import { NavLink } from "react-router-dom";
import "../../styles/layout/navbar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/play">Play</NavLink>
      <NavLink to="/watch">Watch</NavLink>
      <NavLink to="/login" className="login-btn">Login</NavLink>
      <NavLink to="/register" className="login-btn">Register</NavLink>
    </nav>
  );
}
