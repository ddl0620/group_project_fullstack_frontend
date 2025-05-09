"use client"

import React, { useState, useEffect, useRef } from "react"
import { ArrowUpDown } from "lucide-react"
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
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';

function RecentRecipients({ fullTable = false, data = [] }) {
  // Render counter for debugging
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1
    console.log(`RecentRecipients Render Count: ${renderCount.current}`)
  })

  // Log data changes
  useEffect(() => {
    console.log("Recipients Data in Component:", data)
  }, [data])

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Responsive column visibility
  useEffect(() => {
    const updateColumnVisibility = () => {
      const isSmallScreen = window.matchMedia("(max-width: 640px)").matches
      const isMediumScreen = window.matchMedia("(max-width: 768px)").matches

      setColumnVisibility({
        name: true,
        email: !isMediumScreen, // Hide email on screens < 768px
        rsvp: true,
        respondedAt: !isSmallScreen, // Hide respondedAt on screens < 640px
      })
    }

    updateColumnVisibility() // Initial check
    window.addEventListener("resize", updateColumnVisibility)
    return () => window.removeEventListener("resize", updateColumnVisibility)
  }, [])

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <CustomAvatar fallbackText={row.getValue("name")} src={row.original.avatar} />
          <span className="ml-2">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "rsvp",
      header: "RSVP Status",
      cell: ({ row }) => {
        const status = row.getValue("rsvp")
        return (
          <Badge variant={status === "ACCEPTED" ? "success" : status === "DENIED" ? "destructive" : "outline"}
                 className={
                  status === "DENIED"
                    ? "text-white bg-red-600 !h-8 !px-3 !text-sm !leading-4"
                    : status === "ACCEPTED"
                      ? "text-white bg-green-600 !h-8 !px-1.5 !text-sm !leading-4"
                      : "text-gray-800 bg-gray-200 !h-8 !px-3 !text-sm !leading-4"
            }
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        )
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
        <div className="flex items-center py-4 flex-col sm:flex-row">
          <Input
            placeholder="Filter by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-full sm:max-w-sm mb-2 sm:mb-0"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table className="w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
                  No recipients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {fullTable && (
        <div className="flex items-center justify-end space-x-2 py-4 flex-col sm:flex-row">
          <div className="flex-1 text-sm text-muted-foreground mb-2 sm:mb-0">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(RecentRecipients)