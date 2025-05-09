"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ResponsiveTable } from '@/pages/Dashboard/Admin/components/dashboard/tables/ResponsiveTable.jsx';

export function DiscussionsTable({ data = [], onViewDiscussion }) {
  const columns = [
    { key: "title", header: "Title", minWidth: 200 },
    { key: "author", header: "Author", minWidth: 120 },
    { key: "replies", header: "Replies", minWidth: 80 },
    { key: "createdAt", header: "Created", minWidth: 120 },
    { key: "actions", header: "Actions", minWidth: 80 },
  ]

  const renderRow = (discussion, index) => (
    <TableRow key={discussion.id || index}>
      <TableCell className="font-medium max-w-[300px] truncate">{discussion.title}</TableCell>
      <TableCell className="max-w-[120px] truncate">{discussion.author}</TableCell>
      <TableCell>{discussion.replies}</TableCell>
      <TableCell>{discussion.createdAt}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewDiscussion && onViewDiscussion(discussion)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View discussion</span>
        </Button>
      </TableCell>
    </TableRow>
  )

  return <ResponsiveTable data={data} columns={columns} renderRow={renderRow} emptyMessage="No discussions found" />
}
