import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { validateForm } from "../../utils/validator";
import { apiRequest } from "../../services/api";
import "../../styles/auth/password.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errorMessage = validateForm({password, confirmPassword}, {
        password: true,
        confirmPassword: true,
      });
      if(errorMessage) {
        setError(errorMessage);
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
      await apiRequest(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ newPassword: password }),
      }, true);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-shell">
      <div className="password-layout">
        <aside className="password-hero">
          <span className="password-kicker">Secure Reset</span>
          <h1>Create a new password.</h1>
          <p>Choose a strong password you haven’t used before. We’ll redirect you to sign in once it’s updated.</p>
        </aside>

        <form className="auth-card password-card" onSubmit={handleSubmit}>
          <h1 className="auth-title">Reset your password</h1>

          {error && <p className="error">{error}</p>}

          {success ? (
            <p className="success">
              Your password has been successfully updated. Redirecting...
            </p>
          ) : (
            <>
              <label className="password-label" htmlFor="reset-new-password">New password</label>
              <input
                id="reset-new-password"
                type="password"
                className="auth-input"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="password-label" htmlFor="reset-confirm-password">Confirm new password</label>
              <input
                id="reset-confirm-password"
                type="password"
                className="auth-input"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </>
          )}

          {!success && (
            <Link to="/login" className="auth-back">
              Back to sign in
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
