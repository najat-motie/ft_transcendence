import { NavLink } from "react-router-dom";
import "../../styles/auth/login.css";
import Input from "../../components/Input";
import Button from "../../components/Button";

function Login() {
  return (
    <div className="login-container">
      
      {/* LEFT SIDE */}
      <div className="login-left">
        <h1 className="login-title">
          Master your strategy.
          <br />
          Ascend the ranks.
        </h1>

        <p className="login-description">
          Join the ultimate community for competitive chess. Analyze games,
          challenge masters, and participate in global tournaments.
        </p>

        <ul className="login-features subtitle">
          <li>♖ Real-time matchmaking & tournaments</li>
          <li>📊 Global leaderboards & ELO rating</li>
          <li>💬 Community chat & friend system</li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-box">

          <div className="login-header">
            <div className="login-logo" />
            <h2>Welcome back</h2>
            <p className="login-subtitle">Enter your details to access your account</p>
          </div>

          <form className="login-form">
            <div className="form-group">
              <label>Email or Username</label>
              <Input type="text" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <Input type="password" />
              <div className="forgot-password">
                <a href="/reset-password">Forgot password?</a>
              </div>
            </div>

            <Button type="submit">Sign In</Button>
          </form>
          
          <div className="login-signup">
            Don’t have an account?{" "}
            <span className="create-account">
              <a href="/register">Create one</a>
            </span>
          </div>

          <p className="login-footer">
            By clicking continue, you agree to our{" "}
            <NavLink to="/terms-of-service">Terms of Service</NavLink> and{" "}
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
