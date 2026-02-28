import { useState } from "react"
import { Role, type BubbleProps } from "../types"

export function Bubble({ role, content, thinking }: BubbleProps) {
  const [showThinking, setShowThinking] = useState(false)
  const isUser = role === Role.User
  const isAssistant = role === Role.Assistant
  const hasThinking = isAssistant && thinking && thinking.trim() !== ""

  const align = isUser ? "justify-end" : "justify-start"
  const bubble = isUser
    ? "bg-bubble-user text-white"
    : isAssistant
      ? "bg-bubble-assistant text-white"
      : "bg-bubble-other text-black"

  return (
    <div className={`flex flex-col gap-1 ${align}`}>
      <div className={`flex ${align}`}>
        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${bubble}`}>
          {content}
        </div>
      </div>
      {hasThinking && (
        <div className={`max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
          <button
            type="button"
            onClick={() => setShowThinking((v) => !v)}
            className="text-sm font-light text-app-muted hover:text-app-text py-1.5 px-1 flex items-center gap-1.5"
            aria-expanded={showThinking}
          >
            {showThinking ? "Hide thinking" : "Show thinking"}
            <span className="text-xs">{showThinking ? "▲" : "▼"}</span>
          </button>
          {showThinking && (
            <div className="mt-1 rounded-lg bg-app-surface border border-app-border px-3 py-2 text-xs text-app-muted whitespace-pre-wrap max-h-48 overflow-y-auto">
              {thinking}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
