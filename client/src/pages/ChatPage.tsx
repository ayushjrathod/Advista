import { useReducer, useRef, useEffect, useState } from 'react'
import type { ChatState, ChatAction, Brief, Message } from '../types/chat'

const initialState: ChatState = {
  sessionId: null,
  messages: [],
  brief: null,
  completion: 0,
  loading: false,
}

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'PREFILL_SUCCESS':
      return { ...state, sessionId: action.sessionId, brief: action.brief, completion: action.completion }
    case 'USER_MESSAGE':
      return { ...state, messages: [...state.messages, { role: 'user', text: action.text }], loading: true }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'MESSAGE_SUCCESS':
      return {
        ...state,
        messages: [...state.messages, { role: 'assistant', text: action.response }],
        brief: action.brief,
        completion: action.completion,
        loading: false,
      }
    case 'ASSISTANT_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { role: 'assistant', text: action.response }],
        brief: action.brief,
        completion: action.completion,
        loading: false,
      }
    default:
      return state
  }
}

const BRIEF_LABELS: Record<keyof Brief, string> = {
  company_name: 'Company',
  product_description: 'Product Description',
  target_customers: 'Target Customers',
  competitor_names: 'Competitors',
  strategic_goals: 'Strategic Goals',
  primary_channels: 'Primary Channels',
  positioning_hypothesis: 'Positioning',
  additional_context: 'Additional Context',
}

const PREFILL_STEPS = [
  'Fetching your website…',
  'Extracting company context…',
  'Building research brief…',
]

function IconBot() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.843 7.627a.498.498 0 0 0 .683.627l18-9a.498.498 0 0 0 0-.894z" /><path d="M6 12h16" />
    </svg>
  )
}

function IconLoader() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function getDomain(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    return u.hostname
  } catch {
    return null
  }
}

