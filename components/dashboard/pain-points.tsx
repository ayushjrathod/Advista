import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// This would typically come from your backend
const painPointsData = [
  { id: 1, description: "Slow loading times on mobile devices" },
  { id: 2, description: "Difficulty in navigating through product categories" },
  { id: 3, description: "Lack of detailed product information" },
  { id: 4, description: "Complicated checkout process" },
]

export function PainPoints() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {painPointsData.map((painPoint) => (
          <TableRow key={painPoint.id}>
            <TableCell className="font-medium">{painPoint.id}</TableCell>
            <TableCell>{painPoint.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

