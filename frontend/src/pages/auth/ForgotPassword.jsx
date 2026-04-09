import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
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
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "ft_transcendence - Forgot Password";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const response = await apiRequest(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ email, question }),
        },
        true,
      );

      const resetToken = response?.data?.resetToken;

      if (resetToken) {
        navigate(`/reset-password/${resetToken}`);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
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
            We'll send a secure reset link so you can create a new password and get back to playing.
          </p>
        </aside>

        <form className={`${frostedPanelStrong} grid content-center gap-4 p-[clamp(1.35rem,3vw,2rem)]`} onSubmit={handleSubmit}>
          {error ? <p className={alertError}>{error}</p> : null}
          <h1 className={cn(slabHeading, "m-0 text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>Forgot your password?</h1>
          <p className="m-0 text-[0.95rem] leading-[1.6] text-slate-400">
            Enter your email and password recovery answer to continue to password reset.
          </p>

          {!submitted ? (
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

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="forgot-question">
                  Password recovery
                </label>
                <input
                  id="forgot-question"
                  type="text"
                  className={inputSky}
                  placeholder="What is your favorite book?"
                  required
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
              </div>

              <button className={goldButton} type="submit" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </button>
            </>
          ) : (
            <p className={alertSuccess}>
              If an account exists with this email, a reset link has been sent.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
