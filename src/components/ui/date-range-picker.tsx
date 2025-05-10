"use client"

import { PureDateRangePicker } from "./pure-date-range-picker"

// This component has the same interface as expected by EventDateForm.jsx
export function DateRangePicker({ date, onDateChange, className }) {
  return (
    <PureDateRangePicker
      date={date}
      onDateChange={onDateChange}
      className={className}
      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
      darkMode={true}
    />
  )
}
