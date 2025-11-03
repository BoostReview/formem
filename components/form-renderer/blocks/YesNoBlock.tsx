"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface YesNoBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function YesNoBlock({ block, value, onChange }: YesNoBlockProps) {
  const isChecked = value === true || value === "yes" || value === "oui";

  return (
    <div 
      onClick={() => onChange(isChecked ? "no" : "yes")}
      className="flex items-center justify-between space-x-4 p-5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer"
    >
      <Label htmlFor={block.id} className="text-lg sm:text-xl font-medium cursor-pointer flex-1 text-gray-900 dark:text-slate-100 leading-tight pointer-events-none">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      <Switch
        id={block.id}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked ? "yes" : "no")}
        className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-slate-300 scale-110 pointer-events-none"
      />
    </div>
  );
}

