"use client"

import * as React from "react"
import { GripVertical, Copy, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface BlockWrapperProps {
  id: string
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
  children: React.ReactNode
  className?: string
  dragListeners?: any
  dragAttributes?: any
}

export function BlockWrapper({
  id,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  children,
  className,
  dragListeners,
  dragAttributes,
}: BlockWrapperProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-select]")) return
        e.stopPropagation() // Empêcher la propagation vers le canvas
        onSelect()
      }}
    >
      <Card
        className={cn(
          "relative transition-all duration-200",
          isSelected
            ? "border-primary border-2 shadow-md"
            : "border border-transparent hover:border-muted-foreground/30",
          isHovered && "shadow-sm"
        )}
      >
        {/* Actions bar - visible au hover ou si sélectionné */}
        {(isHovered || isSelected) && (
          <div
            className="absolute -top-2 -right-2 z-10 flex items-center gap-1 bg-background rounded-md border shadow-sm p-1"
            data-no-select
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
              data-no-select
              {...(dragListeners || {})}
              {...(dragAttributes || {})}
              title="Glisser pour réorganiser"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
                toast.success("Bloc dupliqué", {
                  description: "Le bloc a été dupliqué avec succès",
                })
              }}
              data-no-select
              title="Dupliquer"
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
                  onDelete()
                  toast.success("Bloc supprimé", {
                    description: "Le bloc a été supprimé avec succès",
                  })
                }
              }}
              data-no-select
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Contenu du bloc */}
        <div className="p-4">{children}</div>
      </Card>
    </div>
  )
}

