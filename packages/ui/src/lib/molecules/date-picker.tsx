"use client";

import * as React from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { cn } from "../utils";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";

export interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | string | undefined) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  clearable = true,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? (typeof value === "string" ? new Date(value) : value) : undefined
  );

  // Format the date for display in the input field
  const formatForDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
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
      // HTML date inputs return strings in format "YYYY-MM-DD"
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

  const handleClear = () => {
    setDate(undefined);
    onChange?.(undefined);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex w-full items-center">
        <Input
          type="date"
          value={formatForDisplay(date)}
          onChange={handleInputChange}
          className="w-full pr-10"
          placeholder={placeholder}
        />
        {clearable && date && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="absolute right-0 h-full px-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear date</span>
          </Button>
        )}
      </div>
    </div>
  );
}