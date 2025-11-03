"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface YouTubeBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function YouTubeBlock({ block, isEditing = false, onUpdate }: YouTubeBlockProps) {
  const url = (block.url as string) || ""

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return null
  }

  const embedUrl = getYouTubeEmbedUrl(url)

  return (
    <div className="w-full space-y-2">
      <Label className="text-base font-medium">
        {block.label || "Vidéo YouTube"}
      </Label>
      {isEditing ? (
        <Input
          type="url"
          value={url}
          onChange={(e) => onUpdate?.({ url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      ) : embedUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Aucune vidéo configurée
        </div>
      )}
    </div>
  )
}


