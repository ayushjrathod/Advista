import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

import aiofiles
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import AsyncGroq, Groq
from pydantic import BaseModel
from scripts import (get_chat_response, refine_ad_requirements,
                     search_youtube_videos)
from video_processor import VideoProcessor

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

# Store session data
session_data = {}
# Store active conversations
active_conversations = {}

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
        # Generate search query and process videos
        search_query = response.split('[SUFFICIENT]')[1].strip()
        youtube_results = search_youtube_videos(query=search_query)
        
        # Process videos in parallel
        processor = VideoProcessor()
        processed_results = await processor.process_videos(youtube_results)
        
        # Store final results
        session_data[chat_input.session_id] = {
            "query": search_query,
            "youtube_results": processed_results,
            "conversation": conversation,
            "timestamp": datetime.now().isoformat()
        }
        
        # Clean up active conversation
        del active_conversations[chat_input.session_id]
        
        await save_session_data(chat_input.session_id, session_data[chat_input.session_id])
    else:
        conversation.append({"role": "assistant", "content": response})
    
    return {
        "message": response,
        "is_complete": is_complete,
        "session_id": chat_input.session_id
    }

@app.get("/results/{session_id}")
async def get_results(session_id: str):
    """Get the final results for a completed chat session"""
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found or not completed")
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

if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
