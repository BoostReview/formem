"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextareaBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function TextareaBlock({ block, isEditing = false, onUpdate }: TextareaBlockProps) {
  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Zone de texte"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        placeholder={block.placeholder || "Entrez votre message..."}
        disabled={!isEditing}
        onChange={(e) => {
          if (isEditing) {
            onUpdate?.({ placeholder: e.target.value })
          }
        }}
        rows={4}
      />
    </div>
  )
}


