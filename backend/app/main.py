import logging
import os
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import ChatRequest
from app.services.model_service import ModelService
from app.services.qwen_model_service import QwenModelService
from app.services.redis_session_service import RedisSessionService

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

model_service: ModelService = QwenModelService()
session_service = RedisSessionService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load()
    logger.info("Model loaded successfully")
    yield


app = FastAPI(title="Chat_Qwen3.0_0.6B", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=[],
)

router = APIRouter(prefix="/api/v1", tags=["api"])


@router.get("/health", status_code=204)
async def health():
    return Response(status_code=204)


@router.post("/chat")
async def chat(payload: ChatRequest):
    try:
        session_id = payload.session_id or session_service.create_session()
        session_service.add_message(session_id, payload.message.role, payload.message.content)
        messages = session_service.get_messages(session_id)

        result = model_service.generate(
            messages=messages,
            enable_thinking=payload.enable_thinking,
            temperature=payload.temperature,
        )

        session_service.add_message(session_id, "assistant", result["content"])
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        return JSONResponse(status_code=500, content={"error": "Oops, something went wrong. Please contact support."})

    return {**result, "session_id": session_id}


app.include_router(router)
