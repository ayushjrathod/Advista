import type { ComponentType } from 'react'
import type { Report } from '../../types/chat'
import {
  IconAlert,
  IconChart,
  IconCheckCircle,
  IconExternal,
  IconGrid,
  IconPackage,
  IconTag,
  IconTarget,
  IconTrend,
  IconUsers,
  type IconProps,
} from '../icons'

export type SectionKind = 'text' | 'gaps' | 'actions' | 'sources'

export interface ReportSection {
  id: string
  label: string
  key: keyof Report
  kind: SectionKind
  Icon: ComponentType<IconProps>
}

export const REPORT_SECTIONS: ReportSection[] = [
  { id: 'executive', label: 'Executive Summary', key: 'executive_summary', kind: 'text', Icon: IconChart },
  { id: 'positioning', label: 'Product Positioning', key: 'product_positioning', kind: 'text', Icon: IconPackage },
  { id: 'competitive', label: 'Competitive Landscape', key: 'competitive_landscape', kind: 'text', Icon: IconTarget },
  { id: 'sentiment', label: 'Customer Sentiment', key: 'customer_sentiment', kind: 'text', Icon: IconUsers },
  { id: 'pricing', label: 'Pricing Intelligence', key: 'pricing_intelligence', kind: 'text', Icon: IconTag },
  { id: 'momentum', label: 'Corporate Momentum', key: 'corporate_momentum', kind: 'text', Icon: IconTrend },
  { id: 'integration', label: 'Integration & Ecosystem', key: 'integration_ecosystem', kind: 'text', Icon: IconGrid },
  { id: 'gaps', label: 'Strategic Gaps', key: 'strategic_gaps', kind: 'gaps', Icon: IconAlert },
  { id: 'actions', label: 'Recommended Actions', key: 'recommended_actions', kind: 'actions', Icon: IconCheckCircle },
  { id: 'sources', label: 'Sources', key: 'sources', kind: 'sources', Icon: IconExternal },
]

export function sectionHasContent(report: Report, section: ReportSection): boolean {
  const value = report[section.key]
  return Array.isArray(value) ? value.length > 0 : Boolean(value)
}
