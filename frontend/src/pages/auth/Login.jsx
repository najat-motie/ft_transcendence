import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/auth/login.css";
import { apiRequest } from "../../services/api";
import { setCookie, setUserInCookie } from "../../utils/cookies";

function storeUserData(data) {
  // Store ONLY in cookies
  setUserInCookie(data.user, 7); // 7 days
  setCookie(`accessToken_${data.user.userId}`, data.accessToken, 7);
  setCookie(`refreshToken_${data.user.userId}`, data.refreshToken, 7);
}

function Login() {
 const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const oauth42Url = `${apiBaseUrl}/auth/42`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for OAuth error in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, true);
      const payload = response?.data || response;
      console.log("Login successful:", payload);
      // Persist tokens immediately so follow-up requests are authorized
      storeUserData(payload);

      // Hydrate profile/KPIs for downstream pages
      try {
        const kpiResponse = await apiRequest(`/profile/${payload.user.userId}/kpis`, { method: "GET" });
        const kpiData = kpiResponse?.data || kpiResponse;
        setCookie("userProfile", JSON.stringify(kpiData), 7);
      } catch (kpiErr) {
        console.warn("Could not prefetch profile KPIs:", kpiErr.message);
      }

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
            onClick={() => window.location.href = oauth42Url}
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
