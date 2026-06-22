import { useReducer, useRef, useEffect, useState } from 'react'
import { initialState, reducer } from '../state/chatReducer'
import { getDomain, isBriefReady } from '../lib/brief'
import { streamResearch } from '../lib/researchStream'
import WelcomeCard from '../components/chat/WelcomeCard'
import PrefillSteps from '../components/chat/PrefillSteps'
import ChatMessage from '../components/chat/ChatMessage'
import ThinkingBubble from '../components/chat/ThinkingBubble'
import ChatComposer from '../components/chat/ChatComposer'
import BriefPanel from '../components/chat/BriefPanel'
import ReportView from '../components/report/ReportView'

export default function ChatPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [url, setUrl] = useState('')
  const [input, setInput] = useState('')
  const [prefillDismissed, setPrefillDismissed] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

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

  async function handleGenerateReport() {
    if (!state.sessionId || state.research.status === 'running') return
    setReportOpen(true)
    dispatch({ type: 'RESEARCH_START' })
    await streamResearch(state.sessionId, {
      onProgress: (message) => dispatch({ type: 'RESEARCH_PROGRESS', message }),
      onReport: (report) => dispatch({ type: 'RESEARCH_REPORT', report }),
      onError: (error) => dispatch({ type: 'RESEARCH_ERROR', error }),
    })
  }

  const briefCompletion = Math.round(state.completion)
  const sourceDomain = getDomain(url)
  const favicon = sourceDomain ? `https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=32` : null
  const isPrefillLoading = state.loading && !state.sessionId
  const showWelcomeCard = !state.sessionId && !prefillDismissed && !state.loading && state.messages.length === 0
  const briefReady = isBriefReady(state.brief)

  return (
    <>
      <div className={`relative min-h-dvh overflow-x-hidden bg-[#08090A] text-white lg:h-screen lg:overflow-hidden ${reportOpen ? 'print:hidden' : ''}`}>
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

              {/* Card header — source pill after prefill succeeds */}
              <div className="flex items-center justify-between px-5 py-4 sm:px-6">
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
                  {showWelcomeCard && (
                    <WelcomeCard
                      url={url}
                      onUrlChange={setUrl}
                      favicon={favicon}
                      onPrefill={handlePrefill}
                      onSkip={handleSkip}
                      inputRef={urlInputRef}
                    />
                  )}

                  {isPrefillLoading && <PrefillSteps sourceDomain={sourceDomain} />}

                  {state.messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                  ))}

                  {state.loading && state.sessionId && <ThinkingBubble />}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Input */}
              <ChatComposer
                value={input}
                onChange={setInput}
                onSend={handleSend}
                disabled={state.loading}
                textareaRef={textareaRef}
              />
            </div>

            {/* Brief sidebar */}
            <BriefPanel
              brief={state.brief}
              completion={state.completion}
              sessionId={state.sessionId}
              researchStatus={state.research.status}
              briefReady={briefReady}
              onGenerate={handleGenerateReport}
              onView={() => setReportOpen(true)}
              onRetry={handleGenerateReport}
            />

          </div>
        </div>
      </div>

      {reportOpen && state.research.status !== 'idle' && (
        <ReportView research={state.research} onClose={() => setReportOpen(false)} onRetry={handleGenerateReport} />
      )}
    </>
  )
}
