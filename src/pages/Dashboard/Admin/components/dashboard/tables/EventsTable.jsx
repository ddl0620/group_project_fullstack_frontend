"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ResponsiveTable } from '@/pages/Dashboard/Admin/components/dashboard/tables/ResponsiveTable.jsx';

export function EventsTable({ data = [], onViewEvent }) {
  const columns = [
    { key: "name", header: "Event Name", minWidth: 180 },
    { key: "date", header: "Date", minWidth: 120 },
    { key: "organizer", header: "Organizer", minWidth: 150 },
    { key: "status", header: "Status", minWidth: 100 },
    { key: "actions", header: "Actions", minWidth: 80 },
  ]

  const renderRow = (event, index) => (
    <TableRow key={event.id || index}>
      <TableCell className="font-medium max-w-[180px] truncate">{event.name}</TableCell>
      <TableCell>{event.date}</TableCell>
      <TableCell className="max-w-[150px] truncate">{event.organizer}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            event.status === "active"
              ? "bg-green-100 text-green-800"
              : event.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : event.status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {event.status}
        </span>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewEvent && onViewEvent(event)}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">View event</span>
        </Button>
      </TableCell>
    </TableRow>
  )

  return <ResponsiveTable data={data} columns={columns} renderRow={renderRow} emptyMessage="No events found" />
}
