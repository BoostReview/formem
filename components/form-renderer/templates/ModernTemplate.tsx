"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface ModernTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ModernTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: ModernTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")
  
  // Vérifier si tous les blocs sont des blocs informatifs (menu-restaurant, heading, paragraph, etc.)
  const hasOnlyInformationalBlocks = formBlocks.length > 0 && 
    formBlocks.every(block => 
      ["menu-restaurant", "heading", "paragraph", "youtube"].includes(block.type)
    )

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Layout en grille moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Blocs welcome - Design en colonnes */}
          {welcomeBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={index === welcomeBlocks.length - 1 && welcomeBlocks.length % 2 === 1 ? "md:col-span-2" : ""}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="space-y-4">
                  {renderBlock(block, undefined, () => {})}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blocs formulaire - Design moderne avec sections colorées */}
        <div className="space-y-4 sm:space-y-6">
          {formBlocks.map((block, index) => {
            const colors = [
              "border-blue-500 bg-blue-50",
              "border-purple-500 bg-purple-50",
              "border-pink-500 bg-pink-50",
              "border-indigo-500 bg-indigo-50",
            ]
            const colorClass = colors[index % colors.length]

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (welcomeBlocks.length + index) * 0.08, duration: 0.4 }}
              >
                <div className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-md border-l-4 ${colorClass} hover:shadow-xl transition-all duration-300`}>
                  <div className="space-y-6">
                    {renderBlock(block, answers[block.id], onAnswer)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bouton - Style moderne centré */}
        {!hasOnlyInformationalBlocks && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-14 px-16 bg-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
            size="lg"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </motion.div>
        )}
      </div>
    </div>
  )
}


