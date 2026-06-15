import { motion } from "framer-motion";

function EmptyState({ icon = "📝", title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-400">{description}</p>
      {action && action}
    </motion.div>
  );
}

export default EmptyState;