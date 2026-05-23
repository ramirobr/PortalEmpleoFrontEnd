"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export type Option<T extends string | number> = { id: T; label: string };

type Props<T extends string | number> = {
  options: Option<T>[];
  value?: T;
  onChange: (id: T) => void;
  placeholder?: string;
  searchPlaceholder?: string; // Kept for backward compatibility
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function SearchAutocomplete<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  searchPlaceholder,
  className,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const displayPlaceholder = searchPlaceholder || placeholder;

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  );

  // Sync input value with selected option when not open
  React.useEffect(() => {
    if (!open) {
      setInputValue(selectedOption?.label ?? "");
    }
  }, [selectedOption, open]);

  const filteredOptions = React.useMemo(() => {
    if (!inputValue || (selectedOption && inputValue === selectedOption.label)) {
      return options;
    }
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue, selectedOption]);

  const handleSelect = (option: Option<T>) => {
    setInputValue(option.label);
    onChange(option.id);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    setOpen(true);
  };

  const uniqueId = React.useId();
  const listboxId = `${id || uniqueId}-listbox`;

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full group">
            <Input
              id={id || uniqueId}
              name={name}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              role="combobox"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              disabled={disabled}
              placeholder={displayPlaceholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className="h-13 bg-surface-highlight border-gray-light hover:bg-surface-container-low pr-10 focus:bg-white transition-all font-normal text-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {inputValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-zinc-100 rounded-full text-gray-dark transition-colors"
                  aria-label="Limpiar selección"
                >
                  <X className="size-3.5 opacity-50" />
                </button>
              )}
              <ChevronsUpDown className="size-4 text-gray-dark opacity-50" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width] overflow-hidden"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="w-full" shouldFilter={false}>
            <CommandList id={listboxId} className="max-h-[300px]">
              <CommandEmpty className="py-6 text-center text-sm text-gray-dark">
                Sin resultados.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.slice(0, 100).map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

