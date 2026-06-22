import { useState } from 'react'
import type { ResearchState } from '../../types/chat'
import { IconAlert, IconClose, IconDownload, IconLoader, IconMenu, IconSparkles } from '../icons'
import { REPORT_SECTIONS, sectionHasContent, type ReportSection } from './reportSections'
import SectionBody from './SectionBody'

interface ReportViewProps {
  research: ResearchState
  onClose: () => void
  onRetry: () => void
}

export default function ReportView({ research, onClose, onRetry }: ReportViewProps) {
  const { status, progress, report, error } = research
  const [activeId, setActiveId] = useState('executive')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'running') return <RunningScreen progress={progress} onClose={onClose} />
  if (status === 'error' || !report) return <ErrorScreen error={error} onRetry={onRetry} onClose={onClose} />

  const sections = REPORT_SECTIONS.filter((s) => sectionHasContent(report, s))
  if (sections.length === 0) return <ErrorScreen error="The report came back empty." onRetry={onRetry} onClose={onClose} />

  const active = sections.find((s) => s.id === activeId) ?? sections[0]

  function handleSelect(id: string) {
    setActiveId(id)
    setSidebarOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#08090A] text-white print:static print:block print:bg-white print:text-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden print:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar nav */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/8 bg-[#0b0c0e] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 print:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ReportSidebar sections={sections} activeId={active.id} onSelect={handleSelect} onExport={() => window.print()} onClose={onClose} />
      </aside>

      {/* Main content */}
      <main className="relative flex flex-1 flex-col overflow-hidden print:overflow-visible">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-3 lg:hidden print:hidden">
          <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300">
            <IconMenu />
          </button>
          <span className="text-sm font-semibold">CI Report</span>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300">
            <IconClose />
          </button>
        </header>

        {/* On-screen: active section only */}
        <div className="flex-1 overflow-y-auto print:hidden">
          <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
            <SectionHeader section={active} />
            <SectionBody report={report} section={active} />
          </div>
        </div>

        {/* Print: every section stacked */}
        <div className="hidden px-10 print:block">
          <h1 className="mb-1 text-3xl font-bold text-black">Competitive Intelligence Report</h1>
          <p className="mb-8 text-sm text-zinc-600">Generated {new Date().toLocaleDateString()}</p>
          {sections.map((s) => (
            <section key={s.id} className="mb-10 break-after-page">
              <h2 className="mb-4 border-b border-zinc-300 pb-2 text-2xl font-bold text-black">{s.label}</h2>
              <SectionBody report={report} section={s} />
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

function SectionHeader({ section }: { section: ReportSection }) {
  const Icon = section.Icon
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-white/8 pb-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-200">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">Competitive Intelligence</p>
        <h1 className="text-2xl font-bold text-white">{section.label}</h1>
      </div>
    </div>
  )
}

interface ReportSidebarProps {
  sections: ReportSection[]
  activeId: string
  onSelect: (id: string) => void
  onExport: () => void
  onClose: () => void
}

function ReportSidebar({ sections, activeId, onSelect, onExport, onClose }: ReportSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-200">
            <IconSparkles />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">Advista</p>
            <p className="text-sm font-semibold text-white">CI Report</p>
          </div>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:text-white lg:hidden">
          <IconClose />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((s) => {
          const Icon = s.Icon
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                isActive ? 'bg-violet-500/15 text-violet-100' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <Icon size={16} />
              <span>{s.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-white/8 px-3 py-4">
        <button
          onClick={onExport}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
        >
          <IconDownload size={16} /> Export PDF
        </button>
        <button onClick={onClose} className="w-full rounded-xl py-2 text-sm text-zinc-500 transition hover:text-zinc-300">
          Back to chat
        </button>
      </div>
    </div>
  )
}

function RunningScreen({ progress, onClose }: { progress: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08090A] text-white">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:text-white">
          <IconClose />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-200">
              <IconSparkles size={26} />
            </div>
            <h2 className="text-xl font-semibold">Generating your CI report…</h2>
            <p className="mt-1 text-sm text-zinc-500">Researching competitors and synthesizing findings. This can take a moment.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-3">
              {progress.map((label, i) => {
                const isLast = i === progress.length - 1
                return (
                  <div key={i} className={`flex items-center gap-3 text-sm ${isLast ? 'text-zinc-100' : 'text-zinc-400'}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      isLast ? 'border-violet-400/60 bg-violet-500/10 text-violet-300' : 'border-violet-500/40 bg-violet-500/20 text-violet-300'
                    }`}>
                      {isLast ? '' : '✓'}
                    </span>
                    {isLast ? <span className="flex items-center gap-2"><IconLoader /> {label}</span> : <span>{label}</span>}
                  </div>
                )
              })}
              {progress.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-zinc-400"><IconLoader /> Starting research…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorScreen({ error, onRetry, onClose }: { error: string | null; onRetry: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090A] px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <IconAlert size={30} />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Unable to generate report</h2>
        <p className="mb-8 break-words text-sm text-zinc-400">{error || 'Something went wrong. Please try again.'}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={onRetry} className="rounded-xl border border-violet-500/30 bg-violet-500/15 px-5 py-2.5 text-sm font-medium text-violet-100 transition hover:bg-violet-500/25">
            Try again
          </button>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
            Back to chat
          </button>
        </div>
      </div>
    </div>
  )
}
