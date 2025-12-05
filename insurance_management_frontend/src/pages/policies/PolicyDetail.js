import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PoliciesAPI, ClaimsAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function PolicyDetail() {
  /** Show policy with link to its claims */
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [claims, setClaims] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await PoliciesAPI.retrieve(id);
        setData(p);
        const cl = await ClaimsAPI.list({ policy: id });
        setClaims(Array.isArray(cl) ? cl : (cl.results || []));
      } catch (e) {
        setErr(e.message || 'Failed to load');
      }
    };
    load();
  }, [id]);

  if (err) return <div className="card"><div className="health down">{err}</div></div>;
  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div className="header">
        <h2 style={{ margin: 0 }}>Policy {data.policy_number}</h2>
        <div>
          <button className="btn secondary" onClick={() => navigate(`/policies/${id}/edit`)}>Edit</button>{' '}
          <button className="btn" onClick={() => navigate('/policies')}>Back</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Type:</strong> {data.type || '-'}</div>
        <div><strong>Premium:</strong> {data.premium ?? '-'}</div>
        <div><strong>Start:</strong> {data.start_date || '-'}</div>
        <div><strong>End:</strong> {data.end_date || '-'}</div>
        <div><strong>Status:</strong> {data.status || '-'}</div>
        <div>
          <strong>Customer:</strong>{' '}
          {data.customer ? <Link to={`/customers/${data.customer}`}>View Customer</Link> : '-'}
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Claims</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Claim #</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(c => (
            <tr key={c.id}>
              <td><Link to={`/claims/${c.id}`}>{c.claim_number}</Link></td>
              <td>{c.date_of_claim}</td>
              <td>{c.claim_type}</td>
              <td>{c.amount}</td>
              <td>{c.status}</td>
            </tr>
          ))}
          {claims.length === 0 && <tr><td colSpan={5}>No claims</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
