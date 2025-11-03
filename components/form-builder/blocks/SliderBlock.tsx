"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface SliderBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function SliderBlock({ block, isEditing = false, onUpdate }: SliderBlockProps) {
  const min = typeof block.min === "number" ? block.min : 0
  const max = typeof block.max === "number" ? block.max : 100
  const step = typeof block.step === "number" ? block.step : 1
  const [value, setValue] = React.useState([Math.floor((min + max) / 2)])

  return (
    <div className="w-full space-y-3">
      <Label className="text-base font-medium">
        {block.label || "Curseur"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Slider
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={isEditing}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground text-center">
        Valeur: {value[0]}
      </div>
    </div>
  )
}


