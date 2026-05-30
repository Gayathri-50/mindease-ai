import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import {
  FaSmile,
  FaBook,
  FaCheckCircle,
  FaQuoteLeft,
  FaRocket,
} from "react-icons/fa"
import { motion } from "framer-motion"
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
} from "recharts"
import Navbar from "../components/Navbar"

function StatCard({ title, value, subtitle, icon, accent }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${accent} p-6 shadow-[0_25px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">{title}</p>
          <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl text-white shadow-lg shadow-black/20">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

function QuoteWidget({ quote }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1c1f34]/80 to-[#111827]/90 p-8 shadow-[0_35px_80px_rgba(10,14,32,0.35)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-violet-200/80">Motivational Quote</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Daily inspiration</h2>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white shadow-lg shadow-violet-500/20">
          <FaQuoteLeft />
        </div>
      </div>
      <p className="mt-7 text-lg leading-8 text-slate-300">{quote}</p>
    </motion.div>
  )
}

const sampleQuotes = [
  "Small acts of self-care create powerful momentum.",
  "Your wellness is built from the choices you make today.",
  "Consistency is more meaningful than perfection.",
  "Each healthy habit is a step toward a stronger you.",
  "Pause, breathe, and celebrate the progress you have made.",
]

function Home() {
  const [stats, setStats] = useState({
    moods: 0,
    journal: 0,
    habits: 0,
    wellnessScore: 82,
    completionRate: 74,
    streak: 6,
  })
  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: "Mon", mood: 70, completion: 60 },
    { day: "Tue", mood: 76, completion: 68 },
    { day: "Wed", mood: 81, completion: 72 },
    { day: "Thu", mood: 78, completion: 70 },
    { day: "Fri", mood: 85, completion: 78 },
    { day: "Sat", mood: 88, completion: 82 },
    { day: "Sun", mood: 91, completion: 86 },
  ])
  const [recentJournals, setRecentJournals] = useState([])
  const [quote, setQuote] = useState(sampleQuotes[0])
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
    setQuote(sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)])
  }, [])

  const loadDashboardData = async () => {
    try {
      const [moodRes, journalRes, habitRes] = await Promise.all([
        API.get("/moods"),
        API.get("/journal"),
        API.get("/habits"),
      ])
      const moods = moodRes.data || []
      const journals = journalRes.data || []
      const habits = habitRes.data || []
      const completedHabits = habits.filter((item) => item.completed).length
      const completionRate = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0
      const wellnessScore = Math.min(100, Math.round((moods.length * 3 + completionRate * 0.8 + journals.length * 1.5) / 5 + 40))

      const moodTrendData = weeklyTrend.map((item, index) => {
        const moodValue = Math.min(100, Math.max(50, item.mood + (moods.length > 0 ? Math.floor(moods.length / 5) - 2 : 0)))
        return { ...item, mood: moodValue, completion: completionRate }
      })

      setStats({
        moods: moods.length,
        journal: journals.length,
        habits: habits.length,
        wellnessScore,
        completionRate,
        streak: habits.length >= 5 ? Math.min(14, habits.length) : 6,
      })
      setWeeklyTrend(moodTrendData)
      setRecentJournals(journals.slice(0, 4))
    } catch (error) {
      console.error("Home loadDashboardData error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#050913] text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Navbar />

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_rgba(10,14,32,0.28)] backdrop-blur-xl"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">MindEase Premium</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Wellness analytics built for your mental growth.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Stay motivated with mood trends, habit progress, journal insights, and a premium dashboard experience.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-inner shadow-black/20">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Wellness score</p>
                <p className="mt-3 text-4xl font-semibold text-white">{stats.wellnessScore}%</p>
                <p className="mt-2 text-sm text-slate-400">A tailored score from your mood and habits.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-inner shadow-black/20">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Habit consistency</p>
                <p className="mt-3 text-4xl font-semibold text-white">{stats.completionRate}%</p>
                <p className="mt-2 text-sm text-slate-400">Weekly completed habits.</p>
              </div>
            </div>
          </motion.div>

          <QuoteWidget quote={quote} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <StatCard
            title="Total moods tracked"
            value={stats.moods}
            subtitle="Mood logs captured"
            icon={<FaSmile />}
            accent="from-violet-500 to-fuchsia-500"
          />
          <StatCard
            title="Total habits"
            value={stats.habits}
            subtitle="Active habit goals"
            icon={<FaCheckCircle />}
            accent="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Journal entries"
            value={stats.journal}
            subtitle="Reflective notes"
            icon={<FaBook />}
            accent="from-purple-500 to-blue-500"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_1.3fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_rgba(10,14,32,0.3)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-200/80">Weekly trend</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Mood score</h2>
              </div>
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">7-day view</span>
            </div>
            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.12} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: "18px",
                      color: "#fff",
                    }}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#a855f7" strokeWidth={3} fill="url(#moodTrendGradient)" fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#111827]/95 to-[#0f172a]/95 p-8 shadow-[0_35px_80px_rgba(10,14,32,0.3)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-200/80">Habit completion</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Progress chart</h2>
              </div>
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">Goal focus</div>
            </div>
            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend} margin={{ top: 8, right: 5, left: -14, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: "18px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  <Bar dataKey="completion" name="Completion %" fill="#3b82f6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_rgba(10,14,32,0.3)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-200/80">Recent journal entries</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Reflective moments</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/journal")}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View all
              </button>
            </div>
            <div className="mt-8 space-y-4">
              {recentJournals.length > 0 ? (
                recentJournals.map((entry, index) => (
                  <div key={`${entry._id || index}-${entry.title || index}`} className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_45px_rgba(10,14,32,0.24)]">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{entry.title || `Journal Entry ${index + 1}`}</p>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                        {new Date(entry.createdAt || entry.date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-3">{entry.content || entry.body || "A thoughtful reflection to keep your wellness journey moving forward."}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
                  No recent journal entries yet. Start writing to capture your wellness progress.
                </div>
              )}
            </div>
          </motion.div>

          <QuoteWidget quote={quote} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(10,14,32,0.28)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-violet-200/80">Progress snapshot</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Performance metrics</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Mood logs tracked</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.moods}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">Habit goals active</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.habits}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#111827]/90 to-[#0f172a]/95 p-6 shadow-[0_25px_70px_rgba(10,14,32,0.28)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-purple-200/80">Guided actions</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Next steps</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <p>• Log your mood after each activity for better insight.</p>
              <p>• Keep habit streaks visible by reviewing daily wins.</p>
              <p>• Use journal reflections to deepen emotional awareness.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 p-6 shadow-[0_25px_70px_rgba(10,14,32,0.28)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-200/80">Fast actions</p>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => navigate("/mood")}
                className="flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-left text-white transition hover:bg-white/10"
              >
                <span>Log a mood</span>
                <FaRocket />
              </button>
              <button
                onClick={() => navigate("/habits")}
                className="flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-left text-white transition hover:bg-white/10"
              >
                <span>Review habits</span>
                <FaCheckCircle />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
