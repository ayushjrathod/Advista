import { useEffect, useState } from 'react'
import { IconLoader } from '../icons'

const PREFILL_STEPS = [
  'Fetching your website…',
  'Extracting company context…',
  'Building research brief…',
]

interface PrefillStepsProps {
  sourceDomain: string | null
}

export default function PrefillSteps({ sourceDomain }: PrefillStepsProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, PREFILL_STEPS.length - 1))
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
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
            <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= step ? 'text-zinc-200' : 'text-zinc-600'}`}>
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${
                i < step
                  ? 'border-violet-500/40 bg-violet-500/20 text-violet-300'
                  : i === step
                  ? 'border-violet-400/60 bg-violet-500/10 text-violet-300'
                  : 'border-white/10 text-zinc-700'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
