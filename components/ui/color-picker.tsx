"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)

  // S'assurer que la valeur est toujours un hex valide
  const hexValue = React.useMemo(() => {
    if (!value || !value.startsWith("#")) {
      return "#3b82f6" // Default blue
    }
    // Normaliser les couleurs hex courtes (#fff -> #ffffff)
    if (value.length === 4) {
      return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    }
    return value.length === 7 ? value : "#3b82f6"
  }, [value])

  const handleChange = (color: string) => {
    onChange(color)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Valider le format hex
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue)) {
      onChange(inputValue)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-10 border-2 rounded-lg",
                "hover:scale-105 transition-transform",
                "focus-visible:ring-2 focus-visible:ring-primary"
              )}
              style={{ backgroundColor: hexValue }}
            >
              <span className="sr-only">Choisir une couleur</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <HexColorPicker
              color={hexValue}
              onChange={handleChange}
              style={{ width: 200, height: 200 }}
            />
            <div className="mt-3 flex items-center gap-2">
              <Input
                value={hexValue}
                onChange={handleInputChange}
                placeholder="#3b82f6"
                className="h-8 text-sm font-mono"
                maxLength={7}
              />
              <div
                className="w-8 h-8 rounded border-2 border-border"
                style={{ backgroundColor: hexValue }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Input
          value={hexValue}
          onChange={handleInputChange}
          placeholder="#3b82f6"
          className="flex-1 h-10 font-mono text-sm"
          maxLength={7}
        />
      </div>
    </div>
  )
}




