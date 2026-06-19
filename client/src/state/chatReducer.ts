import type { ChatState, ChatAction, ResearchState } from '../types/chat'

export const initialResearch: ResearchState = {
  status: 'idle',
  progress: [],
  report: null,
  error: null,
}

export const initialState: ChatState = {
  sessionId: null,
  messages: [],
  brief: null,
  completion: 0,
  loading: false,
  research: initialResearch,
}

export function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'PREFILL_SUCCESS':
      return { ...state, sessionId: action.sessionId, brief: action.brief, completion: action.completion }
    case 'USER_MESSAGE':
      return { ...state, messages: [...state.messages, { role: 'user', text: action.text }], loading: true }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'MESSAGE_SUCCESS':
    case 'ASSISTANT_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { role: 'assistant', text: action.response }],
        brief: action.brief,
        completion: action.completion,
        loading: false,
      }
    case 'RESEARCH_START':
      return { ...state, research: { status: 'running', progress: [], report: null, error: null } }
    case 'RESEARCH_PROGRESS':
      return { ...state, research: { ...state.research, progress: [...state.research.progress, action.message] } }
    case 'RESEARCH_REPORT':
      return { ...state, research: { ...state.research, status: 'done', report: action.report } }
    case 'RESEARCH_ERROR':
      return { ...state, research: { ...state.research, status: 'error', error: action.error } }
    default:
      return state
  }
}
