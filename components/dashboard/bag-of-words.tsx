"use client";
import { WordCloudComponent } from "@/components/ui/word-cloud";
import { useEffect, useState } from "react";

interface BagOfWordsProps {
  data: {
    query: string;
  };
}

export function BagOfWords({ data }: BagOfWordsProps) {
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordCloudData = async () => {
      if (!data?.query) {
        setError("No query provided");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/wordcloud", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: data.query }),
        });

        const result = await response.json();
        console.log("API Response:", result); // Debug log

        if (result.error) {
          throw new Error(result.error);
        }

        const processedWords = processApiResponse(result);
        console.log("Processed Words:", processedWords); // Debug log

        if (processedWords.length === 0) {
          throw new Error("No words generated from the response");
        }

        setWords(processedWords);
      } catch (error) {
        console.error("Error fetching word cloud data:", error);
        setError(error instanceof Error ? error.message : "Failed to generate word cloud");
      } finally {
        setLoading(false);
      }
    };

    fetchWordCloudData();
  }, [data?.query]);

  const processApiResponse = (apiData: any) => {
    try {
      // Extract text from both responses
      const text1 = apiData.first?.result || apiData.first?.response || "";
      const text2 = apiData.second?.result || apiData.second?.response || "";

      const combinedText = `${text1} ${text2}`;
      const wordCount = new Map<string, number>();

      // Improved word extraction
      combinedText
        .toLowerCase()
        .replace(/[^\w\s]/g, " ") // Remove punctuation
        .split(/\s+/)
        .filter((word) => word.length > 3 && !["this", "that", "with", "from", "what"].includes(word))
        .forEach((word) => {
          wordCount.set(word, (wordCount.get(word) || 0) + 1);
        });

      const processedWords = Array.from(wordCount.entries())
        .map(([text, value]) => ({
          text,
          value: value * 10, // Increase word size for better visibility
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 50); // Take top 50 words

      return processedWords;
    } catch (error) {
      console.error("Error processing API response:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[600px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          <span>Generating word cloud...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center w-full h-[600px] text-red-400">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center w-full h-[600px]">
      {words.length > 0 ? (
        <WordCloudComponent words={words} />
      ) : (
        <div className="text-gray-400">No words to display</div>
      )}
    </div>
  );
}
