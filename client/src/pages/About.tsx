import { FloatingNav } from "@/components/landing/floating-navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { navItems } from "@/lib/nav";

export default function AboutPage() {

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />

      <main className="relative min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">About Advista</h1>
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto">
              From conversational brief to competitive intelligence report — in a single run.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Do</h2>
              <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
                <p className="text-lg text-zinc-300 leading-relaxed text-center">
                  Advista is a competitive intelligence research assistant. You describe your product and competitors
                  through a conversational brief — or paste your company URL to pre-fill the context automatically.
                  Advista then fans out 8 parallel web searches across intelligence categories, scrapes the top results,
                  and synthesizes everything into a 10-section CI report: executive summary, positioning, competitive
                  landscape, customer sentiment, pricing intelligence, corporate momentum, ecosystem, strategic gaps,
                  recommended actions, and sources.
                </p>
              </div>
            </div>
          </section>

          {/* Who It's For */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Built For</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Product Marketing</h3>
                <p className="text-zinc-400">
                  Run a fresh competitive intelligence pass before a launch, pricing review, or positioning update.
                  Get structured findings across landscape, sentiment, and gaps — not a pile of browser tabs.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Sales Enablement</h3>
                <p className="text-zinc-400">
                  Pull recommended actions and strategic gaps from the report to build battlecard updates grounded
                  in current search data, not stale decks.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Strategy & Leadership</h3>
                <p className="text-zinc-400">
                  Get a structured competitive snapshot — positioning, pricing intelligence, corporate momentum —
                  without assigning an analyst to piece it together manually.
                </p>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Founders & Growth</h3>
                <p className="text-zinc-400">
                  Understand how competitors are showing up in search and how customers talk about them. Use
                  the sentiment and gap analysis to sharpen messaging before you ship.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
