import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorAlert from "../components/ui/ErrorAlert";
import { FaSearch, FaTrash, FaBook, FaClock } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getJournals = async () => {
    try {
      setError(null);
      const response = await API.get("/journal");
      setJournals(response.data);
    } catch (error) {
      setError("Failed to load journals. Please try again.");
      console.error("getJournals error", error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournal = async () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await API.post("/journal", { title: title.trim(), content: content.trim() });
      setSuccess("Journal entry saved! 📝");
      setTitle("");
      setContent("");
      getJournals();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to save journal. Please try again.");
      console.error("saveJournal error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJournal = async (id) => {
    try {
      await API.delete(`/journal/${id}`);
      setJournals((prev) => prev.filter((j) => j._id !== id));
    } catch (error) {
      setError("Failed to delete journal entry.");
      console.error("deleteJournal error", error);
    }
  };

  useEffect(() => {
    getJournals();
  }, []);

  const filteredJournals = useMemo(() => {
    if (!searchQuery.trim()) return journals;
    const q = searchQuery.toLowerCase();
    return journals.filter(
      (j) =>
        (j.title || "").toLowerCase().includes(q) ||
        (j.content || "").toLowerCase().includes(q)
    );
  }, [journals, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <PageHeader
        title="Journal"
        subtitle="Capture your thoughts, reflections, and insights"
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
        {/* New Journal Entry */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Write a New Entry</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, feelings, and reflections..."
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              onClick={saveJournal}
              disabled={!title.trim() || !content.trim() || submitting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {submitting ? <Spinner size="sm" className="mx-auto" /> : "Save Entry"}
            </button>
          </div>
        </motion.div>

        {/* Search & Journal History */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-300/80">History</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Journal Entries</h3>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {filteredJournals.length > 0 ? (
            <div className="space-y-4">
              {filteredJournals.map((journal, index) => (
                <motion.div
                  key={journal._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-xl border border-white/5 bg-slate-900/50 p-5 transition hover:border-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <FaBook className="text-purple-400 flex-shrink-0" />
                        <h4 className="text-base font-semibold text-white truncate">
                          {journal.title}
                        </h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                        {journal.content}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <FaClock />
                        <span>{new Date(journal.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteJournal(journal._id)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs text-red-400 transition hover:bg-red-500/20"
                      title="Delete entry"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {searchQuery && filteredJournals.length !== journals.length && (
                <p className="text-center text-xs text-slate-500">
                  Showing {filteredJournals.length} of {journals.length} entries
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon="📖"
              title={searchQuery ? "No matching entries" : "No journal entries yet"}
              description={
                searchQuery
                  ? "Try a different search term."
                  : "Start writing your first entry above to capture your thoughts."
              }
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Journal;