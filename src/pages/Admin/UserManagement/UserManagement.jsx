"use client"

import { useState, useEffect } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import UserFilters from "./components/UserFilters"
import UserTable from "./components/UserTable"
import Pagination from "../../../components/shared/Pagination.jsx"
import CreateUserModal from "./components/CreateUserModal"
import EditUserModal from "./components/EditUserModal"
import UserActivityModal from "./components/UserActivityModal"

// Mock data for demonstration
const mockUsers = Array(50)
  .fill()
  .map((_, i) => ({
    _id: `user_${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: "********",
    dateOfBirth: new Date(1990, 0, 1 + i),
    role: i % 5 === 0 ? "admin" : "user",
    avatar: `/placeholder.svg?text=U${i + 1}`,
    maxEventCreate: 5,
    maxParticipantPerEvent: 50,
    createdAt: new Date(2022, 0, 1 + i),
    updatedAt: new Date(2023, 0, 1),
    isDeleted: i % 7 === 0,
  }))

const mockEvents = Array(100)
  .fill()
  .map((_, i) => ({
    _id: `event_${i + 1}`,
    title: `Event ${i + 1}`,
    description: `Description for event ${i + 1}`,
    type: i % 3 === 0 ? "CONFERENCE" : i % 3 === 1 ? "WORKSHOP" : "MEETUP",
    startDate: new Date(2023, i % 12, (i % 28) + 1),
    endDate: new Date(2023, i % 12, (i % 28) + 2),
    location: `Location ${i + 1}`,
    images: [`/placeholder.svg?text=Event${i + 1}`],
    organizer: `user_${(i % 20) + 1}`,
    participants: Array((i % 10) + 1)
      .fill()
      .map((_, j) => ({
        user: `user_${(j % 50) + 1}`,
        status: j % 3 === 0 ? "GOING" : j % 3 === 1 ? "NOT_GOING" : "MAYBE",
      })),
    isPublic: i % 4 !== 0,
    createdAt: new Date(2022, 11, 31 - i),
    updatedAt: new Date(2023, 0, 1),
    isDeleted: i % 15 === 0,
  }))

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
  }))

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: null,
    role: "user",
    maxEventCreate: 5,
    maxParticipantPerEvent: 50,
  })
  const [editUser, setEditUser] = useState(null)
  const [userActivity, setUserActivity] = useState({
    organizedEvents: [],
    participatedEvents: [],
    discussionPosts: [],
  })

  const usersPerPage = 10

  // Fetch users on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter users when search term or filters change
  useEffect(() => {
    let result = [...users]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isDeleted = statusFilter === "inactive"
      result = result.filter((user) => user.isDeleted === isDeleted)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, roleFilter, users])

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle user creation
  const handleCreateUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.dateOfBirth) {
      alert("Please fill in all required fields")
      return
    }

    // Create new user object
    const createdUser = {
      _id: `user_${users.length + 1}`,
      ...newUser,
      avatar: `/placeholder.svg?text=${newUser.name.charAt(0)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }

    // Add to users list
    setUsers([createdUser, ...users])

    // Reset form and close modal
    setNewUser({
      name: "",
      email: "",
      password: "",
      dateOfBirth: null,
      role: "user",
      maxEventCreate: 5,
      maxParticipantPerEvent: 50,
    })
    setIsCreateModalOpen(false)
  }

  // Handle user deletion (soft delete)
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      setUsers(users.map((user) => (user._id === userId ? { ...user, isDeleted: true, updatedAt: new Date() } : user)))
    }
  }

  // Handle user reactivation
  const handleReactivateUser = (userId) => {
    if (window.confirm("Are you sure you want to reactivate this user?")) {
      setUsers(users.map((user) => (user._id === userId ? { ...user, isDeleted: false, updatedAt: new Date() } : user)))
    }
  }

  // Handle edit user
  const handleEditUser = () => {
    if (!editUser.name || !editUser.dateOfBirth) {
      alert("Please fill in all required fields")
      return
    }

    setUsers(users.map((user) => (user._id === editUser._id ? { ...editUser, updatedAt: new Date() } : user)))

    setIsEditModalOpen(false)
  }

  // Handle view user activity
  const handleViewActivity = (userId) => {
    const user = users.find((u) => u._id === userId)
    setSelectedUser(user)

    // Get user's organized events
    const organizedEvents = mockEvents.filter((event) => event.organizer === userId && !event.isDeleted)

    // Get events user is participating in
    const participatedEvents = mockEvents.filter(
      (event) => !event.isDeleted && event.participants.some((p) => p.user === userId && p.status === "GOING"),
    )

    // Get user's discussion posts
    const discussionPosts = mockPosts.filter((post) => post.creator_id === userId && !post.isDeleted)

    setUserActivity({
      organizedEvents,
      participatedEvents,
      discussionPosts,
    })

    setIsActivityModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">User Management</h1>

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

        <Button className="whitespace-nowrap mt-4 md:mt-0" onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <UserTable
        users={currentUsers}
        isLoading={isLoading}
        handleDeleteUser={handleDeleteUser}
        handleReactivateUser={handleReactivateUser}
        handleViewActivity={handleViewActivity}
        setEditUser={setEditUser}
        setIsEditModalOpen={setIsEditModalOpen}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        totalItems={filteredUsers.length}
        itemsPerPage={usersPerPage}
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
  )
}

export default UserManagement
