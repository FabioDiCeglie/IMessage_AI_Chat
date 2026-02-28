import type { BubbleProps } from "../types"

export function Bubble({ role, content }: BubbleProps) {
  const isUser = role === "user"
  const align = isUser ? "justify-end" : "justify-start"
  const bubble = isUser ? "bg-bubble-user text-white" : "bg-bubble-other text-black"
  return (
    <div className={`flex ${align}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${bubble}`}>
        {content}
      </div>
    </div>
  )
}
