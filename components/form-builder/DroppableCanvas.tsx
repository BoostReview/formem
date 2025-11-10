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

  // Construire le style sans mélanger background et backgroundColor
  const finalStyle: React.CSSProperties = {}
  
  if (style) {
    // NE PAS mélanger background et backgroundColor
    if (style.background) {
      finalStyle.background = style.background
      // S'assurer que backgroundColor n'est pas défini
      delete (finalStyle as any).backgroundColor
    } else if (style.backgroundColor !== undefined) {
      finalStyle.backgroundColor = style.backgroundColor
      // S'assurer que background n'est pas défini
      delete (finalStyle as any).background
    }
    
    // Copier les autres propriétés de style
    Object.keys(style).forEach(key => {
      if (key !== 'background' && key !== 'backgroundColor') {
        (finalStyle as any)[key] = (style as any)[key]
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[600px] rounded-[14px] border-2 border-dashed transition-all duration-300 ease-out overflow-visible",
        isOver
          ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
          : "border-muted",
        // Ne pas mettre bg-background si un style de background est fourni ou si c'est transparent
        // Aussi ne pas mettre si backgroundColor est explicitement transparent
        !finalStyle.background && 
        finalStyle.backgroundColor !== "transparent" && 
        finalStyle.backgroundColor !== undefined &&
        finalStyle.backgroundColor !== null &&
        finalStyle.backgroundColor !== "" ? "bg-background" : "",
        className
      )}
      style={finalStyle}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

