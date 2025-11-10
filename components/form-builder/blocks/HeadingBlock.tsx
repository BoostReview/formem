"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HeadingBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (label: string) => void
}

export function HeadingBlock({
  block,
  isEditing = false,
  onUpdate,
}: HeadingBlockProps) {
  const level = (block.level as "h1" | "h2" | "h3") || "h2"
  const align = (block.align as "left" | "center" | "right") || "left"
  const HeadingTag = level

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate?.(e.target.value)
  }

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div className="w-full">
      {isEditing ? (
        <Input
          type="text"
          value={block.label || ""}
          onChange={handleChange}
          placeholder="Titre"
          className={cn(
            "bg-transparent border border-dashed border-muted-foreground/40 font-bold block",
            level === "h1" && "text-3xl h-auto py-3",
            level === "h2" && "text-2xl h-auto py-2",
            level === "h3" && "text-xl h-auto py-2",
            alignmentClasses[align]
          )}
        />
      ) : (
        <HeadingTag
          className={cn(
            "font-bold text-foreground block",
            level === "h1" && "text-3xl",
            level === "h2" && "text-2xl",
            level === "h3" && "text-xl",
            alignmentClasses[align]
          )}
        >
          {block.label || "Titre"}
        </HeadingTag>
      )}
    </div>
  )
}



