import type { CSSProperties } from "react";
import { Twitter, Linkedin, Github, Youtube, Circle } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Features: [
    { label: "Intelligence Reports", href: "/chat" },
    { label: "Competitor Analysis", href: "/chat" },
    { label: "Customer Sentiment", href: "/chat" },
    { label: "Strategic Recommendations", href: "/chat" },
    { label: "Go-to-Market Strategy", href: "/chat" },
  ],
  Resources: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Blog", href: "/blog" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Customers", href: "/customers" },
  ],
  Help: [
    { label: "Support", href: "/support" },
    { label: "Status", href: "/status" },
    { label: "FAQ", href: "/faq" },
  ],
};

const watermarkText = "Advista";
const watermarkTop = "clamp(0px, 1vw, 18px)";
const watermarkLineTop = "clamp(115px, 16.2vw, 270px)";
const footerContentPaddingTop = "clamp(290px, 34vw, 500px)";
const watermarkVisibleHeight = `calc(${watermarkLineTop} - ${watermarkTop})`;

const watermarkTypography = {
  fontFamily: '"Sora", "Inter", system-ui, -apple-system, sans-serif',
  fontSize: "clamp(130px, 22vw, 360px)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 0.86,
  textRendering: "geometricPrecision",
} as CSSProperties;

const watermarkHaloStyle = {
  color: "transparent",
  WebkitTextStroke: "6px rgba(132, 126, 160, 0.02)",
  opacity: 0.3,
  transform: "translateZ(0)",
} as CSSProperties;

const watermarkStrokeStyle = {
  color: "black",
  WebkitTextStroke: "1.5px rgba(168, 130, 247, 0.4)",
  paintOrder: "stroke fill",
  opacity: 0.2,
  mixBlendMode: "screen",
} as CSSProperties;

const watermarkFillStyle = {
  backgroundImage:
    "linear-gradient(105deg, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0.35) 20%, rgba(236, 200, 255, 0.45) 30%, rgba(139, 92, 246, 0.35) 40%, rgba(139, 92, 246, 0.05) 60%, rgba(168, 85, 247, 0.05) 100%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  animation: "shimmer 6s ease-in-out infinite",
  willChange: "background-position",
} as CSSProperties;

export function Footer() {
  return (
    <footer className="relative w-full bg-black overflow-hidden">
      {/* Giant background wordmark */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-x-0 z-0 flex items-start justify-center overflow-hidden"
        style={{
          top: watermarkTop,
          height: watermarkVisibleHeight,
        }}
      >
        <span
          className="relative inline-block whitespace-nowrap"
          style={watermarkTypography}
        >
          <span aria-hidden className="absolute inset-0" style={watermarkHaloStyle}>
            {watermarkText}
          </span>
          <span aria-hidden className="absolute inset-0" style={watermarkStrokeStyle}>
            {watermarkText}
          </span>
          <span className="relative block" style={watermarkFillStyle}>
            {watermarkText}
          </span>
        </span>
      </div>

      {/* Glowing horizontal line cutting across the watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-[1]"
        style={{ top: watermarkLineTop }}
      >
        <div className="relative">
          <div
            className="w-full h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 100%)",
              boxShadow: "0 0 10px rgba(124,116,154,0.14)",
            }}
          />
          <div
            className="absolute inset-x-[12%] top-px"
            style={{
              height: "clamp(28px, 4vw, 48px)",
              background:
                "radial-gradient(58% 140% at 50% 0%, rgba(128,120,164,0.22) 0%, rgba(78,72,106,0.08) 40%, rgba(0,0,0,0) 76%)",
              filter: "blur(18px)",
            }}
          />
        </div>
      </div>

      {/* Dark panel below the divider — hides the lower part of the watermark like the reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2"
        style={{
          top: `calc(${watermarkLineTop} + 1px)`,
          width: "min(72vw, 1380px)",
          height: "clamp(120px, 16vw, 220px)",
          background:
            "radial-gradient(78% 165% at 50% 0%, rgba(28,28,34,0.42) 0%, rgba(10,10,12,0.94) 54%, rgba(0,0,0,0.99) 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* Full-width fade overlay below the glow line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-[1]"
        style={{
          top: watermarkLineTop,
          height: "clamp(180px, 22vw, 300px)",
          background:
            "linear-gradient(180deg, rgba(12,12,16,0.05) 0%, rgba(4,4,6,0.84) 24%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Footer content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 pb-12"
        style={{ paddingTop: footerContentPaddingTop }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
          {/* Left: branding + socials + status */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Advista Inc.
                <br />
                Pune, Maharashtra, India <br />
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-8 h-8 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 w-fit">
              <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
              <span className="text-xs text-zinc-300">All systems operational</span>
            </div>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-white mb-4">{category}</p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Advista. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
