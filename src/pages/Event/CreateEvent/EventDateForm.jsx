import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PureDateRangePicker } from '@/components/ui/pure-date-range-picker.js';

export default function EventDateForm({ formData, handleChange }) {
  // Parse initial times from formData
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString ? timeString.split(':') : ['09', '00'];
    return { hours, minutes };
  };

  const startTimeParsed = parseTime(formData.startTime || '09:00');
  const endTimeParsed = parseTime(formData.endTime || '17:00');

  // Separate state for hours and minutes
  const [startHour, setStartHour] = useState(startTimeParsed.hours);
  const [startMinute, setStartMinute] = useState(startTimeParsed.minutes);
  const [endHour, setEndHour] = useState(endTimeParsed.hours);
  const [endMinute, setEndMinute] = useState(endTimeParsed.minutes);

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0')
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  // Combine hours and minutes into time strings
  const formatTime = (hours, minutes) => `${hours}:${minutes}`;

  // Update parent component when times change
  useEffect(() => {
    const startTime = formatTime(startHour, startMinute);
    const endTime = formatTime(endHour, endMinute);

    handleChange('startTime', startTime);
    handleChange('endTime', endTime);
    // Remove handleChange from dependencies to prevent infinite loop
  }, [startHour, startMinute, endHour, endMinute]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
          <Label>Event Date Range</Label>
        </div>
        <PureDateRangePicker
          date={formData.dateRange}
          onDateChange={(range) => handleChange('dateRange', range)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Clock className="text-muted-foreground mr-2 h-4 w-4" />
            <Label>Start Time</Label>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label
                htmlFor="startHour"
                className="text-muted-foreground mb-1 block text-xs"
              >
                Hour
              </Label>
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger id="startHour" className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={`start-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="startMinute"
                className="text-muted-foreground mb-1 block text-xs"
              >
                Minute
              </Label>
              <Select value={startMinute} onValueChange={setStartMinute}>
                <SelectTrigger id="startMinute" className="w-full">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={`start-minute-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Clock className="text-muted-foreground mr-2 h-4 w-4" />
            <Label>End Time</Label>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label
                htmlFor="endHour"
                className="text-muted-foreground mb-1 block text-xs"
              >
                Hour
              </Label>
              <Select value={endHour} onValueChange={setEndHour}>
                <SelectTrigger id="endHour" className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={`end-hour-${hour}`} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="endMinute"
                className="text-muted-foreground mb-1 block text-xs"
              >
                Minute
              </Label>
              <Select value={endMinute} onValueChange={setEndMinute}>
                <SelectTrigger id="endMinute" className="w-full">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={`end-minute-${minute}`} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground text-sm">
        Selected time: {formatTime(startHour, startMinute)} -{' '}
        {formatTime(endHour, endMinute)}
      </div>
    </div>
  );
}
