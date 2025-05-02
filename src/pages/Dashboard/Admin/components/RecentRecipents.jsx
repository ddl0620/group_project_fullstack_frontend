"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Badge } from "./ui/index"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu"

export function RecentRecipients({ fullTable = false }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Sample data for recipients
  const data = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      rsvpStatus: "ACCEPTED",
      invitedAt: "2023-05-10T14:30:00Z",
      respondedAt: "2023-05-11T09:15:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      rsvpStatus: "PENDING",
      invitedAt: "2023-05-10T14:35:00Z",
      respondedAt: null,
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
      rsvpStatus: "DENIED",
      invitedAt: "2023-05-10T14:40:00Z",
      respondedAt: "2023-05-12T16:20:00Z",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 234-5678",
      rsvpStatus: "ACCEPTED",
      invitedAt: "2023-05-11T09:30:00Z",
      respondedAt: "2023-05-11T14:45:00Z",
    },
    {
      id: "5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "+1 (555) 876-5432",
      rsvpStatus: "PENDING",
      invitedAt: "2023-05-11T09:35:00Z",
      respondedAt: null,
    },
    {
      id: "6",
      name: "Sarah Brown",
      email: "sarah.brown@example.com",
      phone: "+1 (555) 345-6789",
      rsvpStatus: "ACCEPTED",
      invitedAt: "2023-05-11T09:40:00Z",
      respondedAt: "2023-05-12T11:10:00Z",
    },
    {
      id: "7",
      name: "David Miller",
      email: "david.miller@example.com",
      phone: "+1 (555) 654-3210",
      rsvpStatus: "DENIED",
      invitedAt: "2023-05-12T10:30:00Z",
      respondedAt: "2023-05-13T08:25:00Z",
    },
    {
      id: "8",
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      phone: "+1 (555) 789-0123",
      rsvpStatus: "PENDING",
      invitedAt: "2023-05-12T10:35:00Z",
      respondedAt: null,
    },
    {
      id: "9",
      name: "Christopher Anderson",
      email: "christopher.anderson@example.com",
      phone: "+1 (555) 321-0987",
      rsvpStatus: "ACCEPTED",
      invitedAt: "2023-05-12T10:40:00Z",
      respondedAt: "2023-05-12T15:30:00Z",
    },
    {
      id: "10",
      name: "Jessica Thomas",
      email: "jessica.thomas@example.com",
      phone: "+1 (555) 210-9876",
      rsvpStatus: "PENDING",
      invitedAt: "2023-05-13T11:30:00Z",
      respondedAt: null,
    },
  ]

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "rsvpStatus",
      header: "RSVP Status",
      cell: ({ row }) => {
        const status = row.getValue("rsvpStatus")
        return (
          <Badge variant={status === "ACCEPTED" ? "success" : status === "DENIED" ? "destructive" : "outline"}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        )
      },
    },
    {
      accessorKey: "invitedAt",
      header: "Invited At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("invitedAt"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "respondedAt",
      header: "Responded At",
      cell: ({ row }) => {
        const value = row.getValue("respondedAt")
        if (!value) return <div>-</div>
        const date = new Date(value)
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const recipient = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(recipient.email)}>
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Send reminder</DropdownMenuItem>
              <DropdownMenuItem>Edit recipient</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: fullTable ? data : data.slice(0, 5),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {fullTable && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {fullTable && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
