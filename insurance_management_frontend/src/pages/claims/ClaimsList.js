import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClaimsAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function ClaimsList() {
  /** List claims, allow create and delete */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await ClaimsAPI.list();
      setItems(Array.isArray(data) ? data : (data.results || []));
    } catch (e) {
      setErr(e.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this claim?')) return;
    try {
      await ClaimsAPI.delete(id);
      await load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="card">
      <div className="header">
        <h2 style={{ margin: 0 }}>Claims</h2>
        <button className="btn" onClick={() => navigate('/claims/new')}>New Claim</button>
      </div>

      {loading && <div>Loading...</div>}
      {err && <div className="health down">{err}</div>}

      {!loading && !err && (
        <table className="table" aria-label="Claims">
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Policy</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td><Link to={`/claims/${c.id}`}>{c.claim_number}</Link></td>
                <td>{c.policy_number || c.policy || '-'}</td>
                <td>{c.date_of_claim}</td>
                <td>{c.claim_type}</td>
                <td>{c.amount}</td>
                <td>{c.status}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn secondary" onClick={() => navigate(`/claims/${c.id}/edit`)}>Edit</button>{' '}
                  <button className="btn danger" onClick={() => onDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7}>No claims yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
