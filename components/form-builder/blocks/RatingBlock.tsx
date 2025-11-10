"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface RatingBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function RatingBlock({ block, isEditing = false, onUpdate }: RatingBlockProps) {
  const maxRating = (block.maxRating as number) || 5
  const helpText = (block.helpText as string) || ""
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
          {block.label || "Notez votre expérience"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className={cn(
          "text-sm text-muted-foreground -mt-2",
          alignmentClasses[align]
        )}>
          {helpText}
        </p>
      )}
      <div className={cn(
        "flex items-center gap-2",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        align === "left" && "justify-start"
      )}>
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "w-8 h-8 transition-colors",
              isEditing ? "text-muted-foreground/40" : "text-yellow-400 fill-yellow-400 cursor-pointer hover:text-yellow-500"
            )}
          />
        ))}
      </div>
      {isEditing && (
        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="max-rating">Nombre d'étoiles</Label>
          <Input
            id="max-rating"
            type="number"
            min={1}
            max={10}
            value={maxRating}
            onChange={(e) => onUpdate?.({ maxRating: parseInt(e.target.value) || 5 })}
          />
        </div>
      )}
    </div>
  )
}

