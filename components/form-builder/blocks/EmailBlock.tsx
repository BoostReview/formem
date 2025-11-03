"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function EmailBlock({ block, isEditing = false, onUpdate }: EmailBlockProps) {
  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Email"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type="email"
        placeholder={block.placeholder || "exemple@email.com"}
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


