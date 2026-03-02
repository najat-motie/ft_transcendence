import { Outlet, Navigate } from "react-router-dom";
import { getUser } from "../services/auth";

export default function ProtectedRoute() {
  const isAuthenticated = !!getUser();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
