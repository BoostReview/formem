"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ThemeJSON } from "@/types"

interface DynamicButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  theme: ThemeJSON
  className?: string
}

export function DynamicButton({ 
  onClick, 
  disabled, 
  children, 
  theme,
  className 
}: DynamicButtonProps) {
  const buttonStyle = theme.buttonStyle || "default"
  const buttonSize = theme.buttonSize || "md"
  const buttonAnimation = theme.buttonAnimation || "none"
  const primaryColor = theme.colors?.primary || "#000000"

  // Classes de base
  const baseClasses = "font-semibold transition-all duration-300"

  // Styles selon le type de bouton
  const styleClasses = React.useMemo(() => {
    switch (buttonStyle) {
      case "rounded":
        return "rounded-xl"
      case "pill":
        return "rounded-full"
      case "sharp":
        return "rounded-none"
      case "3d":
        return "rounded-lg shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-1 active:translate-y-2"
      case "outline":
        return `rounded-lg border-2 bg-transparent hover:bg-opacity-10`
      case "ghost":
        return "rounded-lg bg-transparent hover:bg-opacity-20"
      case "gradient":
        return "rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
      case "glassmorphism":
        return "rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20"
      case "neumorphism":
        return "rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]"
      case "gradient-animated":
        return "rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-[length:200%_auto] animate-gradient"
      case "glow":
        return "rounded-lg shadow-[0_0_20px_currentColor] hover:shadow-[0_0_30px_currentColor]"
      case "elevated":
        return "rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
      case "minimal":
        return "rounded-lg border border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      case "bold":
        return "rounded-lg font-bold shadow-lg hover:shadow-xl"
      case "soft":
        return "rounded-xl shadow-sm hover:shadow-md"
      case "modern":
        return "rounded-lg border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
      case "ripple":
        return "rounded-lg relative overflow-hidden"
      case "flat":
        return "rounded-lg shadow-none hover:shadow-md"
      case "skeuomorphic":
        return "rounded-lg border-2 border-t-white/50 border-l-white/50 border-b-gray-400 border-r-gray-400 hover:border-t-white/70 hover:border-l-white/70"
      default:
        return "rounded"
    }
  }, [buttonStyle])

  // Tailles
  const sizeClasses = React.useMemo(() => {
    switch (buttonSize) {
      case "sm":
        return "h-10 px-6 text-sm"
      case "lg":
        return "h-14 px-10 text-lg"
      case "xl":
        return "h-16 px-12 text-xl"
      default: // md
        return "h-12 px-8 text-base"
    }
  }, [buttonSize])

  // Animations
  const animationClasses = React.useMemo(() => {
    switch (buttonAnimation) {
      case "hover-lift":
        return "hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
      case "hover-grow":
        return "hover:scale-110 transition-transform duration-300"
      case "hover-shine":
        return "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-in-out before:z-10"
      case "hover-pulse":
        return "hover:animate-pulse hover:shadow-lg transition-shadow duration-300"
      case "hover-glow":
        return "hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-shadow duration-300"
      case "hover-slide":
        return "relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-in-out"
      case "hover-bounce":
        return "hover:animate-[bounce-once_0.6s_ease-out] transition-transform"
      case "hover-rotate":
        return "hover:rotate-3 transition-transform duration-300"
      case "hover-gradient":
        return "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/30 before:via-pink-500/30 before:to-orange-500/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      case "hover-border":
        return "relative border-2 border-transparent hover:border-white/50 transition-all duration-300"
      case "hover-scale-down":
        return "hover:scale-95 transition-transform duration-200 ease-in-out"
      case "hover-wiggle":
        return "hover:animate-[wiggle_0.5s_ease-in-out] transition-transform"
      case "hover-ripple":
        return "relative overflow-hidden after:absolute after:inset-0 after:bg-white/30 after:scale-0 after:rounded-full hover:after:scale-150 hover:after:opacity-0 after:transition-all after:duration-500"
      case "hover-float":
        return "hover:animate-[float-smooth_3s_ease-in-out_infinite] transition-transform"
      case "hover-shake":
        return "hover:animate-[shake_0.5s_ease-in-out] transition-transform"
      case "hover-squeeze":
        return "hover:scale-x-95 hover:scale-y-105 transition-transform duration-200 ease-in-out"
      case "hover-flip":
        return "hover:rotate-180 transition-transform duration-500 ease-in-out"
      case "hover-glow-pulse":
        return "hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:animate-[glow-pulse_1.5s_ease-in-out_infinite] transition-shadow"
      case "hover-slide-up":
        return "hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out"
      case "hover-slide-down":
        return "hover:translate-y-2 hover:shadow-xl transition-all duration-300 ease-out"
      case "hover-slide-left":
        return "hover:-translate-x-2 hover:shadow-xl transition-all duration-300 ease-out"
      case "hover-slide-right":
        return "hover:translate-x-2 hover:shadow-xl transition-all duration-300 ease-out"
      case "hover-zoom-in":
        return "hover:scale-125 transition-transform duration-300 ease-out"
      case "hover-zoom-out":
        return "hover:scale-90 transition-transform duration-300 ease-out"
      case "hover-elastic":
        return "hover:animate-[elastic_0.6s_ease-out] transition-transform"
      case "hover-3d-tilt":
        return "hover:animate-[tilt-3d_0.5s_ease-out] hover:shadow-2xl transition-all duration-300"
      case "hover-spin-slow":
        return "hover:animate-[spin-slow_3s_linear_infinite] transition-transform"
      case "hover-gradient-shift":
        return "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out"
      case "hover-blur-focus":
        return "hover:blur-0 blur-sm transition-all duration-300"
      case "hover-skew":
        return "hover:animate-[skew-anim_0.5s_ease-out] transition-transform duration-300"
      case "hover-perspective":
        return "hover:animate-[perspective-3d_0.5s_ease-out] hover:shadow-2xl transition-all duration-500"
      case "hover-wave":
        return "hover:animate-[wave_1s_ease-in-out_infinite] transition-transform"
      case "hover-magnetic":
        return "hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out"
      case "hover-liquid":
        return "hover:animate-[liquid_2s_ease-in-out_infinite] transition-transform"
      case "hover-breathe":
        return "hover:animate-[breathe_2s_ease-in-out_infinite] transition-transform"
      default:
        return ""
    }
  }, [buttonAnimation])

  // Couleurs personnalisées
  const colorStyles = React.useMemo(() => {
    if (buttonStyle === "outline") {
      return {
        borderColor: primaryColor,
        color: primaryColor,
        backgroundColor: "transparent",
      }
    }
    if (buttonStyle === "ghost") {
      return {
        color: primaryColor,
        backgroundColor: "transparent",
      }
    }
    if (buttonStyle === "gradient" || buttonStyle === "gradient-animated") {
      return {} // Déjà défini par la classe
    }
    if (buttonStyle === "glassmorphism") {
      return {
        backgroundColor: `${primaryColor}20`,
        borderColor: `${primaryColor}40`,
        color: primaryColor,
      }
    }
    if (buttonStyle === "neumorphism") {
      return {
        backgroundColor: "#f0f0f0",
        color: primaryColor,
      }
    }
    if (buttonStyle === "minimal" || buttonStyle === "modern" || buttonStyle === "flat") {
      return {
        color: primaryColor,
        backgroundColor: "transparent",
      }
    }
    if (buttonStyle === "glow") {
      return {
        backgroundColor: primaryColor,
        color: "#ffffff",
        boxShadow: `0 0 20px ${primaryColor}40`,
      }
    }
    if (buttonStyle === "skeuomorphic") {
      return {
        backgroundColor: primaryColor,
        color: "#ffffff",
      }
    }
    return {
      backgroundColor: primaryColor,
      color: "#ffffff",
    }
  }, [buttonStyle, primaryColor])

  // Pour les animations qui grandissent, ajouter overflow-visible et padding
  const needsOverflow = buttonAnimation === "hover-grow" || 
                        buttonAnimation === "hover-zoom-in" ||
                        buttonAnimation === "hover-scale-down" ||
                        buttonAnimation === "hover-elastic" ||
                        buttonAnimation === "hover-squeeze" ||
                        buttonAnimation === "hover-magnetic" ||
                        buttonAnimation === "hover-perspective" ||
                        buttonAnimation === "hover-3d-tilt"

  return (
    <div className={cn(
      needsOverflow && "overflow-visible p-2 -m-2"
    )}>
      <Button
        onClick={onClick}
        disabled={disabled}
        style={colorStyles}
        className={cn(
          baseClasses,
          styleClasses,
          sizeClasses,
          animationClasses,
          "w-full",
          needsOverflow && "relative z-10",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {children}
      </Button>
    </div>
  )
}

