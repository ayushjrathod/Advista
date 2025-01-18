import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from your backend
const insightsData = [
  { title: "Total Users", value: "10,234" },
  { title: "Revenue", value: "$54,321" },
  { title: "Active Sessions", value: "432" },
  { title: "Conversion Rate", value: "3.2%" },
]

export function Insights() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {insightsData.map((insight, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {insight.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insight.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

