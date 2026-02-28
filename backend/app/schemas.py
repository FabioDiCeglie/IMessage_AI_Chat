from typing import Literal, Optional

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: Message
    enable_thinking: bool = False
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
