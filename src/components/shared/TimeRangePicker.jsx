'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';

export function TimePickerDemo({ value, onChange }) {
  const minuteRef = React.useRef(null);
  const hourRef = React.useRef(null);

  // Split the time string into hours and minutes
  const [hour, minute] = value ? value.split(':') : ['', ''];

  const handleHourChange = (e) => {
    const newHour = e.target.value.padStart(2, '0');
    if (isNaN(Number(newHour))) return;

    if (Number(newHour) > 23) {
      onChange('23:' + minute);
      return;
    }

    onChange(newHour + ':' + minute);

    if (e.target.value.length >= 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value.padStart(2, '0');
    if (isNaN(Number(newMinute))) return;

    if (Number(newMinute) > 59) {
      onChange(hour + ':59');
      return;
    }

    onChange(hour + ':' + newMinute);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-1 text-center">
        <Input
          ref={hourRef}
          value={hour}
          onChange={handleHourChange}
          className="w-16 text-center"
          placeholder="HH"
          maxLength={2}
        />
      </div>
      <span className="text-sm">:</span>
      <div className="grid gap-1 text-center">
        <Input
          ref={minuteRef}
          value={minute}
          onChange={handleMinuteChange}
          className="w-16 text-center"
          placeholder="MM"
          maxLength={2}
        />
      </div>
    </div>
  );
}
