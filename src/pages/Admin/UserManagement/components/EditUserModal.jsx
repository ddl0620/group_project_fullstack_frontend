"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { PureCalendar } from '@/components/ui/pure-calendar.js';

export default function EditUserModal({ isOpen, setIsOpen, editUser, setEditUser, handleEditUser }) {
  // Separate state for date to avoid issues with the calendar component
  const [date, setDate] = useState(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Initialize date when editUser changes
  useEffect(() => {
    if (editUser?.dateOfBirth) {
      try {
        const parsedDate = new Date(editUser.dateOfBirth)
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate)
        }
      } catch (e) {
        console.error("Error parsing date:", e)
        setDate(null)
      }
    } else {
      setDate(null)
    }
  }, [editUser])

  // Handle date selection
  const handleDateChange = (newDate) => {
    setDate(newDate)
    // Update the editUser state with the new date
    if (newDate && editUser) {
      setEditUser({
        ...editUser,
        dateOfBirth: newDate,
      })
    }
    // Close the calendar after selection to avoid focus issues
    setTimeout(() => {
      setIsCalendarOpen(false)
    }, 100)
  }

  if (!editUser) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[95vh] h-auto min-h-[600px] overflow-y-auto sm:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information. Email cannot be changed.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                name="edit-name"
                value={editUser.name || ""}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" name="edit-email" value={editUser.email || ""} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date-picker">Date of Birth *</Label>
              {/* Use a custom implementation instead of the Popover component */}
              <div className="relative">
                <Button
                  type="button"
                  id="date-picker"
                  name="date-picker"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>

                {isCalendarOpen && (
                  <div
                    className="absolute z-[9999] mt-1 bg-white border rounded-md shadow-lg"
                    style={{
                      maxHeight: "300px",
                      overflow: "auto",
                      position: "absolute",
                      top: "calc(100% + 5px)",
                      left: 0,
                      width: "100%",
                    }}
                  >
                    <PureCalendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus={false}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editUser.role || ""} onValueChange={(value) => setEditUser({ ...editUser, role: value })}>
                <SelectTrigger id="edit-role" name="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-maxEvents">Max Events</Label>
              <Input
                id="edit-maxEvents"
                name="edit-maxEvents"
                type="number"
                value={editUser.maxEventCreate || 0}
                onChange={(e) => setEditUser({ ...editUser, maxEventCreate: Number.parseInt(e.target.value) })}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maxParticipants">Max Participants</Label>
              <Input
                id="edit-maxParticipants"
                name="edit-maxParticipants"
                type="number"
                value={editUser.maxParticipantPerEvent || 0}
                onChange={(e) => setEditUser({ ...editUser, maxParticipantPerEvent: Number.parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-status"
                name="edit-status"
                checked={!editUser.isDeleted}
                onCheckedChange={(checked) => setEditUser({ ...editUser, isDeleted: !checked })}
              />
              <Label htmlFor="edit-status">Active Account</Label>
            </div>
            <p className="text-xs text-gray-500">Uncheck to deactivate this user account.</p>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleEditUser} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
