import { IconLoader } from '../icons'

export default function ThinkingBubble() {
  return (
    <div className="flex gap-3">
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
  )
}
