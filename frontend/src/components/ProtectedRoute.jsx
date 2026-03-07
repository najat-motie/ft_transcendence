import { Navigate, Outlet } from "react-router-dom";
import { getCookie, getUserFromCookie } from "../utils/cookies";

/**
 * Protected route wrapper that checks authentication
 * Redirects to /login if user is not authenticated
 */
export default function ProtectedRoute() {
  const user = getUserFromCookie();
  const accessToken = getCookie(`accessToken_${user?.userId}`);

  // Check if user is authenticated
  const isAuthenticated = !!(user?.userId && accessToken);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
