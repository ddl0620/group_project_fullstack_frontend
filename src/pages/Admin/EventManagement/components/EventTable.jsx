"use client"

import { useState } from "react"
import { Edit, Trash2, RefreshCw, Eye, Calendar, Users, MapPin, ChevronDown, ArrowUpDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

export default function EventTable({
                                     events,
                                     isLoading,
                                     handleDeleteEvent,
                                     handleRestoreEvent,
                                     handleViewEvent,
                                     handleEditEvent,
                                   }) {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A"
    return format(new Date(date), "MMM d, yyyy")
  }

  // Format date with time for display
  const formatDateTime = (date) => {
    if (!date) return "N/A"
    return format(new Date(date), "MMM d, yyyy h:mm a")
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Get event type display name
  const getEventTypeDisplay = (type) => {
    const typeMap = {
      SOCIAL: "Social",
      EDUCATION: "Education",
      BUSINESS: "Business",
      ENTERTAINMENT: "Entertainment",
      OTHER: "Other",
    }
    return typeMap[type] || type
  }

  // Get event status
  const getEventStatus = (event) => {
    if (event.isDeleted) return { label: "Deleted", className: "bg-red-100 text-red-800" }
    if (new Date() > new Date(event.endDate)) return { label: "Ended", className: "bg-gray-100 text-gray-800" }
    return { label: "Active", className: "bg-green-100 text-green-800" }
  }

  // Table state
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  // Define columns
  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="pl-0">
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              {event.images && event.images.length > 0 ? (
                <img
                  src={event.images[0] || "/placeholder.svg"}
                  alt={event.title}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{event.title}</div>
              <div className="text-sm text-gray-500 truncate max-w-[200px]">{event.location}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const type = row.getValue("type")
        return <Badge variant="outline">{getEventTypeDisplay(type)}</Badge>
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const event = row.original
        return (
          <div>
            <div className="text-sm text-gray-500">{formatDate(event.startDate)}</div>
            <div className="text-xs text-gray-400">to {formatDate(event.endDate)}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "isDeleted",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const event = row.original
        const status = getEventStatus(event)
        return (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${status.className}`}>
            {status.label}
          </span>
        )
      },
    },
    {
      id: "participants",
      accessorFn: (row) => (row.participants ? row.participants.length : 0),
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Participants
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              {event.participants && event.participants.length > 0 ? (
                <>
                  {event.participants.slice(0, 3).map((participant, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-white">
                      <AvatarImage
                        src={participant.userId?.avatar || "/placeholder.svg"}
                        alt={participant.userId?.name || ""}
                      />
                      <AvatarFallback>{getInitials(participant.userId?.name || "")}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.participants.length > 3 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs">
                      +{event.participants.length - 3}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-sm text-gray-500">None</span>
              )}
            </div>
            {/*<span className="text-sm text-gray-500">({event.participants?.length || 0})</span>*/}
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("updatedAt")
        return (
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <div className="text-sm text-gray-500">{formatDateTime(date)}</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
              <Edit className="h-4 w-4" />
            </Button>
            {event.isDeleted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestoreEvent(event._id)}
                className="text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteEvent(event._id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  // Initialize table
  const table = useReactTable({
    data: events || [],
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

  // Render mobile card view for each event
  const renderMobileEventCard = (event) => (
    <div key={event._id} className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Badge>{getEventTypeDisplay(event.type)}</Badge>
        <div className={`flex items-center`}>
          {(() => {
            const status = getEventStatus(event)
            return (
              <>
                <div
                  className={`mr-1 h-2 w-2 rounded-full ${
                    event.isDeleted
                      ? "bg-red-500"
                      : new Date() > new Date(event.endDate)
                        ? "bg-gray-500"
                        : "bg-green-500"
                  }`}
                ></div>
                <span className="text-xs">{status.label}</span>
              </>
            )
          })()}
        </div>
      </div>

      <h3 className="mb-1 font-medium">{event.title}</h3>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          <span>{event.participants?.length || 0} participants</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>Updated: {formatDate(event.updatedAt)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
          <Edit className="h-4 w-4" />
        </Button>
        {event.isDeleted ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestoreEvent(event._id)}
            className="text-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteEvent(event._id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="mb-6">
      {/* Mobile view (cards) */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div>{events.map(renderMobileEventCard)}</div>
        )}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden md:block">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      {column.id === "title"
                        ? "Event"
                        : column.id === "isDeleted"
                          ? "Status"
                          : column.id === "updatedAt"
                            ? "Last Updated"
                            : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-4">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-sm text-gray-500">Loading events...</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${row.original.isDeleted ? "bg-gray-50" : ""} hover:bg-gray-50`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
