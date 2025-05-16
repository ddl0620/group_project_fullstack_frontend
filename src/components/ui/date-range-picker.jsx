import { PureDateRangePicker } from './pure-date-range-picker';

// This is a wrapper component that adapts PureDateRangePicker to the interface
// expected by EventDateForm.jsx
export function DateRangePicker({ date, onDateChange, className }) {
  return (
    <PureDateRangePicker
      dateRange={date}
      onDateRangeChange={onDateChange}
      className={className}
      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
    />
  );
}
