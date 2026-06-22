import type { RefObject } from 'react'

interface WelcomeCardProps {
  url: string
  onUrlChange: (value: string) => void
  favicon: string | null
  onPrefill: () => void
  onSkip: () => void
  inputRef: RefObject<HTMLInputElement | null>
}

export default function WelcomeCard({ url, onUrlChange, favicon, onPrefill, onSkip, inputRef }: WelcomeCardProps) {
  return (
    <div className="mx-auto mt-8 w-full max-w-md">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl">
        <h3 className="mt-3 text-base font-semibold text-white">Start with your company URL</h3>
        <p className="text-base pt-2 text-zinc-400">
          <span className="text-violet-300 pr-1">/about</span>
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
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
            placeholder="https://your-company.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onPrefill()}
            autoFocus
          />
        </div>
        <button
          className="mt-3 w-full rounded-2xl cursor-pointer border border-violet-500/20 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-100 backdrop-blur-md transition hover:bg-violet-500/20 hover:border-violet-400/30 hover:cursor-pointer disabled:opacity-40"
          onClick={onPrefill}
          disabled={!url.trim()}
        >
          Prefill brief →
        </button>
        <button
          className="mt-3 w-full text-center text-xs text-zinc-600 transition hover:text-zinc-400"
          onClick={onSkip}
        >
          Skip, start typing
        </button>
      </div>
    </div>
  )
}
