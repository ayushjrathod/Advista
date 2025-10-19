import { About } from "@/components/landing/About";
import { FloatingNav } from "@/components/landing/floating-navbar";
import HeroButton from "@/components/landing/HeroButton";
import SplineComponent from "@/components/landing/SplineComponent";
import { Spotlight } from "@/components/ui/spotlight-new";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <FloatingNav className="" navItems={navItems} />
      {/* <SmokeSceneComponent /> */}
      <main className="relative min-h-screen flex items-center bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-left lg:w-1/2 mb-8 lg:mb-0">
            {/* <GlowingButton /> */}
            <h1 className="pt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Welcome to advista </h1>
            <p className="text-xl sm:text-2xl md:text-2xl text-gray-400 mb-8 mx-2">
              AI-powered research. Human-centered insights
            </p>
            <div className="flex flex-col">
              <Link to="/chat?input=hello">
                <HeroButton />
              </Link>
            </div>
          </div>
          <Spotlight />
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
