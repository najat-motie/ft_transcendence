import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { setCookie, setUserInCookie } from "../../utils/cookies";
import { frostedPanelStrong, slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";

const shellStyle = {
  background:
    "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.1), transparent 22%), linear-gradient(180deg, #0b1220 0%, #09111d 100%)",
};

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = "ft_transcendence - OAuth 42";
  }, []);

  useEffect(() => {
    const syncOAuthUser = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const userId = searchParams.get("userId");
      const email = searchParams.get("email");

      if (!accessToken || !refreshToken || !userId || !email) {
        navigate("/login");
        return;
      }

      const userData = {
        userId,
        email,
      };

      setUserInCookie(userData, 7);
      setCookie(`accessToken_${userId}`, accessToken, 7);
      setCookie(`refreshToken_${userId}`, refreshToken, 7);

      try {
        const kpiResponse = await apiRequest(`/profile/${userId}/kpis`, {
          method: "GET",
        });
        const kpiData = kpiResponse?.data || kpiResponse;
        const hydratedUser = {
          ...userData,
          username: kpiData?.username || userData.username,
          avatar: kpiData?.avatar || userData.avatar,
          bio: kpiData?.bio || userData.bio,
        };

        setUserInCookie(hydratedUser, 7);
        setCookie("userProfile", JSON.stringify(kpiData), 7);
      } catch {}

      navigate("/");
    };

    syncOAuthUser();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,3vw,2rem)] text-slate-200" style={shellStyle}>
      <div className="mx-auto grid w-full max-w-[520px] pt-[clamp(3rem,10vh,7rem)]">
        <div className={`${frostedPanelStrong} grid min-h-[420px] content-center gap-6 p-[clamp(1.35rem,3vw,2rem)] text-center`}>
          <div>
            <div className="mx-auto mb-4 grid h-[3.75rem] w-[3.75rem] place-items-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] font-extrabold tracking-[0.08em] text-sky-50 shadow-[0_18px_30px_rgba(37,99,235,0.28)]">
              42
            </div>
            <h2 className={cn(slabHeading, "mb-[0.45rem] text-[clamp(1.5rem,3vw,2rem)] text-slate-50")}>Authenticating...</h2>
            <p className="m-0 text-[0.95rem] leading-[1.6] text-slate-400">
              Please wait while we complete your login
            </p>
          </div>

          <div className="relative mx-auto grid h-[120px] w-[120px] place-items-center" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full border border-sky-400/20"></span>
            <span
              className="absolute inset-[16%] animate-ping rounded-full border border-sky-400/20"
              style={{ animationDelay: "0.35s" }}
            ></span>
            <span className="h-[18px] w-[18px] rounded-full bg-sky-400 shadow-[0_0_0_10px_rgba(56,189,248,0.12),0_0_24px_rgba(56,189,248,0.7)]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
