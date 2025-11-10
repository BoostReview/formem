"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface NumberBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function NumberBlock({ block, isEditing = false, onUpdate }: NumberBlockProps) {
  const helpText = (block.helpText as string) || ""
  const min = typeof block.min === "number" ? block.min : undefined
  const max = typeof block.max === "number" ? block.max : undefined
  const step = (block.step as number) || 1
  const decimals = (block.decimals as number) || 0
  const defaultValue = (block.defaultValue as number) || undefined
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
          {block.label || "Nombre"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        placeholder={
          min !== undefined && max !== undefined
            ? `Entre ${min} et ${max}`
            : min !== undefined
            ? `Minimum: ${min}`
            : max !== undefined
            ? `Maximum: ${max}`
            : "Entrez un nombre"
        }
        disabled={!isEditing}
      />
      {(min !== undefined || max !== undefined) && !isEditing && (
        <p className="text-xs text-muted-foreground text-right">
          {min !== undefined && max !== undefined
            ? `Entre ${min} et ${max}`
            : min !== undefined
            ? `Min: ${min}`
            : `Max: ${max}`}
        </p>
      )}
    </div>
  )
}



