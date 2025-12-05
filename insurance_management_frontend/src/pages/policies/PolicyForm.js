import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PoliciesAPI, CustomersAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function PolicyForm() {
  /** Create/Edit policy form with customer FK */
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';

  const [form, setForm] = useState({
    policy_number: '',
    customer: '',
    type: '',
    premium: '',
    start_date: '',
    end_date: '',
    status: '',
  });
  const [customers, setCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const cl = await CustomersAPI.list();
        const list = Array.isArray(cl) ? cl : (cl.results || []);
        setCustomers(list);

        if (isEdit) {
          const data = await PoliciesAPI.retrieve(id);
          setForm({
            policy_number: data.policy_number || '',
            customer: data.customer || '',
            type: data.type || '',
            premium: data.premium ?? '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
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
        premium: form.premium === '' ? null : parseFloat(form.premium),
      };
      if (isEdit) {
        await PoliciesAPI.update(id, payload);
      } else {
        await PoliciesAPI.create(payload);
      }
      navigate('/policies');
    } catch (e2) {
      setErr(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{isEdit ? 'Edit Policy' : 'New Policy'}</h2>
      {err && <div className="health down" style={{ marginBottom: 12 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="label" htmlFor="policy_number">Policy Number</label>
            <input id="policy_number" name="policy_number" className="input" value={form.policy_number} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="customer">Customer</label>
            <select id="customer" name="customer" className="select" value={form.customer} onChange={handleChange} required>
              <option value="" disabled>Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="type">Type</label>
            <input id="type" name="type" className="input" value={form.type} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="premium">Premium</label>
            <input id="premium" name="premium" type="number" step="0.01" className="number" value={form.premium} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="start_date">Start Date</label>
            <input id="start_date" name="start_date" type="date" className="date" value={form.start_date} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="end_date">End Date</label>
            <input id="end_date" name="end_date" type="date" className="date" value={form.end_date} onChange={handleChange} />
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
