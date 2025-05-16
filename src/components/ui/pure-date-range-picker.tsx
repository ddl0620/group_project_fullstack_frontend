import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DateRange } from './pure-calendar';

interface PureDateRangePickerProps {
  date?: DateRange;
  onDateChange?: (dateRange: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: number;
  darkMode?: boolean;
}

export function PureDateRangePicker({
                                      date,
                                      onDateChange,
                                      placeholder = 'Select date range',
                                      className,
                                      disabled,
                                      minDate,
                                      maxDate,
                                      numberOfMonths = 2,
                                      darkMode = false,
                                    }: PureDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onDateChange?.(range);
  };

  const formatDisplayDate = () => {
    if (!date?.from) return placeholder;

    if (date.to) {
      return `${format(date.from, 'MMM dd, yyyy')} - ${format(date.to, 'MMM dd, yyyy')}`;
    }

    return format(date.from, 'MMM dd, yyyy');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        variant="outline"
        className={cn(
          'w-full justify-start text-left font-normal',
          darkMode
            ? 'border-gray-700 bg-black text-white hover:bg-gray-900 hover:text-white'
            : 'border border-neutral-300 bg-white hover:bg-neutral-50',
          !date?.from && cn(darkMode ? 'text-gray-400' : 'text-neutral-500')
        )}
        onClick={handleToggle}
        type="button"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDisplayDate()}
      </Button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 rounded-md border shadow-md',
            darkMode
              ? 'border-gray-700 bg-black text-white'
              : 'border-gray-200 bg-white'
          )}
          style={{
            width: 'auto',
            minWidth: numberOfMonths > 1 ? '600px' : '300px',
          }}
        >
          <CustomCalendar
            mode="range"
            selected={date}
            onSelect={(range) => handleSelect(range as DateRange)}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            numberOfMonths={numberOfMonths}
            defaultMonth={date?.from}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
}

function CustomCalendar({
                          mode = 'range',
                          selected,
                          onSelect,
                          disabled,
                          minDate,
                          maxDate,
                          numberOfMonths = 2,
                          defaultMonth,
                          darkMode = false,
                        }: {
  mode?: 'single' | 'range';
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: number;
  defaultMonth?: Date;
  darkMode?: boolean;
}) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    defaultMonth ||
    (mode === 'range' && (selected as DateRange)?.from) ||
    new Date()
  );

  const getMonthName = (date: Date) => {
    return format(date, 'MMMM yyyy');
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const renderMonths = () => {
    return Array.from({ length: numberOfMonths }).map((_, index) => {
      const monthToRender = addMonths(currentMonth, index);
      return (
        <div key={index} className="month-container">
          <div className="mb-4 text-center font-medium">
            {getMonthName(monthToRender)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div
                key={day}
                className={cn(
                  'py-1 text-center text-sm',
                  darkMode ? 'text-gray-500' : 'text-gray-600'
                )}
              >
                {day}
              </div>
            ))}
            {renderDaysInMonth(monthToRender)}
          </div>
        </div>
      );
    });
  };

  const renderDaysInMonth = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const firstDayOfWeek = firstDay.getDay();

    const daysFromPrevMonth = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const day = new Date(
        month.getFullYear(),
        month.getMonth(),
        -firstDayOfWeek + i + 1
      );
      return renderDay(day, true);
    });

    const daysInMonth = Array.from({ length: lastDay.getDate() }, (_, i) => {
      const day = new Date(month.getFullYear(), month.getMonth(), i + 1);
      return renderDay(day, false);
    });

    const remainingCells = (7 - ((firstDayOfWeek + lastDay.getDate()) % 7)) % 7;
    const daysFromNextMonth = Array.from({ length: remainingCells }, (_, i) => {
      const day = new Date(month.getFullYear(), month.getMonth() + 1, i + 1);
      return renderDay(day, true);
    });

    return [...daysFromPrevMonth, ...daysInMonth, ...daysFromNextMonth];
  };

  const isInRange = (date: Date) => {
    if (mode !== 'range' || !selected) return false;
    const range = selected as DateRange;
    if (!range.from) return false;
    if (!range.to) return isSameDay(date, range.from);
    return date >= range.from && date <= range.to;
  };

  const isRangeStart = (date: Date) => {
    if (mode !== 'range' || !selected) return false;
    const range = selected as DateRange;
    return range.from ? isSameDay(date, range.from) : false;
  };

  const isRangeEnd = (date: Date) => {
    if (mode !== 'range' || !selected) return false;
    const range = selected as DateRange;
    return range.to ? isSameDay(date, range.to) : false;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (disabled && disabled(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isCurrentMonth = (date: Date, month: Date) => {
    return (
      date.getMonth() === month.getMonth() &&
      date.getFullYear() === month.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const range = selected as DateRange | undefined;

    if (!range?.from) {
      onSelect?.({ from: date });
    } else if (!range.to && date >= range.from) {
      onSelect?.({ ...range, to: date });
    } else {
      onSelect?.({ from: date });
    }
  };

  const renderDay = (date: Date, isOutsideMonth: boolean) => {
    const isSelected =
      mode === 'single' && selected && isSameDay(date, selected as Date);
    const inRange = isInRange(date);
    const isStart = isRangeStart(date);
    const isEnd = isRangeEnd(date);
    const disabled = isDateDisabled(date);
    const today = isToday(date);

    return (
      <button
        key={date.toISOString()}
        type="button"
        disabled={disabled}
        onClick={() => handleDateClick(date)}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md text-sm',
          isOutsideMonth &&
          (darkMode
            ? 'text-gray-600 opacity-50'
            : 'text-gray-400 opacity-50'),
          disabled && 'cursor-not-allowed opacity-30',
          !isOutsideMonth &&
          !disabled &&
          !isSelected &&
          !inRange &&
          (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'),
          today &&
          !isSelected &&
          !inRange &&
          (darkMode ? 'border border-gray-600' : 'border border-gray-300'),
          isSelected && 'bg-blue-500 text-white',
          inRange &&
          !isStart &&
          !isEnd &&
          (darkMode ? 'bg-gray-800' : 'bg-blue-100'),
          isStart && 'rounded-l-md bg-gray-700 text-white',
          isEnd && 'rounded-r-md bg-gray-700 text-white',
          darkMode ? 'text-white' : 'text-gray-900'
        )}
      >
        {date.getDate()}
      </button>
    );
  };

  return (
    <div
      className={cn(
        'p-4',
        darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={cn(
            'rounded-md p-2',
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          )}
        >
          <span className="sr-only">Previous month</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="text-sm font-medium">
          {getMonthName(currentMonth)}
          {numberOfMonths > 1 &&
            ` - ${getMonthName(addMonths(currentMonth, numberOfMonths - 1))}`}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            'rounded-md p-2',
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          )}
        >
          <span className="sr-only">Next month</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          'grid gap-8',
          numberOfMonths > 1 ? 'grid-cols-2' : 'grid-cols-1'
        )}
      >
        {renderMonths()}
      </div>
    </div>
  );
}