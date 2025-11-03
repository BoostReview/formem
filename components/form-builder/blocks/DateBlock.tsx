"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function DateBlock({ block, isEditing = false, onUpdate }: DateBlockProps) {
  const dateType = (block.dateType as "date" | "datetime-local" | "time") || "date"

  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Date"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type={dateType}
        disabled={!isEditing}
        className="w-full"
      />
    </div>
  )
}


