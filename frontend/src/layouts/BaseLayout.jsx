import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import '../styles/base-layout.css'
import logo from "../assets/logo.png";

export default function BaseLayout() {
  const location = useLocation();
  const hideNavbarFooter = 
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname === "/forgot-password"; 

  return (
    <div className="layout">
      {!hideNavbarFooter && (
      <header className="layout-header">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Chess logo" className="logo-img" />
          </Link>
        </div>
        <nav className="navbar">
          <NavLink to="/play">Play</NavLink>
          <Link to="/settings">
            <FiSettings size={24} />
          </Link>
        </nav>
      </header>)}

      <main className="layout-content">
        <Outlet />
      </main>
      
      {!hideNavbarFooter && (
      <footer className="layout-footer">
        <div className="footer-copy">
          <p>© {new Date().getFullYear()} ft_transcendence</p>
        </div>
        <div className="footer-links">
          <Link to="/terms-of-service">Terms</Link>
          <Link to="/privacy-policy">Privacy</Link>
        </div>
      </footer>)}
    </div>
  );
}
