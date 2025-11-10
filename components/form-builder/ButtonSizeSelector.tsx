"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ButtonSizeSelectorProps {
  value: string
  onChange: (value: string) => void
  primaryColor?: string
}

export function ButtonSizeSelector({ value, onChange, primaryColor = "#000000" }: ButtonSizeSelectorProps) {
  const sizes = [
    { value: "sm", label: "Petit", class: "h-8 px-4 text-xs" },
    { value: "md", label: "Moyen", class: "h-10 px-6 text-sm" },
    { value: "lg", label: "Grand", class: "h-12 px-8 text-base" },
    { value: "xl", label: "Très grand", class: "h-14 px-10 text-lg" },
  ]

  return (
    <div className="space-y-3">
      <Label>Taille des boutons</Label>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map((size) => {
          const isSelected = value === size.value
          
          return (
            <button
              key={size.value}
              onClick={() => onChange(size.value)}
              className={cn(
                "relative rounded-lg font-semibold transition-all duration-200 hover:scale-105",
                size.class,
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
              }}
            >
              {size.label}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}


