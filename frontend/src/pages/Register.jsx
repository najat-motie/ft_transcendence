import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/register.css";
import { apiRequest } from "../services/api";

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    const password = form.password;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }
  
    if (password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="auth-container">
      <form 
        className="auth-form" 
        onSubmit={handleSubmit}
      >

        {!submitted ? (
          <>
            {error && <p className="auth-error">{error}</p>}

            <h1 className="auth-title">Create your account</h1>

            <p className="auth-subtitle">
              Join the ultimate Tic-Tac-Toe arena and challenge players around the world.
            </p>

              <input
                type="text"
                name="username"
                placeholder="Username"
                className="auth-input"
                value={form.username}
                onChange={handleChange}
                required
              />
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

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>

              <p className="auth-back">
                Already have an account? <Link to="/login">Login</Link>
              </p>
          </>
          ) : (
          <p className="auth-success">
            Your account has been created! You can now <Link to="/login">👉🏻 Sign In</Link>
          </p>
        )}

      </form>
    </div>
  );
}
