import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/login.css";
import { apiRequest } from "../../services/api";

function storeUserData(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("userId", JSON.stringify(data.user.userId));
  localStorage.setItem(`accessToken_${data.user.userId}`, data.accessToken);
  localStorage.setItem(`refreshToken_${data.user.userId}`, data.refreshToken);
}

function Login() {
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

      storeUserData(data);
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
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
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
            onClick={() => window.location.href = "http://localhost:3000/auth/42/callback"}
          >
            Intra 42
          </button>
        </div>

        <div className="auth-signup">
          Don’t have an account?{" "}
          <span className="create-account">
            <a href="/register">Create one</a>
          </span>
        </div>
    
      </div>
    </div>
  );
}

export default Login;
