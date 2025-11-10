"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { ImageUploader } from "@/components/form-builder/ImageUploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function ImageBlock({ block, isEditing = false, onUpdate }: ImageBlockProps) {
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

  const shouldAlign = size !== "full"

  if (isEditing) {
    return (
      <div className="w-full space-y-4 p-4 border-2 border-dashed border-muted-foreground/40 rounded-lg">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ImageIcon className="w-5 h-5" />
          <Label className="text-base font-medium">
            {block.label || "Image"}
          </Label>
        </div>
        
        {imageUrl ? (
          <div className="space-y-3">
            {shouldAlign ? (
              <div className={cn("w-full", alignmentWrapperClasses[alignment])}>
                <div className={cn("relative overflow-hidden rounded-lg", sizeClasses[size])}>
                  <img
                    src={imageUrl}
                    alt={altText || "Image"}
                    className={cn("w-full h-auto object-cover transition-opacity")}
                    style={{
                      borderRadius: `${borderRadius}px`,
                      opacity: opacity / 100,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className={cn("relative overflow-hidden rounded-lg", sizeClasses[size])}>
                <img
                  src={imageUrl}
                  alt={altText || "Image"}
                  className={cn("w-full h-auto object-cover transition-opacity")}
                  style={{
                    borderRadius: `${borderRadius}px`,
                    opacity: opacity / 100,
                  }}
                />
              </div>
            )}
            {caption && (
              <p className={cn(
                "text-sm text-muted-foreground italic",
                alignment === "left" && "text-left",
                alignment === "center" && "text-center",
                alignment === "right" && "text-right"
              )}>
                {caption}
              </p>
            )}
            {linkUrl && (
              <p className={cn(
                "text-xs text-muted-foreground",
                alignment === "left" && "text-left",
                alignment === "center" && "text-center",
                alignment === "right" && "text-right"
              )}>
                Lien: {linkUrl}
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            Aucune image configurée. Utilisez le panneau de propriétés pour ajouter une image.
          </div>
        )}
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="w-full p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Aucune image</p>
      </div>
    )
  }

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
          "text-sm text-muted-foreground italic",
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

