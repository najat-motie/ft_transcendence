import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth/forgot-password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
  
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
    finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Forgot your password?</h1>

        <p className="auth-subtitle">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        {!submitted ? (
            <>
              <input
                type="email"
                className="auth-input"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
  
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          ) : (
          <p className="auth-success">
            If an account exists with this email, a reset link has been sent.
          </p>
        )}
    
        <Link to="/login" className="auth-back">
          ← Back to sign in
        </Link>
      </form>
    </div>
  );
}
