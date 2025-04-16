"use client";

import { References } from "@/components/dashboard/references";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Tabs } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

interface AnalysisData {
  query: string;
  timestamp: string;
  youtube_groq_analysis?: string;
  reddit_groq_insight?: string;
  groq_analysis?: string;
  processed?: boolean;
}

interface Tab {
  title: string;
  value: string;
  content: ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full animate-ping"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full animate-pulse"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="text-red-500 text-xl font-semibold">{message}</div>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "Chat", link: "/chat" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session_id = searchParams.get("session_id") || "20250119_041143";
        setLoading(true);
        setError(null);

        const response = await fetch("/api/db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analysis data");
        }

        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load analysis data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const tabs: Tab[] = [
    {
      title: "Analysis",
      value: "references",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="w-full h-full overflow-hidden relative rounded-3xl shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              <References
                data={{
                  ...analysisData,
                  youtube_groq_analysis: analysisData?.youtube_groq_analysis,
                  reddit_groq_insight: analysisData?.reddit_groq_insight,
                  processed: analysisData?.processed,
                }}
                session_id={searchParams.get("session_id") || "20250119_041143"}
              />
            </div>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white overflow-y-auto">
      <FloatingNav navItems={navItems} />
      <AnimatePresence>
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-8 py-8">
          {analysisData && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="z-12 mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">Query Analysis</h1>
              <div className="bg-white/[0.02] p-4 rounded-lg backdrop-blur-sm">
                <p className="text-xl text-gray-300">"{analysisData.query}"</p>
                <p className="text-sm text-gray-400 mt-2">{new Date(analysisData.timestamp).toLocaleString()}</p>
              </div>
            </motion.div>
          )}
          {loading ? <LoadingSpinner /> : <Tabs containerClassName="w-full" tabs={tabs} />}
        </div>
      </AnimatePresence>
    </div>
  );
}
