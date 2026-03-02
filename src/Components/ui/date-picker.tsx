"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";

/** Valor en formato ISO date (YYYY-MM-DD). */
type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

function toDate(value: string): Date | undefined {
  if (!value?.trim()) return undefined;
  const d = parseISO(value.trim());
  return isValid(d) ? d : undefined;
}

function toISOString(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  id,
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = toDate(value);
  const defaultMonth = date ?? new Date();

  const handleSelect = (d: Date | undefined) => {
    onChange(toISOString(d));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "d MMM yyyy", { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={defaultMonth}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
