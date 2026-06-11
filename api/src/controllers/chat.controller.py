from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
from starlette.responses import StreamingResponse

logger=logging.getLogger(__name__)

chat_router = APIRouter()


chat_router.post("/stream")
async def stream_chat(request: BaseModel):
  async def event_generator():
    for chunk in chatbot_service.stream(request.request_id, request.user_message):
      yield chunk
  return StreamingResponse(event_generator(), media_type="text/event-stream")
