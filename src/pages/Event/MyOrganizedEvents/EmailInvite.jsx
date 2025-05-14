"use client"

import { useState, useEffect } from "react"
import { Send, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CustomAvatar } from "@/components/shared/CustomAvatar"
import { Toast } from "@/helpers/toastService.js"
import { useUser } from '@/hooks/useUser.js'
import { useEvent } from '@/hooks/useEvent.js'

export default function EmailInvite({ event }) {
  const [email, setEmail] = useState("")
  const [selectedUserId, setSelectedUserId] = useState(null) // New state for user ID
  const [isLoading, setIsLoading] = useState(false)
  const [matchingUsers, setMatchingUsers] = useState([])
  const [showMatches, setShowMatches] = useState(false)
  const [users, setUsers] = useState([])
  const [isFetchingUsers, setIsFetchingUsers] = useState(true)
  const [invitedUsers, setInvitedUsers] = useState([])

  const { fetchUsers, getUserById } = useUser()
  const { requestJoinEvent } = useEvent()

  // Fetch users and initialize invited users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsFetchingUsers(true)
        const response = await fetchUsers(1, 1000, true)
        console.log("Fetched users:", response.users)
        if (response.users) {
          setUsers(response.users)
        } else {
          Toast.error("Error", "Failed to fetch users")
        }

        // Initialize invited users from event.participants with status "INVITED"
        if (event?.participants) {
          const invitedParticipants = event.participants.filter(
            (p) => p.status === "INVITED"
          )
          const invitedUsersData = await Promise.all(
            invitedParticipants.map(async (participant) => {
              try {
                const userResponse = await getUserById(participant.userId)
                console.log("Fetched user data:", userResponse)
                if (userResponse.success) {
                  return {
                    avatar: userResponse.content.avatar,
                    email: userResponse.content.email,
                    userId: participant.userId,
                    status: participant.status,
                    date: new Date(participant.invitedAt),
                  }
                }
                return null
              } catch (error) {
                console.error(`Failed to fetch user ${participant.userId}:`, error)
                return null
              }
            })
          )
          setInvitedUsers(invitedUsersData.filter((user) => user !== null))
        }
      } catch (error) {
        Toast.error("Error", "Failed to fetch users. Please try again.")
        console.error("Fetch users error:", error)
      } finally {
        setIsFetchingUsers(false)
      }
    }

    getUsers()
  }, [fetchUsers, event])

  // Search for matching users when email input changes
  useEffect(() => {
    if (isFetchingUsers || email.length <= 1) {
      setMatchingUsers([])
      setShowMatches(false)
      return
    }

    const searchUsers = setTimeout(() => {
      console.log("Users in search effect:", users)
      const matches = users
        .filter(
          (user) =>
            user.email.toLowerCase().includes(email.toLowerCase()) ||
            user.name.toLowerCase().includes(email.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 results

      setMatchingUsers(matches)
      setShowMatches(matches.length > 0)
    }, 300) // Debounce for 300ms

    return () => clearTimeout(searchUsers)
  }, [email, users, isFetchingUsers])

  // Clear selectedUserId when email is manually changed
  useEffect(() => {
    if (email && !users.some((user) => user.email === email && user._id === selectedUserId)) {
      setSelectedUserId(null)
    }
  }, [email, users, selectedUserId])

  const handleInvite = async (e) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      Toast.error("Invalid email", "Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await requestJoinEvent(event._id, {
        userId: selectedUserId,
        status: "INVITED",
      })

      if (!response.success) {
        Toast.error("Error", "Failed to send invitation. Please try again.")
        return
      }
      console.log("Invite response:", response)

      // Check if user is already invited
      if (invitedUsers.some((user) => user.email === email)) {
        Toast.error("Already invited", "This user has already been invited to this event")
      } else {
        // Add to invited users with _id if available
        const newInvitation = {
          email,
          userId: selectedUserId || null, // Include userId if selected
          status: "PENDING",
          date: new Date(),
        }
        setInvitedUsers([...invitedUsers, newInvitation])
        Toast.info("Invitation sent", `Invitation email sent to ${email}`)

        // Clear input and selected user
        setEmail("")
        setSelectedUserId(null)
        setShowMatches(false)
      }
    } catch (error) {
      Toast.error("Error", "Failed to send invitation. Please try again.")
      console.error("Invite error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectUser = (user) => {
    setEmail(user.email)
    setSelectedUserId(user._id) // Store the selected user's _id
    setShowMatches(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Accepted
          </Badge>
        )
      case "DECLINED":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
            <XCircle className="h-3 w-3" />
            Declined
          </Badge>
        )
      case "PENDING":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const removeInvitation = (emailToRemove) => {
    setInvitedUsers(invitedUsers.filter((user) => user.email !== emailToRemove))
    Toast.info("Invitation removed", `Invitation for ${emailToRemove} has been removed`)
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Invite Users by Email</h2>
      <form onSubmit={handleInvite} className="mb-6">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isLoading}
                autoComplete="off"
              />
              {showMatches && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  <ul className="max-h-60 overflow-auto py-1 text-base">
                    {matchingUsers.map((user) => (
                      <li
                        key={user._id} // Use _id as key
                        className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100"
                        onClick={() => selectUser(user)}
                      >
                        <CustomAvatar
                          src={user.avatar}
                          fallbackText={user.name}
                          alt={user.name}
                          className="mr-3 h-8 w-8"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {isLoading ? "Sending..." : "Invite"}
            </Button>
          </div>
        </div>
      </form>

      <h2 className="mb-4 text-lg font-semibold text-gray-800">Invited Users</h2>
      {invitedUsers.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-500">
          No users have been invited yet
        </div>
      ) : (
        <div className="space-y-3">
          {invitedUsers.map((user, index) => (
            <div key={index} className="rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CustomAvatar
                    src={user.avatar}
                    fallbackText={user.email.charAt(0).toUpperCase()}
                    alt={user.email}
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Invited on {user.date.toLocaleDateString()}
                      {user.userId && ` (User ID: ${user.userId})`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">{getStatusBadge(user.status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}