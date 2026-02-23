import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";
import { FiPlay } from "react-icons/fi";
import logo from "../assets/logo.png";
import { apiRequest } from "../services/api.js";
import { logout } from "../services/auth.js";

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      logout(user?.userId);
      navigate("/login");
      // setUser(null);
    }
  };

  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="tic-tac-toe logo" className="logo-img" />
            </Link>
          </div>

          <nav className="nav">
            <NavLink to="/play" className="nav-item">
              <FiPlay className="nav-icon" />
              <span>Play</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {user ? (
            <div className="user">
              <a onClick={() => setOpen(prev => !prev)}>
                <img
                  src={user?.avatar}
                  alt="avatar"
                  className="avatar"
                />
                <span className="username">{user?.username || "User"}</span>
              </a>

              {open && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    View Profile
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="user-login">
              <Link to="/login" className="login-btn">
                Login
              </Link>
            </div>
          )}

          <div className="footer legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link> & <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
