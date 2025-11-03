"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TextBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function TextBlock({ block, isEditing = false, onUpdate }: TextBlockProps) {
  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Texte"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type="text"
        placeholder={block.placeholder || "Entrez votre texte..."}
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


