"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface TextBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function TextBlock({ block, isEditing = false, onUpdate }: TextBlockProps) {
  const helpText = (block.helpText as string) || ""
  const minLength = (block.minLength as number) || undefined
  const maxLength = (block.maxLength as number) || undefined
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
          {block.label || "Texte"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <Input
        type="text"
        placeholder={block.placeholder || "Entrez votre texte..."}
        defaultValue={defaultValue}
        disabled={!isEditing}
        minLength={minLength}
        maxLength={maxLength}
        onChange={(e) => {
          if (isEditing) {
            onUpdate?.({ placeholder: e.target.value })
          }
        }}
      />
      {maxLength && !isEditing && (
        <p className="text-xs text-muted-foreground text-right">
          Max {maxLength} caractères
        </p>
      )}
    </div>
  )
}



