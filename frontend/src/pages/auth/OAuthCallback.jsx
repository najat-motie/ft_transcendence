import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCookie, setUserInCookie } from "../../utils/cookies";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!accessToken || !refreshToken || !userId || !email) {
      console.error("Missing OAuth callback parameters");
      navigate("/login");
      return;
    }

    // Store tokens and user data in cookies
    const userData = {
      userId,
      email,
    };

    setUserInCookie(userData, 7);
    setCookie(`accessToken_${userId}`, accessToken, 7);
    setCookie(`refreshToken_${userId}`, refreshToken, 7);

    // Redirect to home page
    navigate("/");
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>Authenticating...</h2>
          <p className="auth-subtitle">Please wait while we complete your login</p>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
