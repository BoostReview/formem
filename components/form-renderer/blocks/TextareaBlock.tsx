"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface TextareaBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function TextareaBlock({ block, value, onChange }: TextareaBlockProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor={block.id} className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      <Textarea
        id={block.id}
        placeholder={block.placeholder}
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="resize-none rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 py-3 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-base text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
      />
    </div>
  );
}

