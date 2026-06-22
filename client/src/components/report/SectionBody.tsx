import type { Report } from '../../types/chat'
import { IconAlert, IconExternal } from '../icons'
import type { ReportSection } from './reportSections'

export default function SectionBody({ report, section }: { report: Report; section: ReportSection }) {
  const value = report[section.key]

  if (section.kind === 'text') {
    const paragraphs = (value as string).split(/\n{2,}/).filter((p) => p.trim())
    return (
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-300 print:text-zinc-800">{p}</p>
        ))}
      </div>
    )
  }

  if (section.kind === 'gaps') {
    return (
      <ul className="space-y-3">
        {(value as string[]).map((item, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 print:border-zinc-300 print:bg-transparent">
            <span className="mt-0.5 shrink-0 text-amber-400 print:text-zinc-700"><IconAlert size={16} /></span>
            <span className="text-[15px] leading-7 text-zinc-200 print:text-zinc-800">{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (section.kind === 'actions') {
    return (
      <ol className="space-y-3">
        {(value as string[]).map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-xs font-bold text-violet-300 print:border-zinc-400 print:text-zinc-700">{i + 1}</span>
            <span className="text-[15px] leading-7 text-zinc-200 print:text-zinc-800">{item}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="space-y-2">
      {(value as string[]).map((src, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1 shrink-0 text-zinc-500"><IconExternal size={14} /></span>
          <a href={src} target="_blank" rel="noopener noreferrer" className="break-all text-zinc-400 underline-offset-2 hover:text-violet-300 hover:underline print:text-zinc-700 print:no-underline">{src}</a>
        </li>
      ))}
    </ul>
  )
}
