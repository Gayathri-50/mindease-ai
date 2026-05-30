import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom"
import {
  FaHome,
  FaSmile,
  FaCheckCircle,
  FaBook,
  FaRobot,
  FaUser,
} from "react-icons/fa"

const links = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/mood", label: "Mood", icon: <FaSmile /> },
  { to: "/habits", label: "Habits", icon: <FaCheckCircle /> },
  { to: "/journal", label: "Journal", icon: <FaBook /> },
  { to: "/chat", label: "AI Chat", icon: <FaRobot /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
]
function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-[260px] p-8 text-white">
      <div className="h-full rounded-[36px] border border-white/10 bg-[#09101f]/90 p-6 shadow-[0_25px_90px_rgba(9,10,22,0.45)] backdrop-blur-3xl flex flex-col">
        <div className="mb-12 flex items-center gap-4 rounded-[28px] bg-white/5 p-4 shadow-[0_20px_45px_rgba(79,70,229,0.15)] ring-1 ring-white/10 transition-all duration-300">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg shadow-purple-500/20">
            M
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">MindEase</p>
            <h1 className="text-xl font-semibold">Wellness</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-sm flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-3xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 ring-1 ring-purple-400/30 shadow-[0_18px_45px_rgba(168,85,247,0.18)] text-white"
                    : "bg-transparent text-white/80 hover:bg-white/5 hover:text-white hover:translate-x-1"
                }`
              }
            >
              <span className="text-lg transition-colors duration-300 group-hover:text-purple-300">
                {link.icon}
              </span>
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="w-full mt-auto p-3 rounded-3xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar