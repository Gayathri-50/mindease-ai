import { motion } from "framer-motion";

function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 backdrop-blur-xl"
    >
      <span className="mt-0.5 flex-shrink-0 text-lg">⚠️</span>
      <p className="flex-1 text-sm leading-5 text-red-200">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-300 hover:text-red-100 transition-colors"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}

export default ErrorAlert;