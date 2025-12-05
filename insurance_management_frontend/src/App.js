import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import CustomersList from './pages/customers/CustomersList';
import CustomerForm from './pages/customers/CustomerForm';
import CustomerDetail from './pages/customers/CustomerDetail';
import PoliciesList from './pages/policies/PoliciesList';
import PolicyForm from './pages/policies/PolicyForm';
import PolicyDetail from './pages/policies/PolicyDetail';
import ClaimsList from './pages/claims/ClaimsList';
import ClaimForm from './pages/claims/ClaimForm';
import ClaimDetail from './pages/claims/ClaimDetail';
import { apiRequest, getHealthPath } from './api/client';

function HealthBanner() {
  const [status, setStatus] = useState('checking'); // checking | ok | down
  const [msg, setMsg] = useState('');
  const location = useLocation();

  const fetchHealth = async () => {
    try {
      const hp = getHealthPath();
      const isAbsolute = /^https?:\/\//i.test(hp);
      let data;
      if (isAbsolute) {
        data = await fetch(hp).then((r) => r.json());
      } else {
        // Prefer calling the backend base + health when path starts with /api to avoid CORS confusion
        if (hp.startsWith('/api')) {
          data = await apiRequest(hp.replace('/api', ''), {});
        } else {
          data = await fetch(hp).then((r) => r.json());
        }
      }
      setStatus('ok');
      setMsg(data.status || 'healthy');
    } catch (e) {
      setStatus('down');
      setMsg(e.message || 'unreachable');
    }
  };

  useEffect(() => {
    fetchHealth();
    // re-check on navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={`health ${status === 'ok' ? 'ok' : status === 'down' ? 'down' : ''}`}>
      Backend: {status === 'checking' ? 'checking...' : msg}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Application shell with sidebar and routed main content */
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Ocean Insurance</div>
        <Navbar />
        <div style={{ marginTop: 16 }}>
          <HealthBanner />
        </div>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/policies" element={<PoliciesList />} />
          <Route path="/policies/new" element={<PolicyForm />} />
          <Route path="/policies/:id" element={<PolicyDetail />} />
          <Route path="/policies/:id/edit" element={<PolicyForm />} />
          <Route path="/claims" element={<ClaimsList />} />
          <Route path="/claims/new" element={<ClaimForm />} />
          <Route path="/claims/:id" element={<ClaimDetail />} />
          <Route path="/claims/:id/edit" element={<ClaimForm />} />
          <Route path="*" element={<div className="card">Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
