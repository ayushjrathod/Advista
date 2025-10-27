import { FloatingNav } from "@/components/landing/floating-navbar";
import { MaintenanceBanner } from "@/components/ui/maintenance-banner";
import { ArrowLeft, HomeIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "About", link: "/about" },
    { name: "Chat", link: "/chat", icon: <MessageSquare /> },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <MaintenanceBanner />
      <FloatingNav className="" navItems={navItems} />

      <main className="relative min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">About Advista</h1>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto">
              AI-powered research. Human-centered insights
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Mission</h2>
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <p className="text-lg text-gray-300 leading-relaxed text-center">
                  We believe that research should be intelligent, efficient, and accessible. Advista transforms the way
                  businesses conduct competitive research by combining the power of AI with human-centered design to
                  deliver actionable insights that drive real results.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Research Automation</h3>
                <p className="text-gray-400">
                  Automate data collection from multiple sources including Google, YouTube, Reddit, Quora, and app
                  reviews to save time and ensure comprehensive coverage.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Analysis</h3>
                <p className="text-gray-400">
                  Leverage advanced AI to identify patterns, trends, and insights that would take hours of manual
                  analysis to discover.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Visual Intelligence</h3>
                <p className="text-gray-400">
                  Experience insights through interactive dashboards, graphs, and visualizations that make complex data
                  easy to understand.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Competitive Intelligence</h3>
                <p className="text-gray-400">
                  Stay ahead of competitors by analyzing their strategies, ads, and audience sentiments in real-time.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Smart Recommendations</h3>
                <p className="text-gray-400">
                  Get tailored recommendations for high-performing hooks, CTAs, and content formats based on competitor
                  analysis.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-semibold text-white mb-4">Team Collaboration</h3>
                <p className="text-gray-400">
                  Share insights seamlessly with your team through intuitive dashboards and collaborative features.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
                <p className="text-gray-400">
                  We continuously push the boundaries of what's possible with AI and automation to deliver cutting-edge
                  research solutions.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Accuracy</h3>
                <p className="text-gray-400">
                  We prioritize data accuracy and reliability to ensure our insights are trustworthy and actionable for
                  your business decisions.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Efficiency</h3>
                <p className="text-gray-400">
                  We believe in maximizing productivity by automating repetitive tasks and focusing human effort on
                  strategic analysis and decision-making.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">Transparency</h3>
                <p className="text-gray-400">
                  We provide clear, understandable insights with full traceability to original sources, ensuring you can
                  verify and trust our findings.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 w-full py-12 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Advista. All rights reserved.</p>
      </footer>
    </div>
  );
}
