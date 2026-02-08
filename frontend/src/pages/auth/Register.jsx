import { Link } from "react-router-dom";
import "../../styles/auth/register.css";
import { useState } from "react";

export default function Register() {
  const [error, setError] = useState("");
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

    // const password = e.target.password.value;
    // const confirmPassword = e.target.confirmPassword.value;

    // if (!e.target.checkValidity()) {
    //   e.target.reportValidity();
    //   return;
    // }
    
    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;                           
    // }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;                           
    }

    // form.submit();
    setSubmitted(true);
  };

  return (
    <div className="auth-container">
      <form 
        // action="/auth/register"
        // method="POST"
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
                // minLength={3}
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
                // minLength={8}
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

                <button type="submit" className="submit-btn">Register</button>

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
