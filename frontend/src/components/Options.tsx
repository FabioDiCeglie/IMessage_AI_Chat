import { useState } from "react"

type OptionsProps = {
  enableThinking: boolean
  onThinkingChange: (value: boolean) => void
  temperature: number
  onTemperatureChange: (value: number) => void
}

export function Options({
  enableThinking,
  onThinkingChange,
  temperature,
  onTemperatureChange,
}: OptionsProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-app-muted">Thinking</span>
        <button
          type="button"
          role="switch"
          aria-checked={enableThinking}
          aria-description="See how the AI thinks when it replies"
          onClick={() => onThinkingChange(!enableThinking)}
          className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border border-app-border/40 transition-colors focus:outline-none focus:ring-2 focus:ring-app-accent focus:ring-offset-2 focus:ring-offset-app-bg ${
            enableThinking ? "bg-bubble-user" : "bg-app-surface"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform mt-0.5 ${
              enableThinking ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-app-muted shrink-0">Temp</span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temperature}
          onChange={(e) => onTemperatureChange(Number(e.target.value))}
          className="w-16 accent-bubble-user"
          aria-label="Temperature: left is steady, right is more varied"
        />
        <span className="text-app-muted w-5 tabular-nums text-xs">{temperature.toFixed(1)}</span>
      </label>
      <div className="ml-auto relative">
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="w-8 h-8 rounded-full border border-app-border/40 bg-app-surface text-app-muted flex items-center justify-center text-base hover:bg-app-border/20 focus:outline-none focus:ring-2 focus:ring-app-accent focus:ring-offset-2 focus:ring-offset-app-bg"
          aria-label="Options help"
          aria-expanded={showHelp}
        >
          ?
        </button>
        {showHelp && (
          <>
            <div
              className="fixed inset-0 z-10"
              aria-hidden
              onClick={() => setShowHelp(false)}
            />
            <div className="absolute right-0 bottom-full mb-2 z-20 w-64 p-4 rounded-xl bg-app-surface border border-app-border shadow-xl text-sm text-app-text">
              <p className="font-medium text-app-text mb-2">Options</p>
              <p className="text-app-muted text-xs leading-relaxed mb-1">
                <strong className="text-app-text">Thinking</strong> — Turn on to see how the AI works step by step.
              </p>
              <p className="text-app-muted text-xs leading-relaxed">
                <strong className="text-app-text">Temp</strong> — Slide left for steady answers, right for more variety.
              </p>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="mt-3 w-full py-1.5 rounded-lg bg-app-bg text-app-muted text-xs font-medium hover:bg-app-border/30"
              >
                Got it
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
