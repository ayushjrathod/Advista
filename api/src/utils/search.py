import serpapi
from .config import settings
from models.research_report import SearchHit


def web_search_structured(query: str, num_results: int = 5) -> list[SearchHit]:
    results = serpapi.search(q=query, engine="google", api_key=settings.SERPAPI_API_KEY, num=num_results)
    return [
        SearchHit(title=r.get("title", ""), url=r.get("link", ""), snippet=r.get("snippet", ""))
        for r in results.get("organic_results", [])
        if r.get("snippet")
    ]


def web_search(query: str, num_results: int = 5) -> str:
    hits = web_search_structured(query, num_results)
    return "\n\n".join(f"{h.title}: {h.snippet}" for h in hits)
