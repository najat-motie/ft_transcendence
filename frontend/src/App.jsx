import { BrowserRouter, Routes, Route } from "react-router-dom";

import SideBar from "./layouts/SidebarLayout";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Profile from "./pages/user/Profile";
import Friends from "./pages/user/Friends";
import Lobby from "./pages/game/GameLobby";
import GameRoom from "./pages/game/GameRoom";
import Matchmaking from "./pages/game/Matchmaking";
import OnlineGame from "./pages/game/OnlineGame";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/play/:mode" element={<GameRoom />} />
          <Route path="/play/online" element={<OnlineGame />} />
        </Route>

        <Route element={<SideBar />}>
          <Route path="/play" element={<Lobby />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/play/matchmaking" element={<Matchmaking />} />
            </Route>
        </Route>
 
        <Route path="*" element={<Home />} />
        
      </Routes>
    </BrowserRouter>
  );
}
