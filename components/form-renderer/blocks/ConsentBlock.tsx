"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface ConsentBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function ConsentBlock({ block, value, onChange }: ConsentBlockProps) {
  const isChecked = value === true || value === "yes";
  const align = getAlignment(block as any)

  return (
    <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-all duration-200 pt-6">
      <Checkbox
        id={block.id}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked === true)}
        className="mt-1.5"
      />
      <Label htmlFor={block.id} className={cn(
        "text-base cursor-pointer flex-1 leading-relaxed text-gray-700 dark:text-slate-200",
        alignmentClasses[align]
      )}>
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5">*</span>}
      </Label>
    </div>
  );
}

