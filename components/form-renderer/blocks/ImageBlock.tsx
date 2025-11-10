"use client"

import * as React from "react"
import type { FormBlock } from "@/types"
import { cn } from "@/lib/utils"

interface ImageBlockProps {
  block: FormBlock
  value?: unknown
  onChange: (value: unknown) => void
}

export function ImageBlock({ block }: ImageBlockProps) {
  const imageUrl = (block.imageUrl as string) || ""
  const altText = (block.altText as string) || ""
  const caption = (block.caption as string) || ""
  const linkUrl = (block.linkUrl as string) || ""
  const size = (block.size as "small" | "medium" | "large" | "full") || "medium"
  const alignment = (block.alignment as "left" | "center" | "right") || "center"
  const borderRadius = (block.borderRadius as number) ?? 8
  const opacity = (block.opacity as number) ?? 100

  const sizeClasses = {
    small: "max-w-xs",
    medium: "max-w-md",
    large: "max-w-2xl",
    full: "w-full",
  }

  const alignmentWrapperClasses = {
    left: "flex justify-start",
    center: "flex justify-center",
    right: "flex justify-end",
  }

  if (!imageUrl) {
    return null
  }

  // Si la taille est "full", l'alignement n'a pas de sens, on garde juste la largeur
  const shouldAlign = size !== "full"

  const imageContent = (
    <div className={cn("relative overflow-hidden", sizeClasses[size])}>
      <img
        src={imageUrl}
        alt={altText || block.label || "Image"}
        className={cn("w-full h-auto object-cover transition-opacity")}
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: opacity / 100,
        }}
      />
    </div>
  )

  const wrapperContent = linkUrl ? (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      {imageContent}
    </a>
  ) : (
    <div className="inline-block">
      {imageContent}
    </div>
  )

  return (
    <div className="w-full space-y-2">
      {shouldAlign ? (
        <div className={cn("w-full", alignmentWrapperClasses[alignment])}>
          {wrapperContent}
        </div>
      ) : (
        wrapperContent
      )}
      {caption && (
        <p className={cn(
          "text-sm text-gray-500 dark:text-gray-400 italic mt-2",
          alignment === "left" && "text-left",
          alignment === "center" && "text-center",
          alignment === "right" && "text-right"
        )}>
          {caption}
        </p>
      )}
    </div>
  )
}

