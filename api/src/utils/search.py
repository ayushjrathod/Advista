import serpapi
from .config import settings


def web_search(query: str, num_results: int = 5) -> str:
    results = serpapi.search(q=query, engine="google", api_key=settings.SERPAPI_API_KEY, num=num_results)
    snippets = [
        f"{r.get('title', '')}: {r.get('snippet', '')}"
        for r in results.get("organic_results", [])
        if r.get("snippet")
    ]
    return "\n\n".join(snippets)
