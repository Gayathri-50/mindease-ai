import { useEffect, useRef, useState } from "react"
import API from "../services/api"

function AIChat() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return

    // append user message and a loading placeholder for AI
    const userMessage = { type: 'user', text: trimmed }
    const aiPlaceholder = { type: 'ai', text: '...', loading: true }
    setChat((c) => [...c, userMessage, aiPlaceholder])
    setMessage('')
    setIsLoading(true)

    API.post("/chat", { message: trimmed })
      .then((res) => {
        const reply = res?.data?.reply || "Sorry, I could not generate a response."
        setChat((prev) => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].type === "ai" && copy[i].loading) {
              copy[i] = { type: "ai", text: reply }
              break
            }
          }
          return copy
        })
      })
      .catch((err) => {
        console.error("AI chat error", {
          url: err.config?.url,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        })

        setChat((prev) => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].type === "ai" && copy[i].loading) {
              copy[i] = { type: "ai", text: "Sorry, something went wrong. Please try again." }
              break
            }
          }
          return copy
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  return (
    <div className="flex h-screen flex-col bg-[#070b17] text-white">
      <div className="border-b border-white/10 bg-[#0f141f]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">AI Wellness Chat</h1>
              <p className="mt-1 text-sm text-gray-400">Get support and reflect with your mindful companion</p>
            </div>
            <span className="inline-flex max-w-max rounded-full bg-green-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-green-300 ring-1 ring-green-500/30">
              🟢 Online
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {chat.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="rounded-full bg-white/5 p-6">
                  <div className="text-5xl">💭</div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">Start your wellness journey</p>
                  <p className="mt-2 text-gray-400">Share your thoughts and get mindful support from MindEase AI</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {chat.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${item.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 ${item.type === "user" ? "flex-row-reverse" : "flex-row"} max-w-xl sm:max-w-2xl`}
                    >
                      {item.type === "ai" && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-purple-500/30">
                          M
                        </div>
                      )}
                      <div
                        className={`rounded-3xl px-5 py-4 shadow-xl transition-all ${
                          item.type === "user"
                            ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-purple-500/20"
                            : "border border-white/10 bg-[#0f172a]/80 text-gray-100 shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6 sm:text-base">
                          {item.text}
                          {item.loading && (
                            <span className="ml-2 inline-block animate-pulse">⋯</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0f141f]/90 backdrop-blur-xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex gap-3 sm:gap-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts..."
                rows={1}
                className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 sm:text-base"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-xl font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
              >
                {isLoading ? '⏳' : '↑'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
