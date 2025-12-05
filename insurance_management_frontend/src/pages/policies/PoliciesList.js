import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PoliciesAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function PoliciesList() {
  /** List policies, allow create and delete */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await PoliciesAPI.list();
      setItems(Array.isArray(data) ? data : (data.results || []));
    } catch (e) {
      setErr(e.message || 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try {
      await PoliciesAPI.delete(id);
      await load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="card">
      <div className="header">
        <h2 style={{ margin: 0 }}>Policies</h2>
        <button className="btn" onClick={() => navigate('/policies/new')}>New Policy</button>
      </div>

      {loading && <div>Loading...</div>}
      {err && <div className="health down">{err}</div>}

      {!loading && !err && (
        <table className="table" aria-label="Policies">
          <thead>
            <tr>
              <th>Policy #</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Premium</th>
              <th>Status</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/policies/${p.id}`}>{p.policy_number}</Link></td>
                <td>{p.customer_name || p.customer || '-'}</td>
                <td>{p.type}</td>
                <td>{p.premium}</td>
                <td>{p.status}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn secondary" onClick={() => navigate(`/policies/${p.id}/edit`)}>Edit</button>{' '}
                  <button className="btn danger" onClick={() => onDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6}>No policies yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
