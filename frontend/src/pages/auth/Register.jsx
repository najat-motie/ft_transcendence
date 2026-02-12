import { Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth/register.css";

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
    
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;                           
    }
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      // if (!res.ok) throw new Error("Registration failed");
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

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
                placeholder="Email address"
                className="auth-input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="auth-input"
                value={form.confirmPassword}
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
