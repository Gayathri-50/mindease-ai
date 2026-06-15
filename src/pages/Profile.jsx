import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import { FaUser, FaEnvelope, FaIdBadge, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

function Profile() {
  const { user, loading, error, clearError } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

      <PageHeader
        title="Profile"
        subtitle="Manage your account and personal information"
      />

      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-4xl font-bold text-white shadow-xl shadow-purple-500/20">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
            <p className="mt-1 text-sm text-slate-400">{user?.email || "No email"}</p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-medium text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Active Account
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Details</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Account Information</h3>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <FaUser />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="text-sm font-medium text-white truncate">{user?.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FaEnvelope />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="text-sm font-medium text-white truncate">{user?.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <FaIdBadge />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">User ID</p>
                <p className="text-sm font-mono text-white truncate">{user?._id || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <FaShieldAlt />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Account Status</p>
                <p className="text-sm font-medium text-green-400">Verified & Active</p>
              </div>
            </div>
          </div>

          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
            >
              <p className="text-sm text-purple-300">
                ✨ Profile editing will be available in the next update. Stay tuned!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;