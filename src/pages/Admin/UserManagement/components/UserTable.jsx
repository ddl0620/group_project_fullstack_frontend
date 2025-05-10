'use client';

import { useState } from 'react';
import {
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  Calendar,
  Shield,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function UserTable({
  users,
  isLoading,
  handleDeleteUser,
  handleReactivateUser,
  handleViewActivity,
  setEditUser,
  setIsEditModalOpen,
}) {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Table state
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Define columns
  const columns = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="pl-0"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <CustomAvatar
                _classname={'h-10 w-10'}
                src={user.avatar}
                alt={user.name}
                fallbackText={user.name}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue('role');
        return (
          <Badge variant={role === 'admin' ? 'destructive' : 'default'}>
            {role === 'admin' ? 'Admin' : 'User'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isDeleted',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isDeleted = row.getValue('isDeleted');
        return (
          <span
            className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
              isDeleted
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isDeleted ? 'Inactive' : 'Active'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('createdAt');
        return <div className="text-sm text-gray-500">{formatDate(date)}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditUser({ ...user });
                setIsEditModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewActivity(user._id)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {user.isDeleted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReactivateUser(user._id)}
                className="text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteUser(user._id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: users || [],
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
  });

  // Render mobile card view for each user
  const renderMobileUserCard = (user) => (
    <div
      key={user._id}
      className="mb-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="flex items-center space-x-3">
        <CustomAvatar
          _classname={'h-12 w-12'}
          src={user.avatar || '/placeholder.svg'}
          alt={user.name}
          fallbackText={user.name}
        />
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-gray-400" />
          <Badge
            variant={user.role === 'admin' ? 'destructive' : 'default'}
            className="font-normal"
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </Badge>
        </div>

        <div className="flex items-center">
          <div
            className={`mr-2 h-2 w-2 rounded-full ${user.isDeleted ? 'bg-red-500' : 'bg-green-500'}`}
          ></div>
          <span className="text-gray-600">
            {user.isDeleted ? 'Inactive' : 'Active'}
          </span>
        </div>

        <div className="col-span-2 flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditUser({ ...user });
            setIsEditModalOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewActivity(user._id)}
        >
          <Eye className="h-4 w-4" />
        </Button>

        {user.isDeleted ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReactivateUser(user._id)}
            className="text-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(user._id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Mobile view (cards) */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div>{users.map(renderMobileUserCard)}</div>
        )}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden md:block">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={table.getColumn('name')?.getFilterValue() ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === 'name'
                        ? 'User'
                        : column.id === 'isDeleted'
                          ? 'Status'
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  );
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-sm text-gray-500">
                          Loading users...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`${row.original.isDeleted ? 'bg-gray-50' : ''} hover:bg-gray-50`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
