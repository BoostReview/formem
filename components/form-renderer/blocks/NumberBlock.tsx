"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface NumberBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function NumberBlock({ block, value, onChange }: NumberBlockProps) {
  const helpText = (block.helpText as string) || ""
  const min = (block.min as number) || undefined
  const max = (block.max as number) || undefined
  const step = (block.step as number) || 1
  const decimals = (block.decimals as number) || 0
  const defaultValue = (block.defaultValue as number) || undefined
  const currentValue: number | string | undefined = (value as number | undefined) ?? defaultValue ?? ""

  React.useEffect(() => {
    if (defaultValue !== undefined && value === undefined) {
      onChange(defaultValue)
    }
  }, [defaultValue])

  const formatNumber = (val: number | string): string => {
    if (val === "" || val === undefined || val === null) return ""
    const num = typeof val === "string" ? parseFloat(val) : val
    if (isNaN(num)) return ""
    return decimals > 0 ? num.toFixed(decimals) : num.toString()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      onChange("")
      return
    }
    const numValue = parseFloat(val)
    if (!isNaN(numValue)) {
      // Appliquer min/max
      let finalValue = numValue
      if (min !== undefined && finalValue < min) finalValue = min
      if (max !== undefined && finalValue > max) finalValue = max
      onChange(finalValue)
    }
  }

  const align = getAlignment(block)

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
        type="number"
        placeholder={block.placeholder}
        value={typeof currentValue === "string" || currentValue === undefined ? "" : formatNumber(currentValue)}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
      />
      {(min !== undefined || max !== undefined) && (
        <p className="text-xs text-gray-400 text-right">
          {min !== undefined && max !== undefined
            ? `Entre ${min} et ${max}`
            : min !== undefined
            ? `Minimum: ${min}`
            : `Maximum: ${max}`}
        </p>
      )}
    </div>
  );
}

