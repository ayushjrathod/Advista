from pydantic import BaseModel, Field
from typing import List


class SearchHit(BaseModel):
    """A single SerpAPI organic result, with its source URL preserved (web_search drops it)."""
    title: str = ""
    url: str = ""
    snippet: str = ""


class SourceDoc(BaseModel):
    """A scraped page: source URL plus its (truncated) text content."""
    title: str = ""
    url: str = ""
    content: str = ""


class CategoryInsight(BaseModel):
    """MAP output — synthesized insight for one search category. Same schema for every category."""
    category: str = ""
    summary: str = ""
    key_findings: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list, description="Source URLs backing the findings")


class CompetitiveIntelligenceReport(BaseModel):
    """REDUCE output — the final competitive intelligence deliverable."""
    executive_summary: str = ""
    product_positioning: str = ""
    competitive_landscape: str = ""
    customer_sentiment: str = ""
    strategic_gaps: List[str] = Field(default_factory=list)
    pricing_intelligence: str = ""
    corporate_momentum: str = ""
    integration_ecosystem: str = ""
    recommended_actions: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list, description="All source URLs cited across the report")
