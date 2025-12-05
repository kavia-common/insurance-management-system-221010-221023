import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Minimal sidebar navigation */
  return (
    <nav className="nav" aria-label="Primary Navigation">
      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/customers">Customers</NavLink>
      <NavLink to="/policies">Policies</NavLink>
      <NavLink to="/claims">Claims</NavLink>
    </nav>
  );
}
