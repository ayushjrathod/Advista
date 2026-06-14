import asyncio
import logging

from google.genai import types
from prisma.enums import MessageRole
from utils.llm import llm_client
from utils.search import web_search
from pydantic import BaseModel, Field, create_model
from typing import Optional, List
from models.research_brief import ResearchBrief
from prompts.chatbot import CHATBOT_SYSTEM_PROMPT, SEARCH_EXTRACTION_PROMPT
from services.database_service import db

logger = logging.getLogger(__name__)


BriefUpdates = create_model(
    'BriefUpdates',
    **{
        name: (Optional[field.annotation], None)
        for name, field in ResearchBrief.model_fields.items()
    }
)


class CompetitorEnrichment(BaseModel):
    competitor_names: Optional[List[str]] = None
    primary_channels: Optional[List[str]] = None
    additional_context: Optional[str] = None
    positioning_hypothesis: Optional[str] = None


class TurnOutput(BaseModel):
    response: str = Field(description="The conversational reply to the user")
    brief_updates: BriefUpdates = Field(description="Only the fields learned this turn, leave others as null")
    search_query: Optional[str] = Field(None, description="Set to a search string only when real-world competitor data is needed, otherwise null")


_BRIEF_FIELDS = list(ResearchBrief.model_fields.keys())


class ChatService:

    async def _ensure_session(self, session_id: str) -> None:
        if await db.prisma.session.find_unique(where={'id': session_id}) is None:
            await db.prisma.session.create(data={'id': session_id})

    async def _load_memory(self, session_id: str) -> list[types.Content]:
        rows = await db.prisma.message.find_many(
            where={'session_id': session_id},
            order={'created_at': 'asc'},
        )
        return [
            types.Content(
                role='user' if row.role == MessageRole.USER else 'model',
                parts=[types.Part.from_text(text=row.content)],
            )
            for row in rows
        ]

    async def _load_brief(self, session_id: str) -> ResearchBrief:
        row = await db.prisma.researchbrief.find_unique(where={'session_id': session_id})
        if row is None:
            return ResearchBrief()
        return ResearchBrief(**{field: getattr(row, field) for field in _BRIEF_FIELDS})

    async def _save_message(self, session_id: str, role: MessageRole, content: str) -> None:
        await db.prisma.message.create(
            data={'session_id': session_id, 'role': role, 'content': content},
        )

    async def _save_brief(self, session_id: str, brief: ResearchBrief) -> None:
        fields = brief.model_dump()
        await db.prisma.researchbrief.upsert(
            where={'session_id': session_id},
            data={
                'create': {**fields, 'session_id': session_id},
                'update': fields,
            },
        )

    def _build_system_prompt(self, brief: ResearchBrief) -> str:
        return f"{CHATBOT_SYSTEM_PROMPT}\n\nCURRENT BRIEF STATE:\n{brief.model_dump_json(indent=2)}"

    def _apply_updates(self, brief: ResearchBrief, updates_model) -> ResearchBrief:
        updates = updates_model.model_dump(exclude_none=True)
        return brief.model_copy(update=updates) if updates else brief

    async def chat(self, session_id: str, user_message: str) -> TurnOutput:
        await self._ensure_session(session_id)

        memory = await self._load_memory(session_id)
        brief = await self._load_brief(session_id)

        memory.append(
            types.Content(role='user', parts=[types.Part.from_text(text=user_message)])
        )

        response = await asyncio.to_thread(
            llm_client.generate_structured,
            model="gemini-3.1-flash-lite",
            system_instruction=self._build_system_prompt(brief),
            prompt=memory,
            response_schema=TurnOutput,
        )
        turn_output = TurnOutput.model_validate_json(response.text)

        await self._save_message(session_id, MessageRole.USER, user_message)
        await self._save_message(session_id, MessageRole.MODEL, turn_output.response)

        brief = self._apply_updates(brief, turn_output.brief_updates)

        if turn_output.search_query:
            search_text = await asyncio.to_thread(web_search, turn_output.search_query)

            search_extraction = await asyncio.to_thread(
                llm_client.generate_structured,
                model="gemini-3.1-flash-lite",
                system_instruction=SEARCH_EXTRACTION_PROMPT,
                prompt=search_text,
                response_schema=CompetitorEnrichment,
            )

            brief = self._apply_updates(
                brief, CompetitorEnrichment.model_validate_json(search_extraction.text)
            )

        await self._save_brief(session_id, brief)

        return turn_output

    async def get_brief(self, session_id: str) -> ResearchBrief:
        return await self._load_brief(session_id)

    async def set_brief(self, session_id: str, brief: ResearchBrief) -> None:
        await self._ensure_session(session_id)
        await self._save_brief(session_id, brief)


chat_service = ChatService()
