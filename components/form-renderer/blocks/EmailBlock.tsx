"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface EmailBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function EmailBlock({ block, value, onChange }: EmailBlockProps) {
  const helpText = (block.helpText as string) || ""
  const confirmEmail = (block.confirmEmail as boolean) || false
  const defaultValue = (block.defaultValue as string) || ""
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
      <Input
        id={block.id}
        type="email"
        placeholder={block.placeholder || "exemple@email.com"}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
      />
      {confirmEmail && (
        <Input
          id={`${block.id}-confirm`}
          type="email"
          placeholder="Confirmez votre email"
          className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
        />
      )}
    </div>
  );
}

