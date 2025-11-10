"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface ConsentBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function ConsentBlock({ block, isEditing = false, onUpdate }: ConsentBlockProps) {
  const consentText =
    (block.consentText as string) || "J'accepte les conditions d'utilisation"
  const align = getAlignment(block as any)

  return (
    <div className="w-full space-y-2">
      <div className="flex items-start gap-2">
        <Checkbox id={block.id} disabled={isEditing} className="mt-1" />
        {isEditing ? (
          <Input
            value={consentText}
            onChange={(e) => onUpdate?.({ consentText: e.target.value })}
            placeholder="Texte de consentement"
            className={cn(
              "text-sm font-normal h-auto py-1 border-dashed",
              alignmentClasses[align]
            )}
          />
        ) : (
          <Label
            htmlFor={block.id}
            className={cn(
              "text-sm font-normal cursor-pointer leading-relaxed",
              alignmentClasses[align]
            )}
          >
            {consentText}
            {block.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>
    </div>
  )
}



