import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import ChatRequest
from app.services.model_service import ModelService
from app.services.qwen_model_service import QwenModelService

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

model_service: ModelService = QwenModelService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load()
    logger.info("Model loaded successfully")
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
async def chat(payload: ChatRequest):
    try:
        result = model_service.generate(
            # Convert Pydantic objects to plain dicts for the model service
            messages=[m.model_dump() for m in payload.messages],
            enable_thinking=payload.enable_thinking,
            temperature=payload.temperature,
        )
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to generate response"})

    return result
