import { useState } from "react";
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
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
  
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <h1 className="auth-title">Forgot your password?</h1>

        <p className="auth-subtitle">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        {!submitted ? (
            <>
              <input
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
          <p className="auth-success">
            If an account exists with this email, a reset link has been sent.
          </p>
        )}
    
      </form>
    </div>
  );
}
