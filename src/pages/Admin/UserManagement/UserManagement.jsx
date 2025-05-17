import { useState, useEffect, useMemo } from 'react';
import { Info, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminManagement } from '@/hooks/useAdminManagement.js';
import { useSelector } from 'react-redux';

// Import components
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import Pagination from '../../../components/shared/Pagination.jsx';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import UserActivityModal from './components/UserActivityModal';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { Toast } from '@/helpers/toastService.js';

const UserManagement = () => {
  const { fetchUsers, createUser, updateUserInfo, softDeleteUser } =
    useAdminManagement();

  // Get users directly from Redux store
  const users = useSelector((state) => state.adminManagement.users);
  const pagination = useSelector(
    (state) => state.adminManagement.pagination.users
  );
  const loading = useSelector((state) => state.adminManagement.loading);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: null,
    role: 'user',
    maxEventCreate: 5,
    maxParticipantPerEvent: 50,
  });
  const [editUser, setEditUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit, false);
  }, [fetchUsers, pagination.page, pagination.limit]);

  // Filter users using useMemo to avoid unnecessary recalculations
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isDeleted = statusFilter === 'inactive';
      result = result.filter((user) => user.isDeleted === isDeleted);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    return result;
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Handle page change
  const paginate = async (pageNumber) => {
    await fetchUsers(pageNumber, pagination.limit);
  };

  // Handle user creation
  const handleCreateUser = async () => {
    // Validate form
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.dateOfBirth
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createUser({
        ...newUser,
        confirmPassword: newUser.password,
      });

      setNewUser({
        name: '',
        email: '',
        password: '',
        dateOfBirth: null,
        role: 'user',
        maxEventCreate: 5,
        maxParticipantPerEvent: 50,
      });
      setIsCreateModalOpen(false);

      // Refresh the user list
      fetchUsers(pagination.page, pagination.limit, false, true);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle user deletion (soft delete)
  const handleDeleteUser = async (userId) => {
    const confirmed = await AlertDialogUtils.danger({
      title: 'Delete User',
      description: 'Are you sure you want to deactivate this user?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
    });

    if (!confirmed) return;

    try {
      await softDeleteUser(userId);
    } catch (error) {
      alert('Failed to deactivate user: ' + error.message);
    }
  };

  // Handle user reactivation
  const handleReactivateUser = async (userId) => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Reactivate User',
      description: 'Are you sure you want to reactivate this user?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
    });
    if (!confirmed) return;

    try {
      await updateUserInfo(userId, { isDeleted: false });
    } catch (error) {
      alert('Failed to reactivate user: ' + error.message);
    }
  };

  // Handle edit user
  const handleEditUser = async () => {
    if (!editUser.name || !editUser.dateOfBirth) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await updateUserInfo(editUser._id, {
        name: editUser.name,
        dateOfBirth: editUser.dateOfBirth,
        role: editUser.role,
        maxEventCreate: editUser.maxEventCreate,
        maxParticipantPerEvent: editUser.maxParticipantPerEvent,
        isDeleted: editUser.isDeleted,
      });

      setIsEditModalOpen(false);
    } catch (error) {
      alert('Failed to update user: ' + error.message);
    }
  };

  // Handle view user activity
  const handleViewActivity = async (userId) => {
    setSelectedUserId(userId);
    setIsActivityModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
        User Management
      </h1>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col space-y-2 md:flex-row md:items-start md:justify-between md:space-x-2">
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        <Button
          className="mt-4 whitespace-nowrap md:mt-0"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        isLoading={loading}
        handleDeleteUser={handleDeleteUser}
        handleReactivateUser={handleReactivateUser}
        handleViewActivity={handleViewActivity}
        setEditUser={setEditUser}
        setIsEditModalOpen={setIsEditModalOpen}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={paginate}
        totalItems={pagination.totalUsers}
        itemsPerPage={pagination.limit}
        itemName="users"
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        handleCreateUser={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        editUser={editUser}
        setEditUser={setEditUser}
        handleEditUser={handleEditUser}
      />

      <UserActivityModal
        isOpen={isActivityModalOpen}
        setIsOpen={setIsActivityModalOpen}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UserManagement;
