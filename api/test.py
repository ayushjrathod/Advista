import sys
import importlib.util

sys.path.insert(0, "src")

spec = importlib.util.spec_from_file_location("chat_service", "src/services/chat.service.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

ChatService = module.ChatService

service = ChatService()

while True:
    user_input = input("You: ")
    if user_input.lower() in ("exit", "quit"):
        break

    turn = service.chat(user_input)
    print(f"Bot: {turn.response}")
    print(f"Brief updates: {turn.brief_updates}")
    print(f"Brief state: {service.brief.model_dump()}")
    print()
