from pydantic import BaseModel, Field
from typing import List

class SearchParams(BaseModel):
    """Search parameters generated from research brief for SerpAPI queries"""
    
    # --- Core Product & Market ---
    company_product_query: str = Field(
        default="",
        description="Query for product features, release notes, and positioning. Should exclude job postings (-job)."
    )
    competitor_landscape_query: str = Field(
        default="",
        description="Query for finding direct competitors and alternative tools using 'vs' and 'alternatives' keywords."
    )
    
    # --- Qualitative Data ---
    customer_sentiment_query: str = Field(
        default="",
        description="Query restricted to forums (site:reddit.com, etc.) searching for raw opinions, complaints, or praise."
    )
    strategic_gap_query: str = Field(
        default="",
        description="Query targeting feature requests, limitations, and missing capabilities to find market whitespace."
    )
    
    # --- Head-to-Head & Commercial ---
    battlecard_query: str = Field(
        default="",
        description="Query using 'intitle:[Company] vs' to find direct comparison articles and pros/cons lists."
    )
    pricing_intelligence_query: str = Field(
        default="",
        description="Query to uncover hidden enterprise costs, pricing leaks, and contract renewal discussions."
    )
    
    # --- Ecosystem & Momentum ---
    corporate_momentum_query: str = Field(
        default="",
        description="Query targeting recent funding, acquisitions, leadership changes, or major partnerships."
    )
    integration_ecosystem_query: str = Field(
        default="",
        description="Query to map out the tool's API capabilities, marketplace, and third-party integrations."
    )

    def get_all_queries(self) -> List[str]:
        """Get all search queries as a list"""
        return [
            self.company_product_query, 
            self.competitor_landscape_query, 
            self.customer_sentiment_query, 
            self.strategic_gap_query, 
            self.battlecard_query,
            self.pricing_intelligence_query,
            self.corporate_momentum_query,
            self.integration_ecosystem_query
        ]
