import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Profile from "./pages/user/Profile";
import Friends from "./pages/user/Friends";
import Lobby from "./pages/game/GameLobby";
import OnlineGame from "./pages/game/rooms/OnlineGame";
import CreateRoom from "./pages/game/modes/CreateRoom";
import JoinRoom from "./pages/game/modes/JoinRoom";
import LocalGame from "./pages/game/rooms/LocalGame";
import Matchmaking from "./pages/game/modes/Matchmaking";
import AIGame from "./pages/game/rooms/AIGame";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CustomizePage from "./features/customize/CustomizePage";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("accessToken");
//   if (!token) return <Navigate to="/login" />;
//   return children;
// }

function ProtectedRoutes() {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} /> */}
        {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/play/online-game" element={<OnlineGame />} />
          <Route path="/play/local-game" element={<LocalGame />} />
          <Route path="/play/ai-game" element={<AIGame />} />
        {/* </Route> */}

        <Route element={<SideBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          {/* <Route path="/play" element={<Play />} /> */}
          <Route path="/settings" element={<CustomizePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Route>

        <Route path="*" element={<Home />} />
        
      </Routes>
    </BrowserRouter>
  );
}
