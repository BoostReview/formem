"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface MultipleChoiceBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function MultipleChoiceBlock({ block, value, onChange }: MultipleChoiceBlockProps) {
  const options = block.options || [];
  const selectedValues = (Array.isArray(value) ? value : []) as string[];

  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, option]);
    } else {
      onChange(selectedValues.filter((v) => v !== option));
    }
  };

  return (
    <div className="space-y-5">
      <Label className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      <div className="space-y-3">
        {options.map((option, index) => {
          const isChecked = selectedValues.includes(option);
          return (
            <div
              key={index}
              onClick={() => handleChange(option, !isChecked)}
              className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer group"
            >
              <Checkbox
                id={`${block.id}-${index}`}
                checked={isChecked}
                onCheckedChange={(checked) => handleChange(option, checked === true)}
                className="pointer-events-none"
              />
              <Label
                htmlFor={`${block.id}-${index}`}
                className="font-normal cursor-pointer flex-1 text-base text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100 pointer-events-none"
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

