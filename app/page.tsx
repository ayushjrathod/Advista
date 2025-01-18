"use client";
import { About } from "@/components/about";
import GlowingButton from "@/components/githubButton";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/ui/footer";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  // const { data: session } = useSession();
  // const user: User = session?.user as User;
  // const router = useRouter();

  // if (!user) {
  //   router.push("/sign-in");
  //   return null;
  // }
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/chat?input=${encodeURIComponent(input)}`);
  };

  const [input, setInput] = useState("");
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
            <GlowingButton />
            <h1 className="pt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Welcome to advista </h1>
            <p className="text-xl sm:text-2xl md:text-2xl text-gray-400 mb-8 mx-2">
              AI-powered research. Human-centered insights
            </p>

            <div className="flex flex-col">
              <div className="my-4">
                <PlaceholdersAndVanishInput
                  placeholders={["Enter your email", "Enter your password"]}
                  onChange={(e) => setInput(e.target.value)}
                  onSubmit={(e) => handleSubmit(e)}
                />
              </div>
              {/* <div className="flex justify-center w-full">
                <HeroButton />
              </div> */}
            </div>
          </div>
          {/* <SplineComponent /> */}
        </div>
      </main>
      <div className="m-24">
        <About />
      </div>
      <Footer />
    </div>
  );
}
