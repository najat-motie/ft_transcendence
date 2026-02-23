import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./layouts/SidebarLayout";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Play from "./pages/game/GameModes";
import Profile from "./pages/user/Profile";
import Friends from "./pages/user/Friends";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

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
        <Route element={<SideBar />}>
            <Route path="/" element={<Home />} />
              {/* <Route element={<ProtectedRoutes />}> */}
                <Route path="/play" element={<Play />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/friends" element={<Friends />} />
              {/* </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
