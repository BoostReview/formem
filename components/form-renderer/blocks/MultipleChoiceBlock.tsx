"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface MultipleChoiceBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function MultipleChoiceBlock({ block, value, onChange }: MultipleChoiceBlockProps) {
  const options = block.options || [];
  const hasOther = (block.hasOther as boolean) || false;
  const otherText = (block.otherText as string) || "Autre";
  const helpText = (block.helpText as string) || "";
  const selectedValues = (Array.isArray(value) ? value : []) as string[];
  const [otherValue, setOtherValue] = React.useState("");

  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, option]);
    } else {
      onChange(selectedValues.filter((v) => v !== option));
    }
  };

  const handleOtherChange = (checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, otherValue || "other"]);
    } else {
      onChange(selectedValues.filter((v) => v !== otherValue && v !== "other"));
      setOtherValue("");
    }
  };

  const isOtherChecked = selectedValues.some((v) => v === "other" || (!options.includes(v) && v !== ""));
  const align = getAlignment(block as any)

  return (
    <div className="space-y-5 pt-6">
      <Label className={cn(
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
      <div className="space-y-3">
        {options.map((option, index) => {
          const isChecked = selectedValues.includes(option);
          return (
            <div
              key={index}
              onClick={() => handleChange(option, !isChecked)}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer group"
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
        {hasOther && (
          <div className="space-y-2">
            <div
              onClick={() => handleOtherChange(!isOtherChecked)}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer group"
            >
              <Checkbox
                id={`${block.id}-other`}
                checked={isOtherChecked}
                onCheckedChange={handleOtherChange}
                className="pointer-events-none"
              />
              <Label
                htmlFor={`${block.id}-other`}
                className="font-normal cursor-pointer flex-1 text-base text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100 pointer-events-none"
              >
                {otherText}
              </Label>
            </div>
            {isOtherChecked && (
              <Input
                placeholder={`Précisez votre ${otherText.toLowerCase()}...`}
                value={otherValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setOtherValue(val);
                  // Mettre à jour la valeur dans le tableau
                  const withoutOther = selectedValues.filter((v) => v !== "other" && !options.includes(v));
                  onChange([...withoutOther, val || "other"]);
                }}
                className="ml-6 sm:ml-8 h-12 text-base text-gray-900 dark:text-slate-100 rounded-lg sm:rounded-xl border-0 bg-white dark:bg-slate-700 px-3 sm:px-4 ring-2 ring-gray-200 dark:ring-slate-600 focus:ring-gray-900 dark:focus:ring-slate-300 transition-all duration-200 placeholder:text-gray-400"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

