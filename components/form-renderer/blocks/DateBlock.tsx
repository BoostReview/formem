"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface DateBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function DateBlock({ block, value, onChange }: DateBlockProps) {
  const helpText = (block.helpText as string) || "";
  const dateType = (block.dateType as "date" | "datetime-local" | "time") || "date";
  const minDate = (block.minDate as string) || undefined;
  const maxDate = (block.maxDate as string) || undefined;
  const defaultValue = (block.defaultValue as string) || undefined;
  const currentValue = (value as string) || defaultValue || "";

  React.useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue]);

  const getInputType = () => {
    if (dateType === "datetime-local") return "datetime-local";
    if (dateType === "time") return "time";
    return "date";
  };

  const align = getAlignment(block as any)

  return (
    <div className="space-y-4 pt-6">
      <Label htmlFor={block.id} className={cn(
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
      <Input
        id={block.id}
        type={getInputType()}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
      />
      {(minDate || maxDate) && (
        <p className="text-xs text-gray-400 text-right">
          {minDate && maxDate
            ? `Entre ${minDate} et ${maxDate}`
            : minDate
            ? `À partir du ${minDate}`
            : `Jusqu'au ${maxDate}`}
        </p>
      )}
    </div>
  );
}

