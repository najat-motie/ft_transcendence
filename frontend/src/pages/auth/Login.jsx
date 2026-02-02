import { Link, NavLink } from "react-router-dom";
import "../../styles/auth/login.css";

function Login() {
  return (
    <div className="login-container">
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
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" />
              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>

            <button className="submit-btn" type="submit">Sign In</button>
          </form>
          
          <div className="oauth-container">
            <p className="oauth-text">Or continue with</p>
            <button className="oauth-btn">Google</button>
          </div>

          <div className="login-signup">
            Don’t have an account?{" "}
            <span className="create-account">
              <a href="/register">Create one</a>
            </span>
          </div>
          
          <div className="auth-back">
            <Link to="/">← Return to home page</Link>
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
