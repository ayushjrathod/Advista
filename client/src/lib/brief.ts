import type { Brief } from '../types/chat'

export const BRIEF_LABELS: Record<keyof Brief, string> = {
  company_name: 'Company',
  product_description: 'Product Description',
  target_customers: 'Target Customers',
  competitor_names: 'Competitors',
  strategic_goals: 'Strategic Goals',
  primary_channels: 'Primary Channels',
  positioning_hypothesis: 'Positioning',
  additional_context: 'Additional Context',
}

export function renderBriefValue(value: Brief[keyof Brief]): string | null {
  if (Array.isArray(value)) return value.length ? value.join(', ') : null
  return value || null
}

/** Mirrors ResearchBrief.is_complete() on the backend — the core fields needed to start research. */
export function isBriefReady(brief: Brief | null): boolean {
  if (!brief) return false
  return [
    brief.company_name,
    brief.product_description,
    brief.target_customers,
    brief.competitor_names?.length,
    brief.strategic_goals,
    brief.primary_channels?.length,
  ].every(Boolean)
}

export function getDomain(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    return u.hostname
  } catch {
    return null
  }
}
