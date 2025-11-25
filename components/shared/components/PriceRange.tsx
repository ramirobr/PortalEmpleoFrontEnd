"use client";

import { Slider } from "@/components/ui/slider";

interface PriceRangeProps {
  min?: number;
  max?: number;
  step?: number;
  range: [number, number];
  setRange: (value: [number, number]) => void;
  onCommit?: (value: [number, number]) => void;
}

export function PriceRange({
  min = 10,
  max = 5000,
  step = 100,
  range,
  setRange,
  onCommit,
}: PriceRangeProps) {
  function handleChange(value: number[]) {
    const [newMin, newMax] = value as [number, number];
    if (newMin >= newMax) return;
    setRange([newMin, newMax]);
  }

  function handleCommit(value: number[]) {
    if (!onCommit) return;
    const [newMin, newMax] = value as [number, number];
    onCommit([newMin, newMax]);
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      <Slider
        min={min}
        max={max}
        step={step}
        value={range}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
      />

      <div className="flex justify-between text-sm text-gray-700">
        <span>${range[0]}</span>
        <span>${range[1]}</span>
      </div>
    </div>
  );
}
