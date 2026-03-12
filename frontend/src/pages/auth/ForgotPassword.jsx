import { useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/auth/password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }, true);
  
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="password-shell">
      <div className="password-layout">
        <aside className="password-hero">
          <span className="password-kicker">Recovery</span>
          <h1>Get back into your account.</h1>
          <p>We’ll send a secure reset link so you can create a new password and get back to playing.</p>
        </aside>

        <form className="auth-card password-card" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <h1 className="auth-title">Forgot your password?</h1>

          <p className="auth-subtitle">
            Enter your email address and we’ll send you a link to reset your password.
          </p>

          {!submitted ? (
            <>
              <label className="password-label" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                className="auth-input"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          ) : (
            <p className="success">
              If an account exists with this email, a reset link has been sent.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
