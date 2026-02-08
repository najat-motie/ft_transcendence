import { Link } from "react-router-dom";
import "../../styles/auth/forgot-password.css";

export default function ForgotPassword() {
  return (
    <div className="auth-container">
      <form className="auth-card">
        <h1 className="auth-title">Forgot your password?</h1>

        <p className="auth-subtitle">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <input
          type="email"
          className="auth-input"
          placeholder="Email address"
          required
        />

        <button className="submit-btn" type="submit">
          Send reset link
        </button>

        <Link to="/login" className="auth-back">
          ← Back to sign in
        </Link>
      </form>
    </div>
  );
}
