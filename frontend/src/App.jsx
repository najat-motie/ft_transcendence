import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        
        {/* Public Routes - Offline Game */}
        <Route path="/play/local-game" element={<LocalGame />} />
        <Route path="/play/ai-game" element={<AIGame />} />

        {/* Public Routes - With Sidebar */}
        <Route element={<SideBar />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Protected Routes - Online Game Only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/play/online-game" element={<OnlineGame />} />
        </Route>

        {/* Protected Routes - With Sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SideBar />}>
            <Route path="/settings" element={<CustomizePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
