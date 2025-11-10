"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface DateBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function DateBlock({ block, isEditing = false, onUpdate }: DateBlockProps) {
  const helpText = (block.helpText as string) || ""
  const dateType = (block.dateType as "date" | "datetime-local" | "time") || "date"
  const minDate = (block.minDate as string) || undefined
  const maxDate = (block.maxDate as string) || undefined
  const defaultValue = (block.defaultValue as string) || undefined

  const getInputType = () => {
    if (dateType === "datetime-local") return "datetime-local"
    if (dateType === "time") return "time"
    return "date"
  }

  const align = getAlignment(block as any)

  return (
    <div className="w-full space-y-2">
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
          {block.label || "Date"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <Input
        type={getInputType()}
        defaultValue={defaultValue}
        min={minDate}
        max={maxDate}
        disabled={!isEditing}
        className="w-full"
      />
      {(minDate || maxDate) && !isEditing && (
        <p className="text-xs text-muted-foreground text-right">
          {minDate && maxDate
            ? `Entre ${minDate} et ${maxDate}`
            : minDate
            ? `À partir du ${minDate}`
            : `Jusqu'au ${maxDate}`}
        </p>
      )}
    </div>
  )
}



