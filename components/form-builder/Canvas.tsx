"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/EmptyState"
import { FileText } from "lucide-react"

interface CanvasProps {
  children?: React.ReactNode
  onDrop?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onClick?: (e: React.MouseEvent) => void
  className?: string
  style?: React.CSSProperties
}

export function Canvas({
  children,
  onDrop,
  onDragOver,
  onClick,
  className,
  style,
}: CanvasProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    onDragOver?.(e)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Ne déclencher que si on quitte vraiment le canvas
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node | null
    
    if (!currentTarget.contains(relatedTarget)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    onDrop?.(e)
  }

  const hasContent = React.Children.count(children) > 0

  return (
    <div
      className={cn(
        "min-h-[600px] rounded-[14px] border-2 border-dashed transition-colors duration-200",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted bg-background",
        className
      )}
      style={style}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
    >
      {hasContent ? (
        <div className="p-6">{children}</div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Zone de dépôt"
          description="Glissez des blocs ici pour construire votre formulaire"
        />
      )}
    </div>
  )
}

