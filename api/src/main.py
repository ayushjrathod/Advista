import logging
from fastapi import FastAPI

from utils.config import settings
from controllers.chat_controller import chat_router
from controllers.research_controller import research_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def lifespan(app: FastAPI):
    logger.info("Starting up the application...")
    # Perform any startup tasks here
    yield
    logger.info("Shutting down the application...")
    # Perform any shutdown tasks here
    
app = FastAPI(
    title='Advista api',
    lifespan=lifespan
)

app.include_router(chat_router, prefix="/chat")
app.include_router(research_router, prefix="/research")

@app.get("/")
async def root():
    return {"message": "Welcome to the Advista API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
