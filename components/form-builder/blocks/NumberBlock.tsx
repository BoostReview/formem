"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function NumberBlock({ block, isEditing = false, onUpdate }: NumberBlockProps) {
  const min = typeof block.min === "number" ? block.min : 0
  const max = typeof block.max === "number" ? block.max : 100

  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Nombre"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type="number"
        min={min}
        max={max}
        placeholder={`Entre ${min} et ${max}`}
        disabled={!isEditing}
      />
    </div>
  )
}


