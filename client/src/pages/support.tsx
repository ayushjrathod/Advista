import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingNav } from "@/components/landing/floating-navbar";
import { navItems } from "@/lib/nav";

const faqs = [
  {
    q: "What is Advista?",
    a: "Advista is a competitive intelligence research assistant. You describe your product and competitors through a conversational chat brief, then Advista fans out parallel web searches, scrapes the top results, and synthesizes a 10-section CI report covering positioning, landscape, sentiment, pricing, strategic gaps, and recommended actions.",
  },
  {
    q: "How do I get started?",
    a: "Open the chat and either paste your company URL to auto-fill the research brief, or skip straight to typing. Describe your product, competitors, and strategic goals conversationally — the assistant extracts the brief fields from your messages automatically.",
  },
  {
    q: "What is the research brief and why does it matter?",
    a: "The research brief is an 8-field profile (company name, product description, target customers, competitors, strategic goals, primary channels, positioning hypothesis, and additional context) that drives the research run. Advista extracts these fields from your conversation automatically — you never fill a form.",
  },
  {
    q: "What does the company URL prefill do?",
    a: "Paste your company's homepage or /about URL and Advista fetches the page content and extracts as many brief fields as it can automatically. This skips most of the back-and-forth in the chat and gets you to the research run faster.",
  },
  {
    q: "How does Advista run the research?",
    a: "Once the brief has enough context, Advista sends 8 parallel search queries — one per intelligence category — scrapes the top results for each, then runs a map-reduce synthesis: 8 focused analysis calls that reduce into a single CompetitiveIntelligenceReport. You see live progress updates as it runs.",
  },
  {
    q: "What's in the report?",
    a: "The report has 10 sections: Executive Summary, Product Positioning, Competitive Landscape, Customer Sentiment, Pricing Intelligence, Corporate Momentum, Integration & Ecosystem, Strategic Gaps, Recommended Actions, and Sources. Each section is structured and rendered on its own page, with PDF export available.",
  },
  {
    q: "Can I export the report?",
    a: "Yes. Use the Export PDF button in the report sidebar to print all 10 sections to a PDF. Every section stacks cleanly for print.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNav navItems={navItems} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Support</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Answers to common questions about Advista
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-semibold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{q}</h3>
                <p className="text-zinc-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-zinc-700 bg-zinc-800 mb-6">
              <Mail className="h-5 w-5 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Still have questions?</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Reach out and I will get back to you as soon as possible.
            </p>
            <a
              href="mailto:ayushjrathod7@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              ayushjrathod7@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
