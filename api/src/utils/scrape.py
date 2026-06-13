import httpx


def fetch_page(url: str, max_chars: int = 6000) -> str:
    """Fetch a page's raw HTML, truncated to max_chars.

    Mirrors url_service.extract_brief_from_url: no HTML parser — the LLM reads the
    raw markup. Returns "" on any failure so one bad URL never breaks the batch.
    """
    try:
        return httpx.get(url, follow_redirects=True, timeout=10.0).text[:max_chars]
    except Exception:
        return ""