export default function ChatPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [url, setUrl] = useState('')
  const [input, setInput] = useState('')
  const [prefillDismissed, setPrefillDismissed] = useState(false)
  const [prefillStep, setPrefillStep] = useState(0)
  const [favicon, setFavicon] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  // Derive favicon from URL input as user types
  useEffect(() => {
    const domain = getDomain(url)
    if (domain) {
      setFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`)
    } else {
      setFavicon(null)
    }
  }, [url])

  // Step timer: advance prefill steps while loading with no session yet
  useEffect(() => {
    if (!state.loading || state.sessionId) return
    setPrefillStep(0)
    const interval = setInterval(() => {
      setPrefillStep((s) => Math.min(s + 1, PREFILL_STEPS.length - 1))
    }, 900)
    return () => clearInterval(interval)
  }, [state.loading, state.sessionId])

  async function handlePrefill() {
    if (!url.trim()) return
    dispatch({ type: 'SET_LOADING', value: true })
    const prefillRes = await fetch('/api/chat/prefill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const prefillData = await prefillRes.json()
    dispatch({ type: 'PREFILL_SUCCESS', sessionId: prefillData.session_id, brief: prefillData.brief, completion: prefillData.completion })

    const chatRes = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: prefillData.session_id, user_message: "I've shared my company URL. What information do you still need to complete the research brief?" }),
    })
    const chatData = await chatRes.json()
    dispatch({ type: 'ASSISTANT_MESSAGE', response: chatData.response, brief: chatData.brief, completion: chatData.completion })
  }

  function handleSkip() {
    setPrefillDismissed(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  async function handleSend() {
    if (!input.trim() || state.loading) return
    const text = input.trim()
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    dispatch({ type: 'USER_MESSAGE', text })
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: state.sessionId, user_message: text }),
    })
    const data = await res.json()
    dispatch({ type: 'MESSAGE_SUCCESS', response: data.response, brief: data.brief, completion: data.completion })
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  function renderBriefValue(key: keyof Brief, value: Brief[keyof Brief]) {
    if (Array.isArray(value)) return value.length ? value.join(', ') : null
    return value || null
  }

  const briefCompletion = Math.round(state.completion)
  const sourceDomain = getDomain(url)
  const isPrefillLoading = state.loading && !state.sessionId
  const showWelcomeCard = !state.sessionId && !prefillDismissed && !state.loading && state.messages.length === 0

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#08090A] text-white lg:h-screen lg:overflow-hidden">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_26%)]" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col box-border px-4 pt-3 pb-3 sm:px-6 lg:h-full lg:min-h-0 lg:px-8 lg:pt-4 lg:pb-4">

        {/* Header */}
        <div className="mb-4 shrink-0 border-b border-white/8 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                <span className="text-violet-200">Advista Copilot</span>
                <span className="text-zinc-700">•</span>
                <span>Competitive Intelligence</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
                Describe your market, competitors, and strategic goals to build a research brief.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span>{state.messages.length} messages</span>
              <span className="text-zinc-700">•</span>
              <span>{briefCompletion}% brief complete</span>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1.45fr)_380px] xl:grid-cols-[minmax(0,1.65fr)_400px]">

          {/* Chat card */}
          <div className="flex min-h-[calc(100dvh-11rem)] flex-col rounded-2xl border border-white/8 bg-white/2 backdrop-blur-xl lg:min-h-0 lg:h-full">

            {/* Card header — clean, no prefill widget */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              {/* Source pill — shown after prefill succeeds */}
              {state.sessionId && sourceDomain && (
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
                  {favicon && <img src={favicon} alt="" className="h-4 w-4 rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                  <span>{sourceDomain}</span>
                  <span className="text-violet-500">·</span>
                  <span>Prefilled ✓</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:min-h-0">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-4">

                {/* Welcome card — shown when no session, not dismissed, not loading */}
                {showWelcomeCard && (
                  <div className="mx-auto mt-8 w-full max-w-md">
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl">
                      <h3 className="mt-3 text-base font-semibold text-white">Start with your company URL</h3>
                      <p className="text-base pt-2 text-zinc-400">
                        <span className='text-violet-300 pr-1'>
                        /about
                        </span>
                        pages are preferred for rich data collection
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        We'll extract your company context and pre-fill the research brief automatically.
                      </p>
                      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all">
                        {favicon ? (
                          <img src={favicon} alt="" className="h-5 w-5 shrink-0 rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="h-5 w-5 shrink-0 rounded-sm bg-white/10" />
                        )}
                        <input
                          ref={urlInputRef}
                          className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                          placeholder="https://your-company.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handlePrefill()}
                          autoFocus
                        />
                      </div>
                      <button
                        className="mt-3 w-full rounded-2xl cursor-pointer border border-violet-500/20 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-100 backdrop-blur-md transition hover:bg-violet-500/20 hover:border-violet-400/30 hover:cursor-pointer disabled:opacity-40"
                        onClick={handlePrefill}
                        disabled={!url.trim()}
                      >
                        Prefill brief →
                      </button>
                      <button
                        className="mt-3 w-full text-center text-xs text-zinc-600 transition hover:text-zinc-400"
                        onClick={handleSkip}
                      >
                        Skip, start typing
                      </button>
                    </div>
                  </div>
                )}

                {/* Prefill loading — step progress indicator */}
                {isPrefillLoading && (
                  <div className="mx-auto mt-8 w-full max-w-md">
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                          <IconLoader />
                        </div>
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                          {sourceDomain ?? 'Analyzing…'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {PREFILL_STEPS.map((label, i) => (
                          <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= prefillStep ? 'text-zinc-200' : 'text-zinc-600'}`}>
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${
                              i < prefillStep
                                ? 'border-violet-500/40 bg-violet-500/20 text-violet-300'
                                : i === prefillStep
                                ? 'border-violet-400/60 bg-violet-500/10 text-violet-300'
                                : 'border-white/10 text-zinc-700'
                            }`}>
                              {i < prefillStep ? '✓' : i + 1}
                            </div>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message list */}
                {state.messages.map((msg: Message, i: number) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-100 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                        <IconBot />
                      </div>
                    )}
                    <div className={`max-w-[88%] rounded-3xl border px-4 py-3 sm:max-w-[78%] sm:px-5 sm:py-4 ${
                      msg.role === 'user'
                        ? 'border-white/10 bg-black text-white'
                        : 'border-white/8 bg-white/3 text-zinc-100'
                    }`}>
                      <p className="whitespace-pre-wrap text-[15px] leading-7">{msg.text}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                        <IconUser />
                      </div>
                    )}
                  </div>
                ))}

                {/* Chat loading bubble — only shown during regular message send, not prefill */}
                {state.loading && state.sessionId && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-100">
                      <IconBot />
                    </div>
                    <div className="rounded-3xl border border-white/8 bg-white/3 px-5 py-4">
                      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                        Advista AI · Thinking
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <IconLoader />
                        <span>Analyzing your input and updating the brief…</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/6 px-4 py-4 sm:px-6 sm:py-5">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-transparent">
                  <textarea
                    ref={textareaRef}
                    className="min-h-18 w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
                    value={input}
                    onChange={handleTextareaChange}
                    placeholder="Describe your company, market, competitors, or the strategic questions you want answered..."
                    disabled={state.loading}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={handleSend}
                      disabled={state.loading || !input.trim()}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl cursor-pointer border border-violet-500/20 bg-violet-500/10 text-violet-100 backdrop-blur-md transition hover:bg-violet-500/20 hover:border-violet-400/30 disabled:opacity-40"
                    >
                      <IconSend />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                  <p>Press Enter to send, Shift + Enter for a new line.</p>
                  <p>The brief updates automatically as you chat.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brief sidebar */}
          <aside className="flex flex-col gap-4 lg:min-h-0 lg:h-full">
            <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/2 backdrop-blur-xl px-5 py-5 sm:px-6 overflow-hidden">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">Live brief</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Research brief preview</h2>
                <p className="mt-1 text-sm text-zinc-500">Updates live as the assistant extracts key context from your conversation.</p>
              </div>

              {/* Progress bar */}
              <div className="mt-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">Completion</span>
                  <span className="text-xs text-zinc-400">{briefCompletion}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${briefCompletion}%` }}
                  />
                </div>
              </div>

              {/* Brief fields */}
              <div className="mt-4 flex-1 overflow-y-auto">
                {state.brief ? (
                  <div>
                    {(Object.keys(BRIEF_LABELS) as (keyof Brief)[]).map((key) => {
                      const val = renderBriefValue(key, state.brief![key])
                      if (!val) return null
                      return (
                        <div key={key} className="border-b border-white/6 py-3 last:border-b-0">
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">{BRIEF_LABELS[key]}</p>
                          <p className="text-sm leading-6 text-zinc-100">{val}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-zinc-600">
                    No brief fields captured yet. Start the conversation and this panel will fill in automatically.
                  </p>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
