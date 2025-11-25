"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type DatePickerProps = {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal bg-input/30 hover:bg-input/30 hover:text-card-foreground"
          >
            {value ? value.toLocaleDateString() : "Fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
