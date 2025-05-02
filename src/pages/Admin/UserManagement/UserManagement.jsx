'use client';

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminManagement } from '@/hooks/useAdminManagement.js';

// Import components
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import Pagination from '../../../components/shared/Pagination.jsx';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import UserActivityModal from './components/UserActivityModal';

// Mock data for demonstration
const mockEvents = Array(100)
  .fill()
  .map((_, i) => ({
    _id: `event_${i + 1}`,
    title: `Event ${i + 1}`,
    description: `Description for event ${i + 1}`,
    type: i % 3 === 0 ? 'CONFERENCE' : i % 3 === 1 ? 'WORKSHOP' : 'MEETUP',
    startDate: new Date(2023, i % 12, (i % 28) + 1),
    endDate: new Date(2023, i % 12, (i % 28) + 2),
    location: `Location ${i + 1}`,
    images: [`/placeholder.svg?text=Event${i + 1}`],
    organizer: `user_${(i % 20) + 1}`,
    participants: Array((i % 10) + 1)
      .fill()
      .map((_, j) => ({
        user: `user_${(j % 50) + 1}`,
        status: j % 3 === 0 ? 'GOING' : j % 3 === 1 ? 'NOT_GOING' : 'MAYBE',
      })),
    isPublic: i % 4 !== 0,
    createdAt: new Date(2022, 11, 31 - i),
    updatedAt: new Date(2023, 0, 1),
    isDeleted: i % 15 === 0,
  }));

const mockPosts = Array(200)
  .fill()
  .map((_, i) => ({
    _id: `post_${i + 1}`,
    creator_id: `user_${(i % 50) + 1}`,
    event_id: `event_${(i % 100) + 1}`,
    content: `This is post ${i + 1} content. It contains some text about the event.`,
    images: i % 3 === 0 ? [`/placeholder.svg?text=Post${i + 1}`] : [],
    isDeleted: i % 20 === 0,
    created_at: new Date(2023, i % 12, (i % 28) + 1),
    updated_at: new Date(2023, i % 12, (i % 28) + 1),
  }));

const UserManagement = () => {
  const { fetchUsers, users, pagination, createUser, updateUserInfo, softDeleteUser, reactivateUserAccount, fetchUserActivities } = useAdminManagement();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
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
  const [userActivity, setUserActivity] = useState({
    organizedEvents: [],
    participatedEvents: [],
    discussionPosts: [],
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      await fetchUsers(currentPage, pagination.users.limit, false);
      setAllUsers(users);
      setFilteredUsers(users);
      setIsLoading(false);
    };
    fetchUsersData();
  }, [fetchUsers, users, currentPage, pagination.users.limit]);

  // Filter users when search term or filters change
  useEffect(() => {
    let result = [...allUsers];

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

    setFilteredUsers(result);
  }, [searchTerm, statusFilter, roleFilter, allUsers]);

  // Handle page change
  const paginate = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchUsers(pageNumber, pagination.users.limit);
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
      const createdUser = await createUser({
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

      setAllUsers([createdUser, ...allUsers]);
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
    } catch (error) {
      alert('Failed to create user: ' + error.message);
    }
  };

  // Handle user deletion (soft delete)
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await softDeleteUser(userId);
        setAllUsers(
          allUsers.map((user) =>
            user._id === userId
              ? { ...user, isDeleted: true, updatedAt: new Date() }
              : user
          )
        );
      } catch (error) {
        alert('Failed to deactivate user: ' + error.message);
      }
    }
  };

  // Handle user reactivation
  const handleReactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        await reactivateUserAccount(userId);
        setAllUsers(
          allUsers.map((user) =>
            user._id === userId
              ? { ...user, isDeleted: false, updatedAt: new Date() }
              : user
          )
        );
      } catch (error) {
        alert('Failed to reactivate user: ' + error.message);
      }
    }
  };

  // Handle edit user
  const handleEditUser = async () => {
    if (!editUser.name || !editUser.dateOfBirth) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const updatedUser = await updateUserInfo(editUser._id, {
        name: editUser.name,
        dateOfBirth: editUser.dateOfBirth,
        role: editUser.role,
        maxEventCreate: editUser.maxEventCreate,
        maxParticipantPerEvent: editUser.maxParticipantPerEvent,
      });

      console.log(updatedUser);

      setFilteredUsers(
        filteredUsers.map((user) =>
          user._id === updatedUser._id
            ? { ...updatedUser, updatedAt: new Date() }
            : user
        )
      );
      // setFilteredUsers(allUsers)
      setIsEditModalOpen(false);
    } catch (error) {
      alert('Failed to update user: ' + error.message);
    }
  };

  // Handle view user activity
  const handleViewActivity = async (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    setSelectedUser(user);

    try {
      const activities = await fetchUserActivities(userId);
      // Get user's organized events
      const organizedEvents = activities.organizedEvents.filter(
        (event) => !event.isDeleted
      );

      // Get events user is participating in
      const participatedEvents = mockEvents.filter(
        (event) =>
          !event.isDeleted &&
          event.participants.some(
            (p) => p.user === userId && p.status === 'GOING'
          )
      );

      // Get user's discussion posts
      const discussionPosts = mockPosts.filter(
        (post) => post.creator_id === userId && !post.isDeleted
      );

      setUserActivity({
        organizedEvents,
        participatedEvents,
        discussionPosts,
      });

      setIsActivityModalOpen(true);
    } catch (error) {
      alert('Failed to fetch user activities: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
        User Management
      </h1>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
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
        isLoading={isLoading}
        handleDeleteUser={handleDeleteUser}
        handleReactivateUser={handleReactivateUser}
        handleViewActivity={handleViewActivity}
        setEditUser={setEditUser}
        setIsEditModalOpen={setIsEditModalOpen}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.users.page}
        totalPages={pagination.users.totalPages}
        onPageChange={paginate}
        totalItems={pagination.users.totalUsers}
        itemsPerPage={pagination.users.limit}
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
        selectedUser={selectedUser}
        userActivity={userActivity}
      />
    </div>
  );
};

export default UserManagement;