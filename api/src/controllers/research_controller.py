import logging

from fastapi import APIRouter
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from api.src.models.search_params import SearchParams
from api.src.services import chat_service
from api.src.services.research_service import research_service


logger = logging.getLogger(__name__)

research_router = APIRouter()

class ResearchRequest(BaseModel):
  session_id: str


@research_router.post("/start-research")
async def start_research(request: ResearchRequest):
    return StreamingResponse(
      _research_stream(request.session_id),
      media_type="text/event-stream"
    )


async def _research_stream(session_id: str):
    yield "Starting research process...\n"
    
    # get current brief state
    current_brief = chat_service.get_brief(session_id)
    
    # generate search queries
    yield "Getting Research Queries...\n"
    search_params: SearchParams = await research_service.create_research_query(current_brief, session_id)

    # call serpapi with each query 
    # process the results 
    # clean up 
    # can do rag on it and then generate queies and then pass it to llm or this might be overkill and pass everything to llm or there might be something elsse entierly that we can do with the results to get the insights we need.
