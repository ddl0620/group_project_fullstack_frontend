"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ResponsiveTable } from '@/pages/Dashboard/Admin/components/dashboard/tables/ResponsiveTable.jsx';

export function UsersTable({ data = [], onViewUser }) {
  const columns = [
    { key: "username", header: "Username", minWidth: 120 },
    { key: "email", header: "Email", minWidth: 180 },
    { key: "status", header: "Status", minWidth: 100 },
    { key: "joinedDate", header: "Joined", minWidth: 120 },
    { key: "actions", header: "Actions", minWidth: 80 },
  ]

  const renderRow = (user, index) => (
    <TableRow key={user.id || index}>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell className="max-w-[180px] truncate">{user.email}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.status === "active"
              ? "bg-green-100 text-green-800"
              : user.status === "inactive"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {user.status}
        </span>
      </TableCell>
      <TableCell>{user.joinedDate}</TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewUser && onViewUser(user)}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">View user</span>
        </Button>
      </TableCell>
    </TableRow>
  )

  return <ResponsiveTable data={data} columns={columns} renderRow={renderRow} emptyMessage="No users found" />
}
