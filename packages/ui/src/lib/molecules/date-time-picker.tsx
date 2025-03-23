"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "../utils";
import { Button } from "../atoms/button";
import { Calendar } from "../atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "../atoms/input";

export interface DateTimePickerProps {
  value?: Date | string;
  onChange?: (date: Date | string | undefined) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  clearable = true,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? (typeof value === "string" ? new Date(value) : value) : undefined
  );
  const [open, setOpen] = React.useState(false);

  // Format the date for display in the input field
  const formatForDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      const newDate = typeof value === "string" ? new Date(value) : value;
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val) {
      // HTML datetime-local inputs return strings in format "YYYY-MM-DDThh:mm"
      const parsedDate = new Date(val);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        onChange?.(parsedDate);
      }
    } else {
      setDate(undefined);
      onChange?.(undefined);
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Preserve the time from the existing date or set to current time
      if (date) {
        newDate.setHours(date.getHours(), date.getMinutes());
      }
      setDate(newDate);
      onChange?.(newDate);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setDate(undefined);
    onChange?.(undefined);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative flex w-full items-center">
          <Input
            type="datetime-local"
            value={formatForDisplay(date)}
            onChange={handleInputChange}
            className="w-full pr-10"
            placeholder={placeholder}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute right-0 h-full rounded-l-none"
              onClick={() => setOpen(true)}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Open calendar</span>
            </Button>
          </PopoverTrigger>
          {clearable && date && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="absolute right-8 h-full px-2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear date</span>
            </Button>
          )}
        </div>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          alignOffset={5}
          side="bottom"
          sideOffset={5}
          style={{ width: '220px' }}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            initialFocus
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}