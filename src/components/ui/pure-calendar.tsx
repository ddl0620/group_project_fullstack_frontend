'use client';

import * as React from 'react';
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isAfter,
  isBefore,
  isSameMonth,
  startOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  getCalendarDays,
  getWeekDays,
  isDateInRange,
  isRangeStart,
  isRangeEnd,
} from '@/lib/date-utils';

type CalendarMode = 'single' | 'multiple' | 'range';

type DateRange = {
  from?: Date;
  to?: Date;
};

interface PureCalendarProps {
  mode?: CalendarMode;
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  numberOfMonths?: number;
  defaultMonth?: Date;
  showYearInput?: boolean;
  minYear?: number;
  maxYear?: number;
  onMonthChange?: (date: Date) => void;
}

interface DayProps {
  day: Date;
  selected?: Date | DateRange;
  disabled?: (date: Date) => boolean;
  mode?: CalendarMode;
  onSelect?: (date: Date | DateRange | undefined) => void;
}

function Day({ day, selected, disabled, mode, onSelect }: DayProps) {
  const isSelected =
    mode === 'single'
      ? selected instanceof Date
        ? isSameDay(day, selected)
        : false
      : mode === 'range'
        ? isDateInRange(day, selected as DateRange)
        : false;

  const isStart =
    mode === 'range' ? isRangeStart(day, selected as DateRange) : false;
  const isEnd =
    mode === 'range' ? isRangeEnd(day, selected as DateRange) : false;

  const isDisabled = disabled?.(day) || isAfter(day, new Date());

  const handleSelect = () => {
    if (isDisabled) {
      return;
    }

    if (mode === 'single') {
      onSelect?.(day);
    } else if (mode === 'range') {
      if (!(selected as DateRange)?.from) {
        onSelect?.({ from: day, to: undefined });
      } else if (
        !(selected as DateRange)?.to &&
        isBefore(day, (selected as DateRange).from)
      ) {
        onSelect?.({ from: day, to: (selected as DateRange).from });
      } else {
        onSelect?.({ from: (selected as DateRange).from, to: day });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        isSelected &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        isStart &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-l-md',
        isEnd &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-r-md',
        isDisabled && 'pointer-events-none opacity-50'
      )}
      onClick={handleSelect}
      disabled={isDisabled}
    >
      {format(day, 'd')}
    </Button>
  );
}

interface MonthProps {
  month: Date;
  selected?: Date | DateRange;
  disabled?: (date: Date) => boolean;
  mode?: CalendarMode;
  onSelect?: (date: Date | DateRange | undefined) => void;
}

