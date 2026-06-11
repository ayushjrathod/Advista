from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config=SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"

    PORT: int = 8000

    DATABASE_URL: str = "postgresql://user:password@localhost:5432/advista"
    DIRECT_URL: Optional[str] = None

    # LLM API keys
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_API_KEY1: str = ""
    GROQ_API_KEY2: str = ""
    GROQ_API_KEY3: str = ""
    GROQ_API_KEY4: str = ""
    GROQ_API_KEY5: str = ""
    GEMINI_LITE_MODEL: str = "gemini-3.1-flash-lite"
    GOOGLE_CLOUD_PROJECT: str = "learninig-test"
    GOOGLE_CLOUD_REGION: str = "global"

    SERPAPI_API_KEY: str = ""

    ENABLE_CELERY: bool = False
    ENABLE_REDIS: bool = False    

settings = Settings()
