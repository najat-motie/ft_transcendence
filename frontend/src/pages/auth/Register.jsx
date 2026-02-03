import { Link } from "react-router-dom";
import "../../styles/auth/register.css";

export default function auth() {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h1 className="auth-title">Create your account</h1>

        <p className="auth-subtitle">
          Join the ultimate Tic-Tac-Toe arena and challenge players around the world.
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="auth-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="auth-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="auth-input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="auth-input"
        />

        <button className="submit-btn" type="button">
          Register
        </button>

        <p className="auth-back">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
