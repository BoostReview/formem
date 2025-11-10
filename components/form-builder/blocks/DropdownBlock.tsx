"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface DropdownBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function DropdownBlock({
  block,
  isEditing = false,
  onUpdate,
}: DropdownBlockProps) {
  const options = block.options || ["Option 1", "Option 2"]
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
          {block.label || "Liste déroulante"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      {isEditing ? (
        <div className="space-y-2 border-2 border-dashed border-muted-foreground/40 rounded-lg p-4">
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && (
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
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une option
          </Button>
        </div>
      ) : (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une option..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

