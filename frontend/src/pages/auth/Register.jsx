import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/auth/register.css";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validators";

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

  const handleContinue = () => {
    setError("");
    const errorMessage = validateForm(form, {
      email: true,
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

  const handleRegister = async () => {
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
    <div className="auth-container">
      <form className="auth-form">
        {!submitted ? (
          <>
            {error && <p className="auth-error">{error}</p>}

            {step === 1 && (
              <>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">
                  Join the ultimate Tic-Tac-Toe arena and challenge players around the world.
                </p>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email address"
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Password"
                  className="auth-input"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Confirm Password"
                  className="auth-input"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleContinue}
                >
                  Continue
                </button>

                <p className="auth-back">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="auth-title">Create your profile</h1>

                <label className="auth-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="auth-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                />

                <label className="auth-label">Bio (Optional)</label>
                <textarea
                  name="bio"
                  className="auth-input"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                />

                <label className="auth-label">Avatar (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="auth-input"
                />

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </>
            )}
          </>
        ) : (
          <p className="auth-success">
            Your account has been created! You can now <Link to="/login">Sign In</Link>
          </p>
        )}

        {step === 1 && (
          <p className="auth-footer">
            By clicking continue, you agree to our{" "}
            <NavLink to="/terms-of-service">Terms of Service</NavLink> and{" "}
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
          </p>
        )}
      </form>
    </div>
  );
}
