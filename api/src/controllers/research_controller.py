import logging
from datetime import datetime, timezone

from fastapi import APIRouter
from prisma import Json
from prisma.enums import ResearchRunStatus
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from services.chat_service import chat_service
from services.research_service import research_service
from services.database_service import db

logger = logging.getLogger(__name__)

research_router = APIRouter()


class ResearchRequest(BaseModel):
    session_id: str


def _sse(data: str, event: str) -> str:
    return f"event: {event}\ndata: {data}\n\n"


@research_router.post("/start-research")
async def start_research(request: ResearchRequest):
    return StreamingResponse(
        _research_stream(request.session_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def _research_stream(session_id: str):
    run = None
    try:
        brief = await chat_service.get_brief(session_id)

        run = await db.prisma.researchrun.create(
            data={
                "session_id": session_id,
                "status": ResearchRunStatus.RUNNING,
                "brief_snapshot": Json(brief.model_dump()),
                "started_at": datetime.now(timezone.utc),
            }
        )

        yield _sse("Generating search queries...", "progress")
        search_params = await research_service.create_research_query(brief, session_id)
        await db.prisma.researchrun.update(
            where={"id": run.id},
            data={"search_params": Json(search_params.model_dump())},
        )

        yield _sse("Searching the web...", "progress")
        hits = await research_service.run_searches(search_params)

        yield _sse("Scraping sources...", "progress")
        docs = await research_service.scrape_sources(hits)

        yield _sse("Analyzing findings...", "progress")
        insights = await research_service.synthesize_categories(brief, docs)

        yield _sse("Writing report...", "progress")
        report = await research_service.synthesize_report(brief, insights)

        await db.prisma.report.create(data={**report.model_dump(), "run_id": run.id})
        await db.prisma.researchrun.update(
            where={"id": run.id},
            data={
                "status": ResearchRunStatus.COMPLETED,
                "completed_at": datetime.now(timezone.utc),
            },
        )

        yield _sse(report.model_dump_json(), "report")
    except Exception as e:
        logger.exception("Research stream failed")
        if run is not None:
            await db.prisma.researchrun.update(
                where={"id": run.id},
                data={"status": ResearchRunStatus.FAILED, "error": str(e)},
            )
        yield _sse(str(e), "error")
