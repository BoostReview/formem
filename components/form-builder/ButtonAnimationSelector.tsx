"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ButtonAnimationSelectorProps {
  value: string
  onChange: (value: string) => void
  primaryColor?: string
}

export function ButtonAnimationSelector({ value, onChange, primaryColor = "#000000" }: ButtonAnimationSelectorProps) {
  const animations = [
    { value: "none", label: "Aucune", class: "" },
    { value: "hover-lift", label: "Élévation", class: "hover:-translate-y-2 hover:shadow-xl transition-all duration-300" },
    { value: "hover-grow", label: "Agrandissement", class: "hover:scale-110 transition-transform duration-300" },
    { 
      value: "hover-shine", 
      label: "Brillance", 
      class: "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-in-out before:z-10"
    },
    { 
      value: "hover-pulse", 
      label: "Pulsation", 
      class: "hover:animate-pulse hover:shadow-lg transition-shadow duration-300"
    },
    { 
      value: "hover-glow", 
      label: "Lueur", 
      class: "hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-shadow duration-300"
    },
    { 
      value: "hover-slide", 
      label: "Glissement", 
      class: "relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-in-out"
    },
    { 
      value: "hover-bounce", 
      label: "Rebond", 
      class: "hover:animate-[bounce-once_0.6s_ease-out] transition-transform"
    },
    { 
      value: "hover-rotate", 
      label: "Rotation", 
      class: "hover:rotate-3 transition-transform duration-300"
    },
    { 
      value: "hover-gradient", 
      label: "Dégradé animé", 
      class: "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/30 before:via-pink-500/30 before:to-orange-500/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
    },
    { 
      value: "hover-border", 
      label: "Bordure animée", 
      class: "relative border-2 border-transparent hover:border-white/50 transition-all duration-300"
    },
    { 
      value: "hover-scale-down", 
      label: "Rétrécissement", 
      class: "hover:scale-95 transition-transform duration-200 ease-in-out"
    },
    { 
      value: "hover-wiggle", 
      label: "Oscillation", 
      class: "hover:animate-[wiggle_0.5s_ease-in-out] transition-transform"
    },
    { 
      value: "hover-ripple", 
      label: "Ondulation", 
      class: "relative overflow-hidden after:absolute after:inset-0 after:bg-white/30 after:scale-0 after:rounded-full hover:after:scale-150 hover:after:opacity-0 after:transition-all after:duration-500"
    },
    { 
      value: "hover-float", 
      label: "Flottement", 
      class: "hover:animate-[float-smooth_3s_ease-in-out_infinite] transition-transform"
    },
    { 
      value: "hover-shake", 
      label: "Secousse", 
      class: "hover:animate-[shake_0.5s_ease-in-out] transition-transform"
    },
    { 
      value: "hover-squeeze", 
      label: "Compression", 
      class: "hover:scale-x-95 hover:scale-y-105 transition-transform duration-200 ease-in-out"
    },
    { 
      value: "hover-flip", 
      label: "Retournement", 
      class: "hover:rotate-180 transition-transform duration-500 ease-in-out"
    },
    { 
      value: "hover-glow-pulse", 
      label: "Lueur pulsante", 
      class: "hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:animate-[glow-pulse_1.5s_ease-in-out_infinite] transition-shadow"
    },
    { 
      value: "hover-slide-up", 
      label: "Glissement haut", 
      class: "hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out"
    },
    { 
      value: "hover-slide-down", 
      label: "Glissement bas", 
      class: "hover:translate-y-2 hover:shadow-xl transition-all duration-300 ease-out"
    },
    { 
      value: "hover-slide-left", 
      label: "Glissement gauche", 
      class: "hover:-translate-x-2 hover:shadow-xl transition-all duration-300 ease-out"
    },
    { 
      value: "hover-slide-right", 
      label: "Glissement droite", 
      class: "hover:translate-x-2 hover:shadow-xl transition-all duration-300 ease-out"
    },
    { 
      value: "hover-zoom-in", 
      label: "Zoom avant", 
      class: "hover:scale-125 transition-transform duration-300 ease-out"
    },
    { 
      value: "hover-zoom-out", 
      label: "Zoom arrière", 
      class: "hover:scale-90 transition-transform duration-300 ease-out"
    },
    { 
      value: "hover-elastic", 
      label: "Élastique", 
      class: "hover:animate-[elastic_0.6s_ease-out] transition-transform"
    },
    { 
      value: "hover-3d-tilt", 
      label: "Inclinaison 3D", 
      class: "hover:animate-[tilt-3d_0.5s_ease-out] hover:shadow-2xl transition-all duration-300"
    },
    { 
      value: "hover-spin-slow", 
      label: "Rotation lente", 
      class: "hover:animate-[spin-slow_3s_linear_infinite] transition-transform"
    },
    { 
      value: "hover-gradient-shift", 
      label: "Dégradé mouvant", 
      class: "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out"
    },
    { 
      value: "hover-blur-focus", 
      label: "Flou → Focus", 
      class: "hover:blur-0 blur-sm transition-all duration-300"
    },
    { 
      value: "hover-skew", 
      label: "Inclinaison", 
      class: "hover:animate-[skew-anim_0.5s_ease-out] transition-transform duration-300"
    },
    { 
      value: "hover-perspective", 
      label: "Perspective", 
      class: "hover:animate-[perspective-3d_0.5s_ease-out] hover:shadow-2xl transition-all duration-500"
    },
    { 
      value: "hover-wave", 
      label: "Vague", 
      class: "hover:animate-[wave_1s_ease-in-out_infinite] transition-transform"
    },
    { 
      value: "hover-magnetic", 
      label: "Magnétique", 
      class: "hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out"
    },
    { 
      value: "hover-liquid", 
      label: "Liquide", 
      class: "hover:animate-[liquid_2s_ease-in-out_infinite] transition-transform"
    },
    { 
      value: "hover-breathe", 
      label: "Respiration", 
      class: "hover:animate-[breathe_2s_ease-in-out_infinite] transition-transform"
    },
  ]

  return (
    <div className="space-y-3">
      <Label>Animation des boutons</Label>
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {animations.map((animation) => {
          const isSelected = value === animation.value
          
          return (
            <button
              key={animation.value}
              onClick={() => onChange(animation.value)}
              className={cn(
                "relative h-10 px-6 rounded-lg text-sm font-semibold transition-all duration-300",
                animation.class,
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
              }}
            >
              {animation.label}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center z-20">
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

