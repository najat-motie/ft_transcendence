import { Link, NavLink, Outlet } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import '../styles/base-layout.css'
import logo from "../assets/logo.png";

export default function BaseLayout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Chess logo" className="logo-img" />
          </Link>
        </div>
        <nav className="navbar">
          <NavLink to="/play">Play</NavLink>
          <NavLink to="/watch">Watch</NavLink>
          <NavLink to="/login" className="login-btn">Login</NavLink>
          <Link to="/settings">
            <FiSettings size={24} />
          </Link>
        </nav>
      </header>

      <main className="layout-content">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <div className="footer-copy">
          <p>© {new Date().getFullYear()} ft_transcendence</p>
        </div>
        <div className="footer-links">
          <Link to="/terms-of-service">Terms</Link>
          <Link to="/privacy-policy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
