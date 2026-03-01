export const Role = {
  User: "user",
  Assistant: "assistant",
} as const

export type Role = (typeof Role)[keyof typeof Role]

export type Message = {
  role: Role
  content: string
  thinking?: string | null
}

export type BubbleProps = Message

export type ChatState = {
  messages: Message[]
  sessionId: string | null
  loading: boolean
  error: string | null
}

export type ChatRequestPayload = {
  session_id: string | null
  message: { role: Role; content: string }
  enable_thinking: boolean
  temperature: number
}

export type ChatResponse = {
  content: string
  thinking: string | null
  model: string
  session_id: string
}

export type SessionMessagesResponse = {
  messages: Message[]
}
