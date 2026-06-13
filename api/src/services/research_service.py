import asyncio
import logging

from models.research_brief import ResearchBrief
from models.search_params import SearchParams
from models.research_report import (
    SearchHit,
    SourceDoc,
    CategoryInsight,
    CompetitiveIntelligenceReport,
)
from utils.llm import llm_client
from utils.config import settings
from utils.search import web_search_structured
from utils.scrape import fetch_page
from prompts.research import MAP_PROMPT, REDUCE_PROMPT

logger = logging.getLogger(__name__)

# Bound concurrent page fetches so a research run never hammers target sites at once.
_FETCH_LIMIT = asyncio.Semaphore(8)


class ResearchService:
    def __init__(self):
        pass

    async def create_research_query(self, research_brief: ResearchBrief, threadId: str) -> SearchParams:

        # Create prompt for extracting search queries
        brief_summary = f"""
        Company: {research_brief.company_name}
        Product/Service: {research_brief.product_description}
        Target Customers: {research_brief.target_customers}
        Competitors: {', '.join(research_brief.competitor_names) if research_brief.competitor_names else 'None specified'}
        Strategic Goals: {research_brief.strategic_goals}
        Primary Channels: {', '.join(research_brief.primary_channels) if research_brief.primary_channels else 'None specified'}
        Positioning: {research_brief.positioning_hypothesis}
        Additional Context: {research_brief.additional_context}
        """

        extraction_prompt = f"""
        Based on the following competitive intelligence brief, generate comprehensive search queries for Google Search
        that will help gather competitive intelligence. Create a single query for each category.

        Guidelines:
        1. company_product_query: Research what {research_brief.company_name}'s product does and how it's positioned.
           Focus on features, capabilities, and market positioning. Exclude job postings (-job).
        2. competitor_landscape_query: Research direct competitors and alternatives using 'vs' and 'alternatives' keywords.
           Competitors: {', '.join(research_brief.competitor_names) if research_brief.competitor_names else 'key competitors in the market'}
        3. customer_sentiment_query: Research what customers say on forums (site:reddit.com, etc.) — raw opinions,
           complaints, or praise. Target customers: {research_brief.target_customers}
        4. strategic_gap_query: Research feature requests, limitations, and missing capabilities to find market whitespace.
           Strategic goals: {research_brief.strategic_goals}
        5. battlecard_query: Use 'intitle:[Company] vs' to find direct comparison articles and pros/cons lists.
           Primary channels: {', '.join(research_brief.primary_channels) if research_brief.primary_channels else 'general market channels'}
        6. pricing_intelligence_query: Uncover hidden enterprise costs, pricing leaks, and contract renewal discussions.
        7. corporate_momentum_query: Find recent funding rounds, acquisitions, leadership changes, or major partnerships.
        8. integration_ecosystem_query: Map out API capabilities, marketplace presence, and third-party integrations.

        Make queries specific and actionable. Each must cover a distinct angle of the competitive landscape.

        CI Brief:
        {brief_summary}
        """

        try:
            response = llm_client.generate_structured(
                model=settings.GEMINI_LITE_MODEL,
                prompt=extraction_prompt,
                response_schema=SearchParams,
            )
            return SearchParams.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Error generating search params: {e}")
            return SearchParams()

    async def run_searches(self, search_params: SearchParams) -> dict[str, list[SearchHit]]:
        """Fan out all 8 queries to SerpAPI concurrently, keyed by category, preserving URLs."""
        named_queries = {
            "company_product":       search_params.company_product_query,
            "competitor_landscape":  search_params.competitor_landscape_query,
            "customer_sentiment":    search_params.customer_sentiment_query,
            "strategic_gap":         search_params.strategic_gap_query,
            "battlecard":            search_params.battlecard_query,
            "pricing_intelligence":  search_params.pricing_intelligence_query,
            "corporate_momentum":    search_params.corporate_momentum_query,
            "integration_ecosystem": search_params.integration_ecosystem_query,
        }
        active = {k: v for k, v in named_queries.items() if v}

        results = await asyncio.gather(
            *[asyncio.to_thread(web_search_structured, q) for q in active.values()],
            return_exceptions=True,
        )

        return {
            key: result if isinstance(result, list) else []
            for key, result in zip(active.keys(), results)
        }

    async def scrape_sources(
        self, hits_by_category: dict[str, list[SearchHit]], top_n: int = 3
    ) -> dict[str, list[SourceDoc]]:
        """Scrape the top N pages per category. All fetches run concurrently, bounded by a semaphore."""

        async def fetch(hit: SearchHit) -> SourceDoc:
            async with _FETCH_LIMIT:
                content = await asyncio.to_thread(fetch_page, hit.url)
            return SourceDoc(title=hit.title, url=hit.url, content=content)

        async def scrape_category(hits: list[SearchHit]) -> list[SourceDoc]:
            top = [h for h in hits if h.url][:top_n]
            docs = await asyncio.gather(*[fetch(h) for h in top])
            return [d for d in docs if d.content]

        categories = list(hits_by_category.keys())
        grouped = await asyncio.gather(
            *[scrape_category(hits) for hits in hits_by_category.values()]
        )
        return dict(zip(categories, grouped))

    async def synthesize_categories(
        self, brief: ResearchBrief, docs_by_category: dict[str, list[SourceDoc]]
    ) -> list[CategoryInsight]:
        """MAP: synthesize each non-empty category independently and in parallel."""
        active = {c: docs for c, docs in docs_by_category.items() if docs}

        def synthesize(category: str, docs: list[SourceDoc]) -> CategoryInsight:
            sources_block = "\n\n---\n\n".join(
                f"URL: {d.url}\nTITLE: {d.title}\nCONTENT:\n{d.content}" for d in docs
            )
            prompt = (
                f"Research category: {category}\n\n"
                f"Original brief:\n{brief.model_dump_json(indent=2)}\n\n"
                f"Scraped sources:\n{sources_block}"
            )
            response = llm_client.generate_structured(
                model=settings.GEMINI_LITE_MODEL,
                prompt=prompt,
                response_schema=CategoryInsight,
                system_instruction=MAP_PROMPT,
            )
            insight = CategoryInsight.model_validate_json(response.text)
            insight.category = category
            return insight

        results = await asyncio.gather(
            *[asyncio.to_thread(synthesize, c, docs) for c, docs in active.items()],
            return_exceptions=True,
        )

        insights = []
        for c, result in zip(active.keys(), results):
            if isinstance(result, CategoryInsight):
                insights.append(result)
            else:
                logger.error(f"Error synthesizing category '{c}': {result}")
        return insights

    async def synthesize_report(
        self, brief: ResearchBrief, insights: list[CategoryInsight]
    ) -> CompetitiveIntelligenceReport:
        """REDUCE: combine the per-category insights into the final report (one LLM call)."""
        insights_block = "\n\n".join(i.model_dump_json(indent=2) for i in insights)
        prompt = (
            f"Original brief:\n{brief.model_dump_json(indent=2)}\n\n"
            f"Per-category insights:\n{insights_block}"
        )

        try:
            response = await asyncio.to_thread(
                llm_client.generate_structured,
                model=settings.GEMINI_LITE_MODEL,
                prompt=prompt,
                response_schema=CompetitiveIntelligenceReport,
                system_instruction=REDUCE_PROMPT,
            )
            return CompetitiveIntelligenceReport.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Error synthesizing report: {e}")
            return CompetitiveIntelligenceReport()


research_service = ResearchService()
