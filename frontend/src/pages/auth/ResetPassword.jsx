import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { validateForm } from "../../utils/validators";
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
        email: true,
        password: true,
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
        body: JSON.stringify({ password }),
      });

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
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Reset your password</h1>

        {error && <p className="auth-error">{error}</p>}

        {success ? (
          <p className="auth-success">
            Your password has been successfully updated. Redirecting...
          </p>
        ) : (
          <>
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
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        {!success && (
          <Link to="/login" className="auth-back">
            ← Back to sign in
          </Link>
        )}
      </form>
    </div>
  );
}
