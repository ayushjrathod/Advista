export interface Brief {
  company_name: string
  product_description: string
  target_customers: string
  competitor_names: string[]
  strategic_goals: string
  primary_channels: string[]
  positioning_hypothesis: string
  additional_context: string
}

export interface Message {
  role: 'user' | 'assistant'
  text: string
}

export interface Report {
  executive_summary: string
  product_positioning: string
  competitive_landscape: string
  customer_sentiment: string
  strategic_gaps: string[]
  pricing_intelligence: string
  corporate_momentum: string
  integration_ecosystem: string
  recommended_actions: string[]
  sources: string[]
}

export type ResearchStatus = 'idle' | 'running' | 'done' | 'error'

export interface ResearchState {
  status: ResearchStatus
  progress: string[]
  report: Report | null
  error: string | null
}

export interface ChatState {
  sessionId: string | null
  messages: Message[]
  brief: Brief | null
  completion: number
  loading: boolean
  research: ResearchState
}

export type ChatAction =
  | { type: 'PREFILL_SUCCESS'; sessionId: string; brief: Brief; completion: number }
  | { type: 'USER_MESSAGE'; text: string }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'MESSAGE_SUCCESS'; response: string; brief: Brief; completion: number }
  | { type: 'ASSISTANT_MESSAGE'; response: string; brief: Brief; completion: number }
  | { type: 'RESEARCH_START' }
  | { type: 'RESEARCH_PROGRESS'; message: string }
  | { type: 'RESEARCH_REPORT'; report: Report }
  | { type: 'RESEARCH_ERROR'; error: string }
