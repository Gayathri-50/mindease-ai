import { motion } from "framer-motion";

function StatCard({ title, value, subtitle, icon, accent, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-5 shadow-lg backdrop-blur-xl transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-white/60">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 truncate text-xs text-white/70">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl text-white shadow-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;