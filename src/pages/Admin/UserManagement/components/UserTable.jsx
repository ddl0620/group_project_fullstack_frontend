'use client';

import { Edit, Trash2, RefreshCw, Eye, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

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

  // Render mobile card view for each user
  const renderMobileUserCard = (user) => (
    <div
      key={user._id}
      className="mb-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.avatar || '/placeholder.svg'}
            alt={user.name}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
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
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className={user.isDeleted ? 'bg-gray-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Avatar>
                          <AvatarImage
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        user.role === 'admin' ? 'destructive' : 'default'
                      }
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        user.isDeleted
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
