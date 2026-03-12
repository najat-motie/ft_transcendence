import { useState } from "react";
import { Link } from "react-router-dom";
import { validateForm } from "../../utils/validator";
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

    const errorMessage = validateForm({password, confirmPassword}, {
      password: true,
      confirmPassword: true
    });
    if(errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-shell">
      <div className="password-layout">
        <aside className="password-hero">
          <span className="password-kicker">Account Security</span>
          <h1>Change your password safely.</h1>
          <p>Update your credentials and keep your account protected while your game progress stays intact.</p>
        </aside>

        <form className="auth-card password-card" onSubmit={handleSubmit}>
          <h1 className="auth-title">Set a new password</h1>

          {success ? (
            <p className="success">
              Your password has been successfully changed. <Link to="/profile" className="auth-back">Back to profile</Link>
            </p>
          ) : (
            <>
              {error && <p className="error">{error}</p>}

              <label className="password-label" htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                className="auth-input"
                placeholder="Current password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label className="password-label" htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                className="auth-input"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="password-label" htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                className="auth-input"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
