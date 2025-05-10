"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PureCalendar } from "./pure-calendar"

interface PureDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: (date: Date) => boolean
  minDate?: Date
  maxDate?: Date
}

export function PureDatePicker({
                                 date,
                                 onDateChange,
                                 placeholder = "Select date",
                                 className,
                                 disabled,
                                 minDate,
                                 maxDate,
                               }: PureDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Handle clicks outside to close the calendar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Toggle calendar visibility
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start border border-neutral-300 bg-white text-left font-normal hover:bg-neutral-50",
          !date && "text-neutral-500",
        )}
        onClick={handleToggle}
        type="button"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : placeholder}
      </Button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 rounded-md border bg-white shadow-md"
          style={{ width: "auto", minWidth: "100%" }}
        >
          <PureCalendar
            mode="single"
            selected={date}
            onSelect={(date) => handleSelect(date as Date)}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  )
}
