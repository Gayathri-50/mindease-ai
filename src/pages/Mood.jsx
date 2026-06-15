import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorAlert from "../components/ui/ErrorAlert";
import { FaSmile, FaMeh, FaFrown, FaHistory } from "react-icons/fa";

const MOOD_OPTIONS = [
  { value: "Happy", emoji: "😊", label: "Happy", color: "#22c55e", bg: "bg-green-500/20", border: "border-green-500/30", icon: <FaSmile className="text-green-400" /> },
  { value: "Neutral", emoji: "😐", label: "Neutral", color: "#f59e0b", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: <FaMeh className="text-amber-400" /> },
  { value: "Sad", emoji: "😔", label: "Sad", color: "#ef4444", bg: "bg-red-500/20", border: "border-red-500/30", icon: <FaFrown className="text-red-400" /> },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

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

function Mood() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getMoods = async () => {
    try {
      setError(null);
      const response = await API.get("/moods");
      setMoods(response.data);
    } catch (error) {
      setError("Failed to load moods. Please try again.");
      console.error("getMoods error", error);
    } finally {
      setLoading(false);
    }
  };

  const saveMood = async () => {
    if (!mood) return;
    setSubmitting(true);
    setError(null);
    try {
      await API.post("/moods", { mood, note });
      setSuccess("Mood saved successfully! 🎉");
      setMood("");
      setNote("");
      getMoods();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to save mood. Please try again.");
      console.error("saveMood error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMood = async (id) => {
    try {
      await API.delete(`/moods/${id}`);
      setMoods((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      setError("Failed to delete mood.");
      console.error("deleteMood error", error);
    }
  };

  useEffect(() => {
    getMoods();
  }, []);

  const stats = useMemo(() => {
    const happy = moods.filter((m) => m.mood === "Happy").length;
    const neutral = moods.filter((m) => m.mood === "Neutral").length;
    const sad = moods.filter((m) => m.mood === "Sad").length;
    return { happy, neutral, sad, total: moods.length };
  }, [moods]);

  const pieData = [
    { name: "Happy", value: stats.happy },
    { name: "Neutral", value: stats.neutral },
    { name: "Sad", value: stats.sad },
  ];

  const recentMoods = useMemo(() => {
    return moods.slice(0, 10);
  }, [moods]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-green-600/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <PageHeader
        title="Mood Tracker"
        subtitle="Track and visualize your emotional journey"
      />

      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 backdrop-blur-xl"
        >
          <span className="text-lg">✅</span>
          <p className="text-sm text-green-200">{success}</p>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Happy"
            value={stats.happy}
            subtitle="Moments of joy"
            icon={<FaSmile />}
            accent="from-green-600/20 to-emerald-600/10"
          />
          <StatCard
            title="Neutral"
            value={stats.neutral}
            subtitle="Balanced moments"
            icon={<FaMeh />}
            accent="from-amber-600/20 to-yellow-600/10"
          />
          <StatCard
            title="Sad"
            value={stats.sad}
            subtitle="Challenging moments"
            icon={<FaFrown />}
            accent="from-red-600/20 to-rose-600/10"
          />
        </motion.div>

        {/* Log Mood + Chart */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
          {/* Log Mood Form */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Log Your Mood</h3>

            <div className="space-y-4">
              {/* Mood Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">How are you feeling?</label>
                <div className="flex gap-3">
                  {MOOD_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMood(option.value)}
                      className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 ${
                        mood === option.value
                          ? `${option.bg} ${option.border} ring-2 ring-white/20`
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <span className={`text-xs font-medium ${mood === option.value ? "text-white" : "text-slate-400"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <button
                onClick={saveMood}
                disabled={!mood || submitting}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? <Spinner size="sm" className="mx-auto" /> : "Save Mood"}
              </button>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Mood Distribution</h3>
            {stats.total > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "#cbd5e1", fontSize: 13 }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon="📊"
                title="No mood data yet"
                description="Start logging your mood to see distribution charts."
              />
            )}
          </motion.div>
        </div>

        {/* Mood History */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">History</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Recent Moods</h3>
            </div>
            {moods.length > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                {moods.length} total
              </span>
            )}
          </div>

          {moods.length > 0 ? (
            <div className="space-y-3">
              {recentMoods.map((item) => {
                const moodOption = MOOD_OPTIONS.find((m) => m.value === item.mood) || MOOD_OPTIONS[1];
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition hover:border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl">{moodOption.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{item.mood}</p>
                        {item.note && (
                          <p className="mt-0.5 truncate text-xs text-slate-400">{item.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteMood(item._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-xs text-red-400 transition hover:bg-red-500/20"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="😊"
              title="No moods tracked yet"
              description="Start logging your mood above to build your emotional timeline."
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Mood;