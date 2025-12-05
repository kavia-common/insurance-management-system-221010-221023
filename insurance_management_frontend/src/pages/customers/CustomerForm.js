import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomersAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function CustomerForm() {
  /** Create/Edit customer form */
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (isEdit) {
        try {
          const data = await CustomersAPI.retrieve(id);
          setForm({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        } catch (e) {
          setErr(e.message || 'Failed to load customer');
        }
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
      if (isEdit) {
        await CustomersAPI.update(id, form);
      } else {
        await CustomersAPI.create(form);
      }
      navigate('/customers');
    } catch (e2) {
      setErr(e2.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{isEdit ? 'Edit Customer' : 'New Customer'}</h2>
      {err && <div className="health down" style={{ marginBottom: 12 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="label" htmlFor="first_name">First Name</label>
            <input id="first_name" name="first_name" className="input" value={form.first_name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="last_name">Last Name</label>
            <input id="last_name" name="last_name" className="input" value={form.last_name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" name="email" className="input" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <input id="address" name="address" className="input" value={form.address} onChange={handleChange} />
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
