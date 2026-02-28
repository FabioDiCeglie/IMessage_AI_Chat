import type { ChatRequestPayload, ChatResponse } from "./types"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export async function sendMessage(payload: ChatRequestPayload): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = (await res.json().catch(() => ({}))) as ChatResponse & { error?: string }
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
  return data
}
