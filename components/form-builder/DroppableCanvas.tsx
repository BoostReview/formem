"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface DroppableCanvasProps {
  id: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
}

export function DroppableCanvas({
  id,
  children,
  className,
  style,
  onClick,
}: DroppableCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "canvas",
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[600px] rounded-[14px] border-2 border-dashed transition-all duration-300 ease-out",
        isOver
          ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
          : "border-muted bg-background",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

