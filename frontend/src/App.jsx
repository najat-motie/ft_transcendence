import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import OAuthCallback from "./pages/auth/OAuthCallback";
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
import GameRoom from "./pages/game/GameRoom";
import OnlineGameNew from "./pages/game/OnlineGame";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        
        {/* Public Routes - Offline Game */}
        <Route path="/play/local-game" element={<LocalGame />} />
        <Route path="/play/ai-game" element={<AIGame />} />

        {/* Public Routes - With Sidebar */}
        <Route element={<SideBar />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Routes that need the sidebar shell */}
          <Route element={<SideBar />}>
            <Route path="/play" element={<Lobby />} />
            <Route path="/play/create-room" element={<CreateRoom />} />
            <Route path="/play/join-room" element={<JoinRoom />} />
            <Route path="/play/matchmaking" element={<Matchmaking />} />
            <Route path="/settings" element={<CustomizePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          {/* Fullscreen/protected game routes without sidebar */}
          <Route path="/play/online-game" element={<OnlineGame />} />
          <Route path="/play/online" element={<OnlineGameNew />} />
          <Route path="/play/:mode" element={<GameRoom />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
