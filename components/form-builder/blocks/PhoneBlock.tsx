"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhoneBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function PhoneBlock({ block, isEditing = false, onUpdate }: PhoneBlockProps) {
  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Téléphone"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type="tel"
        placeholder={block.placeholder || "+33 6 12 34 56 78"}
        disabled={!isEditing}
        onChange={(e) => {
          if (isEditing) {
            onUpdate?.({ placeholder: e.target.value })
          }
        }}
      />
    </div>
  )
}


