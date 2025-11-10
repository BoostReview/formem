"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface SliderBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function SliderBlock({ block, isEditing = false, onUpdate }: SliderBlockProps) {
  const helpText = (block.helpText as string) || ""
  const min = typeof block.min === "number" ? block.min : 0
  const max = typeof block.max === "number" ? block.max : 100
  const step = typeof block.step === "number" ? block.step : 1
  const minLabel = (block.minLabel as string) || min.toString()
  const maxLabel = (block.maxLabel as string) || max.toString()
  const defaultValue = (block.defaultValue as number) || Math.floor((min + max) / 2)
  const [value, setValue] = React.useState([defaultValue])
  const align = getAlignment(block as any)

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
          {block.label || "Curseur"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <Slider
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={isEditing}
        className="w-full"
      />
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{minLabel}</span>
        <span className="font-semibold text-base bg-muted px-3 py-1 rounded">
          {value[0]}
        </span>
        <span className="text-muted-foreground">{maxLabel}</span>
      </div>
    </div>
  )
}



