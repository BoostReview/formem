"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface TextareaBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function TextareaBlock({ block, value, onChange }: TextareaBlockProps) {
  const helpText = (block.helpText as string) || ""
  const minLength = (block.minLength as number) || undefined
  const maxLength = (block.maxLength as number) || undefined
  const defaultValue = (block.defaultValue as string) || ""
  const rows = (block.rows as number) || 5
  const currentValue = (value as string) || defaultValue

  React.useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue)
    }
  }, [defaultValue])

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
      <Textarea
        id={block.id}
        placeholder={block.placeholder}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        className="resize-none rounded-lg sm:rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-3 sm:px-4 py-3 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-base text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
      />
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">
          {currentValue.length} / {maxLength} caractères
        </p>
      )}
    </div>
  );
}

