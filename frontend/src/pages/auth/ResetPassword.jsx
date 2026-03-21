import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { validateForm } from "../../utils/validator";
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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
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
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await apiRequest(
        `/auth/reset-password/${token}`,
        {
          method: "POST",
          body: JSON.stringify({ newPassword: password }),
        },
        true,
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200" style={shellStyle}>
      <div className="mx-auto grid min-h-[calc(100vh-clamp(2rem,6vw,4rem))] w-full max-w-[1040px] grid-cols-1 gap-[clamp(1rem,3vw,2rem)] min-[921px]:grid-cols-[minmax(0,1fr)_minmax(340px,460px)]">
        <aside className={`${frostedPanel} grid content-center gap-4 p-[clamp(1.5rem,4vw,3rem)]`}>
          <span className={goldPill}>Secure Reset</span>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] text-slate-50")}>
            Create a new password.
          </h1>
          <p className={cn("m-0 max-w-[52ch] leading-[1.7]", mutedText)}>
            Choose a strong password you haven't used before. We'll redirect you to sign in once it's updated.
          </p>
        </aside>

        <form className={`${frostedPanelStrong} grid content-center gap-4 p-[clamp(1.35rem,3vw,2rem)]`} onSubmit={handleSubmit}>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>Reset your password</h1>

          {error ? <p className={alertError}>{error}</p> : null}

          {success ? (
            <p className={alertSuccess}>
              Your password has been successfully updated. Redirecting...
            </p>
          ) : (
            <>
              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="reset-new-password">
                  New password
                </label>
                <input
                  id="reset-new-password"
                  type="password"
                  className={inputSky}
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="reset-confirm-password">
                  Confirm new password
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  className={inputSky}
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              <button className={goldButton} type="submit" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
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
