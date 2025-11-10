"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface SliderBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function SliderBlock({ block, value, onChange }: SliderBlockProps) {
  const helpText = (block.helpText as string) || "";
  const min = (block.min as number) || 0;
  const max = (block.max as number) || 100;
  const step = (block.step as number) || 1;
  const minLabel = (block.minLabel as string) || min.toString();
  const maxLabel = (block.maxLabel as string) || max.toString();
  const defaultValue = (block.defaultValue as number) || min;
  const currentValue = (value as number) ?? defaultValue;

  React.useEffect(() => {
    if (defaultValue !== undefined && value === undefined) {
      onChange(defaultValue);
    }
  }, [defaultValue]);

  const align = getAlignment(block as any)

  return (
    <div className="space-y-6 pt-6">
      <Label className={cn(
        "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
        alignmentClasses[align]
      )}>
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      {helpText && (
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          {helpText}
        </p>
      )}
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
          <span className="text-gray-500 dark:text-slate-400 font-medium" title={`Minimum: ${min}`}>
            {minLabel}
          </span>
          <span 
            className="font-semibold text-xl text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-800 px-5 py-2 rounded-xl"
            title={`Valeur actuelle: ${currentValue}`}
          >
            {currentValue}
          </span>
          <span className="text-gray-500 dark:text-slate-400 font-medium" title={`Maximum: ${max}`}>
            {maxLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

