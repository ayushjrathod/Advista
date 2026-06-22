import type { ChangeEvent, RefObject } from 'react'
import { IconSend } from '../icons'

interface ChatComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export default function ChatComposer({ value, onChange, onSend, disabled, textareaRef }: ChatComposerProps) {
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="shrink-0 border-t border-white/6 px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-transparent">
          <textarea
            ref={textareaRef}
            className="min-h-18 w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
            value={value}
            onChange={handleChange}
            placeholder="Describe your company, market, competitors, or the strategic questions you want answered..."
            disabled={disabled}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={onSend}
              disabled={disabled || !value.trim()}
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
  )
}
