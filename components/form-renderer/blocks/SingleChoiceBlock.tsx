"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface SingleChoiceBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function SingleChoiceBlock({ block, value, onChange }: SingleChoiceBlockProps) {
  const options = block.options || [];
  const hasOther = (block.hasOther as boolean) || false;
  const otherText = (block.otherText as string) || "Autre";
  const helpText = (block.helpText as string) || "";
  const selectedValue = value as string | undefined;
  const [otherValue, setOtherValue] = React.useState("");
  // Utiliser un ref pour garder la dernière valeur envoyée et éviter les doubles appels
  const lastSentValueRef = React.useRef<string | undefined>(selectedValue);

  const isOtherSelected = selectedValue === "other" || (selectedValue && !options.includes(selectedValue));

  // Mettre à jour le ref quand la valeur change
  React.useEffect(() => {
    lastSentValueRef.current = selectedValue;
  }, [selectedValue]);

  const handleChange = (val: string) => {
    console.log("[SingleChoiceBlock] handleChange appelé:", { 
      val, 
      selectedValue, 
      lastSentValue: lastSentValueRef.current,
      isOtherSelected,
      blockId: block.id,
      blockLabel: block.label
    });
    
    // Ne pas déclencher onChange si la valeur est vide
    if (!val || val === "") {
      console.log("[SingleChoiceBlock] Valeur vide, retour early");
      return;
    }
    
    // Si on clique sur le même choix déjà sélectionné, ne rien faire du tout
    // Vérifier à la fois selectedValue (props) et lastSentValueRef (dernière valeur envoyée)
    if (val === selectedValue || val === lastSentValueRef.current) {
      console.log("[SingleChoiceBlock] Même choix déjà sélectionné, retour early - val:", val, "selectedValue:", selectedValue, "lastSentValue:", lastSentValueRef.current);
      return;
    }
    
    // Vérifier aussi si c'est "other" et que "other" est déjà sélectionné
    if (val === "other" && isOtherSelected) {
      console.log("[SingleChoiceBlock] 'other' déjà sélectionné, retour early");
      return;
    }
    
    console.log("[SingleChoiceBlock] Appel onChange avec:", val);
    // Mettre à jour le ref avant d'appeler onChange
    lastSentValueRef.current = val;
    
    if (val === "other") {
      onChange("other");
    } else {
      onChange(val);
    }
  };

  const handleOtherChange = (val: string) => {
    setOtherValue(val);
    onChange(val);
  };

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
      <RadioGroup
        value={isOtherSelected ? "other" : (selectedValue || "")}
        onValueChange={(newValue) => {
          console.log("[SingleChoiceBlock] RadioGroup onValueChange appelé avec:", newValue, "selectedValue actuel:", selectedValue);
          // Ne pas déclencher handleChange si c'est la même valeur
          if (newValue === selectedValue || newValue === lastSentValueRef.current) {
            console.log("[SingleChoiceBlock] RadioGroup: même valeur, on ignore");
            return;
          }
          handleChange(newValue);
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
        {hasOther && (
          <div className="space-y-2">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-slate-600 transition-colors duration-150 cursor-pointer group">
              <RadioGroupItem value="other" id={`${block.id}-other`} />
              <Label
                htmlFor={`${block.id}-other`}
                className="font-normal cursor-pointer flex-1 text-base text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-slate-100"
              >
                {otherText}
              </Label>
            </div>
            {isOtherSelected && (
              <Input
                placeholder={`Précisez votre ${otherText.toLowerCase()}...`}
                value={otherValue}
                onChange={(e) => handleOtherChange(e.target.value)}
                className="ml-8 h-12 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-white dark:bg-slate-700 px-4 ring-2 ring-gray-200 dark:ring-slate-600 focus:ring-gray-900 dark:focus:ring-slate-300 transition-all duration-200 placeholder:text-gray-400"
              />
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
}

