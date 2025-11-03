"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { FormBlock } from "@/types";

interface SingleChoiceBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function SingleChoiceBlock({ block, value, onChange }: SingleChoiceBlockProps) {
  const options = block.options || [];
  const selectedValue = value as string | undefined;

  return (
    <div className="space-y-5">
      <Label className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight">
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      <RadioGroup
        value={selectedValue || ""}
        onValueChange={(val) => {
          if (val) {
            onChange(val);
          }
        }}
        className="space-y-3"
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer group"
          >
            <RadioGroupItem value={option} id={`${block.id}-${index}`} />
            <Label
              htmlFor={`${block.id}-${index}`}
              className="font-normal cursor-pointer flex-1 text-base text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

