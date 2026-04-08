import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { setCookie, setUserInCookie } from "../../utils/cookies";
import {
  alertError,
  frostedPanel,
  frostedPanelStrong,
  goldButton,
  goldPill,
  inputSky,
  mutedText,
  slabHeading,
} from "../../lib/ui";
import { cn } from "../../lib/cn";
import { getApiBaseUrl } from "../../lib/runtime-config";

function storeUserData(data) {
  setUserInCookie(data.user, 7);
  setCookie(`accessToken_${data.user.userId}`, data.accessToken, 7);
  setCookie(`refreshToken_${data.user.userId}`, data.refreshToken, 7);
}

const shellStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.1), transparent 22%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

const heroCardClass = "grid gap-[0.35rem] rounded-[18px] border border-white/10 bg-white/[0.04] p-4";
const labelClass = "text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-slate-300";
const linkClass = "font-semibold text-sky-300 hover:text-sky-100 hover:no-underline";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const apiBaseUrl = getApiBaseUrl();
  const oauth42Url = `${apiBaseUrl}/auth/42`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "ft_transcendence - Login";
  }, []);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        true,
      );
      const payload = response?.data || response;
      storeUserData(payload);

      try {
        const kpiResponse = await apiRequest(`/profile/${payload.user.userId}/kpis`, { method: "GET" });
        const kpiData = kpiResponse?.data || kpiResponse;
        setCookie("userProfile", JSON.stringify(kpiData), 7);
      } catch {}

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200" style={shellStyle}>
      <div className="mx-auto grid min-h-[calc(100vh-clamp(2rem,6vw,4rem))] w-full max-w-[1120px] grid-cols-1 gap-[clamp(1rem,3vw,2rem)] min-[921px]:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
        <aside className={`${frostedPanel} grid content-center gap-[1.1rem] p-[clamp(1.5rem,4vw,3rem)]`}>
          <span className={goldPill}>Player Access</span>
          <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] text-slate-50")}>
            Jump back into the arena.
          </h1>
          <p className={cn("m-0 max-w-[54ch] leading-[1.7]", mutedText)}>
            Sign in to continue your ranked climb, reconnect with friends, and pick up active matches instantly.
          </p>

          <div className="mt-1 grid gap-[0.85rem] min-[921px]:grid-cols-3">
            <div className={heroCardClass}>
              <strong className="text-[0.92rem] text-slate-50">Realtime Matches</strong>
              <span className="text-[0.82rem] leading-[1.45] text-slate-400">Low-latency online rooms</span>
            </div>
            <div className={heroCardClass}>
              <strong className="text-[0.92rem] text-slate-50">Private Invites</strong>
              <span className="text-[0.82rem] leading-[1.45] text-slate-400">Share room codes in seconds</span>
            </div>
            <div className={heroCardClass}>
              <strong className="text-[0.92rem] text-slate-50">Profile Sync</strong>
              <span className="text-[0.82rem] leading-[1.45] text-slate-400">Your stats stay ready across devices</span>
            </div>
          </div>
        </aside>

        <div className={`${frostedPanelStrong} grid content-center p-[clamp(1.35rem,3vw,2rem)]`}>
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid h-[3.75rem] w-[3.75rem] place-items-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] font-extrabold tracking-[0.08em] text-sky-50 shadow-[0_18px_30px_rgba(37,99,235,0.28)]">
              XO
            </div>
            <h2 className={cn(slabHeading, "mb-[0.45rem] text-[clamp(1.5rem,3vw,2rem)] text-slate-50")}>Welcome back</h2>
            <p className="m-0 text-[0.95rem] leading-[1.6] text-slate-400">
              Enter your details to access your account
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error ? <p className={alertError}>{error}</p> : null}

            <div className="grid gap-[0.45rem]">
              <label htmlFor="login-email" className={labelClass}>Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={inputSky}
              />
            </div>

            <div className="grid gap-[0.45rem]">
              <label htmlFor="login-password" className={labelClass}>Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className={inputSky}
              />
              <div className="mt-4 text-center">
                <Link 
                  to="/reset-password"
                  className="text-sm text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button className={goldButton} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 grid gap-[0.85rem]">
            <p className="m-0 text-center text-[0.84rem] uppercase tracking-[0.08em] text-slate-500">
              Or continue with
            </p>
            <button
              className="inline-flex w-full items-center justify-center gap-3 rounded-[14px] border border-white/80 bg-white px-4 py-[0.85rem] text-[0.95rem] font-bold text-slate-900 transition duration-150 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
              type="button"
              onClick={() => {
                window.location.href = oauth42Url;
              }}
            >
              Intra 42
            </button>
          </div>

          <div className="mt-[1.4rem] text-center text-[0.9rem] text-slate-400">
            Don't have an account? <Link className={linkClass} to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
