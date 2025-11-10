"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface MultipleChoiceBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function MultipleChoiceBlock({
  block,
  isEditing = false,
  onUpdate,
}: MultipleChoiceBlockProps) {
  const options = block.options || ["Option 1", "Option 2"]
  const helpText = (block.helpText as string) || ""
  const hasOther = (block.hasOther as boolean) || false
  const otherText = (block.otherText as string) || "Autre"
  const align = getAlignment(block as any)

  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    onUpdate?.({ options: newOptions })
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) return
    const newOptions = options.filter((_, i) => i !== index)
    onUpdate?.({ options: newOptions })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    onUpdate?.({ options: newOptions })
  }

  return (
    <div className="w-full space-y-3">
      {isEditing ? (
        <Input
          value={block.label || ""}
          onChange={(e) => onUpdate?.({ label: e.target.value })}
          placeholder="Label du champ"
          className={cn(
            "text-base font-medium h-auto py-1 border-dashed",
            alignmentClasses[align]
          )}
        />
      ) : (
        <Label className={cn(
          "text-base font-medium block",
          alignmentClasses[align]
        )}>
          {block.label || "Choix multiples"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox id={`${block.id}-${index}`} disabled />
            {isEditing ? (
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
                placeholder={`Option ${index + 1}`}
              />
            ) : (
              <Label
                htmlFor={`${block.id}-${index}`}
                className="flex-1 cursor-pointer"
              >
                {option}
              </Label>
            )}
            {isEditing && options.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {hasOther && !isEditing && (
          <div className="flex items-center gap-2">
            <Checkbox id={`${block.id}-other`} disabled />
            <Label htmlFor={`${block.id}-other`} className="flex-1 cursor-pointer">
              {otherText}
            </Label>
          </div>
        )}
      </div>
      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une option
        </Button>
      )}
    </div>
  )
}



