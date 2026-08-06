"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date & time",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("09:00");

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      onChange?.(undefined);
      return;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(day);
    combined.setHours(hours, minutes, 0, 0);
    onChange?.(combined);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (value) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const combined = new Date(value);
      combined.setHours(hours, minutes, 0, 0);
      onChange?.(combined);
    }
  };

  const formatted = value
    ? `${format(value, "EEE. d MMM yyyy")}, ${format(value, "h:mm a")}`
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg border border-gray-200 px-3 h-11 text-sm text-left transition-colors hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC8900]/30 focus-visible:border-[#EC8900]",
              !value && "text-gray-400",
              className
            )}
          />
        }
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {formatted ?? placeholder}
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 overflow-hidden"
        align="start"
        side="bottom"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDaySelect}
        />

        {/* Time picker */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-400 shrink-0" />
            <label className="text-xs font-medium text-gray-600 w-10 shrink-0">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 outline-none focus:border-[#EC8900] focus:ring-1 focus:ring-[#EC8900]/30"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
