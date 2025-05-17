'use client';

import * as React from 'react';
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
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

export type DateRange = {
  from?: Date;
  to?: Date;
};

type CalendarMode = 'single' | 'range';

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
}: PureCalendarProps) {
  // State for current month view
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    defaultMonth ||
      (mode === 'range' && (selected as DateRange)?.from) ||
      (mode === 'single' && (selected as Date)) ||
      new Date()
  );

  // Get days for the current month
  const days = getCalendarDays(currentMonth);
  const weekDays = getWeekDays();

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
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
      onSelect?.(date);
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
        {/*<div className="flex items-center justify-center">*/}
        {/*  <div className="text-sm font-medium">*/}
        {/*    {format(month, 'MMMM yyyy')}*/}
        {/*  </div>*/}
        {/*</div>*/}

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
