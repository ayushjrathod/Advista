import logging

from google.genai import types
from utils.llm import llm_client
from utils.search import web_search
from pydantic import BaseModel, Field, ConfigDict, create_model
from typing import Optional, List
from models.research_brief import ResearchBrief
from prompts.chatbot import CHATBOT_SYSTEM_PROMPT, SEARCH_EXTRACTION_PROMPT

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



class Session(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    memory: list = Field(default_factory=list)
    brief: ResearchBrief = Field(default_factory=ResearchBrief)


class ChatService:
    def __init__(self):
        self.sessions: dict[str, Session] = {}

    def _get_session(self, session_id: str) -> Session:
        if session_id not in self.sessions:
            self.sessions[session_id] = Session()
        return self.sessions[session_id]

    def _build_system_prompt(self, session: Session) -> str:
        brief_json = session.brief.model_dump_json(indent=2)
        return f"{CHATBOT_SYSTEM_PROMPT}\n\nCURRENT BRIEF STATE:\n{brief_json}"

    def _merge_updates(self, session: Session, updates_model) -> None:
        updates = updates_model.model_dump(exclude_none=True)
        if updates:
            session.brief = session.brief.model_copy(update=updates)

    def chat(self, session_id: str, user_message: str) -> TurnOutput:
        session = self._get_session(session_id)

        session.memory.append(
            types.Content(
                role='user',
                parts=[types.Part.from_text(text=user_message)]
            )
        )

        response = llm_client.generate_structured(
            model="gemini-3.1-flash-lite",
            system_instruction=self._build_system_prompt(session),
            prompt=session.memory,
            response_schema=TurnOutput
        )

        turn_output = TurnOutput.model_validate_json(response.text)

        session.memory.append(
            types.Content(
                role='model',
                parts=[types.Part.from_text(text=turn_output.response)]
            )
        )

        self._merge_updates(session, turn_output.brief_updates)

        if turn_output.search_query:
            search_text = web_search(turn_output.search_query)

            search_extraction = llm_client.generate_structured(
                model="gemini-3.1-flash-lite",
                system_instruction=SEARCH_EXTRACTION_PROMPT,
                prompt=search_text,
                response_schema=CompetitorEnrichment
            )

            self._merge_updates(session, CompetitorEnrichment.model_validate_json(search_extraction.text))

        return turn_output

    def get_brief(self, session_id: str) -> ResearchBrief:
        return self._get_session(session_id).brief

    def set_brief(self, session_id: str, brief: ResearchBrief) -> None:
        self._get_session(session_id).brief = brief

chat_service = ChatService()
