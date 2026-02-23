import { useState } from "react";
import { Link } from "react-router-dom";
import { validateForm } from "../../utils/validators";
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
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Set a new password</h1>

        {success ? (
          <p className="auth-success">
            Your password has been successfully changed.{" "}
            <Link to="/profile" className="auth-back">← Back</Link>
          </p>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}

            <input
              type="password"
              className="auth-input"
              placeholder="Current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="auth-input"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
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
  );
}
