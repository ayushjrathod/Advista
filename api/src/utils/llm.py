from google import genai
from google.genai import types
from .config import settings


class LLM:
  def __init__(self):
    self.client = genai.Client(
      vertexai = True,
      project=settings.GOOGLE_CLOUD_PROJECT,
    )

  def generate(self, model: str, prompt: str):
    response = self.client.models.generate_content(
      model=model,
      contents=prompt
    )
    return response

  def generate_structured(self, model: str, prompt: str, response_schema: str = "json", system_instruction: str = None):
    response = self.client.models.generate_content(
      model=model,
      contents=prompt,
      config=types.GenerateContentConfig(
        response_mime_type='application/json',
        response_schema=response_schema,
        system_instruction=system_instruction,
      )
    )
    return response

llm_client = LLM()
