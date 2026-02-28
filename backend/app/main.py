from contextlib import asynccontextmanager

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.services.model_service import ModelService
from app.services.qwen_model_service import QwenModelService

model_service: ModelService = QwenModelService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load()
    yield


app = FastAPI(title="Chat_Qwen3.0_0.6B", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health", status_code=204)
async def health():
    return Response(status_code=204)


@app.post("/api/v1/chat")
async def chat(payload: dict):
    messages = payload.get("messages", [])
    enable_thinking = payload.get("enable_thinking", False)
    temperature = payload.get("temperature", 0.7)

    result = model_service.generate(
        messages=messages,
        enable_thinking=enable_thinking,
        temperature=temperature,
    )

    return result
