import logging

from fastapi import APIRouter
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from services.chat_service import chat_service
from services.research_service import research_service


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
    yield "Getting research queries...\n"
    search_params = await research_service.create_research_query(current_brief, session_id)

    # fan out SerpAPI searches
    yield "Running searches...\n"
    hits_by_category = await research_service.run_searches(search_params)
    total_hits = sum(len(h) for h in hits_by_category.values())
    yield f"Found {total_hits} results across {len(hits_by_category)} categories.\n"

    # scrape the top pages per category
    yield "Scraping sources...\n"
    docs_by_category = await research_service.scrape_sources(hits_by_category)
    total_docs = sum(len(d) for d in docs_by_category.values())
    yield f"Scraped {total_docs} pages.\n"

    # MAP: synthesize each category in parallel
    yield "Analyzing categories...\n"
    insights = await research_service.synthesize_categories(current_brief, docs_by_category)
    yield f"Produced {len(insights)} category insights.\n"

    # REDUCE: combine into the final report
    yield "Synthesizing report...\n"
    report = await research_service.synthesize_report(current_brief, insights)

    yield report.model_dump_json()
