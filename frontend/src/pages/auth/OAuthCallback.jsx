import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { setCookie, setUserInCookie } from "../../utils/cookies";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const syncOAuthUser = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const userId = searchParams.get("userId");
      const email = searchParams.get("email");

      if (!accessToken || !refreshToken || !userId || !email) {
        console.error("Missing OAuth callback parameters");
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
      } catch (error) {
        console.warn("OAuth profile hydration skipped:", error?.message || error);
      }

      navigate("/");
    };

    syncOAuthUser();
  }, [searchParams, navigate]);

  return (
    <div className="auth-shell auth-shell-login">
      <div className="auth-layout auth-layout-login auth-layout-compact">
        <div className="auth-box auth-box-loading">
          <div className="auth-header">
            <div className="auth-logo" aria-hidden="true">42</div>
            <h2>Authenticating...</h2>
            <p className="auth-subtitle">Please wait while we complete your login</p>
          </div>

          <div className="oauth-loading" aria-hidden="true">
            <span className="oauth-loading-ring oauth-loading-ring-one" />
            <span className="oauth-loading-ring oauth-loading-ring-two" />
            <span className="oauth-loading-core" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
