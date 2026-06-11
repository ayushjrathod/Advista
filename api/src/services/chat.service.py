import logging

from google.genai import types
from utils.llm import llm_client
from pydantic import BaseModel, Field, create_model
from typing import Optional
from models.research_brief import ResearchBrief
from prompts.chatbot import CHATBOT_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


BriefUpdates = create_model(
    'BriefUpdates',
    **{
        name: (Optional[field.annotation], None)
        for name, field in ResearchBrief.model_fields.items()
    }
)


class TurnOutput(BaseModel):
    response: str = Field(description="The conversational reply to the user")
    brief_updates: BriefUpdates = Field(description="Only the fields learned this turn, leave others as null")


class ChatService:
    def __init__(self):
        self.memory: list = []
        self.brief: ResearchBrief = ResearchBrief()

    def _build_system_prompt(self) -> str:
        brief_json = self.brief.model_dump_json(indent=2)
        return f"{CHATBOT_SYSTEM_PROMPT}\n\nCURRENT BRIEF STATE:\n{brief_json}"

    def chat(self, user_message: str):
        self.memory.append(
            types.Content(
                role='user',
                parts=[types.Part.from_text(text=user_message)]
            )
        )

        response = llm_client.generate_structured(
            model="gemini-3.1-flash-lite",
            system_instruction=self._build_system_prompt(),
            prompt=self.memory,
            response_schema=TurnOutput
        )

        turn_output = TurnOutput.model_validate_json(response.text)

        self.memory.append(
            types.Content(
                role='model',
                parts=[types.Part.from_text(text=turn_output.response)]
            )
        )

        updates = turn_output.brief_updates.model_dump(exclude_none=True)
        if updates:
            self.brief = self.brief.model_copy(update=updates)

        return turn_output
