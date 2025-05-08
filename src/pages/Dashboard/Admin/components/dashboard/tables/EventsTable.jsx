import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function EventsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Organizer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.name}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.organizer}</TableCell>
            <TableCell>{event.status}</TableCell>
            <TableCell>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
