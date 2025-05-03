"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export function DateRangePicker({ date, onDateChange, className }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const calendarRef = React.useRef(null)

  // Handle clicks outside the calendar to close it
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false)
      }
    }

    // Add event listener when calendar is open
    if (isCalendarOpen) {
      // Use mousedown instead of click for better interaction
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCalendarOpen])

  // Prevent event propagation to Dialog
  const handleCalendarClick = (e) => {
    // Stop propagation to prevent Dialog from capturing the event
    e.stopPropagation()
  }

  return (
    <div className={cn("grid gap-2 relative", className)}>
      <Button
        id="date"
        variant="outline"
        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </Button>

      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute z-[9999] mt-1 bg-white border rounded-md shadow-lg"
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: 0,
            width: "auto",
          }}
          onClick={handleCalendarClick}
          onMouseDown={handleCalendarClick}
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus={false}
          />
        </div>
      )}
    </div>
  )
}
