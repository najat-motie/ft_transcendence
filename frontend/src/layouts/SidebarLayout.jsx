import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import logo from "../assets/logo.png";
import { apiRequest } from "../services/api.js";
import { getUser, clearUser } from "../services/auth";
import "../styles/sidebar.css";

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // const user = getUser().user;
  const user = { username: "Alice", avatar: "https://i.pravatar.cc/100?img=3" };

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <NavLink to="/">
              <img src={logo} alt="Tic Tac Toe logo" className="logo-img" />
            </NavLink>
          </div>

          <nav className="nav" aria-label="Main navigation">
            <NavLink
              to="/play"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <FiPlay className="nav-icon" aria-hidden="true" />
              <span>Play</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {user ? (
            <div className="user">
              <button
                type="button"
                className="user-toggle"
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
              >
                <img
                  src={user.avatar}
                  alt={`${user.username} avatar`}
                  className="avatar"
                />
                <span className="username">{user.username}</span>
              </button>

              {open && (
                <div className="dropdown-menu" role="menu">
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    Logout
                  </button>
                  <NavLink to="/profile" role="menuitem" onClick={() => setOpen(false)}>
                    View Profile
                  </NavLink>
                </div>
              )}
            </div>
          ) : (
            <div className="user-login">
              <NavLink to="/login" className="login-btn">
                Login
              </NavLink>
            </div>
          )}

          <div className="footer legal-links">
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>
            <span>&</span>
            <NavLink to="/terms-of-service">Terms of Service</NavLink>
          </div>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
