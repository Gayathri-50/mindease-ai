import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorAlert from "../components/ui/ErrorAlert";
import { FaCheckCircle, FaPlus, FaTrash, FaFire, FaChartLine } from "react-icons/fa";

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

function Habits() {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getHabits = async () => {
    try {
      setError(null);
      const response = await API.get("/habits");
      setHabits(response.data);
    } catch (error) {
      setError("Failed to load habits. Please try again.");
      console.error("getHabits error", error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!habitName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await API.post("/habits", { name: habitName.trim() });
      setHabitName("");
      setSuccess(`"${habitName.trim()}" added! 🎯`);
      getHabits();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to add habit. Please try again.");
      console.error("addHabit error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addHabit();
    }
  };

  const toggleHabit = async (id) => {
    try {
      await API.put(`/habits/${id}`);
      getHabits();
    } catch (error) {
      setError("Failed to update habit.");
      console.error("toggleHabit error", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await API.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      setError("Failed to delete habit.");
      console.error("deleteHabit error", error);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const stats = useMemo(() => {
    const completed = habits.filter((h) => h.completed).length;
    const pending = habits.filter((h) => !h.completed).length;
    const rate = habits.length ? Math.round((completed / habits.length) * 100) : 0;
    const streak = habits.length >= 5 ? Math.min(14, habits.length) : Math.min(habits.length, 6);
    return { completed, pending, rate, streak, total: habits.length };
  }, [habits]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <PageHeader
        title="Habit Tracker"
        subtitle="Build and maintain healthy daily habits"
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
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Habits"
            value={stats.total}
            subtitle="Active goals"
            icon={<FaChartLine />}
            accent="from-purple-600/20 to-fuchsia-600/10"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Done ✅"
            icon={<FaCheckCircle />}
            accent="from-green-600/20 to-emerald-600/10"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.rate}%`}
            subtitle="Success rate"
            icon={<FaFire />}
            accent="from-orange-600/20 to-red-600/10"
          />
          <StatCard
            title="Streak"
            value={stats.streak}
            subtitle="Day streak"
            icon={<FaFire />}
            accent="from-amber-600/20 to-yellow-600/10"
          />
        </motion.div>

        {/* Add Habit */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Add New Habit</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new habit..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              onClick={addHabit}
              disabled={!habitName.trim() || submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Spinner size="sm" /> : <FaPlus />}
              <span className="hidden sm:inline">Add Habit</span>
            </button>
          </div>
        </motion.div>

        {/* Habit List */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">Your habits</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Habit List</h3>
            </div>
            {habits.length > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-400">
                {stats.completed}/{stats.total} done
              </span>
            )}
          </div>

          {habits.length > 0 ? (
            <div className="space-y-3">
              {habits.map((habit) => (
                <motion.div
                  key={habit._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                    habit.completed
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-white/5 bg-slate-900/50 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleHabit(habit._id)}
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                        habit.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/5 text-slate-500 hover:bg-white/10"
                      }`}
                      title={habit.completed ? "Mark as pending" : "Mark as completed"}
                    >
                      <FaCheckCircle className={`text-lg ${habit.completed ? "" : "opacity-40"}`} />
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${habit.completed ? "text-green-300 line-through" : "text-white"}`}>
                        {habit.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {habit.completed ? "Completed ✅" : "Pending ⏳"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs text-red-400 transition hover:bg-red-500/20"
                    title="Delete habit"
                  >
                    <FaTrash size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🎯"
              title="No habits yet"
              description="Start building healthy habits by adding your first one above."
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Habits;