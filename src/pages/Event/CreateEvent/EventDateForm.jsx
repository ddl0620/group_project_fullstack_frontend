"use client"

import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export default function EventDateForm({ formData, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <Label>Event Date Range</Label>
        </div>
        <DateRangePicker date={formData.dateRange} onDateChange={(range) => handleChange("dateRange", range)} />
      </div>
    </div>
  )
}
