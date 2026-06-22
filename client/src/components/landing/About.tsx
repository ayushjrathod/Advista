import type { ReactNode } from "react";

const featureSections = [
  {
    id: "signal-intake",
    eyebrow: "Signal intake",
    title: "Capture live market signals before the summary layer gets there first.",
    description:
      "Advista gathers competitive evidence across Google, YouTube, Reddit, and forum-style discussions in a single run. Teams start with fresh signal, source provenance, and enough context to understand what changed instead of reading a flattened recap.",
    linkLabel: "See briefing controls",
    linkHref: "#brief-builder",
    subfeatures: ["Google, YouTube, Reddit coverage", "Source traceability built in"],
    mockup: "threads",
  },
  {
    id: "brief-builder",
    eyebrow: "Brief builder",
    title: "Turn every research request into a structured brief the system can actually execute.",
    description:
      "The product already models research briefs and search parameters as first-class inputs. That means teams can define competitors, audiences, markets, and desired output shape before collection starts, then reuse the same operating frame across runs.",
    linkLabel: "Review analysis delta",
    linkHref: "#analysis-engine",
    subfeatures: ["Reusable search parameter sets", "Controlled audience and market scope"],
    mockup: "controls",
  },
  {
    id: "analysis-engine",
    eyebrow: "Analysis engine",
    title: "Convert noisy source material into narrative shifts, message gaps, and next moves.",
    description:
      "Between the analysis and synthesis services, Advista is set up to find patterns, reconcile contradictions, and frame strategic recommendations. The interface should feel equally direct: a clear before-and-after view of what the model changed and why it matters.",
    linkLabel: "Follow session flow",
    linkHref: "#session-timeline",
    subfeatures: ["Pattern recognition across sources", "Recommendation-ready synthesis"],
    mockup: "diff",
  },
  {
    id: "session-timeline",
    eyebrow: "Session memory",
    title: "Keep every collection pass, synthesis step, and follow-up thread attached to the same session.",
    description:
      "The API already carries chat sessions, research sessions, and history endpoints. On the product surface, that becomes a timeline teams can revisit: what ran, what finished, what needs another pass, and which outputs are already stable enough to share.",
    linkLabel: "Open report workspace",
    linkHref: "#report-workspace",
    subfeatures: ["Persistent chat and research history", "Queued steps with visible state"],
    mockup: "timeline",
  },
  {
    id: "report-workspace",
    eyebrow: "Report workspace",
    title: "Present findings in a clean decision surface, not a pile of disconnected cards.",
    description:
      "Advista already points toward a report-first experience with dedicated report pages and structured result models. The frontend should echo that with restrained dashboarding: a few strong cards, simple charts, and immediate access to the signals behind each conclusion.",
    linkLabel: "Inspect source library",
    linkHref: "#evidence-library",
    subfeatures: ["Executive summaries with chart context", "Battlecard and sentiment-ready views"],
    mockup: "dashboard",
  },
  {
    id: "evidence-library",
    eyebrow: "Evidence library",
    title: "Hand off proof, not just conclusions, with every recommendation linked back to the source layer.",
    description:
      "Processed results, saved resources, and report outputs only become trustworthy when citations stay close to the claim. The final surface makes that explicit with a browsable evidence table and a focused side panel for the exact excerpt, source type, and recommendation it supports.",
    linkLabel: "Back to top",
    linkHref: "#top",
    subfeatures: ["Source-level citations and excerpts", "Exportable report structure for teams"],
    mockup: "library",
  },
];

const mockupByType: Record<string, () => ReactNode> = {
  threads: SignalThreadsMockup,
  controls: BriefControlsMockup,
  diff: AnalysisDiffMockup,
  timeline: SessionTimelineMockup,
  dashboard: ReportDashboardMockup,
  library: EvidenceLibraryMockup,
};

