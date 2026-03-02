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
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    setError("");
    const errorMessage = validateForm(form, {
      password: true,
      confirmPassword: true,
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setStep(2);
  };

  const handleRegister = async () => {
    setError("");

    const errorMessage = validateForm(form, {
      username: true,
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLoading(true);

    try {
      await apiRequest(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            username: form.username,
            bio: form.bio,
            avatar: form.avatar,
          }),
        },
        true
      );

      setSubmitted(true);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form
        className="auth-form"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-live="polite"
      >
        {!submitted ? (
          <>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            {step === 1 && (
              <>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">
                  Join the ultimate Tic-Tac-Toe arena and challenge players
                  around the world.
                </p>

                <label htmlFor="email" className="auth-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  className="auth-input"
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />

                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  className="auth-input"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />

                <label htmlFor="confirmPassword" className="auth-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
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

                <p className="back-login">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="auth-title">Create your profile</h1>

                <label htmlFor="username" className="auth-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className="auth-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />

                <label htmlFor="bio" className="auth-label">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="auth-input"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                />

                <label htmlFor="avatar" className="auth-label">
                  Avatar (Optional)
                </label>
                <input
                  id="avatar"
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
                  aria-busy={loading}
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
          <p className="success">
            Your account has been created! You can now{" "}
            <Link to="/login">Sign In</Link>
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
    </main>
  );
}
