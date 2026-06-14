import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import logging
from services.chat_service import chat_service
from services.url_service import extract_brief_from_url

logger = logging.getLogger(__name__)

chat_router = APIRouter()


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    user_message: str


class PrefillRequest(BaseModel):
    session_id: Optional[str] = None
    url: str


@chat_router.post("/message")
async def send_message(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    turn = await chat_service.chat(session_id, request.user_message)
    brief = await chat_service.get_brief(session_id)
    return {
        "session_id": session_id,
        "response": turn.response,
        "brief": brief.model_dump(),
        "completion": brief.get_completion_percentage(),
    }


@chat_router.post("/prefill")
async def prefill_from_url(request: PrefillRequest):
    session_id = request.session_id or str(uuid.uuid4())
    brief = extract_brief_from_url(request.url)
    await chat_service.set_brief(session_id, brief)
    return {
        "session_id": session_id,
        "brief": brief.model_dump(),
        "completion": brief.get_completion_percentage(),
        "missing_fields": brief.get_missing_fields(),
    }
