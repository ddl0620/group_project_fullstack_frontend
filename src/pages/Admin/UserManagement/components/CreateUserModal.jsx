"use client"

import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import { useState, useEffect } from "react"

export default function CreateUserModal({ isOpen, setIsOpen, newUser, setNewUser, handleCreateUser }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [dateValue, setDateValue] = useState(newUser?.dateOfBirth || null)

  useEffect(() => {
    if (newUser?.dateOfBirth) {
      setDateValue(newUser.dateOfBirth)
    }
  }, [newUser?.dateOfBirth])

  const handleDateSelect = (date) => {
    setDateValue(date)
    setNewUser({ ...newUser, dateOfBirth: date })
    setTimeout(() => setIsCalendarOpen(false), 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[98vh] min-h-[700px] h-auto overflow-y-auto sm:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the system. All fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name *</Label>
              <Input
                id="create-name"
                name="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-email">Email Address *</Label>
              <Input
                id="create-email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {/*<div className="space-y-2">*/}
            {/*  <Label htmlFor="create-password">Password *</Label>*/}
            {/*  <Input*/}
            {/*    id="create-password"*/}
            {/*    name="password"*/}
            {/*    type="password"*/}
            {/*    value={newUser.password}*/}
            {/*    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}*/}
            {/*    placeholder="••••••••"*/}
            {/*  />*/}
            {/*</div>*/}

            <div className="space-y-2 relative">
              <Label htmlFor="create-dob">Date of Birth *</Label>
              <div className="relative">
                <Button
                  id="create-dob"
                  name="dateOfBirth"
                  type="button"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dateValue && "text-muted-foreground")}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                </Button>

                {isCalendarOpen && (
                  <div
                    className="absolute z-[9999] mt-1 rounded-md border bg-white shadow-md"
                    style={{
                      position: "absolute",
                      width: "auto",
                      maxHeight: "350px",
                      overflow: "auto",
                      top: "calc(100% + 5px)",
                      left: 0,
                    }}
                  >
                    <CalendarComponent
                      mode="single"
                      selected={dateValue}
                      onSelect={handleDateSelect}
                      initialFocus={false}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="create-role" name="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-maxEvents">Max Events</Label>
              <Input
                id="create-maxEvents"
                name="maxEventCreate"
                type="number"
                value={newUser.maxEventCreate}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    maxEventCreate: Number.parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-maxParticipants">Max Participants</Label>
              <Input
                id="create-maxParticipants"
                name="maxParticipantPerEvent"
                type="number"
                value={newUser.maxParticipantPerEvent}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    maxParticipantPerEvent: Number.parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCreateUser} className="w-full sm:w-auto">
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
