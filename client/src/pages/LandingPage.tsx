import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FloatingNav } from "@/components/landing/floating-navbar";
import HeroButton from "@/components/landing/HeroButton";
import LazyRenderBoundary from "@/components/landing/LazyRenderBoundary";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const About = lazy(() => import("@/components/landing/About").then((module) => ({ default: module.About })));
const Footer = lazy(() => import("@/components/landing/Footer").then((module) => ({ default: module.Footer })));
const Spotlight = lazy(() => import("@/components/ui/spotlight-new").then((module) => ({ default: module.Spotlight })));
const RubiksCubeScene = lazy(() => import("@/components/landing/RubiksCube"));

function HeroSceneFallback() {
  return <div className="h-[360px] w-full rounded-[24px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(247,248,248,0.12),rgba(8,9,10,0)_48%)] lg:h-[680px] lg:w-[40%]" />;
}

export default function LandingPage() {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Start Run", link: "/chat", icon: <MessageSquare /> },
    { name: "About", link: "/about" },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (prefersReducedMotion || isMobile || saveData) {
      return;
    }

    let timeoutId: number | undefined;
    let idleCallbackId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleCallbackId = window.requestIdleCallback(() => {
        setShouldRender3D(true);
      });
    } else {
      timeoutId = window.setTimeout(() => {
        setShouldRender3D(true);
      }, 700);
    }

    return () => {
      if (idleCallbackId) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowAbout(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = footerSectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFooter(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="relative min-h-screen bg-[#08090A] text-[#F7F8F8] [font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif]">
      <FloatingNav className="" navItems={navItems} />
      <main className="relative min-h-screen flex items-center bg-transparent">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-12 px-6 py-28 md:py-32 lg:flex-row lg:gap-16 lg:py-36">
          <div className="mb-8 text-left lg:mb-0 lg:w-[46%]">
            <p className="pt-6 text-[13px] uppercase tracking-[0.24em] text-[#8A8F98]">Competitive intelligence</p>
            <h1 className="mt-6 max-w-[12ch] text-[clamp(2.5rem,5vw,3rem)] leading-[0.94] tracking-[-0.045em] text-[#F7F8F8]">
              Spot competitor moves before they reshape your market.
            </h1>
            <p className="mb-10 mt-6 max-w-[38rem] text-[15px] leading-7 text-[#8A8F98] md:text-[16px]">
              Advista turns competitor tracking into a repeatable workflow across search, video, forums, and public web
              sources so your team can monitor positioning, launches, messaging shifts, and category trends from one
              place.
            </p>
            <div className="">
              <Link to="/chat">
                <HeroButton />
              </Link>
            </div>
          </div>
          <Suspense fallback={null}>
            <Spotlight />
          </Suspense>
          {shouldRender3D ? (
            <LazyRenderBoundary fallback={<HeroSceneFallback />}>
              <Suspense fallback={<HeroSceneFallback />}>
                <RubiksCubeScene />
              </Suspense>
            </LazyRenderBoundary>
          ) : (
            <HeroSceneFallback />
          )}
        </div>
      </main>
      <div ref={aboutSectionRef} className="min-h-[280px]" style={{ contentVisibility: "auto", containIntrinsicSize: "1000px" }}>
        {showAbout ? (
          <Suspense fallback={<div className="mx-auto h-24 max-w-[1200px] px-6" />}>
            <About />
          </Suspense>
        ) : null}
      </div>

      <div ref={footerSectionRef} className="min-h-[420px]" style={{ contentVisibility: "auto", containIntrinsicSize: "700px" }}>
        {showFooter ? (
          <Suspense fallback={<div className="h-[420px] bg-black" />}>
            <Footer />
          </Suspense>
        ) : (
          <div className="h-[420px] bg-black" />
        )}
      </div>
    </div>
  );
}
