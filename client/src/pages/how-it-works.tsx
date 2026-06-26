import { FloatingNav } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { navItems } from "@/lib/nav";

const sections = [
  { id: "pipeline", label: "Pipeline" },
  { id: "url-prefill", label: "URL Prefill" },
  { id: "brief-intake", label: "Brief Intake" },
  { id: "research-engine", label: "Research Engine" },
  { id: "report-schema", label: "Report Schema" },
  { id: "decisions", label: "Design Decisions" },
  { id: "stack", label: "Stack" },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />

      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-32">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500 mb-4">Technical overview</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">How Advista Works</h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A walkthrough of the brief extraction flow, research pipeline, synthesis approach, and key engineering
            decisions behind the competitive intelligence system.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-zinc-500 hover:text-white transition-colors py-1"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="space-y-20 min-w-0">

            {/* Pipeline overview */}
            <section id="pipeline" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Pipeline Overview</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                A research run moves through four stages. The frontend drives stages 1, 2, and 4; the
                backend owns stage 3.
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "URL Prefill (optional)",
                    desc: "Paste your company URL and the backend fetches the page with httpx, passes the first 8000 characters to Gemini structured output, and returns pre-filled brief fields. Skippable — users can go straight to chat.",
                    owner: "Client → POST /api/chat/prefill",
                  },
                  {
                    step: "02",
                    title: "Conversational Brief Intake",
                    desc: "A chat agent extracts an 8-field research brief from free-form conversation. Each turn sends a user message, Gemini returns a delta (only the fields learned that turn), and the client merges the delta into the stored brief. The sidebar shows live completion progress.",
                    owner: "Client → POST /api/chat/message",
                  },
                  {
                    step: "03",
                    title: "Research Run",
                    desc: "Once the brief has the six core fields, the research endpoint fans out 8 parallel SerpAPI queries — one per intelligence category — scrapes the top results per category, then map-reduces via Gemini: 8 focused synthesis calls in parallel, reduced into a CompetitiveIntelligenceReport. Progress events stream back via SSE.",
                    owner: "Backend — asyncio.gather + Gemini map-reduce",
                  },
                  {
                    step: "04",
                    title: "Report Rendering",
                    desc: "The full report JSON is returned in the final SSE event and rendered client-side across 10 sections. No additional API calls are made for report data. PDF export uses window.print() with print-specific CSS that stacks all sections.",
                    owner: "Client — React",
                  },
                ].map(({ step, title, desc, owner }) => (
                  <div key={step} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                    <span className="text-2xl font-bold text-zinc-700 font-mono">{step}</span>
                    <div>
                      <p className="font-semibold text-white mb-1">{title}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-2">{desc}</p>
                      <span className="text-xs text-zinc-600 font-mono">{owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* URL prefill */}
            <section id="url-prefill" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">URL Prefill</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The welcome card prompts for a company URL before the first chat message. This is optional but
                cuts several turns of back-and-forth — /about pages typically yield 6–7 of the 8 brief fields
                in a single call.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Prefill endpoint</p>
                <div className="font-mono text-sm space-y-2 text-zinc-400">
                  <div className="text-zinc-300">POST /api/chat/prefill</div>
                  <div className="text-zinc-600">{"{"} url {"}"}</div>
                  <div className="mt-3 text-zinc-600">← returns</div>
                  <div>{"{"} session_id, brief, completion {"}"}</div>
                </div>
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed">
                The backend fetches the URL with httpx, truncates to the first 8000 characters of raw HTML, and
                passes it to <span className="font-mono text-zinc-400">generate_structured(response_schema=BriefUpdates)</span>.
                The same structured-output conflict that prevents Gemini grounding tools from combining with
                response_schema applies here — hence httpx, not the url_context grounding tool.
              </p>
            </section>

            {/* Brief intake */}
            <section id="brief-intake" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Conversational Brief Intake</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The intake agent extracts a structured research brief from free-form conversation rather than a
                static form. Users consistently provide more context when describing their problem in prose.
                The agent uses delta structured output — only the fields learned this turn, merged into the
                stored brief — rather than re-extracting the full brief on every message.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Brief schema (8 fields)</p>
                <div className="font-mono text-sm space-y-1 text-zinc-300">
                  <div><span className="text-zinc-500">company_name</span>             <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">product_description</span>      <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">target_customers</span>         <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">strategic_goals</span>          <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">competitor_names</span>         <span className="text-zinc-600 ml-4">string[]</span></div>
                  <div><span className="text-zinc-500">primary_channels</span>         <span className="text-zinc-600 ml-4">string[]</span></div>
                  <div><span className="text-zinc-500">positioning_hypothesis</span>   <span className="text-zinc-600 ml-4">string</span></div>
                  <div><span className="text-zinc-500">additional_context</span>       <span className="text-zinc-600 ml-4">string</span></div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Chat endpoint</p>
                <div className="font-mono text-sm space-y-2 text-zinc-400">
                  <div className="text-zinc-300">POST /api/chat/message</div>
                  <div className="text-zinc-600">{"{"} session_id?, user_message {"}"}</div>
                  <div className="mt-3 text-zinc-600">← returns</div>
                  <div>{"{"} response, brief, completion {"}"}</div>
                  <div className="mt-3 text-zinc-600 text-xs">Omit session_id on first message — backend creates a new session and returns the ID.</div>
                </div>
              </div>
            </section>

            {/* Research engine */}
            <section id="research-engine" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Research Engine</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Once the six core brief fields are populated, the Generate button unlocks. The research endpoint
                fans out 8 parallel SerpAPI queries — one per intelligence category — then runs a map-reduce
                synthesis over Gemini. Progress events stream back via SSE while the run is active.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Research endpoint</p>
                <div className="font-mono text-sm space-y-1 text-zinc-400">
                  <div className="text-zinc-300">POST /api/research/start-research</div>
                  <div className="text-zinc-600">{"{"} session_id {"}"}</div>
                  <div className="mt-3 text-zinc-600">↓ SSE response (text/event-stream)</div>
                  <div>event: progress  data: "Searching pricing intelligence…"</div>
                  <div>event: progress  data: "Synthesizing competitive landscape…"</div>
                  <div>event: report    data: {"{"} executive_summary, product_positioning, … {"}"}</div>
                  <div>event: error     data: "…"  (on failure)</div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">Intelligence categories (8 parallel searches)</p>
                <div className="space-y-2">
                  {[
                    ["product_positioning", "How the product is positioned vs. competitors in search and messaging"],
                    ["competitive_landscape", "Competitor presence, differentiation, and market coverage"],
                    ["customer_sentiment", "Buyer pain points, community discussions, review signals"],
                    ["pricing_intelligence", "Pricing pages, plan structures, and competitor price signals"],
                    ["corporate_momentum", "Funding, hiring, launches, and strategic moves"],
                    ["integration_ecosystem", "Integrations, partnerships, and platform extensibility"],
                    ["strategic_gaps", "Openings in the market not currently owned by any player"],
                    ["recommended_actions", "Synthesis of findings into prioritized next moves"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex gap-4 text-sm">
                      <span className="font-mono text-zinc-500 shrink-0 w-52">{key}</span>
                      <span className="text-zinc-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Report schema */}
            <section id="report-schema" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Report Schema</h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The report is a strongly typed JSON object with 10 top-level sections rendered client-side.
                Each section maps 1:1 to a React component. String sections render as prose; array sections
                render as ordered lists.
              </p>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="font-mono text-sm space-y-3 text-zinc-400">
                  {[
                    { key: "executive_summary", type: "string", note: "— high-level synthesis across all categories" },
                    { key: "product_positioning", type: "string", note: "— how the product stands vs. competitors" },
                    { key: "competitive_landscape", type: "string", note: "— competitor overview and differentiation" },
                    { key: "customer_sentiment", type: "string", note: "— buyer pain points, triggers, community signals" },
                    { key: "pricing_intelligence", type: "string", note: "— plan structures and competitor pricing signals" },
                    { key: "corporate_momentum", type: "string", note: "— funding, hiring, launches, strategic moves" },
                    { key: "integration_ecosystem", type: "string", note: "— integrations, partnerships, platform extensibility" },
                    { key: "strategic_gaps", type: "string[]", note: "— market openings not currently owned" },
                    { key: "recommended_actions", type: "string[]", note: "— ordered next moves from findings" },
                    { key: "sources", type: "string[]", note: "— URLs scraped during the research run" },
                  ].map(({ key, type, note }) => (
                    <div key={key}>
                      <span className="text-zinc-300">{key}</span>
                      <span className="text-zinc-600">: {type}{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Design decisions */}
            <section id="decisions" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Design Decisions</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Key choices made during development, and the reasoning behind each.
              </p>

              <div className="space-y-5">
                {[
                  {
                    decision: "Delta structured output for brief extraction, not agent tool-calling",
                    why: "Three options were considered: agent with get_brief/update_brief tools, full ResearchBrief + response as structured output, and delta output. Tools add orchestration complexity and hallucinate field values. Full-brief output forces the LLM to simultaneously be conversational and fill an 8-field struct — these objectives fight each other. Delta output (only fields learned this turn, merged server-side) gives one LLM call per turn, no hallucinated empty fields, and a fixed context window.",
                  },
                  {
                    decision: "SerpAPI for web search, not Gemini grounding",
                    why: "Gemini's structured output (response_schema) and grounding tools (google_search, url_context, function calling) are mutually exclusive — the API returns an error if both are set. Since structured output is required for reliable brief extraction and report synthesis, all web searches go through SerpAPI directly. This also skips Gemini's grounding synthesis step, reducing latency.",
                  },
                  {
                    decision: "Map-reduce synthesis, not single-shot or RAG",
                    why: "With full-page scraping, each category's content is large enough to deserve a focused, isolated LLM call. The 8 MAP calls parallelize on asyncio.gather, one failed category can't poison the whole report, and the reduce step assembles them into a coherent report. RAG would be pure overhead — even with full-page scraping, the payload fits Gemini's context window. Single-shot would work on snippets alone but becomes unwieldy across 8 categories of scraped pages.",
                  },
                  {
                    decision: "httpx fetch for URL prefill, not Gemini url_context tool",
                    why: "Same structured output conflict: url_context cannot be combined with response_schema. The solution is to fetch the URL with httpx, pass the first 8000 characters of raw HTML to generate_structured, and extract brief fields in one call. No grounding dependency, simpler and more predictable.",
                  },
                  {
                    decision: "In-memory session store, not a database",
                    why: "Sessions live in a module-level singleton dict on one process. This keeps the data layer simple during development. The limitation is that multiple uvicorn workers won't share sessions. The migration path is Redis when scaling is needed.",
                  },
                  {
                    decision: "React.StrictMode disabled at root for the R3F landing hero",
                    why: "The landing page hero uses @react-three/fiber on a WebGL canvas. StrictMode intentionally double-invokes mount in dev (mount → unmount → remount). On the current stack (React 19.2.7 / Vite 8 / @vitejs/plugin-react 6), the throwaway unmount calls gl.forceContextLoss() and the remounted canvas never reacquires the WebGL context. Removing StrictMode at root fixes it. The tradeoff is losing StrictMode's dev checks across the whole app — scope StrictMode per-route on non-3D routes if those checks are wanted.",
                  },
                  {
                    decision: "Full report returned in the final SSE event, not streamed as partial JSON",
                    why: "Streaming a structured JSON object is awkward to parse incrementally. The report generation step is the longest-running operation, so we show a progress list (fed by SSE progress events) rather than attempting partial renders. This also makes PDF export trivial — the full document is already in state.",
                  },
                ].map(({ decision, why }) => (
                  <div key={decision} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                    <p className="font-semibold text-white text-sm mb-2">{decision}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{why}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stack */}
            <section id="stack" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-white mb-2">Stack</h2>
              <p className="text-zinc-400 text-sm mb-2 leading-relaxed">
                Client and API are separate services.
              </p>
              <p className="text-zinc-500 text-xs mb-6 font-mono">client/  React 19 + Vite + Tailwind + React Three Fiber<br />api/     FastAPI + Gemini + SerpAPI + Prisma (PostgreSQL)</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { layer: "Framework", value: "React 19", note: "Hooks only — useReducer drives chat state" },
                  { layer: "Build", value: "Vite 8", note: "Dev server + production bundler" },
                  { layer: "Routing", value: "React Router 7", note: "SPA — all routes rewrite to index.html" },
                  { layer: "HTTP", value: "fetch", note: "Native fetch for chat and research; SSE via ReadableStream" },
                  { layer: "Styling", value: "Tailwind CSS 4 + Radix UI", note: "Utility-first + headless primitives" },
                  { layer: "Animation", value: "Framer Motion", note: "Page transitions and landing animations" },
                  { layer: "3D", value: "React Three Fiber", note: "Landing page Rubik's cube hero element" },
                  { layer: "Deploy", value: "Vercel", note: "Static SPA with vercel.json rewrite rule" },
                  { layer: "API framework", value: "FastAPI", note: "Python 3.14+ via uv; StreamingResponse for SSE" },
                  { layer: "LLM", value: "Gemini (google-genai)", note: "Structured output for brief extraction + synthesis" },
                  { layer: "Search", value: "SerpAPI", note: "8 parallel queries per research run" },
                  { layer: "ORM", value: "Prisma + PostgreSQL", note: "Session, brief, run, and report persistence" },
                ].map(({ layer, value, note }) => (
                  <div key={layer} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{layer}</span>
                      <span className="font-mono text-sm text-white">{value}</span>
                    </div>
                    <p className="text-xs text-zinc-600">{note}</p>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
