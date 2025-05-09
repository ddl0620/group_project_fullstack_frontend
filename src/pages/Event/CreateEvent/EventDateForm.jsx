"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventDateForm({ formData, handleChange }) {
  // Initialize with values from formData or defaults
  const [startTime, setStartTime] = useState(formData.startTime || "09:00")
  const [endTime, setEndTime] = useState(formData.endTime || "17:00")

  // Time options for the dropdowns
  const timeOptions = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ]

  // Update parent component when times change
  useEffect(() => {
    handleChange("startTime", startTime)
    handleChange("endTime", endTime)
  }, [startTime, endTime])

  // Handle time selection
  const handleStartTimeChange = (value) => {
    setStartTime(value)
  }

  const handleEndTimeChange = (value) => {
    setEndTime(value)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <Label>Event Date Range</Label>
        </div>
        <DateRangePicker date={formData.dateRange} onDateChange={(range) => handleChange("dateRange", range)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Label htmlFor="startTime">Start Time</Label>
          </div>
          <Select value={startTime} onValueChange={handleStartTimeChange}>
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Label htmlFor="endTime">End Time</Label>
          </div>
          <Select value={endTime} onValueChange={handleEndTimeChange}>
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
