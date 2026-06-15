import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Spinner from "../components/ui/Spinner";
import ErrorAlert from "../components/ui/ErrorAlert";

function Login() {
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050913]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-[#050913]">
      {/* Background effects */}
      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative z-10 m-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 lg:flex-row lg:gap-16">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
              M
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50">MindEase</p>
              <h2 className="text-xl font-semibold text-white">Wellness</h2>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Welcome back to your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              wellness journey
            </span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-slate-400 lg:mx-0">
            Track your mood, build healthy habits, journal your thoughts, and get AI-powered wellness support.
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="mt-1 text-sm text-slate-400">Enter your credentials to continue</p>
            </div>

            <ErrorAlert message={error} onDismiss={clearError} />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email.trim() || !password.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? <Spinner size="sm" className="mx-auto" /> : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;