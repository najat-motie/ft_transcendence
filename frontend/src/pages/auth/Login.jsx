import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/auth/login.css";

function Login() {
 const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify({
          login: identifier,
          password,
        }),
      });
  
      const data = await res.json();
  
      // if (!res.ok) {
      //   setError(data.message || "Invalid credentials");
      //   setLoading(false);
      //   return;
      // }

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      localStorage.setItem("token", data.token);
      
      navigate("/");
      // window.location.href = "/";
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
          {error && <p className="auth-error">{error}</p>}

          <div className="form-group">
            <label>Email or Username</label>
            <input 
              type="text" 
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
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
            onClick={() => window.location.href = "/api/auth/google"}
          >
            Google
          </button>
        </div>

        <div className="auth-signup">
          Don’t have an account?{" "}
          <span className="create-account">
            <a href="/register">Create one</a>
          </span>
        </div>
          
        <div className="auth-back">
          <Link to="/">← Return to home page</Link>
        </div>

        <p className="auth-footer">
          By clicking continue, you agree to our{" "}
          <NavLink to="/terms-of-service">Terms of Service</NavLink> and{" "}
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
        </p>
      </div>
    </div>
  );
}

export default Login;
