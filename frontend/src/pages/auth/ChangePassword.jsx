import { useState } from "react";
import { Link } from "react-router-dom";
import { validateForm } from "../../utils/formValidation";
import { apiRequest } from "../../services/api";
import "../../styles/auth/password.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errorMessage = validateForm({ password, confirmPassword }, { password: true, confirmPassword: true });
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Set a new password</h1>

        {success ? (
          <p className="success">
            Your password has been successfully changed.
            <Link to="/profile" className="auth-back">
              ← Back
            </Link>
          </p>
        ) : (
          <>
            {error && <p className="error" role="alert">{error}</p>}

            <label htmlFor="currentPassword" className="sr-only">Current password</label>
            <input
              id="currentPassword"
              type="password"
              className="auth-input"
              placeholder="Current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label htmlFor="newPassword" className="sr-only">New password</label>
            <input
              id="newPassword"
              type="password"
              className="auth-input"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirmNewPassword" className="sr-only">Confirm new password</label>
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
              {loading ? "Updating..." : "Change Password"}
            </button>

            {!loading && (
              <Link to="/profile" className="auth-back">
                ← Back
              </Link>
            )}
          </>
        )}
      </form>
    </main>
  );
}
