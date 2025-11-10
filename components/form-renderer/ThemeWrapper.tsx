"use client"

import * as React from "react"
import type { ThemeJSON } from "@/types"

interface ThemeWrapperProps {
  theme: ThemeJSON
  children: React.ReactNode
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  const backgroundImage = theme.backgroundImage
  const backgroundGradient = theme.backgroundGradient
  const backgroundImageOpacity = theme.backgroundImageOpacity ?? 1
  const backgroundImageBlur = theme.backgroundImageBlur ?? 0
  const backgroundColor = theme.colors?.background || "#ffffff"
  const fontFamily = theme.fonts?.family || "Inter"

  // Vérifier si un background est défini (dégradé ou image)
  const hasBackground = !!(backgroundImage || backgroundGradient)

  // Déterminer le style de fond
  // IMPORTANT: Ne pas mélanger background (shorthand) et backgroundColor (non-shorthand)
  const backgroundStyle: React.CSSProperties = {
    fontFamily: `"${fontFamily}", sans-serif`,
  }

  // Appliquer le background selon la priorité : image > dégradé > couleur
  // NE PAS mélanger background et backgroundColor dans le même objet
  // Utiliser exclusivement l'une ou l'autre
  if (backgroundImage) {
    // Si image, backgroundColor transparent pour laisser voir l'image
    backgroundStyle.backgroundColor = "transparent"
    delete (backgroundStyle as any).background
  } else if (backgroundGradient) {
    // Si dégradé, utiliser uniquement background (shorthand)
    backgroundStyle.background = backgroundGradient
    delete (backgroundStyle as any).backgroundColor
  } else {
    // Sinon, couleur unie avec backgroundColor
    backgroundStyle.backgroundColor = backgroundColor
    delete (backgroundStyle as any).background
  }

  return (
    <div 
      className={hasBackground ? "relative min-h-screen" : "relative min-h-screen"}
      style={backgroundStyle}
    >
      {/* Dégradé de fond (fallback si le style inline ne fonctionne pas) */}
      {backgroundGradient && !backgroundImage && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: backgroundGradient,
          }}
        />
      )}

      {/* Image de fond avec opacité et flou */}
      {backgroundImage && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: backgroundImageOpacity,
            filter: backgroundImageBlur > 0 ? `blur(${backgroundImageBlur}px)` : "none",
          }}
        />
      )}
      
      {/* Overlay si image de fond pour améliorer la lisibilité */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundColor: backgroundColor,
            opacity: 0.3, // Réduit pour correspondre à l'éditeur
          }}
        />
      )}
      
      {/* Conteneur blanc arrondi autour du formulaire - seulement si background défini */}
      {hasBackground ? (
        <div className="flex items-start justify-center px-2 sm:px-4 py-4 sm:py-8 min-h-screen">
          <div className="w-full max-w-3xl bg-white rounded-xl sm:rounded-3xl shadow-2xl">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

