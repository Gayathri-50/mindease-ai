import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { FaRobot, FaUser, FaArrowUp, FaBrain } from "react-icons/fa";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { type: "user", text: trimmed };
    const aiPlaceholder = { type: "ai", text: "", loading: true };
    setChat((c) => [...c, userMessage, aiPlaceholder]);
    setMessage("");
    setIsLoading(true);

    API.post("/chat", { message: trimmed })
      .then((res) => {
        const reply = res?.data?.reply || "Sorry, I could not generate a response.";
        setChat((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].type === "ai" && copy[i].loading) {
              copy[i] = { type: "ai", text: reply };
              break;
            }
          }
          return copy;
        });
      })
      .catch(() => {
        setChat((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].type === "ai" && copy[i].loading) {
              copy[i] = { type: "ai", text: "Sorry, something went wrong. Please try again." };
              break;
            }
          }
          return copy;
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
      {/* Background */}
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <FaBrain className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">AI Wellness Chat</h2>
            <p className="text-xs text-slate-500">Your mindful companion</p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300 ring-1 ring-green-500/20">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {chat.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <EmptyState
                icon="💭"
                title="Start your wellness journey"
                description="Share your thoughts and get mindful support from MindEase AI"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {chat.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${item.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                        item.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                          item.type === "user"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                        }`}
                      >
                        {item.type === "user" ? (
                          <FaUser size={12} />
                        ) : (
                          <FaRobot size={12} />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-lg ${
                          item.type === "user"
                            ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
                            : "border border-white/10 bg-slate-900/80 text-slate-200"
                        }`}
                      >
                        {item.loading ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" style={{ animationDelay: "0ms" }} />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" style={{ animationDelay: "150ms" }} />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-xs text-slate-400">Thinking...</span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
                            {item.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts..."
              rows={1}
              className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <FaArrowUp size={16} />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-600">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

export default AIChat;