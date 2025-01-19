import { About } from "@/components/about";
import GlowingButton from "@/components/githubButton";
import HeroButton from "@/components/heroButton";
import SmokeSceneComponent from "@/components/SmokeSceneComponent";
import SplineComponent from "@/components/SplineComponent";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/ui/footer";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

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
            <GlowingButton />
            <h1 className="pt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Welcome to advista </h1>
            <p className="text-xl sm:text-2xl md:text-2xl text-gray-400 mb-8 mx-2">
              AI-powered research. Human-centered insights
            </p>

            <div className="flex flex-col">
              <Link href="/chat?input=hi">
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
      <Footer />
    </div>
  );
}
