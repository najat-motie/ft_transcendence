import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost";
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
    <div className="auth-shell auth-shell-login">
      <div className="auth-layout auth-layout-login">
        <aside className="auth-hero">
          <span className="auth-kicker">Player Access</span>
          <h1>Jump back into the arena.</h1>
          <p>
            Sign in to continue your ranked climb, reconnect with friends, and pick up active matches instantly.
          </p>

          <div className="auth-hero-grid" aria-hidden="true">
            <div className="auth-hero-card">
              <strong>Realtime Matches</strong>
              <span>Low-latency online rooms</span>
            </div>
            <div className="auth-hero-card">
              <strong>Private Invites</strong>
              <span>Share room codes in seconds</span>
            </div>
            <div className="auth-hero-card">
              <strong>Profile Sync</strong>
              <span>Your stats stay ready across devices</span>
            </div>
          </div>
        </aside>

        <div className="auth-box">
          <div className="auth-header">
            <div className="auth-logo" aria-hidden="true">XO</div>
            <h2>Welcome back</h2>
            <p className="auth-subtitle">Enter your details to access your account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              onClick={() => window.location.href = oauth42Url}
            >
              Intra 42
            </button>
          </div>

          <div className="auth-signup">
            Don’t have an account? <Link className="create-account" to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
