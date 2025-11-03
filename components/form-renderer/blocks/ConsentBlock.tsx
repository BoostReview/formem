"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface ConsentBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function ConsentBlock({ block, value, onChange }: ConsentBlockProps) {
  const isChecked = value === true || value === "yes";

  return (
    <div className="flex items-start space-x-4 p-5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-all duration-200">
      <Checkbox
        id={block.id}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked === true)}
        className="mt-1.5"
      />
      <Label htmlFor={block.id} className="text-base cursor-pointer flex-1 leading-relaxed text-gray-700 dark:text-slate-200">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5">*</span>}
      </Label>
    </div>
  );
}

