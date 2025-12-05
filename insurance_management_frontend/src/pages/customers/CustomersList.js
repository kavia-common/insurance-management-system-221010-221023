import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomersAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function CustomersList() {
  /** List customers, allow create and delete */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await CustomersAPI.list();
      setItems(Array.isArray(data) ? data : (data.results || []));
    } catch (e) {
      setErr(e.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await CustomersAPI.delete(id);
      await load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="card">
      <div className="header">
        <h2 style={{ margin: 0 }}>Customers</h2>
        <button className="btn" onClick={() => navigate('/customers/new')}>New Customer</button>
      </div>

      {loading && <div>Loading...</div>}
      {err && <div className="health down">{err}</div>}

      {!loading && !err && (
        <table className="table" aria-label="Customers">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td><Link to={`/customers/${c.id}`}>{c.first_name} {c.last_name}</Link></td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn secondary" onClick={() => navigate(`/customers/${c.id}/edit`)}>Edit</button>{' '}
                  <button className="btn danger" onClick={() => onDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4}>No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
