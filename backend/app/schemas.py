from typing import Literal

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1)
    enable_thinking: bool = False
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
