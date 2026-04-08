import { Navigate, Outlet } from "react-router-dom";
import { getCookie, getUserFromCookie } from "../utils/cookies";

export default function ProtectedRoute() {
  const user = getUserFromCookie();
  const accessToken = user ? getCookie(`accessToken_${user.userId}`) : null;

  const isAuthenticated = !!(user?.userId && accessToken);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
