import { useState } from "react"
import { Bubble } from "./Bubble"
import type { Message } from "../types"

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-[80vh] max-h-screen max-w-2xl mx-auto bg-app-bg border border-app-border rounded-2xl overflow-hidden shadow-xl">
      <header className="px-6 py-5 border-b border-app-border">
        <h1 className="text-lg font-semibold tracking-tight">iMessage AI 🤖</h1>
      </header>

      <div className="overflow-y-auto px-4 py-4 border-b border-app-border flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-app-muted text-sm text-center py-8">No messages yet. Send one to start.</p>
        ) : (
          messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)
        )}
      </div>

      <footer className="p-4">
        <form
          className="flex gap-2 items-end"
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement
            const text = input?.value?.trim()
            if (!text) return
            setMessages((prev) => [...prev, { role: "user", content: text }])
            input.value = ""
          }}
        >
          <input
            name="message"
            type="text"
            placeholder="iMessage"
            className="flex-1 rounded-[1.25rem] bg-app-surface py-3 pl-4 pr-4 text-app-text text-[15px] placeholder:text-app-muted border border-app-border focus:outline-none focus:ring-1 focus:ring-app-accent focus:ring-offset-1 focus:ring-offset-app-bg"
            aria-label="Message"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-bubble-user p-3 text-white hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-app-accent focus:ring-offset-1 focus:ring-offset-app-bg transition-opacity"
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
