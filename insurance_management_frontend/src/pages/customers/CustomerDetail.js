import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CustomersAPI, PoliciesAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function CustomerDetail() {
  /** Show a customer's info and link to their policies */
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await CustomersAPI.retrieve(id);
        setData(c);
        const p = await PoliciesAPI.list({ customer: id });
        setPolicies(Array.isArray(p) ? p : (p.results || []));
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
        <h2 style={{ margin: 0 }}>{data.first_name} {data.last_name}</h2>
        <div>
          <button className="btn secondary" onClick={() => navigate(`/customers/${id}/edit`)}>Edit</button>{' '}
          <button className="btn" onClick={() => navigate('/customers')}>Back</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Email:</strong> {data.email}</div>
        <div><strong>Phone:</strong> {data.phone || '-'}</div>
        <div><strong>Address:</strong> {data.address || '-'}</div>
      </div>

      <h3 style={{ marginTop: 16 }}>Policies</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Type</th>
            <th>Premium</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p.id}>
              <td><Link to={`/policies/${p.id}`}>{p.policy_number}</Link></td>
              <td>{p.type}</td>
              <td>{p.premium}</td>
              <td>{p.status}</td>
            </tr>
          ))}
          {policies.length === 0 && <tr><td colSpan={4}>No policies</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
