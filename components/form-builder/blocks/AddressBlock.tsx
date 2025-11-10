"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface AddressBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function AddressBlock({ block, isEditing = false, onUpdate }: AddressBlockProps) {
  const align = getAlignment(block as any)

  return (
    <div className="w-full space-y-3">
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
          {block.label || "Adresse"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="space-y-2 border-2 border-dashed border-muted-foreground/40 rounded-lg p-4">
        <Input placeholder="Rue et numéro" disabled={!isEditing} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Code postal" disabled={!isEditing} />
          <Input placeholder="Ville" disabled={!isEditing} />
        </div>
        <Input placeholder="Pays" disabled={!isEditing} />
      </div>
    </div>
  )
}

