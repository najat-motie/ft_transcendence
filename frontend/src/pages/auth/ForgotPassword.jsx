import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "../../styles/auth/password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <h1 className="auth-title">Forgot your password?</h1>
        <p className="auth-subtitle">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>

        {!submitted ? (
          <>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            {!loading && (
              <Link to="/login" className="auth-back">
                ← Back
              </Link>
            )}
          </>
        ) : (
          <p className="success">
            If an account exists with this email, a reset link has been sent.
          </p>
        )}
      </form>
    </main>
  );
}
