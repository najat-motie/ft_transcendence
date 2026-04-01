import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { validateForm } from "../../utils/formValidator";
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

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "ft_transcendence - Change Password";
  }, []);

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
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
        }),
      });
      setSuccess(true);
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
          <span className={goldPill}>Account Security</span>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] text-slate-50")}>
            Change your password safely.
          </h1>
          <p className={cn("m-0 max-w-[52ch] leading-[1.7]", mutedText)}>
            Update your credentials and keep your account protected while your game progress stays intact.
          </p>
        </aside>

        <form className={`${frostedPanelStrong} grid content-center gap-4 p-[clamp(1.35rem,3vw,2rem)]`} onSubmit={handleSubmit}>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(1.7rem,3vw,2.2rem)] text-slate-50")}>Set a new password</h1>

          {success ? (
            <p className={alertSuccess}>
              Your password has been successfully changed.{" "}
              <Link to="/profile" className="font-semibold text-sky-200 hover:text-white hover:no-underline">
                Back to profile
              </Link>
            </p>
          ) : (
            <>
              {error ? <p className={alertError}>{error}</p> : null}

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="current-password">
                  Current password
                </label>
                <input
                  id="current-password"
                  type="password"
                  className={inputSky}
                  placeholder="Current password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="new-password">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={inputSky}
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-[0.35rem] block text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300" htmlFor="confirm-password">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className={inputSky}
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              <button className={goldButton} type="submit" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
