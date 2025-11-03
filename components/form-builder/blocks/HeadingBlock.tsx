"use client"

import * as React from "react"
import { FormBlock } from "@/types"
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
  const [isLocalEditing, setIsLocalEditing] = React.useState(false)
  const [label, setLabel] = React.useState(block.label || "")
  const level = (block.level as "h1" | "h2" | "h3") || "h2"
  const align = (block.align as "left" | "center" | "right") || "left"

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel(block.label || "")
      setIsLocalEditing(false)
    }
  }

  const HeadingTag = level

  return (
    <div
      className={cn(
        "w-full",
        align === "center" && "text-center",
        align === "right" && "text-right"
      )}
    >
      {isLocalEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-2xl font-bold focus:ring-2 focus:ring-primary rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <HeadingTag
          className={cn(
            "font-bold text-foreground",
            level === "h1" && "text-3xl",
            level === "h2" && "text-2xl",
            level === "h3" && "text-xl"
          )}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: isEditing ? "text" : "default" }}
        >
          {label || "Titre"}
        </HeadingTag>
      )}
    </div>
  )
}


