import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/lib/date-utils';

export function PureDateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            className
          )}
        >
          {formatDateRange(dateRange)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from ? dateRange.from : new Date()}
          selected={dateRange}
          onSelect={onDateRangeChange}
          disabled={disabled}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
