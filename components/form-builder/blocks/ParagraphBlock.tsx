"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ParagraphBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (label: string) => void
}

export function ParagraphBlock({
  block,
  isEditing = false,
  onUpdate,
}: ParagraphBlockProps) {
  const align = (block.align as "left" | "center" | "right") || "left"
  
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate?.(e.target.value)
  }

  return (
    <div className="w-full">
      {isEditing ? (
        <Textarea
          value={block.label || ""}
          onChange={handleChange}
          placeholder="Paragraphe de texte..."
          className={cn(
            "bg-transparent border border-dashed border-muted-foreground/40 text-muted-foreground resize-none",
            alignmentClasses[align]
          )}
          rows={3}
        />
      ) : (
        <p className={cn(
          "text-muted-foreground leading-relaxed whitespace-pre-wrap block",
          alignmentClasses[align]
        )}>
          {block.label || "Paragraphe"}
        </p>
      )}
    </div>
  )
}



