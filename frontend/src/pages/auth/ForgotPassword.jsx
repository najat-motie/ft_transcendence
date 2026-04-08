import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/formValidator";
import {
  alertError,
  alertSuccess,
  frostedPanel,
  frostedPanelStrong,
  goldButton,
  goldPill,
  inputSky,
  mutedText,
  slabHeading,
} from "../../lib/ui";
import { cn } from "../../lib/cn";

const shellStyle = {
  background:
    "radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom left, rgba(250, 204, 21, 0.1), transparent 22%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryPrompt, setRecoveryPrompt] = useState("What is your favorite book?");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "ft_transcendence - Forgot Password";
  }, []);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const response = await apiRequest(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
        true,
      );

      const payload = response?.data || response;
      setRecoveryPrompt(payload?.recoveryPrompt || "What is your favorite book?");
      setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const errorMessage = validateForm(
      { password, confirmPassword },
      {
        password: true,
        confirmPassword: true,
      },
    );

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (!secretAnswer.trim()) {
      setError("Secret answer is required");
      return;
    }

    setLoading(true);

    try {
      await apiRequest(
        "/auth/reset-password/verify",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            secretAnswer,
            newPassword: password,
          }),
        },
        true,
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200" style={shellStyle}>
      <div className="mx-auto grid min-h-[calc(100vh-clamp(2rem,6vw,4rem))] w-full max-w-[1040px] grid-cols-1 gap-[clamp(1rem,3vw,2rem)] min-[921px]:grid-cols-[minmax(0,1fr)_minmax(340px,460px)]">
        <aside className={`${frostedPanel} grid content-center gap-4 p-[clamp(1.5rem,4vw,3rem)]`}>
          <span className={goldPill}>Recovery</span>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] text-slate-50")}>
            Get back into your account.
          </h1>
          <p className={cn("m-0 max-w-[52ch] leading-[1.7]", mutedText)}>
            Confirm your email, answer your recovery prompt, and choose a new password to regain access.
          </p>
        </aside>

        <form
          className={`${frostedPanelStrong} grid content-center gap-4 p-[clamp(1.35rem,3vw,2rem)]`}
          onSubmit={step === "email" ? handleEmailSubmit : handleResetSubmit}
        >
          {error ? <p className={alertError}>{error}</p> : null}
          <h1 className={cn(slabHeading, "m-0 text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>Forgot your password?</h1>
          <p className="m-0 text-[0.95rem] leading-[1.6] text-slate-400">
            {step === "email"
              ? "Enter your email address to begin password recovery."
              : "Answer your saved recovery prompt and set a new password."}
          </p>

          {success ? (
            <p className={alertSuccess}>
              Your password has been updated. Redirecting to sign in...
            </p>
          ) : step === "email" ? (
            <>
              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="forgot-email">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className={inputSky}
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <button className={goldButton} type="submit" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="forgot-secret-answer">
                  {recoveryPrompt}
                </label>
                <input
                  id="forgot-secret-answer"
                  type="text"
                  className={inputSky}
                  placeholder="Your answer"
                  required
                  value={secretAnswer}
                  onChange={(event) => setSecretAnswer(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="forgot-new-password">
                  New password
                </label>
                <input
                  id="forgot-new-password"
                  type="password"
                  className={inputSky}
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="forgot-confirm-password">
                  Confirm new password
                </label>
                <input
                  id="forgot-confirm-password"
                  type="password"
                  className={inputSky}
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              <div className="grid gap-3 min-[561px]:grid-cols-[1fr_1.3fr]">
                <button
                  className="rounded-[16px] border border-white/12 bg-white/[0.03] px-5 py-3 text-[0.95rem] font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setSecretAnswer("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Back
                </button>
                <button className={goldButton} type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            </>
          )}

          {!success ? (
            <Link to="/login" className="inline-block text-[0.9rem] font-semibold text-sky-300 hover:text-sky-100 hover:no-underline">
              Back to sign in
            </Link>
          ) : null}
        </form>
      </div>
    </div>
  );
}
