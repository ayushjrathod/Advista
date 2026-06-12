import sys
import uuid

sys.path.insert(0, "src")

from services.chat_service import ChatService

service = ChatService()
session_id = str(uuid.uuid4())
print(f"Session: {session_id}\n")

while True:
    user_input = input("You: ")
    if user_input.lower() in ("exit", "quit"):
        break

    turn = service.chat(session_id, user_input)
    print(f"Bot: {turn.response}")
    print(f"Brief updates: {turn.brief_updates.model_dump(exclude_none=True)}")
    print(f"Search query: {turn.search_query}")
    print(f"Brief state: {service.get_brief(session_id).model_dump()}")
    print()
