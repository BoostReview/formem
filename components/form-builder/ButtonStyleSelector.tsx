"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ButtonStyleSelectorProps {
  value: string
  onChange: (value: string) => void
  primaryColor?: string
}

export function ButtonStyleSelector({ value, onChange, primaryColor = "#000000" }: ButtonStyleSelectorProps) {
  const styles = [
    { value: "default", label: "Défaut", class: "rounded" },
    { value: "rounded", label: "Arrondi", class: "rounded-xl" },
    { value: "pill", label: "Pill", class: "rounded-full" },
    { value: "sharp", label: "Angles droits", class: "rounded-none" },
    { value: "3d", label: "3D", class: "rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.2)]" },
    { value: "outline", label: "Outline", class: "rounded-lg border-2" },
    { value: "ghost", label: "Ghost", class: "rounded-lg" },
    { value: "gradient", label: "Dégradé", class: "rounded-lg" },
    { value: "glassmorphism", label: "Glassmorphism", class: "rounded-xl backdrop-blur-md bg-white/10 border border-white/20" },
    { value: "neumorphism", label: "Neumorphism", class: "rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.8)]" },
    { value: "gradient-animated", label: "Dégradé animé", class: "rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-[length:200%_auto] animate-gradient" },
    { value: "glow", label: "Lueur", class: "rounded-lg shadow-[0_0_20px_currentColor]" },
    { value: "elevated", label: "Élevé", class: "rounded-lg shadow-xl hover:shadow-2xl" },
    { value: "minimal", label: "Minimal", class: "rounded-lg border border-gray-200 bg-transparent hover:bg-gray-50" },
    { value: "bold", label: "Audacieux", class: "rounded-lg font-bold shadow-lg" },
    { value: "soft", label: "Doux", class: "rounded-xl shadow-sm hover:shadow-md" },
    { value: "modern", label: "Moderne", class: "rounded-lg border-2 border-gray-300 hover:border-gray-400" },
    { value: "ripple", label: "Ripple", class: "rounded-lg relative overflow-hidden" },
    { value: "flat", label: "Plat", class: "rounded-lg shadow-none hover:shadow-md" },
    { value: "skeuomorphic", label: "Skeuomorphic", class: "rounded-lg border-2 border-t-white/50 border-l-white/50 border-b-gray-400 border-r-gray-400" },
  ]

  return (
    <div className="space-y-3">
      <Label>Style des boutons</Label>
      <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
        {styles.map((style) => {
          const isSelected = value === style.value
          const isOutline = style.value === "outline"
          const isGhost = style.value === "ghost"
          const isGradient = style.value === "gradient"
          const isGradientAnimated = style.value === "gradient-animated"
          const isGlassmorphism = style.value === "glassmorphism"
          const isNeumorphism = style.value === "neumorphism"
          const isMinimal = style.value === "minimal"
          const isModern = style.value === "modern"
          const isFlat = style.value === "flat"
          const isGlow = style.value === "glow"
          const isSkeuomorphic = style.value === "skeuomorphic"
          
          let buttonStyle: React.CSSProperties = {}
          
          if (isOutline) {
            buttonStyle = {
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: "transparent",
            }
          } else if (isGhost) {
            buttonStyle = {
              color: primaryColor,
              backgroundColor: "transparent",
            }
          } else if (isGradient || isGradientAnimated) {
            buttonStyle = {
              background: "linear-gradient(to right, #a855f7, #ec4899, #f97316)",
              color: "#ffffff",
            }
          } else if (isGlassmorphism) {
            buttonStyle = {
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`,
              color: primaryColor,
            }
          } else if (isNeumorphism) {
            buttonStyle = {
              backgroundColor: "#f0f0f0",
              color: primaryColor,
            }
          } else if (isMinimal || isModern || isFlat) {
            buttonStyle = {
              color: primaryColor,
              backgroundColor: "transparent",
            }
          } else if (isGlow) {
            buttonStyle = {
              backgroundColor: primaryColor,
              color: "#ffffff",
              boxShadow: `0 0 20px ${primaryColor}40`,
            }
          } else if (isSkeuomorphic) {
            buttonStyle = {
              backgroundColor: primaryColor,
              color: "#ffffff",
            }
          } else {
            buttonStyle = {
              backgroundColor: primaryColor,
              color: "#ffffff",
            }
          }

          return (
            <button
              key={style.value}
              onClick={() => onChange(style.value)}
              className={cn(
                "relative px-4 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105",
                style.class,
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              style={buttonStyle}
            >
              {style.label}
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

