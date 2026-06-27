import type { ReactNode } from "react";

const featureSections = [
  {
    id: "url-prefill",
    eyebrow: "Company prefill",
    title: "Paste your URL and skip the manual setup entirely.",
    description:
      "Drop your company's homepage or /about URL and Advista fetches the page, reads the content, and pre-fills 8 brief fields — company name, product description, target customers, competitors, and more — in a single call. No form, no friction.",
    linkLabel: "See brief intake",
    linkHref: "#chat-brief",
    subfeatures: ["Works with any public URL", "/about pages give the richest extraction"],
    mockup: "threads",
  },
  {
    id: "chat-brief",
    eyebrow: "Conversational brief",
    title: "Describe your market and competitors in plain conversation.",
    description:
      "Instead of filling a static form, you tell Advista about your product, competitors, and goals through natural chat. Each turn uses Gemini structured output to extract only the new fields learned that turn, merging them into a live research brief as the conversation progresses.",
    linkLabel: "See brief progress",
    linkHref: "#live-preview",
    subfeatures: ["8-field brief extracted from prose", "Delta updates — only new fields per turn"],
    mockup: "controls",
  },
  {
    id: "live-preview",
    eyebrow: "Brief progress",
    title: "Watch the research brief fill in as you describe your market.",
    description:
      "A live sidebar tracks the 8 core brief fields with a completion percentage. The Generate button unlocks once company name, product description, target customers, competitors, strategic goals, and primary channels are populated — giving you clear signal on when you're ready to run.",
    linkLabel: "See research engine",
    linkHref: "#research-run",
    subfeatures: ["Real-time completion percentage", "Six core fields required to unlock research"],
    mockup: "diff",
  },
  {
    id: "research-run",
    eyebrow: "Research engine",
    title: "Fan out 8 parallel searches and synthesize findings into one report.",
    description:
      "Once the brief is ready, Advista sends 8 parallel SerpAPI queries — one per intelligence category — scrapes the top results for each, then runs a map-reduce synthesis: 8 focused Gemini calls in parallel reduce into a single CompetitiveIntelligenceReport delivered via SSE stream.",
    linkLabel: "See the report",
    linkHref: "#ci-report",
    subfeatures: ["8 parallel searches across intelligence categories", "Map-reduce synthesis via Gemini"],
    mockup: "timeline",
  },
  {
    id: "ci-report",
    eyebrow: "CI report",
    title: "Navigate a 10-section intelligence report, one section at a time.",
    description:
      "The completed report covers executive summary, product positioning, competitive landscape, customer sentiment, pricing intelligence, corporate momentum, integration ecosystem, strategic gaps, recommended actions, and sources. Each section is structured and rendered from the same JSON response — no extra API calls.",
    linkLabel: "See sources",
    linkHref: "#sources",
    subfeatures: ["10 sections, each sourced and structured", "Export full report to PDF"],
    mockup: "dashboard",
  },
  {
    id: "sources",
    eyebrow: "Evidence trail",
    title: "Every finding traces back to the URL that surfaced it.",
    description:
      "The report's sources section lists every web resource scraped during the research run, so you can verify claims, read the original context, and share citations alongside conclusions. No black-box summaries — you always know what the model read.",
    linkLabel: "Back to top",
    linkHref: "#top",
    subfeatures: ["Full source URL list per report", "Exportable as PDF for team sharing"],
    mockup: "library",
  },
];

const mockupByType: Record<string, () => ReactNode> = {
  threads: UrlPrefillMockup,
  controls: BriefIntakeMockup,
  diff: LivePreviewMockup,
  timeline: ResearchRunMockup,
  dashboard: ReportMockup,
  library: SourcesMockup,
};

