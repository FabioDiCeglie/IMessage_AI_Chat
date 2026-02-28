import { useState } from "react"
import { sendMessage } from "../api"
import { Bubble } from "./Bubble"
import { Options } from "./Options"
import { Role, type ChatState, type Message } from "../types"

const initialChatState: ChatState = {
  messages: [],
  sessionId: null,
  loading: false,
  error: null,
}

export function Chat() {
  const [chat, setChat] = useState<ChatState>(initialChatState)
  const [enableThinking, setEnableThinking] = useState(false)
  const [temperature, setTemperature] = useState(0.7)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement
    const text = input?.value?.trim()
    if (!text || chat.loading) return

    const userMessage: Message = { role: Role.User, content: text }
    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null,
    }))
    input.value = ""

    try {
      const res = await sendMessage({
        session_id: chat.sessionId,
        message: { role: Role.User, content: text },
        enable_thinking: enableThinking,
        temperature,
      })
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: Role.Assistant, content: res.content, thinking: res.thinking ?? undefined }],
        sessionId: res.session_id,
        loading: false,
        error: null,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Oops, something went wrong. Please contact support."
      setChat((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  const { messages, loading, error } = chat

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[80vh] max-h-screen max-w-2xl mx-auto bg-app-bg border border-app-border rounded-2xl overflow-hidden shadow-xl">
      <header className="px-6 py-5 border-b border-app-border">
        <h1 className="text-lg font-semibold tracking-tight">iMessage AI 🤖</h1>
      </header>

      <div className="overflow-y-auto px-4 py-4 border-b border-app-border flex flex-col gap-2">
        {messages.length === 0 && !loading ? (
          <p className="text-app-muted text-sm text-center py-8">No messages yet. Send one to start.</p>
        ) : (
          <>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} thinking={m.thinking} />
            ))}
            {loading && <Bubble role={Role.Assistant} content="Thinking…" />}
          </>
        )}
      </div>

      <footer className="p-4 space-y-3">
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Options
          enableThinking={enableThinking}
          onThinkingChange={setEnableThinking}
          temperature={temperature}
          onTemperatureChange={setTemperature}
        />
        <form className="flex gap-2 items-end" onSubmit={handleSubmit}>
          <input
            name="message"
            type="text"
            placeholder="iMessage"
            disabled={loading}
            className="flex-1 rounded-[1.25rem] bg-app-surface py-3 pl-4 pr-4 text-app-text text-[15px] placeholder:text-app-muted border border-app-border focus:outline-none focus:ring-1 focus:ring-app-accent focus:ring-offset-1 focus:ring-offset-app-bg disabled:opacity-60"
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-full bg-bubble-user p-3 text-white hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-app-accent focus:ring-offset-1 focus:ring-offset-app-bg transition-opacity disabled:opacity-60 disabled:pointer-events-none"
            aria-label="Send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  )
}
