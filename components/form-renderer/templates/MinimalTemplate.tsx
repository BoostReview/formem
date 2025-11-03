"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface MinimalTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function MinimalTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: MinimalTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Blocs welcome - Design minimal épuré */}
        {welcomeBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-gray-200 pb-8"
          >
            <div className="space-y-4">
              {renderBlock(block, undefined, () => {})}
            </div>
          </motion.div>
        ))}

        {/* Blocs formulaire - Design minimal sans cartes */}
        {formBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (welcomeBlocks.length + index) * 0.05 }}
            className="space-y-4 py-6 border-b border-gray-100 last:border-b-0"
          >
            {renderBlock(block, answers[block.id], onAnswer)}
          </motion.div>
        ))}

        {/* Bouton - Style minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8"
        >
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white hover:bg-gray-800 h-12 rounded-none border-0"
            size="lg"
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

