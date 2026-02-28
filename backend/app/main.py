from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chat_Qwen3.0_0.6B API")

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
    max_tokens = payload.get("max_tokens", 512)
    temperature = payload.get("temperature", 0.7)

    return {
        "content": "TODO: wire to model service",
        "thinking": None,
        "model": "Qwen/Qwen3-0.6B",
    }
