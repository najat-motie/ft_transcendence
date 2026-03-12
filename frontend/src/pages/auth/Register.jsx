import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/auth/register.css";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validator";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    bio: "",
    avatar: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setError("");
    const errorMessage = validateForm(form, {
      password: true,
      confirmPassword: true,
    });
    if(errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const errorMessage = validateForm(form, {
      username: true,
    });
    if(errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.username,
          bio: form.bio,
          avatar: form.avatar,
        }),
      }, true);
      setSubmitted(true);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-shell">
      <div className="register-layout">
        <aside className="register-hero">
          <span className="register-kicker">Create Account</span>
          <h1>Set up your player identity.</h1>
          <p>
            Build your profile, customize your presence, and get ready for quick online matches, room invites, and AI practice.
          </p>

          <div className="register-progress" aria-label="Registration steps">
            <div className={`register-progress-step ${step === 1 ? "register-progress-step-active" : "register-progress-step-complete"}`}>
              <span>1</span>
              <div>
                <strong>Account Details</strong>
                <p>Email and password</p>
              </div>
            </div>
            <div className={`register-progress-step ${step === 2 ? "register-progress-step-active" : ""}`}>
              <span>2</span>
              <div>
                <strong>Profile Setup</strong>
                <p>Username, bio and avatar</p>
              </div>
            </div>
          </div>
        </aside>

        <form className="auth-form register-card" onSubmit={step === 1 ? handleContinue : handleRegister}>
          {!submitted ? (
            <>
              {error && <p className="error">{error}</p>}

              {step === 1 && (
                <>
                  <h1 className="auth-title">Create your account</h1>
                  <p className="auth-subtitle">
                    Join the ultimate Tic-Tac-Toe arena and challenge players around the world.
                  </p>

                  <label className="auth-label" htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Email address"
                    className="auth-input"
                    onChange={handleChange}
                    required
                  />
                  <label className="auth-label" htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    value={form.password}
                    placeholder="Password"
                    className="auth-input"
                    onChange={handleChange}
                    required
                  />
                  <label className="auth-label" htmlFor="register-confirm-password">Confirm password</label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    placeholder="Confirm Password"
                    className="auth-input"
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="submit"
                    className="submit-btn"
                  >
                    Continue
                  </button>

                  <p className="auth-back register-login-link">
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="auth-title">Create your profile</h1>
                  <p className="auth-subtitle">Add the details other players will recognize on the board.</p>

                  <label className="auth-label" htmlFor="register-username">Username</label>
                  <input
                    id="register-username"
                    type="text"
                    name="username"
                    className="auth-input"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />

                  <label className="auth-label" htmlFor="register-bio">Bio (Optional)</label>
                  <textarea
                    id="register-bio"
                    name="bio"
                    className="auth-input auth-textarea"
                    value={form.bio}
                    onChange={handleChange}
                    rows="3"
                  />

                  <label className="auth-label" htmlFor="register-avatar">Avatar (Optional)</label>
                  <input
                    id="register-avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="auth-input auth-file-input"
                  />

                  <div className="register-actions">
                    <button
                      type="button"
                      className="back-btn"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="success">
              Your account has been created! You can now <Link to="/login">Sign In</Link>
            </p>
          )}

          {step === 1 && (
            <p className="auth-footer">
              By clicking continue, you agree to our <NavLink to="/terms-of-service">Terms of Service</NavLink> and <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
