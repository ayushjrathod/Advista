import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ReferencesData {
  youtube_groq_analysis?: string;
  reddit_groq_insight?: string;
  processed?: boolean;
  query?: string;
  timestamp?: string;
  _id?: string;
}

interface ReferencesProps {
  data: ReferencesData;
  session_id: string;
}

const markdownStyles = {
  h1: "text-2xl font-bold text-white mb-4",
  h2: "text-xl font-bold text-white/90 mb-3",
  h3: "text-lg font-semibold text-white/80 mb-2",
  p: "text-gray-300 mb-4 leading-relaxed",
  ul: "list-disc list-inside space-y-2 mb-4 text-gray-300",
  li: "ml-4",
  strong: "text-white font-semibold mt-6",
  em: "text-purple-400 italic",
  blockquote: "border-l-4 border-purple-500 pl-4 my-4 italic text-gray-300",
  a: "text-purple-400 hover:text-purple-300 underline",
  code: "bg-black/40 rounded px-1 py-0.5 text-purple-300 font-mono text-sm",
};

export function References({ data, session_id }: ReferencesProps) {
  const [localData, setLocalData] = useState<ReferencesData>(data);
  const [isPolling, setIsPolling] = useState(false);

  const fetchUpdates = async () => {
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
      });
      const newData = await response.json();

      if (newData) {
        setLocalData((prev) => ({
          ...prev,
          youtube_groq_analysis: newData.youtube_groq_analysis || prev.youtube_groq_analysis,
          reddit_groq_insight: newData.reddit_groq_insight || prev.reddit_groq_insight,
          processed: newData.processed,
        }));

        // Stop polling if both insights are available
        if (newData.youtube_groq_analysis && newData.reddit_groq_insight) {
          setIsPolling(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  // Start polling if insights are missing
  useEffect(() => {
    if (!localData.youtube_groq_analysis || !localData.reddit_groq_insight) {
      setIsPolling(true);
      const pollInterval = setInterval(async () => {
        const hasAllData = await fetchUpdates();
        if (hasAllData) {
          clearInterval(pollInterval);
        }
      }, 5000); // Poll every 5 seconds

      // Initial fetch
      fetchUpdates();

      return () => clearInterval(pollInterval);
    }
  }, [session_id]);

  const getStatusDisplay = () => {
    if (!localData.processed) {
      return {
        text: "Processing...",
        className: "text-yellow-400",
      };
    }
    return {
      text: "Completed",
      className: "text-green-400",
    };
  };

  const status = getStatusDisplay();

  const insightsData = [
    { title: "Query", value: localData.query },
    { title: "Timestamp", value: localData.timestamp ? new Date(localData.timestamp).toLocaleString() : "" },
    {
      title: "Status",
      value: status.text,
      className: status.className,
    },
    { title: "Session ID", value: localData._id },
  ];

  // Sync with parent data
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  const renderContent = (content: string | undefined, type: "youtube" | "reddit") => {
    if (content) {
      return (
        <div className="prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className={markdownStyles.h1}>{children}</h1>,
              h2: ({ children }) => <h2 className={markdownStyles.h2}>{children}</h2>,
              h3: ({ children }) => <h3 className={markdownStyles.h3}>{children}</h3>,
              p: ({ children }) => <p className={markdownStyles.p}>{children}</p>,
              ul: ({ children }) => <ul className={markdownStyles.ul}>{children}</ul>,
              li: ({ children }) => <li className={markdownStyles.li}>{children}</li>,
              strong: ({ children }) => <strong className={markdownStyles.strong}>{children}</strong>,
              em: ({ children }) => <em className={markdownStyles.em}>{children}</em>,
              blockquote: ({ children }) => <blockquote className={markdownStyles.blockquote}>{children}</blockquote>,
              a: ({ children, href }) => (
                <a href={href} className={markdownStyles.a} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              code: ({ children }) => <code className={markdownStyles.code}>{children}</code>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
        <span>Generating {type === "youtube" ? "YouTube" : "Reddit"} insights...</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-black/20 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          {insightsData.map((item) => (
            <div key={item.title} className="space-y-1">
              <div className="text-sm text-gray-400">{item.title}</div>
              <div className={item.className || "text-white"}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">YouTube Analysis</h3>
        <div className="bg-black/20 p-6 rounded-lg prose prose-invert max-w-none backdrop-blur-sm">
          {renderContent(localData.youtube_groq_analysis, "youtube")}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Reddit Analysis</h3>
        <div className="bg-black/20 p-6 rounded-lg prose prose-invert max-w-none backdrop-blur-sm">
          {renderContent(localData.reddit_groq_insight, "reddit")}
        </div>
      </div>
    </div>
  );
}
