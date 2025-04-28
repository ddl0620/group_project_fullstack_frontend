"use client"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
    value: string
    onChange: (time: string) => void
    className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
    const minutes = ["00", "15", "30", "45"]

    const [selectedHour, selectedMinute] = value.split(":") || ["00", "00"]

    const handleHourChange = (hour: string) => {
        onChange(`${hour}:${selectedMinute}`)
    }

    const handleMinuteChange = (minute: string) => {
        onChange(`${selectedHour}:${minute}`)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        {value || "Select time"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <div className="flex gap-2">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Hour</p>
                            <Select value={selectedHour} onValueChange={handleHourChange}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hours.map((hour) => (
                                        <SelectItem key={hour} value={hour}>
                                            {hour}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Minute</p>
                            <Select value={selectedMinute} onValueChange={handleMinuteChange}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue placeholder="Minute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {minutes.map((minute) => (
                                        <SelectItem key={minute} value={minute}>
                                            {minute}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
