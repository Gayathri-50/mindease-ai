import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaSmile,
  FaCheckCircle,
  FaBook,
  FaRobot,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const links = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/mood", label: "Mood Tracker", icon: <FaSmile /> },
  { to: "/habits", label: "Habit Tracker", icon: <FaCheckCircle /> },
  { to: "/journal", label: "Journal", icon: <FaBook /> },
  { to: "/chat", label: "AI Chat", icon: <FaRobot /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile sidebar (slide-over) */}
      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-screen w-[270px] flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col rounded-r-3xl border-r border-white/10 bg-[#070b17]/95 p-5 shadow-2xl backdrop-blur-2xl">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-bold text-white shadow-lg shadow-purple-500/20">
              M
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">MindEase</p>
              <h1 className="text-base font-semibold text-white">Wellness</h1>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="mb-6 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white ring-1 ring-purple-500/20"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                <span className="text-base transition-colors duration-200 group-hover:text-purple-400">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <FaSignOutAlt className="text-base" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Desktop spacer */}
      <div className="hidden w-[270px] flex-shrink-0 md:block" />
    </>
  );
}

export default Sidebar;