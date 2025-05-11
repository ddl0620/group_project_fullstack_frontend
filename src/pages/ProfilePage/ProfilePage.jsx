"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Calendar, Mail, User, Shield, Clock, Edit, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';

function ProfilePage() {
  const user = useSelector((state) => state.user.user)
  const [isHoveringCover, setIsHoveringCover] = useState(false)

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided"
    return format(new Date(dateString), "MMMM d, yyyy")
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get role display name and color
  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { label: "Admin", color: "bg-red-500" },
      // organizer: { label: "Event Organizer", color: "bg-purple-500" },
      user: { label: "Member and Organizer", color: "bg-purple-500" },
    }

    return roleMap[role] || { label: role, color: "bg-gray-500" }
  }

  const roleBadge = getRoleBadge(user.role)

  return (
    <div className="min-h-screen bg-neutral-50">
       {/*Cover Image Section*/}
      <div
        className="relative h-64 w-full bg-cover bg-center sm:h-80"
        style={{
          backgroundImage: `url('/cover.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-opacity-30"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header with Avatar */}
        <div className="relative -mt-16 flex flex-col items-center sm:-mt-16 sm:flex-row sm:items-end sm:space-x-5">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-green-400 bg-white sm:h-40 sm:w-40">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            {/* Edit Avatar Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-0 transition-all hover:bg-opacity-50">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-transparent text-transparent hover:bg-black/20 hover:text-white"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <div className="mt-1">
              <Badge className={`${roleBadge.color} text-white`}>{roleBadge.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">Member since {formatDate(user.createdAt)}</p>
          </div>

          {/*<div className="mt-6 flex justify-center sm:mt-0">*/}
          {/*  <Link to="/profile/edit">*/}
          {/*    <Button className="flex items-center gap-2">*/}
          {/*      <Edit className="h-4 w-4" />*/}
          {/*      Edit Profile*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info Card */}
          <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Profile Information</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <User className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p className="text-gray-900">{formatDate(user.dateOfBirth)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="text-gray-900">{roleBadge.label}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Management Card */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Management</h2>

            <div className="flex flex-col gap-y-4">
              <Link to="/profile/edit">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>

              <Link to="/profile/email">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Update Email
                </Button>
              </Link>

              <Link to="/profile/password">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </Link>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Account Status</h3>
              <div className="flex items-center">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${user.isDeleted ? "bg-red-500" : "bg-green-500"} mr-2`}
                ></div>
                <span className="text-sm text-gray-700">{user.isDeleted ? "Deactivated" : "Active"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
