import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validator";
import {
  alertError,
  alertSuccess,
  bluePill,
  fileInputGold,
  frostedPanel,
  frostedPanelStrong,
  ghostButton,
  goldButton,
  inputGold,
  mutedText,
  slabHeading,
  textareaGold,
} from "../../lib/ui";
import { cn } from "../../lib/cn";

const shellStyle = {
  background:
    "radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom left, rgba(250, 204, 21, 0.1), transparent 22%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

const labelClass = "mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300";
const progressStepClass = (active) =>
  cn(
    "flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-[0.95rem]",
    active && "border-sky-400/20 bg-sky-400/10",
  );

const progressBadgeClass = (active) =>
  cn(
    "grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-slate-400/15 font-bold text-slate-300",
    active && "bg-sky-400 text-sky-950",
  );

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

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (event) => {
    event.preventDefault();
    setError("");
    const errorMessage = validateForm(form, {
      password: true,
      confirmPassword: true,
    });
    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }
    setStep(2);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    const errorMessage = validateForm(form, {
      username: true,
    });
    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
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
        true,
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
    <div className="min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200" style={shellStyle}>
      <div className="mx-auto grid min-h-[calc(100vh-clamp(2rem,6vw,4rem))] w-full max-w-[1120px] grid-cols-1 gap-[clamp(1rem,3vw,2rem)] min-[921px]:grid-cols-[minmax(0,1fr)_minmax(380px,480px)]">
        <aside className={`${frostedPanel} grid content-center gap-4 p-[clamp(1.5rem,4vw,3rem)]`}>
          <span className={bluePill}>Create Account</span>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] text-slate-50")}>
            Set up your player identity.
          </h1>
          <p className={cn("m-0 max-w-[54ch] leading-[1.7]", mutedText)}>
            Build your profile, customize your presence, and get ready for quick online matches, room invites, and AI practice.
          </p>

          <div className="mt-2 grid gap-[0.85rem]">
            <div className={progressStepClass(step === 1 || step > 1)}>
              <span className={progressBadgeClass(step === 1 || step > 1)}>1</span>
              <div>
                <strong className="mb-[0.15rem] block text-[0.92rem] text-slate-50">Account Details</strong>
                <p className="m-0 text-[0.82rem] text-slate-400">Email and password</p>
              </div>
            </div>
            <div className={progressStepClass(step === 2)}>
              <span className={progressBadgeClass(step === 2)}>2</span>
              <div>
                <strong className="mb-[0.15rem] block text-[0.92rem] text-slate-50">Profile Setup</strong>
                <p className="m-0 text-[0.82rem] text-slate-400">Username, bio and avatar</p>
              </div>
            </div>
          </div>
        </aside>

        <form
          className={`${frostedPanelStrong} grid content-center gap-4 p-[clamp(1.35rem,3vw,2rem)]`}
          onSubmit={step === 1 ? handleContinue : handleRegister}
        >
          {!submitted ? (
            <>
              {error ? <p className={alertError}>{error}</p> : null}

              {step === 1 ? (
                <>
                  <h1 className={cn(slabHeading, "m-0 text-center text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>
                    Create your account
                  </h1>
                  <p className="m-0 text-center text-[0.95rem] leading-[1.6] text-slate-400">
                    Join the ultimate Tic-Tac-Toe arena and challenge players around the world.
                  </p>

                  <div>
                    <label className={labelClass} htmlFor="register-email">Email</label>
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      value={form.email}
                      placeholder="Email address"
                      className={inputGold}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="register-password">Password</label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      value={form.password}
                      placeholder="Password"
                      className={inputGold}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="register-confirm-password">Confirm password</label>
                    <input
                      id="register-confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      placeholder="Confirm password"
                      className={inputGold}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className={goldButton}>
                    Continue
                  </button>

                  <p className="text-center text-slate-400">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-100 hover:no-underline">
                      Login
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h1 className={cn(slabHeading, "m-0 text-center text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>
                    Create your profile
                  </h1>
                  <p className="m-0 text-center text-[0.95rem] leading-[1.6] text-slate-400">
                    Add the details other players will recognize on the board.
                  </p>

                  <div>
                    <label className={labelClass} htmlFor="register-username">Username</label>
                    <input
                      id="register-username"
                      type="text"
                      name="username"
                      className={inputGold}
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="register-bio">Bio (Optional)</label>
                    <textarea
                      id="register-bio"
                      name="bio"
                      className={textareaGold}
                      value={form.bio}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="register-avatar">Avatar (Optional)</label>
                    <input
                      id="register-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className={fileInputGold}
                    />
                  </div>

                  <div className="grid gap-3 min-[561px]:grid-cols-[1fr_1.3fr]">
                    <button type="button" className={ghostButton} onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button type="submit" className={goldButton} disabled={loading}>
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className={alertSuccess}>
              Your account has been created! You can now{" "}
              <Link to="/login" className="font-semibold text-sky-200 hover:text-white hover:no-underline">
                Sign In
              </Link>
            </p>
          )}

          {step === 1 ? (
            <p className="mt-2 text-center text-[0.8rem] leading-[1.6] text-slate-500">
              By clicking continue, you agree to our{" "}
              <NavLink to="/terms-of-service" className="font-semibold text-sky-300 hover:text-sky-100 hover:no-underline">
                Terms of Service
              </NavLink>{" "}
              and{" "}
              <NavLink to="/privacy-policy" className="font-semibold text-sky-300 hover:text-sky-100 hover:no-underline">
                Privacy Policy
              </NavLink>
              .
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
