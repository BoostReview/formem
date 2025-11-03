"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface SingleChoiceBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function SingleChoiceBlock({
  block,
  isEditing = false,
  onUpdate,
}: SingleChoiceBlockProps) {
  const options = block.options || ["Option 1", "Option 2"]

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
      <Label className="text-base font-medium">
        {block.label || "Choix unique"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <RadioGroup value="">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <RadioGroupItem value={option} id={`${block.id}-${index}`} disabled />
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
      </RadioGroup>
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


