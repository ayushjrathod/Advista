import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AlertTriangle, ThumbsUp, TrendingUp } from "lucide-react";

interface PainPointsProps {
  data: any;
}

export function PainPoints({ data }: PainPointsProps) {
  if (!data) return <div>Loading pain points...</div>;

  const painPointsCategories = [
    {
      title: "Critical Issues",
      value: "critical",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      content: (
        <div className="grid gap-4">
          <PainPointCard
            title="Performance Issues"
            description="Users report significant loading delays and response time problems"
            severity="High"
            impact="85%"
            recommendations={[
              "Implement lazy loading for images",
              "Optimize database queries",
              "Use CDN for static assets",
            ]}
          />
          <PainPointCard
            title="Mobile Responsiveness"
            description="Poor layout adaptation on mobile devices leads to navigation difficulties"
            severity="High"
            impact="78%"
            recommendations={[
              "Adopt mobile-first design approach",
              "Implement responsive breakpoints",
              "Optimize touch targets",
            ]}
          />
        </div>
      ),
    },
    {
      title: "Feature Requests",
      value: "features",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      content: (
        <div className="grid gap-4">
          <PainPointCard
            title="Advanced Filtering"
            description="Users need more granular search and filter options"
            severity="Medium"
            impact="65%"
            recommendations={["Add category filters", "Implement price range filters", "Add sorting options"]}
          />
          <PainPointCard
            title="Social Integration"
            description="Limited social sharing and interaction capabilities"
            severity="Medium"
            impact="58%"
            recommendations={["Add social sharing buttons", "Implement comments section", "Add user profiles"]}
          />
        </div>
      ),
    },
    {
      title: "User Experience",
      value: "ux",
      icon: <ThumbsUp className="w-5 h-5 text-green-500" />,
      content: (
        <div className="grid gap-4">
          <PainPointCard
            title="Navigation Structure"
            description="Complex menu hierarchy creates confusion for new users"
            severity="Medium"
            impact="72%"
            recommendations={["Simplify menu structure", "Add breadcrumbs", "Implement search suggestions"]}
          />
          <PainPointCard
            title="Form Validation"
            description="Unclear error messages and validation feedback"
            severity="Low"
            impact="45%"
            recommendations={["Add inline validation", "Improve error messaging", "Add field requirements"]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <Tabs
        containerClassName="w-full"
        tabs={painPointsCategories.map((category) => ({
          title: category.title,
          value: category.value,
          icon: category.icon,
          content: category.content,
        }))}
      />
    </div>
  );
}

function PainPointCard({
  title,
  description,
  severity,
  impact,
  recommendations,
}: {
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  impact: string;
  recommendations: string[];
}) {
  const severityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 bg-black/20 border-zinc-800/50">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-gray-400 mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[severity]} bg-opacity-20 text-white`}
              >
                {severity}
              </span>
              <span className="text-sm text-gray-400">Impact: {impact}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Recommendations:</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-400 text-sm">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
