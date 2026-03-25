import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyPolicy from "./pages/PolicyPage.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const OAuthCallback = lazy(() => import("./pages/auth/OAuthCallback"));
const Profile = lazy(() => import("./pages/user/Profile"));
const FriendProfile = lazy(() => import("./pages/user/ViewFriendProfile"));
const Friends = lazy(() => import("./pages/user/Friends"));
const Lobby = lazy(() => import("./pages/game/GameLobby"));
const CreateRoom = lazy(() => import("./pages/game/CreateRoom.jsx"));
const JoinRoom = lazy(() => import("./pages/game/JoinRoom.jsx"));
const LocalGame = lazy(() => import("./pages/game/LocalGame.jsx"));
const Matchmaking = lazy(() => import("./pages/game/Matchmaking.jsx"));
const AIGame = lazy(() => import("./pages/game/AIGame.jsx"));
const CustomizePage = lazy(() => import("./features/customize/CustomizePage"));
const OnlineGame = lazy(() => import("./pages/game/OnlineGame"));

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
          
          {/* Fullscreen Public Routes - Offline Game */}
          <Route path="/play/local-game" element={<LocalGame />} />
          <Route path="/play/ai-game" element={<AIGame />} />

          {/* Public Routes - With Sidebar */}
          <Route element={<SideBar />}>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Lobby />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Routes that need the sidebar shell */}
            <Route element={<SideBar />}>
              <Route path="/play/create-room" element={<CreateRoom />} />
              <Route path="/play/join-room" element={<JoinRoom />} />
              <Route path="/play/matchmaking" element={<Matchmaking />} />
              <Route path="/settings" element={<CustomizePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<FriendProfile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* Fullscreen Protected Route - Offline Game */}
            <Route path="/play/online" element={<OnlineGame />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
