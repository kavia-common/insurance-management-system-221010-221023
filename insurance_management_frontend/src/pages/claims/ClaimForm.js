import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClaimsAPI, PoliciesAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function ClaimForm() {
  /** Create/Edit claim form with policy FK */
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';

  const [form, setForm] = useState({
    claim_number: '',
    policy: '',
    date_of_claim: '',
    claim_type: '',
    description: '',
    amount: '',
    status: '',
  });
  const [policies, setPolicies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const pl = await PoliciesAPI.list();
        const list = Array.isArray(pl) ? pl : (pl.results || []);
        setPolicies(list);

        if (isEdit) {
          const data = await ClaimsAPI.retrieve(id);
          setForm({
            claim_number: data.claim_number || '',
            policy: data.policy || '',
            date_of_claim: data.date_of_claim || '',
            claim_type: data.claim_type || '',
            description: data.description || '',
            amount: data.amount ?? '',
            status: data.status || '',
          });
        }
      } catch (e) {
        setErr(e.message || 'Failed to load data');
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        ...form,
        amount: form.amount === '' ? null : parseFloat(form.amount),
      };
      if (isEdit) {
        await ClaimsAPI.update(id, payload);
      } else {
        await ClaimsAPI.create(payload);
      }
      navigate('/claims');
    } catch (e2) {
      setErr(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{isEdit ? 'Edit Claim' : 'New Claim'}</h2>
      {err && <div className="health down" style={{ marginBottom: 12 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="label" htmlFor="claim_number">Claim Number</label>
            <input id="claim_number" name="claim_number" className="input" value={form.claim_number} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="policy">Policy</label>
            <select id="policy" name="policy" className="select" value={form.policy} onChange={handleChange} required>
              <option value="" disabled>Select policy</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.policy_number}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="date_of_claim">Date of Claim</label>
            <input id="date_of_claim" name="date_of_claim" type="date" className="date" value={form.date_of_claim} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="claim_type">Claim Type</label>
            <input id="claim_type" name="claim_type" className="input" value={form.claim_type} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" className="textarea" rows={3} value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="amount">Amount</label>
            <input id="amount" name="amount" type="number" step="0.01" className="number" value={form.amount} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <input id="status" name="status" className="input" value={form.status} onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button className="btn secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
