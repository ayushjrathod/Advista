import httpx
from utils.llm import llm_client
from models.research_brief import ResearchBrief
from prompts.url import URL_EXTRACT_PROMPT, BRIEF_FILL_PROMPT


def extract_brief_from_url(url: str) -> ResearchBrief:
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    page_text = httpx.get(url, follow_redirects=True).text

    extraction = llm_client.generate_structured(
        model="gemini-3.1-flash-lite",
        system_instruction=BRIEF_FILL_PROMPT,
        prompt=f"{URL_EXTRACT_PROMPT}\n\n{page_text[:8000]}",
        response_schema=ResearchBrief
    )

    return ResearchBrief.model_validate_json(extraction.text)
