"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface YesNoBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function YesNoBlock({ block, isEditing = false, onUpdate }: YesNoBlockProps) {
  const [value, setValue] = React.useState(false)

  return (
    <div className="w-full space-y-3">
      <Label className="text-base font-medium">
        {block.label || "Oui/Non"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
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


