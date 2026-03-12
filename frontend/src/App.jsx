import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const OAuthCallback = lazy(() => import("./pages/auth/OAuthCallback"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Friends = lazy(() => import("./pages/user/Friends"));
const Lobby = lazy(() => import("./pages/game/GameLobby"));
const OnlineGame = lazy(() => import("./pages/game/rooms/OnlineGame"));
const CreateRoom = lazy(() => import("./pages/game/modes/CreateRoom"));
const JoinRoom = lazy(() => import("./pages/game/modes/JoinRoom"));
const LocalGame = lazy(() => import("./pages/game/rooms/LocalGame"));
const Matchmaking = lazy(() => import("./pages/game/modes/Matchmaking"));
const AIGame = lazy(() => import("./pages/game/rooms/AIGame"));
const CustomizePage = lazy(() => import("./features/customize/CustomizePage"));
const GameRoom = lazy(() => import("./pages/game/GameRoom"));
const OnlineGameNew = lazy(() => import("./pages/game/OnlineGame"));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
