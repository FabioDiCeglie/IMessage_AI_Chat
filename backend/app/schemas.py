from typing import Literal, Optional

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatPayload(BaseModel):
    session_id: Optional[str] = None
    message: Message
    enable_thinking: bool = False
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


class ChatResponse(BaseModel):
    content: str
    thinking: Optional[str] = None
    model: str
    session_id: str


class SessionMessagesResponse(BaseModel):
    messages: list[Message]
