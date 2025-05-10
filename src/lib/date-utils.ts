import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isWithinInterval,
} from "date-fns"

// Get calendar days for a month (including days from prev/next months to fill the grid)
export function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month))
  const end = endOfWeek(endOfMonth(month))

  const days: Date[] = []
  let day = start

  while (day <= end) {
    days.push(day)
    day = addDays(day, 1)
  }

  return days
}

// Get week days headers (Su, Mo, Tu, etc.)
export function getWeekDays(short = true): string[] {
  const now = new Date()
  const start = startOfWeek(now)

  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i)
    return format(day, short ? "EEEEE" : "EEEE")
  })
}

// Check if a date is within a range
export function isDateInRange(date: Date, range: { from?: Date; to?: Date }): boolean {
  if (!range.from) return false
  if (!range.to) return isSameDay(date, range.from)

  return isWithinInterval(date, { start: range.from, end: range.to })
}

// Check if a date is the start of a range
export function isRangeStart(date: Date, range: { from?: Date; to?: Date }): boolean {
  return range.from ? isSameDay(date, range.from) : false
}

// Check if a date is the end of a range
export function isRangeEnd(date: Date, range: { from?: Date; to?: Date }): boolean {
  return range.to ? isSameDay(date, range.to) : false
}

// Format a date range for display
export function formatDateRange(
  range: { from?: Date; to?: Date } | undefined,
  placeholder = "Select date range",
): string {
  if (!range?.from) return placeholder

  if (range.to) {
    return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
  }

  return format(range.from, "LLL dd, y")
}
