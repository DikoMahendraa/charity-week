"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?:       Date;
  onChange?:    (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 h-10 text-sm transition-colors hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC8900]/30 focus-visible:border-[#EC8900]",
              !value ? "text-gray-400" : "text-gray-900"
            )}
          />
        }
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
          {value ? format(value, "d MMM yyyy") : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 overflow-hidden" align="start" side="bottom">
        <Calendar
          mode="single"
          selected={value}
          onSelect={day => { onChange?.(day); setOpen(false); }}
        />
      </PopoverContent>
    </Popover>
  );
}
