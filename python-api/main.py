from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
from datetime import datetime
import json
import logging
from groq import Groq,AsyncGroq
import os
from scripts import search_youtube_videos,refine_ad_requirements,get_chat_response
from video_processor import VideoProcessor
import aiofiles

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    is_complete: bool
    session_id: str
    youtube_results: Optional[List[dict]] = None
    processed: bool = False

# Store session data
session_data = {}
# Store active conversations
active_conversations = {}

# Add logger
logger = logging.getLogger(__name__)

@app.post("/chat/start")
async def start_chat():
    """Initialize a new chat session"""
    session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    active_conversations[session_id] = {
        "conversation": [
            {
                "role": "system",
                "content": """You are an AI advertising assistant helping to gather detailed information about ad requirements. 
                Ask focused questions one at a time to understand the client's needs. After each user response, evaluate if you have 
                enough information to generate a 4-5 word YouTube search query. If you do, indicate with '[SUFFICIENT]' at the start 
                of your response and provide the suggested search query. Otherwise, ask another relevant question."""
            }
        ]
    }
    
    # Send initial greeting
    return {
        "message": "Hello! I'm here to help you create an effective advertisement. What would you like to create an ad for?",
        "session_id": session_id,
        "is_complete": False
    }

@app.post("/chat/message", response_model=ChatResponse)
async def chat_message(chat_input: ChatInput):
    """Handle chat messages and continue the conversation"""
    if not chat_input.session_id or chat_input.session_id not in active_conversations:
        raise HTTPException(status_code=400, detail="Invalid or missing session ID")
    
    conversation = active_conversations[chat_input.session_id]["conversation"]
    
    # Add user message
    conversation.append({"role": "user", "content": chat_input.message})
    
    # Get AI response
    client = AsyncGroq(api_key=os.getenv('GROQ_API_KEY'))
    response = await get_chat_response(client, conversation)
    
    # Check if we have sufficient information
    is_complete = '[SUFFICIENT]' in response
    
    if is_complete:
        # Generate search query and get YouTube results
        search_query = response.split('[SUFFICIENT]')[1].strip()
        youtube_results = search_youtube_videos(query=search_query)
        
        # Store initial results immediately
        session_data[chat_input.session_id] = {
            "query": search_query,
            "youtube_results": youtube_results,
            "conversation": conversation,
            "timestamp": datetime.now().isoformat(),
            "processed": False
        }
        
        # First, send the initial response with YouTube results
        initial_response = {
            "message": response,
            "is_complete": is_complete,
            "session_id": chat_input.session_id,
            "youtube_results": youtube_results,
            "processed": False
        }
        
        # Start video processing in background
        asyncio.create_task(process_videos_background(
            chat_input.session_id, 
            search_query, 
            youtube_results, 
            conversation
        ))
        
        await save_session_data(chat_input.session_id, session_data[chat_input.session_id])
        return initial_response
    else:
        conversation.append({"role": "assistant", "content": response})
        return {
            "message": response,
            "is_complete": is_complete,
            "session_id": chat_input.session_id,
            "youtube_results": None,
            "processed": False
        }

async def process_videos_background(session_id: str, search_query: str, youtube_results: List[dict], conversation: List[dict]):
    """Process videos in background and save results"""
    try:
        processor = VideoProcessor()
        processed_results = await processor.process_videos(youtube_results)
        
        # Update existing session data
        if session_id in session_data:
            session_data[session_id].update({
                "processed_results": processed_results,
                "processed": True
            })
            
            # Save updated data
            await save_session_data(session_id, session_data[session_id])
            
        # Clean up active conversation
        if session_id in active_conversations:
            del active_conversations[session_id]
            
    except Exception as e:
        logger.error(f"Error processing videos: {str(e)}")
        if session_id in session_data:
            session_data[session_id]["error"] = str(e)
            await save_session_data(session_id, session_data[session_id])

@app.get("/results/{session_id}")
async def get_results(session_id: str):
    """Get the final results for a completed chat session"""
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Load from file if not in memory
    if not session_data.get(session_id):
        try:
            filename = f"session_{session_id}.json"
            async with aiofiles.open(filename, "r") as f:
                content = await f.read()
                session_data[session_id] = json.loads(content)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Session data not found")
    
    return session_data[session_id]

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_data[session_id]

@app.get("/sessions/")
async def list_sessions():
    return {"sessions": list(session_data.keys())}

# Update save_session_data to be async
async def save_session_data(session_id: str, data: dict):
    filename = f"session_{session_id}.json"
    async with aiofiles.open(filename, "w") as f:
        await f.write(json.dumps(data, indent=2))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
