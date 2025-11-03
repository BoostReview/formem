"use client"

import * as React from "react"
import { FormBlock } from "@/types"
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
  const [isLocalEditing, setIsLocalEditing] = React.useState(false)
  const [label, setLabel] = React.useState(block.label || "")

  React.useEffect(() => {
    setLabel(block.label || "")
  }, [block.label])

  const handleDoubleClick = () => {
    if (!isEditing) return
    setIsLocalEditing(true)
  }

  const handleBlur = () => {
    setIsLocalEditing(false)
    if (label !== block.label) {
      onUpdate?.(label)
    }
  }

  return (
    <div className="w-full">
      {isLocalEditing ? (
        <textarea
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none outline-none text-muted-foreground focus:ring-2 focus:ring-primary rounded px-2 py-1 resize-none"
          rows={3}
          autoFocus
        />
      ) : (
        <p
          className="text-muted-foreground"
          onDoubleClick={handleDoubleClick}
          style={{ cursor: isEditing ? "text" : "default" }}
        >
          {label || "Paragraphe"}
        </p>
      )}
    </div>
  )
}


