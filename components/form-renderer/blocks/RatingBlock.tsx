"use client"

import * as React from "react"
import type { FormBlock } from "@/types"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface RatingBlockProps {
  block: FormBlock
  value?: unknown
  onChange: (value: unknown) => void
}

export function RatingBlock({ block, value, onChange }: RatingBlockProps) {
  const maxRating = (block.maxRating as number) || 5
  const helpText = (block.helpText as string) || ""
  const currentRating = (value as number) || 0
  const align = getAlignment(block as any)

  return (
    <div className="space-y-4 pt-6">
      <Label className={cn(
        "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
        alignmentClasses[align]
      )}>
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      {helpText && (
        <p className={cn(
          "text-sm text-gray-500 dark:text-gray-400 -mt-2",
          alignmentClasses[align]
        )}>
          {helpText}
        </p>
      )}
      <div className={cn(
        "flex items-center gap-2",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        align === "left" && "justify-start"
      )}>
        {Array.from({ length: maxRating }).map((_, index) => {
          const rating = index + 1
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(rating)}
              className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <Star
                className={cn(
                  "w-10 h-10 transition-all",
                  rating <= currentRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            </button>
          )
        })}
      </div>
      {currentRating > 0 && (
        <p className={cn(
          "text-sm text-gray-500",
          alignmentClasses[align]
        )}>
          {currentRating} / {maxRating} étoiles
        </p>
      )}
    </div>
  )
}

