import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/login.css";
import { setUser } from "../../services//auth";
import { apiRequest } from "../../services/api";

export default function Login() {
 const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, true);

      const userData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      };

      setUser(userData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <div className="auth-header">
          <div className="auth-logo" />
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Enter your details to access your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error" role="alert">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <div className="forgot-password">
              <Link to="/reset-password">Forgot password?</Link>
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
          
        <div className="oauth-container">
          <p className="oauth-text">Or continue with</p>
          <button 
            className="oauth-btn"
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_42_OAUTH_CALLBACK_URL}`}
          >
            Intra 42
          </button>
        </div>

        <div className="auth-signup">
          Don’t have an account?{" "}
          <span className="create-account">
            <Link to="/register">Create one</Link>
          </span>
        </div>
    
      </div>
    </div>
  );
}
