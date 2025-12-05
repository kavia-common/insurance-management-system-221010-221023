import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ClaimsAPI } from '../../api/client';

// PUBLIC_INTERFACE
export default function ClaimDetail() {
  /** Show claim with link to its policy */
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await ClaimsAPI.retrieve(id);
        setData(c);
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
        <h2 style={{ margin: 0 }}>Claim {data.claim_number}</h2>
        <div>
          <button className="btn secondary" onClick={() => navigate(`/claims/${id}/edit`)}>Edit</button>{' '}
          <button className="btn" onClick={() => navigate('/claims')}>Back</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Policy:</strong>{' '}
          {data.policy ? <Link to={`/policies/${data.policy}`}>View Policy</Link> : '-'}</div>
        <div><strong>Date:</strong> {data.date_of_claim || '-'}</div>
        <div><strong>Type:</strong> {data.claim_type || '-'}</div>
        <div><strong>Amount:</strong> {data.amount ?? '-'}</div>
        <div><strong>Status:</strong> {data.status || '-'}</div>
        <div><strong>Description:</strong><div>{data.description || '-'}</div></div>
      </div>
    </div>
  );
}
