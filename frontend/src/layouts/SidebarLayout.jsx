import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiMenu, FiPlay, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";
import { apiRequest } from "../services/api.js";
import { logout } from "../services/auth.js";
import { getUserFromCookie, getUserProfileFromCookie } from "../utils/cookies.js";
import { cn } from "../lib/cn.js";

const navItemClass = ({ isActive }) =>
  cn(
    "flex items-center gap-[0.8rem] rounded-2xl border border-white/5 bg-white/[0.03] px-[14px] py-3 text-base font-medium text-slate-300 backdrop-blur-[8px] transition duration-300 hover:translate-x-1 hover:bg-blue-500/15 hover:text-white hover:no-underline",
    isActive && "border-blue-500/30 bg-blue-500/15 font-semibold text-slate-50 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  );

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const baseUser = getUserFromCookie();
  const userProfile = getUserProfileFromCookie();
  const user = baseUser
    ? {
        ...baseUser,
        username: userProfile?.username || baseUser.username,
        avatar: userProfile?.avatar || baseUser.avatar,
        bio: userProfile?.bio || baseUser.bio,
        email: userProfile?.email || baseUser.email,
      }
    : null;
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebar = () => {
    setMenuOpen(false);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      logout(user?.userId);
      closeSidebar();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#0b1220] max-[900px]:overflow-visible">
      <button
        type="button"
        className="fixed left-4 top-4 z-40 hidden h-12 w-12 items-center justify-center rounded-[14px] border border-white/10 bg-slate-900/90 text-slate-50 shadow-[0_16px_32px_rgba(2,6,23,0.28)] backdrop-blur-[10px] max-[900px]:inline-flex"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
      >
        {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[25] border-0 bg-slate-950/55 backdrop-blur-[3px] min-[901px]:hidden"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={cn(
          "z-20 flex min-h-screen w-[220px] shrink-0 flex-col justify-between border-r border-white/5 bg-[linear-gradient(180deg,#0f1c3f_0%,#0b1220_100%)] px-4 py-8",
          "max-[900px]:fixed max-[900px]:left-0 max-[900px]:top-0 max-[900px]:h-dvh max-[900px]:min-h-dvh max-[900px]:w-[min(82vw,320px)] max-[900px]:overflow-y-auto max-[900px]:pt-20 max-[900px]:shadow-[24px_0_40px_rgba(2,6,23,0.35)] max-[900px]:transition-transform max-[900px]:duration-300",
          "max-[640px]:w-[min(88vw,320px)] max-[640px]:px-[0.9rem]",
          menuOpen ? "max-[900px]:translate-x-0" : "max-[900px]:-translate-x-full",
          "min-[901px]:translate-x-0",
        )}
      >
        <div className="mb-auto flex flex-col">
          <div className="mb-6 border-b border-white/10 pb-4">
            <Link to="/" onClick={closeSidebar}>
              <img src={logo} alt="tic-tac-toe logo" className="h-auto w-[120px]" />
            </Link>
          </div>

          <nav className="flex flex-col gap-4">
            <NavLink to="/play" className={navItemClass} onClick={closeSidebar}>
              <FiPlay className="text-[20px]" />
              <span>Play</span>
            </NavLink>
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-[0.8rem] rounded-2xl border border-white/5 bg-white/[0.03] px-[18px] py-[14px] text-left text-base text-slate-400 transition duration-300 hover:translate-x-1 hover:bg-white/[0.08] hover:text-white"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="menu"
              >
                <img
                  src={user?.avatar}
                  alt="avatar"
                  className="h-[42px] w-[42px] rounded-full border-2 border-yellow-400 object-cover"
                />
                <span className="text-[0.95rem] font-medium">{user?.username || "User"}</span>
              </button>

              {open ? (
                <div className="absolute bottom-[110%] left-0 right-0 z-[100] mb-2 flex min-w-full w-max flex-col gap-[0.2rem] rounded-[14px] border border-white/10 bg-slate-900 p-[0.4rem] shadow-[0_-10px_30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center rounded-[10px] px-[0.8rem] py-[0.65rem] text-[0.9rem] font-medium text-red-400 transition hover:bg-red-400/10"
                  >
                    Logout
                  </button>
                  <Link
                    to="/settings"
                    onClick={closeSidebar}
                    className="flex items-center rounded-[10px] px-[0.8rem] py-[0.65rem] text-[0.9rem] font-medium text-slate-200 transition hover:bg-white/[0.06] hover:no-underline"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeSidebar}
                    className="flex items-center rounded-[10px] px-[0.8rem] py-[0.65rem] text-[0.9rem] font-medium text-slate-200 transition hover:bg-white/[0.06] hover:no-underline"
                  >
                    View Profile
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-2xl bg-blue-500/15 px-[14px] py-3 font-medium text-slate-400 transition duration-300 hover:translate-x-1 hover:bg-white/[0.08] hover:text-white hover:no-underline"
                onClick={closeSidebar}
              >
                Login
              </Link>
            </div>
          )}

          <div className="mt-2 flex flex-wrap justify-center gap-[0.3rem] border-t border-slate-800 pt-4 text-[0.68rem] leading-[1.5] text-slate-500 max-[640px]:justify-start">
            <Link to="/privacy-policy" onClick={closeSidebar} className="text-slate-500 hover:text-slate-300 hover:no-underline">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-600">&</span>
            <Link to="/terms-of-service" onClick={closeSidebar} className="text-slate-500 hover:text-slate-300 hover:no-underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen h-screen min-w-0 flex-1 overflow-y-auto bg-[#0b1220] p-0 max-[900px]:h-auto max-[900px]:min-h-dvh">
        <Outlet />
      </main>
    </div>
  );
}
