import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Landing page with quick links */
  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Insurance Management</h1>
      <p className="muted">Manage customers, policies, and claims.</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Link to="/customers" className="btn">Customers</Link>
        <Link to="/policies" className="btn">Policies</Link>
        <Link to="/claims" className="btn">Claims</Link>
      </div>
    </div>
  );
}
