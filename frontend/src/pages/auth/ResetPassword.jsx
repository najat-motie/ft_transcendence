import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { validateForm } from "../../utils/formValidation";
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

    const errorMessage = validateForm(
      { password, confirmPassword },
      { password: true, confirmPassword: true }
    );
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      setSuccess(true);

      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Reset your password</h1>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {success ? (
          <p className="success">
            Your password has been successfully updated. Redirecting...
          </p>
        ) : (
          <>
            <label htmlFor="newPassword" className="sr-only">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              className="auth-input"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirmNewPassword" className="sr-only">
              Confirm new password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              className="auth-input"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            {!loading && (
              <Link to="/login" className="auth-back">
                ← Back
              </Link>
            )}
          </>
        )}
      </form>
    </main>
  );
}
