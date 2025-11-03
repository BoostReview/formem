"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ConsentBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function ConsentBlock({ block, isEditing = false, onUpdate }: ConsentBlockProps) {
  const consentText =
    (block.consentText as string) || "J'accepte les conditions d'utilisation"

  return (
    <div className="w-full space-y-2">
      <div className="flex items-start gap-2">
        <Checkbox id={block.id} disabled={isEditing} className="mt-1" />
        <Label
          htmlFor={block.id}
          className="text-sm font-normal cursor-pointer leading-relaxed"
        >
          {consentText}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
    </div>
  )
}


