import { FloatingNav } from "@/components/ui/floating-navbar";
import { HomeIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic imports with loading fallbacks
const About = dynamic(() => import("@/components/about").then((mod) => ({ default: mod.About })), {
  loading: () => (
    <div className="animate-pulse m-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 h-[300px] bg-gray-800/50 rounded-2xl"></div>
        <div className="h-[300px] bg-gray-800/50 rounded-2xl"></div>
        <div className="col-span-3 h-[300px] bg-gray-800/50 rounded-2xl"></div>
      </div>
    </div>
  ),
  ssr: false,
});

const SmokeSceneComponent = dynamic(() => import("@/components/SmokeSceneComponent"), {
  loading: () => <div className="w-full h-screen bg-black"></div>,
  ssr: false,
});

const SplineComponent = dynamic(() => import("@/components/SplineComponent"), {
  loading: () => <div className="w-full h-[500px] bg-transparent"></div>,
  ssr: false,
});

const HeroButton = dynamic(() => import("@/components/heroButton"), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-12 w-48 bg-gray-800/50 rounded-full"></div>
    </div>
  ),
});

export default function Home() {
  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />
      <SmokeSceneComponent />
      <main className="relative min-h-screen flex items-center bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-left lg:w-1/2 mb-8 lg:mb-0">
            {/* <GlowingButton /> */}
            <h1 className="pt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Welcome to advista </h1>
            <p className="text-xl sm:text-2xl md:text-2xl text-gray-400 mb-8 mx-2">
              AI-powered research. Human-centered insights
            </p>
            <div className="flex flex-col">
              <Link href="/chat?input=hello">
                <HeroButton />
              </Link>
            </div>
          </div>
          <SplineComponent />
        </div>
      </main>
      <div className="m-24">
        <About />
      </div>

      <footer className="relative z-10 w-full py-12 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Advista. All rights reserved.</p>
      </footer>
    </div>
  );
}
