"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface SliderBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function SliderBlock({ block, value, onChange }: SliderBlockProps) {
  const min = (block.min as number) || 0;
  const max = (block.max as number) || 100;
  const step = (block.step as number) || 1;
  const currentValue = (value as number) ?? min;

  return (
    <div className="space-y-6">
      <Label className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      <div className="space-y-5">
        <div className="px-2">
          <Slider
            value={[currentValue]}
            onValueChange={([val]) => onChange(val)}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-slate-400 font-medium">{min}</span>
          <span className="font-semibold text-xl text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800 px-5 py-2 rounded-xl">
            {currentValue}
          </span>
          <span className="text-gray-500 dark:text-slate-400 font-medium">{max}</span>
        </div>
      </div>
    </div>
  );
}

