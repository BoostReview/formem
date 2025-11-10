"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface EmailBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function EmailBlock({ block, isEditing = false, onUpdate }: EmailBlockProps) {
  const helpText = (block.helpText as string) || ""
  const confirmEmail = (block.confirmEmail as boolean) || false
  const defaultValue = (block.defaultValue as string) || ""
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
          {block.label || "Email"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <Input
        type="email"
        placeholder={block.placeholder || "exemple@email.com"}
        defaultValue={defaultValue}
        disabled={!isEditing}
        onChange={(e) => {
          if (isEditing) {
            onUpdate?.({ placeholder: e.target.value })
          }
        }}
      />
      {confirmEmail && !isEditing && (
        <Input
          type="email"
          placeholder="Confirmez votre email"
          disabled={!isEditing}
          className="mt-2"
        />
      )}
    </div>
  )
}