function Month({ month, selected, disabled, mode, onSelect }: MonthProps) {
  const days = getCalendarDays(month);
  const weekDays = getWeekDays();

  return (
    <div className="rounded-md border shadow-sm">
      <div className="flex flex-col space-y-2 p-4">
        <div className="flex items-center justify-center">
          <div className="text-sm font-semibold">
            {format(month, 'MMMM yyyy')}
          </div>
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((weekDay) => (
            <div
              key={weekDay}
              className="text-muted-foreground text-center text-xs"
            >
              {weekDay}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <Day
              key={day.getTime()}
              day={day}
              selected={selected}
              disabled={disabled}
              mode={mode}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PureCalendar({
  mode = 'single',
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  className,
  numberOfMonths = 1,
  defaultMonth,
  showYearInput = false,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  onMonthChange,
}: PureCalendarProps) {
  // State for current month view
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    defaultMonth ||
      (mode === 'range' && (selected as DateRange)?.from) ||
      (mode === 'single' && (selected as Date)) ||
      new Date()
  );

  // Add state for year input
  const [yearInput, setYearInput] = React.useState<string>(
    currentMonth.getFullYear().toString()
  );
  const [yearError, setYearError] = React.useState<string>('');

  // Get days for the current month
  const days = getCalendarDays(currentMonth);
  const weekDays = getWeekDays();

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setYearInput(newMonth.getFullYear().toString());
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setYearInput(newMonth.getFullYear().toString());
    onMonthChange?.(newMonth);
  };

  // Handle year input change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInput(value);

    const year = Number.parseInt(value, 10);
    if (!isNaN(year) && year >= minYear && year <= maxYear) {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(year);
      setCurrentMonth(newDate);
      setYearError('');
      onMonthChange?.(newDate);
    } else if (value && (isNaN(year) || year < minYear || year > maxYear)) {
      setYearError(`Year must be between ${minYear} and ${maxYear}`);
    }
  };

  // Handle year update on Enter
  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const year = Number.parseInt(yearInput, 10);
      if (!isNaN(year) && year >= minYear && year <= maxYear) {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(year);
        setCurrentMonth(newDate);
        setYearError('');
        onMonthChange?.(newDate);
      } else {
        setYearError(`Year must be between ${minYear} and ${maxYear}`);
      }
    }
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date): boolean => {
    if (disabled && disabled(date)) return true;
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, startOfDay(maxDate))) return true;
    return false;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === 'single') {
      // Call onSelect without closing the popover
      onSelect?.(date);
      // We don't need to do anything else here to keep the calendar open
    } else if (mode === 'range') {
      const range = selected as DateRange | undefined;

      if (!range?.from) {
        onSelect?.({ from: date });
      } else if (!range.to && isAfter(date, range.from)) {
        onSelect?.({ ...range, to: date });
      } else {
        onSelect?.({ from: date });
      }
    }
  };

  // Render multiple months
  const renderMonths = () => {
    return Array.from({ length: numberOfMonths }).map((_, index) => {
      const monthToRender = addMonths(currentMonth, index);
      return renderMonth(monthToRender);
    });
  };

  // Render a single month
  const renderMonth = (month: Date) => {
    const monthDays = getCalendarDays(month);

    return (
      <div key={month.toISOString()} className="space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day, index) => (
            <div
              key={day + index}
              className="py-1 text-xs font-medium text-neutral-500"
            >
              {day}
            </div>
          ))}

          {monthDays.map((day) => {
            const isOutsideMonth = !isSameMonth(day, month);
            const isSelectedSingle =
              mode === 'single' && selected && isSameDay(day, selected as Date);

            const isInRange =
              mode === 'range' && isDateInRange(day, selected as DateRange);
            const isRangeStartDate =
              mode === 'range' && isRangeStart(day, selected as DateRange);
            const isRangeEndDate =
              mode === 'range' && isRangeEnd(day, selected as DateRange);

            const isDisabled = isDateDisabled(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'relative h-9 w-full p-0',
                  isOutsideMonth && 'text-neutral-300',
                  isDisabled && 'cursor-not-allowed text-neutral-300 opacity-50'
                )}
              >
                <button
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled}
                  className={cn(
                    'mx-auto flex h-9 w-9 items-center justify-center rounded-md p-0 text-sm font-normal aria-selected:opacity-100',
                    isToday &&
                      !isSelectedSingle &&
                      !isInRange &&
                      'border border-neutral-200',
                    isSelectedSingle &&
                      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                    isInRange &&
                      !isRangeStartDate &&
                      !isRangeEndDate &&
                      'bg-neutral-100',
                    isRangeStartDate &&
                      'bg-primary text-primary-foreground rounded-l-md',
                    isRangeEndDate &&
                      'bg-primary text-primary-foreground rounded-r-md',
                    !isSelectedSingle &&
                      !isInRange &&
                      !isDisabled &&
                      !isOutsideMonth &&
                      'hover:bg-neutral-100'
                  )}
                >
                  {format(day, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('p-3', className)}>
      {showYearInput && (
        <div className="flex flex-col px-4 py-2">
          {/* Year Input */}
          <div className="mb-2 flex items-center gap-2">
            <label
              htmlFor="year-input"
              className="text-sm font-medium text-gray-700"
            >
              Year:
            </label>
            <input
              id="year-input"
              type="number"
              value={yearInput}
              onChange={handleYearChange}
              onKeyDown={handleYearKeyDown}
              min={minYear}
              max={maxYear}
              className={cn(
                'focus:ring-primary-500 focus:border-primary-500 w-20 rounded border px-2 py-1 text-black',
                yearError && 'border-red-500'
              )}
            />
          </div>
          {yearError && <p className="text-xs text-red-500">{yearError}</p>}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>

        <div className="text-sm font-medium">
          {numberOfMonths > 1
            ? `${format(currentMonth, 'MMMM yyyy')} - ${format(addMonths(currentMonth, numberOfMonths - 1), 'MMMM yyyy')}`
            : format(currentMonth, 'MMMM yyyy')}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className={cn('grid gap-6', numberOfMonths > 1 && 'grid-cols-2')}>
        {renderMonths()}
      </div>
    </div>
  );
}
