import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/register.css";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/formValidation";
import { readImageFile } from "../../utils/fileReader";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    bio: "",
    avatar: "",
  });

  const handleChange = async (e) => {
    setError("");
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      try {
        const file = e.target.files?.[0];
        const dataUrl = await readImageFile(file);
    
        setFormData(prev => ({
          ...prev,
          [name]: dataUrl
        }));
    
        setError(null);
      } catch (err) {
        console.error("File processing error:", err);
        setError(err?.message || "Something went wrong");
      }
      
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("");
    if (loading) return;
    setLoading(true);
    
    const errorMessage = validateForm(form, {
      username: true,
      bio: true,
    });

    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      await apiRequest(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        true
      );

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        {error && <p className="error">{error}</p>}

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
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="auth-input"
            />

            <button
              type="submit"
              className="submit-btn"
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

        {step === 1 && (
          <p className="auth-footer">
            By clicking continue, you agree to our{" "}
            <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        )}
      </form>
    </div>
  );
}