export function About() {
  return (
    <section className="relative bg-[#08090A] text-[#F7F8F8] [font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-white/[0.022] to-transparent" />
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="py-24 md:py-32 lg:py-40">
          <div className="mb-20 md:mb-28 lg:mb-32">
            <p className="flex items-center gap-3 text-[13px] uppercase tracking-[0.24em] text-[#8A8F98]">
              <span aria-hidden className="block h-px w-4 shrink-0 bg-[#8A8F98]/60" />
              How it works
            </p>
            <div className="mt-5 grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
              <h2
                className="text-[clamp(2.75rem,5.5vw,4.25rem)] leading-[0.92] tracking-[-0.05em] text-[#F7F8F8]"
                style={{ fontFamily: '"Sora", "Inter", system-ui, sans-serif', fontWeight: 700 }}
              >
                Every step, connected.
              </h2>
              <p className="text-[17px] leading-[1.7] text-[#8A8F98] lg:pb-1">
                From company URL to a 10-section competitive intelligence report — in a single research session.
              </p>
            </div>
          </div>

          <div>
            {featureSections.map((section, index) => {
              const MockupComponent = mockupByType[section.mockup];
              const isEven = index % 2 === 0;

              return (
                <section key={section.id} id={section.id} className="border-b border-white/6 py-24 md:py-28 lg:py-32 scroll-mt-24">
                  <div
                    className={`grid gap-14 lg:gap-20 ${
                      isEven
                        ? "lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]"
                        : "lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]"
                    }`}
                  >
                    <div className={`relative max-w-[28rem] ${!isEven ? "lg:order-2" : ""}`}>
                      <span
                        aria-hidden
                        className="pointer-events-none select-none absolute -top-4 -left-2 font-bold leading-none text-white/[0.035]"
                        style={{ fontSize: "clamp(5rem,9vw,8rem)", fontFamily: '"Sora","Inter",system-ui,sans-serif', letterSpacing: "-0.06em" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="relative flex items-center gap-2.5 text-[13px] uppercase tracking-[0.24em] text-[#8A8F98]">
                        <span aria-hidden className="block h-px w-3 shrink-0 translate-y-px bg-[#8A8F98]/60" />
                        {section.eyebrow}
                      </p>
                      <h3 className="relative mt-5 text-[clamp(2rem,3.8vw,2.75rem)] leading-[0.96] tracking-[-0.045em] text-[#F7F8F8]">
                        {section.title}
                      </h3>
                      <p className="mt-6 text-[15px] leading-7 text-[#8A8F98] md:text-[16px]">{section.description}</p>
                      <a
                        href={section.linkHref}
                        className="group mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#F7F8F8]/80 transition-colors duration-200 hover:text-[#F7F8F8]"
                      >
                        <span className="underline decoration-[#8A8F98]/30 underline-offset-2 transition-[text-decoration-color] duration-200 group-hover:decoration-[#F7F8F8]/50">
                          {section.linkLabel}
                        </span>
                        <span aria-hidden className="inline-block translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    </div>

                    <FeatureMockupFrame className={!isEven ? "lg:order-1" : ""}>
                      <MockupComponent />
                    </FeatureMockupFrame>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/6 pt-6">
                    {section.subfeatures.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-[#8A8F98]">
                        <span aria-hidden className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[#8A8F98]/40" />
                        <span>{item}</span>
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

function FeatureMockupFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] px-5 py-5 sm:px-6 sm:py-6 ${className}`}
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.13),rgba(8,9,10,0)_40%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.08),rgba(8,9,10,0)_35%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08090A]/70 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

function MockupLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] uppercase tracking-[0.22em] text-[#8A8F98]">{children}</span>;
}

function UrlPrefillMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="border border-white/6 bg-[#0C0D10]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>URL extraction</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">8 fields found</span>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["company_name", "Extracted from page title and OG tags", "✓"],
            ["product_description", "Parsed from hero copy and meta description", "✓"],
            ["target_customers", "Inferred from use-case sections", "✓"],
            ["competitor_names", "Found in comparison and alternatives copy", "✓"],
          ].map(([field, note, status]) => (
            <div key={field} className="grid gap-2 px-4 py-3 sm:grid-cols-[112px_minmax(0,1fr)_24px] sm:items-start">
              <span className="text-[12px] text-[#F7F8F8] font-mono">{field}</span>
              <p className="text-[13px] leading-6 text-[#8A8F98]">{note}</p>
              <span className="text-right text-[12px] text-emerald-400">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="border-b border-white/6 px-4 py-3">
          <MockupLabel>Pre-filled brief</MockupLabel>
        </div>
        <div className="space-y-4 px-4 py-4">
          <div className="border border-white/6 bg-white/[0.02] p-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#8A8F98]">Completion after prefill</p>
            <p className="mt-3 text-[22px] tracking-[-0.04em] text-[#F7F8F8]">75%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
              <div className="h-full rounded-full bg-[#F7F8F8]" style={{ width: "75%" }} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["6 fields", "Extracted from page"],
              ["2 fields", "Filled in chat"],
              ["1 LLM call", "No extra steps"],
              ["Any URL", "Public pages only"],
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

function BriefIntakeMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="border border-white/6 bg-[#0B0C0F] p-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-4">
          <MockupLabel>Chat turn</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">turn 3 of 5</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="border border-white/6 bg-white/[0.015] p-3">
            <p className="text-[12px] text-[#8A8F98]">User</p>
            <p className="mt-2 text-[13px] leading-6 text-[#F7F8F8]">
              "We target mid-market B2B SaaS. Main competitors are Klue and Crayon."
            </p>
          </div>
          <div className="border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="text-[12px] text-emerald-400/70">Fields learned this turn</p>
            <div className="mt-2 space-y-1 font-mono text-[12px]">
              <div className="text-emerald-300/90">+ target_customers: "Mid-market B2B SaaS"</div>
              <div className="text-emerald-300/90">+ competitor_names: ["Klue", "Crayon"]</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/6 bg-[#090A0C]">
        <div className="border-b border-white/6 px-4 py-3">
          <MockupLabel>Brief state</MockupLabel>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["company_name", "Advista", true],
            ["product_description", "CI research tool", true],
            ["target_customers", "Mid-market B2B SaaS", true],
            ["competitor_names", "Klue, Crayon", true],
            ["strategic_goals", "—", false],
            ["primary_channels", "—", false],
          ].map(([field, value, filled]) => (
            <div key={String(field)} className="flex items-center justify-between px-4 py-3">
              <span className="font-mono text-[12px] text-[#8A8F98]">{field}</span>
              <span className={`text-[12px] ${filled ? "text-[#F7F8F8]" : "text-[#8A8F98]/40"}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LivePreviewMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>Before message</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">42%</span>
        </div>
        <div className="px-4 py-4">
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full rounded-full bg-[#F7F8F8]" style={{ width: "42%" }} />
          </div>
          <div className="space-y-2 font-mono text-[12px] leading-6 text-[#8A8F98]">
            <div className="flex justify-between"><span>company_name</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between"><span>product_description</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between"><span>target_customers</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between border-l border-white/10 pl-3 text-[#8A8F98]/40"><span>competitor_names</span><span>—</span></div>
            <div className="flex justify-between border-l border-white/10 pl-3 text-[#8A8F98]/40"><span>strategic_goals</span><span>—</span></div>
            <div className="flex justify-between border-l border-white/10 pl-3 text-[#8A8F98]/40"><span>primary_channels</span><span>—</span></div>
          </div>
        </div>
      </div>

      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <MockupLabel>After message</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">83%</span>
        </div>
        <div className="px-4 py-4">
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/6">
            <div className="h-full rounded-full bg-[#F7F8F8]" style={{ width: "83%" }} />
          </div>
          <div className="space-y-2 font-mono text-[12px] leading-6 text-[#8A8F98]">
            <div className="flex justify-between"><span>company_name</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between"><span>product_description</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between"><span>target_customers</span><span className="text-[#F7F8F8]">✓</span></div>
            <div className="flex justify-between border-l border-emerald-400/40 pl-3"><span className="text-emerald-300/80">competitor_names</span><span className="text-emerald-300/80">✓</span></div>
            <div className="flex justify-between border-l border-emerald-400/40 pl-3"><span className="text-emerald-300/80">strategic_goals</span><span className="text-emerald-300/80">✓</span></div>
            <div className="flex justify-between border-l border-white/10 pl-3 text-[#8A8F98]/40"><span>primary_channels</span><span>—</span></div>
          </div>
          <div className="mt-4 border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-[12px] text-violet-300/80">
            Generate CI report →
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchRunMockup() {
  return (
    <div className="border border-white/6 bg-[#0A0B0D] p-4">
      <div className="flex items-center justify-between border-b border-white/6 pb-4">
        <MockupLabel>Research run</MockupLabel>
        <span className="text-[12px] text-[#8A8F98]">8 parallel queries</span>
      </div>
      <div className="mt-5 space-y-3">
        {[
          ["product_positioning", "Completed", "1.2s", true],
          ["competitive_landscape", "Completed", "1.4s", true],
          ["customer_sentiment", "Completed", "1.1s", true],
          ["pricing_intelligence", "Running…", "", false],
          ["corporate_momentum", "Queued", "", false],
        ].map(([category, status, time, done]) => (
          <div key={String(category)} className="flex items-center justify-between text-[12px]">
            <span className="font-mono text-[#8A8F98]">{category}</span>
            <div className="flex items-center gap-3">
              {time && <span className="text-[#8A8F98]/50">{time}</span>}
              <span className={done ? "text-emerald-400" : status === "Running…" ? "text-violet-300" : "text-[#8A8F98]/40"}>{status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["SerpAPI", "8 search queries fanned out in parallel"],
          ["Gemini", "8 synthesis calls, one per category"],
          ["SSE stream", "Progress events sent as each step completes"],
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

function ReportMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-4">
        <div className="border border-white/6 bg-[#0A0B0D] p-4">
          <div className="flex items-center justify-between">
            <MockupLabel>Executive summary</MockupLabel>
            <span className="text-[12px] text-[#8A8F98]">section 1 / 10</span>
          </div>
          <p className="mt-4 text-[13px] leading-6 text-[#8A8F98]">
            Competitor A is accelerating enterprise positioning while sentiment data shows mid-market buyers citing setup friction. A targeted onboarding narrative creates a clear opening.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Strategic gaps", "3 identified"],
            ["Recommended actions", "7 prioritized"],
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
          <MockupLabel>Report sections</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">10 total</span>
        </div>
        <div className="mt-4 space-y-1">
          {[
            ["Executive Summary", true],
            ["Product Positioning", false],
            ["Competitive Landscape", false],
            ["Customer Sentiment", false],
            ["Pricing Intelligence", false],
            ["Corporate Momentum", false],
            ["Integration Ecosystem", false],
            ["Strategic Gaps", false],
            ["Recommended Actions", false],
            ["Sources", false],
          ].map(([label, active]) => (
            <div key={String(label)} className={`rounded px-3 py-2 text-[12px] ${active ? "bg-white/[0.05] text-[#F7F8F8]" : "text-[#8A8F98]/60"}`}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SourcesMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="border border-white/6 bg-[#0A0B0D]">
        <div className="grid grid-cols-[1.6fr_0.4fr] border-b border-white/6 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#8A8F98]">
          <span>Source URL</span>
          <span>Category</span>
        </div>
        <div className="divide-y divide-white/6">
          {[
            ["competitor.com/pricing", "pricing"],
            ["g2.com/compare/...", "sentiment"],
            ["techcrunch.com/2024/...", "momentum"],
            ["competitor.com/integrations", "ecosystem"],
          ].map(([url, category]) => (
            <div key={url} className="grid grid-cols-[1.6fr_0.4fr] items-center px-4 py-4 text-[12px]">
              <span className="truncate font-mono text-[#F7F8F8]">{url}</span>
              <span className="text-[#8A8F98]">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-white/6 bg-[#090A0C] p-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-4">
          <MockupLabel>Export</MockupLabel>
          <span className="text-[12px] text-[#8A8F98]">PDF ready</span>
        </div>
        <div className="mt-4 border border-white/6 bg-white/[0.02] p-4">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#8A8F98]">All 10 sections</p>
          <p className="mt-3 text-[15px] leading-7 text-[#F7F8F8]">
            Stacked cleanly for print — sources included at the end of every export.
          </p>
        </div>
        <div className="mt-4 grid gap-3 text-[12px] text-[#8A8F98] sm:grid-cols-2">
          <div className="border border-white/6 p-3">
            <p className="text-[#F7F8F8]">Format</p>
            <p className="mt-2">PDF via window.print()</p>
          </div>
          <div className="border border-white/6 p-3">
            <p className="text-[#F7F8F8]">No extra fetch</p>
            <p className="mt-2">Report already in client state</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3 text-[12px] text-[#F7F8F8]">
          <span className="border border-white/6 px-3 py-2">Export PDF</span>
          <span className="border border-white/6 px-3 py-2">Back to chat</span>
        </div>
      </div>
    </div>
  );
}
