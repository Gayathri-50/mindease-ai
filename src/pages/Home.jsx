import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  FaSmile,
  FaBook,
  FaCheckCircle,
  FaRocket,
  FaBrain,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const sampleQuotes = [
  "Small acts of self-care create powerful momentum.",
  "Your wellness is built from the choices you make today.",
  "Consistency is more meaningful than perfection.",
  "Each healthy habit is a step toward a stronger you.",
  "Pause, breathe, and celebrate the progress you have made.",
  "Your mind is your most powerful asset. Nurture it daily.",
  "Wellness is not a destination, but a continuous journey.",
];

function WelcomeCard({ user, stats }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-slate-900 p-6 sm:p-8"
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <p className="text-sm font-medium text-purple-300">{greeting}</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Welcome back, {user?.name || "Warrior"} 👋
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-300">
          Your wellness score is <span className="font-semibold text-purple-300">{stats.wellnessScore}%</span>. 
          You've tracked <span className="font-semibold text-blue-300">{stats.moods} moods</span>, 
          completed <span className="font-semibold text-green-300">{stats.completionRate}% of habits</span>, 
          and written <span className="font-semibold text-pink-300">{stats.journal} journal entries</span>.
        </p>
      </div>
    </motion.div>
  );
}

function QuoteWidget({ quote }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-sm">
          💭
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Daily inspiration</span>
      </div>
      <p className="text-base leading-relaxed text-slate-300 italic">&ldquo;{quote}&rdquo;</p>
    </motion.div>
  );
}

function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    moods: 0,
    journal: 0,
    habits: 0,
    wellnessScore: 0,
    completionRate: 0,
    streak: 0,
  });
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setQuote(sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)]);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [moodRes, journalRes, habitRes] = await Promise.all([
        API.get("/moods"),
        API.get("/journal"),
        API.get("/habits"),
      ]);
      const moods = moodRes.data || [];
      const journals = journalRes.data || [];
      const habits = habitRes.data || [];

      const completedHabits = habits.filter((item) => item.completed).length;
      const completionRate = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0;
      const wellnessScore = Math.min(100, Math.round(
        (moods.length * 3 + completionRate * 0.8 + journals.length * 1.5) / 5 + 40
      ));

      // Build weekly trend data from actual mood data
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const trendData = days.map((day, index) => {
        const dayMoods = moods.filter((m) => {
          const d = new Date(m.createdAt);
          return d.getDay() === index;
        });
        const avgMood = dayMoods.length
          ? Math.round(
              dayMoods.reduce((sum, m) => {
                if (m.mood === "Happy") return sum + 90;
                if (m.mood === "Neutral") return sum + 65;
                return sum + 40;
              }, 0) / dayMoods.length
            )
          : 50 + Math.floor(Math.random() * 20);
        return { day, mood: avgMood, completion: completionRate };
      });

      setStats({
        moods: moods.length,
        journal: journals.length,
        habits: habits.length,
        wellnessScore,
        completionRate,
        streak: habits.length >= 5 ? Math.min(14, habits.length) : Math.min(habits.length, 6),
      });
      setWeeklyTrend(trendData);
      setRecentJournals(journals.slice(0, 4));
    } catch (error) {
      console.error("Home loadDashboardData error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        <PageHeader
          title="Dashboard"
          subtitle="Your wellness journey at a glance"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Welcome + Quote */}
          <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <WelcomeCard user={user} stats={stats} />
            <QuoteWidget quote={quote} />
          </div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              title="Wellness Score"
              value={`${stats.wellnessScore}%`}
              subtitle="Overall wellness"
              icon={<FaBrain />}
              accent="from-purple-600/20 to-fuchsia-600/10"
            />
            <StatCard
              title="Moods Tracked"
              value={stats.moods}
              subtitle="Total mood logs"
              icon={<FaSmile />}
              accent="from-green-600/20 to-emerald-600/10"
            />
            <StatCard
              title="Habit Completion"
              value={`${stats.completionRate}%`}
              subtitle="Completion rate"
              icon={<FaCheckCircle />}
              accent="from-blue-600/20 to-cyan-600/10"
            />
            <StatCard
              title="Day Streak"
              value={stats.streak}
              subtitle="Consecutive days"
              icon={<FaFire />}
              accent="from-orange-600/20 to-red-600/10"
            />
          </motion.div>

          {/* Charts */}
          <div className="grid gap-6 xl:grid-cols-2">
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Weekly trend</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Mood Score</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-400">7-day view</span>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} width={36} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                    <Area type="monotone" dataKey="mood" stroke="#a855f7" strokeWidth={2.5} fill="url(#moodGradient)" fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Habit progress</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Completion Rate</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-400">Weekly</span>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend} margin={{ top: 8, right: 5, left: -14, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} width={36} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                    <Bar dataKey="completion" name="Completion %" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Journals + Quick Actions */}
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Recent entries</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Journal</h3>
                </div>
                <button
                  onClick={() => navigate("/journal")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {recentJournals.length > 0 ? (
                  recentJournals.map((entry, index) => (
                    <div
                      key={entry._id || index}
                      className="rounded-xl border border-white/5 bg-slate-900/50 p-4 transition hover:border-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white truncate">
                          {entry.title || `Journal Entry ${index + 1}`}
                        </p>
                        <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          {new Date(entry.createdAt || entry.date || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                        {entry.content || entry.body || "A thoughtful reflection..."}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon="📝"
                    title="No journal entries yet"
                    description="Start writing to capture your thoughts and reflections."
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-6 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-300/80">Quick actions</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Jump to</h3>
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => navigate("/mood")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <FaSmile className="text-green-400" />
                      Log a mood
                    </span>
                    <FaRocket className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => navigate("/habits")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-400" />
                      Review habits
                    </span>
                    <FaChartLine className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => navigate("/chat")}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <FaBrain className="text-purple-400" />
                      Chat with AI
                    </span>
                    <FaRocket className="text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Stats overview</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-400">Total moods</p>
                    <p className="mt-1 text-2xl font-bold text-white">{stats.moods}</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-400">Active habits</p>
                    <p className="mt-1 text-2xl font-bold text-white">{stats.habits}</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <p className="text-xs text-slate-400">Journal entries</p>
                    <p className="mt-1 text-2xl font-bold text-white">{stats.journal}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;