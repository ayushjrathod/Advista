"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface InsightsData {
  processed: boolean;
  query: string;
  timestamp: string;
  _id: string;
  youtube_groq_analysis?: string;
  reddit_groq_insight?: string;
}

export function Insights({ data }: { data: InsightsData }) {
  if (!data) return <div>Loading...</div>;

  const getStatusDisplay = () => {
    if (!data.processed) {
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
    { title: "Query", value: data.query },
    { title: "Timestamp", value: new Date(data.timestamp).toLocaleString() },
    {
      title: "Status",
      value: status.text,
      className: status.className,
    },
    { title: "Session ID", value: data._id },
  ];

  return (
    <div className="space-y-8">
      {/* Existing cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insightsData.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${insight.className || ""}`}>{insight.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Sections */}
      <div className="space-y-8">
        {/* YouTube Analysis */}
        {data.youtube_groq_analysis && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">YouTube Analysis</h3>
            <Card className="bg-black/20">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{data.youtube_groq_analysis}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reddit Analysis */}
        {data.reddit_groq_insight && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Reddit Analysis</h3>
            <Card className="bg-black/20">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{data.reddit_groq_insight}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
