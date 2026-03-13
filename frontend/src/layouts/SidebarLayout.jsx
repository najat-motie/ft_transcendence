import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/sidebar.css";
import { FiMenu, FiPlay, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { apiRequest } from "../services/api.js";
import { logout } from "../services/auth.js";
import { getUserFromCookie, getUserProfileFromCookie } from "../utils/cookies.js";
import defaultAvatar from "../assets/default-avatar.svg";

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user from cookies instead of localStorage
  const baseUser = getUserFromCookie();
  const userProfile = getUserProfileFromCookie();
  const user = baseUser
    ? {
        ...baseUser,
        username: userProfile?.username || baseUser.username,
        avatar: userProfile?.avatar || baseUser.avatar,
        bio: userProfile?.bio || baseUser.bio,
        email: userProfile?.email || baseUser.email,
      }
    : null;
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      logout(user?.userId);
      closeSidebar();
      navigate("/login");
    }
  };

  const closeSidebar = () => {
    setMenuOpen(false);
    setOpen(false);
  };

  return (
    <div className={`sidebar-layout ${menuOpen ? "sidebar-open" : ""}`}>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {menuOpen && (
        <button
          type="button"
          className=""
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <aside id="app-sidebar" className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <Link to="/" onClick={closeSidebar}>
              <img src={logo} alt="tic-tac-toe logo" className="logo-img" />
            </Link>
          </div>

          <nav className="nav">
            <NavLink to="/play" className="nav-item" onClick={closeSidebar}>
              <FiPlay className="nav-icon" />
              <span>Play</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {isLoggedIn ? (
            <div className="user">
              <button
                type="button"
                className="user-trigger"
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                aria-haspopup="menu"
              >
                <img
                  src={user?.avatar || defaultAvatar}
                  alt="avatar"
                  className="avatar"
                />
                <span className="username">{user?.username || "User"}</span>
              </button>

              {open && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={closeSidebar}>
                    View Profile
                  </Link>
                  <Link to="/settings" onClick={closeSidebar}>
                    Settings
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="user-login">
              <Link to="/login" className="login-btn" onClick={closeSidebar}>
                Login
              </Link>
            </div>
          )}

          <div className="footer legal-links">
            <Link to="/privacy-policy" onClick={closeSidebar}>Privacy Policy</Link>
            <span className="legal-separator" aria-hidden="true">&</span>
            <Link to="/terms-of-service" onClick={closeSidebar}>Terms of Service</Link>
          </div>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
