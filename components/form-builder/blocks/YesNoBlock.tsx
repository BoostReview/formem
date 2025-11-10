"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface YesNoBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function YesNoBlock({ block, isEditing = false, onUpdate }: YesNoBlockProps) {
  const [value, setValue] = React.useState(false)
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
          {block.label || "Oui/Non"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Non</span>
        <Switch
          checked={value}
          onCheckedChange={setValue}
          disabled={isEditing}
        />
        <span className="text-sm text-muted-foreground">Oui</span>
      </div>
    </div>
  )
}



