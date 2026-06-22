import type { Brief, ResearchStatus } from '../../types/chat'
import { BRIEF_LABELS, renderBriefValue } from '../../lib/brief'
import { IconFile, IconLoader, IconSparkles } from '../icons'

interface BriefPanelProps {
  brief: Brief | null
  completion: number
  sessionId: string | null
  researchStatus: ResearchStatus
  briefReady: boolean
  onGenerate: () => void
  onView: () => void
  onRetry: () => void
}

export default function BriefPanel({
  brief,
  completion,
  sessionId,
  researchStatus,
  briefReady,
  onGenerate,
  onView,
  onRetry,
}: BriefPanelProps) {
  const briefCompletion = Math.round(completion)

  return (
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
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${briefCompletion}%` }} />
          </div>
        </div>

        {/* Brief fields */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {brief ? (
            <div>
              {(Object.keys(BRIEF_LABELS) as (keyof Brief)[]).map((key) => {
                const val = renderBriefValue(brief[key])
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

        {/* Generate report CTA */}
        {sessionId && (
          <div className="mt-4 shrink-0 border-t border-white/6 pt-4">
            <button
              onClick={researchStatus === 'done' ? onView : onGenerate}
              disabled={researchStatus === 'running' || (!briefReady && researchStatus !== 'done')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/15 py-3 text-sm font-medium text-violet-100 transition hover:cursor-pointer hover:border-violet-400/40 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {researchStatus === 'running' ? (
                <><IconLoader /> Generating report…</>
              ) : researchStatus === 'done' ? (
                <><IconFile /> View CI report</>
              ) : (
                <><IconSparkles /> Generate CI report</>
              )}
            </button>
            {!briefReady && researchStatus === 'idle' && (
              <p className="mt-2 text-center text-xs text-zinc-600">Fill the core brief fields to unlock research.</p>
            )}
            {researchStatus === 'error' && (
              <p className="mt-2 text-center text-xs text-red-300/80">
                Research failed.{' '}
                <button onClick={onRetry} className="underline underline-offset-2 hover:text-red-200">Retry</button>
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
