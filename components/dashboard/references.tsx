import ReactMarkdown from "react-markdown";
// @ts-expect-error
export function References({ data }) {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">YouTube Analysis</h3>
        <div className="bg-black/20 p-4 rounded-lg prose prose-invert max-w-none">
          <ReactMarkdown>{data.youtube_groq_analysis}</ReactMarkdown>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Reddit Analysis</h3>
        <div className="bg-black/20 p-4 rounded-lg prose prose-invert max-w-none">
          <ReactMarkdown>{data.reddit_groq_insight}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
