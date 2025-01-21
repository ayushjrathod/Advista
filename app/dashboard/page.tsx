"use client";
import { BagOfWords } from "@/components/dashboard/bag-of-words";
import { Insights } from "@/components/dashboard/insights";
import { PainPoints } from "@/components/dashboard/pain-points";
import { References } from "@/components/dashboard/references";
import { Tabs } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

interface AnalysisData {
  query: string;
  timestamp: string;
}

interface Tab {
  title: string;
  value: string;
  content: ReactNode;
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session_id = searchParams.get("session_id") || "20250119_041143";
        console.log("Using session ID:", session_id);
        setLoading(true);

        const response = await fetch("/api/db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id }),
        });
        const data = await response.json();
        console.log("Analysis data received:", data);
        setAnalysisData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
        Loading...
      </div>
    );
  }

  const tabs: Tab[] = [
    {
      title: "Insights",
      value: "insights",
      content: (
        <div className="mt-8">
          <div className="w-full h-full overflow-hidden relative rounded-3xl  shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              {/* @ts-ignore */}
              <Insights data={analysisData as AnalysisData} />
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
          <div className="w-full h-full overflow-hidden relative rounded-3xl  shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              {/* @ts-ignore */}
              <PainPoints data={analysisData as AnalysisData} />
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
          <div className="w-full h-full overflow-hidden relative rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              <References data={analysisData as AnalysisData} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Bag of Words",
      value: "bagOfWords",
      content: (
        <div className="mt-2">
          <div className="w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              {/*@ts-ignore*/}
              <BagOfWords data={analysisData as AnalysisData} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto">
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-8 py-8">
        {analysisData && (
          <div className="z-12 mb-8">
            <h1 className="text-3xl font-bold mb-2">Query Analysis</h1>
            <div className="bg-white/[0.02] p-4 rounded-lg">
              <p className="text-xl text-gray-300">"{analysisData.query}"</p>
              <p className="text-sm text-gray-400 mt-2">{new Date(analysisData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
        <Tabs containerClassName="w-full" tabs={tabs} />
      </div>
    </div>
  );
}
