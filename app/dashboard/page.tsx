"use client";
import { Insights } from "@/components/dashboard/insights";
import { PainPoints } from "@/components/dashboard/pain-points";
import { References } from "@/components/dashboard/references";
import { Tabs } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-8 h-full py-8">
        <Tabs
          containerClassName="w-full"
          tabs={[
            {
              title: "Insights",
              value: "insights",
              content: (
                <div className="mt-8">
                  <div className="w-full h-full overflow-hidden relative rounded-3xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                    <div className="relative z-10 p-8 md:p-12">
                      <Insights />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: "Pain Points",
              value: "painPoints",
              content: (
                <div className="mt-8">
                  <div className="w-full h-full overflow-hidden relative rounded-3xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                    <div className="relative z-10 p-8 md:p-12">
                      <PainPoints />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: "References",
              value: "references",
              content: (
                <div className="mt-8">
                  <div className="w-full h-full overflow-hidden relative rounded-3xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                    <div className="relative z-10 p-8 md:p-12">
                      <References />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
