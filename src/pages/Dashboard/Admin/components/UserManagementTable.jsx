import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ChevronDown, MoreHorizontal, Trash, Edit } from 'lucide-react';

const UserManagementTable = ({ usersData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <Card className="mb-6">
        <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base font-medium">
            User Management{' '}
            <span className="text-xs font-normal text-gray-500">
                ({filteredUsers.length} Users)
            </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
            <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                type="text"
                placeholder="Search users by name or email"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm md:w-[400px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select
                className="rounded-md border border-gray-300 py-2 px-4 text-sm"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
            >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            </div>

            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>ROLE</TableHead>
                    <TableHead>ACTIONS</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </CardContent>
        </Card>
    );
};

export default UserManagementTable;