export function About() {
  return (
    <section className="bg-[#08090A] text-[#F7F8F8] [font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="border-t border-white/6 py-24 md:py-32 lg:py-40">
          <div>
            {featureSections.map((section) => {
              const MockupComponent = mockupByType[section.mockup];

              return (
                <section key={section.id} id={section.id} className="border-b border-white/6 py-24 md:py-28 lg:py-32 scroll-mt-24">
                  <div className="grid gap-14 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
                    <div className="max-w-[28rem]">
                      <p className="text-[13px] uppercase tracking-[0.24em] text-[#8A8F98]">{section.eyebrow}</p>
                      <h3 className="mt-5 text-[clamp(2.25rem,4vw,3rem)] leading-[0.96] tracking-[-0.045em] text-[#F7F8F8]">
                        {section.title}
                      </h3>
                      <p className="mt-6 text-[15px] leading-7 text-[#8A8F98] md:text-[16px]">{section.description}</p>
                      <a
                        href={section.linkHref}
                        className="mt-8 inline-flex items-center gap-2 text-[15px] text-[#F7F8F8] transition-colors hover:text-[#8A8F98]"
                      >
                        <span>{section.linkLabel}</span>
                        <span aria-hidden>→</span>
                      </a>
                    </div>

                    <FeatureMockupFrame>
                      <MockupComponent />
                    </FeatureMockupFrame>
                  </div>

                  <div className="mt-10 grid max-w-[42rem] grid-cols-1 gap-x-8 gap-y-3 border-t border-white/6 pt-6 text-[13px] text-[#8A8F98] sm:grid-cols-2">
                    {section.subfeatures.map((item) => (
                      <div key={item} className="border-b border-white/6 pb-3 sm:border-b-0 sm:pb-0">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureMockupFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/6 bg-white/[0.02] px-5 py-5 sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.11),rgba(8,9,10,0)_38%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.06),rgba(8,9,10,0)_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="relative">{children}</div>
    </div>
  );
}

function MockupLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] uppercase tracking-[0.22em] text-[#8A8F98]">{children}</span>;
}

function SignalThreadsMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="border border-white/6 bg-[#0C0D10]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>Incoming sources</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">28 new signals</span>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["Google Search", "Pricing page now compares directly against enterprise incumbents", "02m"],
            ["YouTube", "Founder interview reframes launch timeline toward mid-market buyers", "08m"],
            ["Reddit", "Users mention setup friction but praise reporting depth after migration", "11m"],
            ["Industry Forum", "Procurement thread requests SOC2 proof and implementation references", "17m"],
          ].map(([source, snippet, age]) => (
            <div key={source} className="grid gap-2 px-4 py-3 sm:grid-cols-[112px_minmax(0,1fr)_40px] sm:items-start">
              <span className="text-[12px] text-[#F7F8F8]">{source}</span>
              <p className="text-[13px] leading-6 text-[#8A8F98]">{snippet}</p>
              <span className="text-right text-[12px] text-[#8A8F98]">{age}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="border-b border-white/6 px-4 py-3">
          <MockupLabel>Evidence preview</MockupLabel>
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="border border-white/6 bg-white/[0.02] p-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#8A8F98]">Observed shift</p>
            <p className="mt-3 text-[15px] leading-7 text-[#F7F8F8]">
              Messaging is moving from “automation” toward “governance and proof of ROI.”
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Search", "Direct competitor comparison added"],
              ["Reddit", "Implementation friction repeated"],
              ["YouTube", "Mid-market positioning reiterated"],
              ["Forum", "Security proof requested early"],
            ].map(([label, detail]) => (
              <div key={label + detail} className="border border-white/6 p-3">
                <p className="text-[12px] text-[#F7F8F8]">{label}</p>
                <p className="mt-2 text-[12px] leading-5 text-[#8A8F98]">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefControlsMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="border border-white/6 bg-[#0B0C0F] p-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-4">
          <MockupLabel>Research brief</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">Template v4</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Competitor set", "Linear, Notion, ClickUp"],
            ["Target market", "North America / B2B SaaS"],
            ["Primary lens", "Enterprise expansion"],
            ["Output mode", "Report + battlecard"],
          ].map(([label, value]) => (
            <div key={label} className="border border-white/6 p-3">
              <p className="text-[12px] text-[#8A8F98]">{label}</p>
              <div className="mt-2 flex items-center justify-between border border-white/6 bg-white/[0.02] px-3 py-2">
                <span className="text-[13px] text-[#F7F8F8]">{value}</span>
                <span className="text-[12px] text-[#8A8F98]">▾</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border border-white/6 p-3">
          <p className="text-[12px] text-[#8A8F98]">Priority sources</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[#F7F8F8]">
            {[
              "Search results",
              "Executive interviews",
              "Product review forums",
              "Community discussions",
            ].map((item) => (
              <span key={item} className="border border-white/6 px-2 py-1 text-[#F7F8F8]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-white/6 bg-[#090A0C]">
        <div className="border-b border-white/6 px-4 py-3">
          <MockupLabel>Saved modes</MockupLabel>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["Launch watch", "Tracks competitor launch cadence and positioning changes"],
            ["Win-loss prep", "Frames objections, proof points, and pricing narrative"],
            ["Quarterly pulse", "Refreshes sentiment and strategic movement every 30 days"],
          ].map(([title, detail]) => (
            <div key={title} className="px-4 py-4">
              <p className="text-[14px] text-[#F7F8F8]">{title}</p>
              <p className="mt-2 text-[12px] leading-6 text-[#8A8F98]">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisDiffMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>Raw synthesis</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">before</span>
        </div>
        <div className="space-y-2 px-4 py-4 font-mono text-[12px] leading-6 text-[#8A8F98]">
          <div className="border-l border-red-400/40 pl-3 text-red-300/85">- competitor messaging appears broader this quarter</div>
          <div className="border-l border-red-400/40 pl-3 text-red-300/85">- reviews are mixed but generally favorable</div>
          <div className="border-l border-red-400/40 pl-3 text-red-300/85">- pricing page now looks more enterprise oriented</div>
          <div className="border-l border-white/10 pl-3">context: some channels mention approvals, others mention faster deployment</div>
          <div className="border-l border-white/10 pl-3">recommendation: continue monitoring and compare against prior campaign</div>
        </div>
      </div>

      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>Strategic delta</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">after</span>
        </div>
        <div className="space-y-2 px-4 py-4 font-mono text-[12px] leading-6 text-[#8A8F98]">
          <div className="border-l border-emerald-400/50 pl-3 text-emerald-300/90">+ narrative shifts toward governance, proof, and enterprise readiness</div>
          <div className="border-l border-emerald-400/50 pl-3 text-emerald-300/90">+ negative sentiment clusters around setup friction, not feature depth</div>
          <div className="border-l border-emerald-400/50 pl-3 text-emerald-300/90">+ pricing page now supports direct incumbent displacement messaging</div>
          <div className="border-l border-white/10 pl-3">supported by: search copy change, founder interview, review excerpts</div>
          <div className="border-l border-white/10 pl-3">next move: sharpen onboarding proof points and ROI language in outbound</div>
        </div>
      </div>
    </div>
  );
}

function SessionTimelineMockup() {
  return (
    <div className="border border-white/6 bg-[#0A0B0D] p-4">
      <div className="flex items-center justify-between border-b border-white/6 pb-4">
        <MockupLabel>Research session timeline</MockupLabel>
        <span className="text-[12px] text-[#8A8F98]">run 1842</span>
      </div>
      <div className="mt-5 grid grid-cols-[130px_repeat(5,minmax(0,1fr))] gap-3 text-[12px] text-[#8A8F98]">
        <span />
        {[
          "Scope",
          "Collect",
          "Cluster",
          "Synthesize",
          "Publish",
        ].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {[
          ["Signal collection", "col-span-2 col-start-2", "02m 14s"],
          ["Audience clustering", "col-span-2 col-start-3", "01m 28s"],
          ["Insight synthesis", "col-span-2 col-start-4", "03m 02s"],
          ["Report assembly", "col-span-1 col-start-6", "Queued"],
        ].map(([label, placement, meta]) => (
          <div key={label} className="grid grid-cols-[130px_repeat(5,minmax(0,1fr))] items-center gap-3">
            <div>
              <p className="text-[13px] text-[#F7F8F8]">{label}</p>
              <p className="mt-1 text-[11px] text-[#8A8F98]">{meta}</p>
            </div>
            <div className={`h-10 border border-white/6 bg-white/[0.03] ${placement}`} />
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Session thread", "Retains follow-up prompts and model outputs"],
          ["Research state", "Keeps params, resources, and result payloads"],
          ["History view", "Lets teams reopen prior runs without losing context"],
        ].map(([title, detail]) => (
          <div key={title} className="border border-white/6 p-3">
            <p className="text-[12px] text-[#F7F8F8]">{title}</p>
            <p className="mt-2 text-[12px] leading-5 text-[#8A8F98]">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportDashboardMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-4">
        <div className="border border-white/6 bg-[#0A0B0D] p-4">
          <div className="flex items-center justify-between">
            <MockupLabel>Executive signal</MockupLabel>
            <span className="text-[12px] text-[#8A8F98]">weekly view</span>
          </div>
          <p className="mt-4 text-[26px] tracking-[-0.04em] text-[#F7F8F8]">3 narrative shifts</p>
          <svg viewBox="0 0 320 120" className="mt-4 h-28 w-full" fill="none" aria-hidden>
            <path d="M0 92C28 90 44 82 64 80C94 76 109 26 145 26C182 26 195 66 224 66C257 66 279 36 320 34" stroke="rgba(247,248,248,0.85)" strokeWidth="1.5" />
            <path d="M0 110H320" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="145" cy="26" r="4" fill="rgba(247,248,248,0.95)" />
            <circle cx="224" cy="66" r="4" fill="rgba(247,248,248,0.75)" />
          </svg>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Sentiment split", "61% positive"],
            ["High-confidence findings", "14 linked sources"],
          ].map(([label, value]) => (
            <div key={label} className="border border-white/6 bg-[#0A0B0D] p-4">
              <p className="text-[12px] text-[#8A8F98]">{label}</p>
              <p className="mt-3 text-[22px] tracking-[-0.04em] text-[#F7F8F8]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/6 bg-[#0A0B0D] p-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-4">
          <MockupLabel>Competitive balance</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">market view</span>
        </div>
        <div className="mt-4 space-y-4">
          {([
            ["Messaging clarity", 82],
            ["Enterprise proof", 64],
            ["Onboarding sentiment", 51],
            ["Feature depth", 77],
          ] as const).map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-[12px] text-[#8A8F98]">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="mt-2 h-2 border border-white/6 bg-white/[0.02]">
                <div className="h-full bg-[#F7F8F8]" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EvidenceLibraryMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr] border-b border-white/6 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#8A8F98]">
          <span>Source</span>
          <span>Claim</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["Founder interview", "Enterprise push confirmed", "Linked"],
            ["Pricing page", "Incumbent comparison added", "Linked"],
            ["Review thread", "Onboarding friction repeated", "Review"],
            ["Forum thread", "Security objections surface early", "Linked"],
          ].map(([source, claim, status]) => (
            <div key={source} className="grid grid-cols-[1.2fr_0.8fr_0.6fr] items-center px-4 py-4 text-[13px]">
              <span className="text-[#F7F8F8]">{source}</span>
              <span className="text-[#8A8F98]">{claim}</span>
              <span className="text-[#8A8F98]">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/6 bg-[#090A0C] p-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-4">
          <MockupLabel>Citation drawer</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">source excerpt</span>
        </div>
        <div className="mt-4 border border-white/6 bg-white/[0.02] p-4">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#8A8F98]">Selected evidence</p>
          <p className="mt-3 text-[15px] leading-7 text-[#F7F8F8]">
            “Teams moving from spreadsheets ask for governance, onboarding proof, and a clearer migration path before they evaluate feature depth.”
          </p>
        </div>
        <div className="mt-4 grid gap-3 text-[12px] text-[#8A8F98] sm:grid-cols-2">
          <div className="border border-white/6 p-3">
            <p className="text-[#F7F8F8]">Source type</p>
            <p className="mt-2">Podcast interview transcript</p>
          </div>
          <div className="border border-white/6 p-3">
            <p className="text-[#F7F8F8]">Supports</p>
            <p className="mt-2">Recommendation 03 / proof-first messaging</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3 text-[12px] text-[#F7F8F8]">
          <span className="border border-white/6 px-3 py-2">Open source</span>
          <span className="border border-white/6 px-3 py-2">Copy citation</span>
        </div>
      </div>
    </div>
  );
}
