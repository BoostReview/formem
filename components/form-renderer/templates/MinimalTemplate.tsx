"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { renderBlock } from "../blocks/BlockRenderer"
import { DynamicButton } from "../DynamicButton"
import { cn } from "@/lib/utils"
import type { Form, FormBlock } from "@/types"

interface MinimalTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  errors?: Record<string, string>
  errorRefs?: React.RefObject<Record<string, HTMLDivElement | null>>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function MinimalTemplate({
  form,
  blocks,
  answers,
  errors = {},
  errorRefs,
  onAnswer,
  onSubmit,
  isSubmitting,
}: MinimalTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")
  
  // Vérifier si tous les blocs sont des blocs informatifs (menu-restaurant, heading, paragraph, etc.)
  const hasOnlyInformationalBlocks = formBlocks.length > 0 && 
    formBlocks.every(block => 
      ["menu-restaurant", "heading", "paragraph", "youtube"].includes(block.type)
    )

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Blocs welcome - Design minimal épuré */}
        {welcomeBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-gray-200 pb-4 sm:pb-8"
          >
            <div className="space-y-4">
              {renderBlock(block, undefined, () => {})}
            </div>
          </motion.div>
        ))}

        {/* Blocs formulaire - Design minimal sans cartes */}
        {formBlocks.map((block, index) => {
          const hasError = errors[block.id]
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (welcomeBlocks.length + index) * 0.05 }}
              className={cn(
                "space-y-2 py-4 sm:py-6 border-b border-gray-100 last:border-b-0",
                hasError && "border-red-200"
              )}
              ref={(el) => {
                if (errorRefs && el) {
                  if (!errorRefs.current) {
                    errorRefs.current = {}
                  }
                  errorRefs.current[block.id] = el
                }
              }}
            >
              {renderBlock(block, answers[block.id], onAnswer)}
              {hasError && (
                <p className="text-sm text-red-600 font-medium mt-1">
                  {errors[block.id]}
                </p>
              )}
            </motion.div>
          )
        })}

        {/* Bouton dynamique avec personnalisation du thème */}
        {!hasOnlyInformationalBlocks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-6 sm:pt-8 overflow-visible"
        >
          <DynamicButton
            onClick={onSubmit}
            disabled={isSubmitting}
            theme={form.theme_json || {}}
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </DynamicButton>
        </motion.div>
        )}
      </div>
    </div>
  )
}


