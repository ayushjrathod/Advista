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

export interface ChatState {
  sessionId: string | null
  messages: Message[]
  brief: Brief | null
  completion: number
  loading: boolean
}

export type ChatAction =
  | { type: 'PREFILL_SUCCESS'; sessionId: string; brief: Brief; completion: number }
  | { type: 'USER_MESSAGE'; text: string }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'MESSAGE_SUCCESS'; response: string; brief: Brief; completion: number }
  | { type: 'ASSISTANT_MESSAGE'; response: string; brief: Brief; completion: number }
