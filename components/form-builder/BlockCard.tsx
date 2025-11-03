"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface BlockCardProps {
  icon: LucideIcon
  label: string
  description?: string
  draggable?: boolean
  onClick?: () => void
  className?: string
}

export function BlockCard({
  icon: Icon,
  label,
  description,
  draggable = true,
  onClick,
  className,
}: BlockCardProps) {
  if (!Icon) {
    console.error("Icon is undefined for BlockCard with label:", label)
    return null
  }

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
      draggable={draggable}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

