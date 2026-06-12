import logging

from api.src.models.research_brief import ResearchBrief
from api.src.models.search_params import SearchParams
from api.src.utils.llm import llm_client
from api.src.utils.config import settings

logger = logging.getLogger(__name__)


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

research_service = ResearchService()
