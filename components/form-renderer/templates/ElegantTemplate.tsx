"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface ElegantTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ElegantTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: ElegantTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")
  
  // Vérifier si tous les blocs sont des blocs informatifs (menu-restaurant, heading, paragraph, etc.)
  const hasOnlyInformationalBlocks = formBlocks.length > 0 && 
    formBlocks.every(block => 
      ["menu-restaurant", "heading", "paragraph", "youtube"].includes(block.type)
    )

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Pattern de fond élégant */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(139, 92, 246, 0.03) 10px,
              rgba(139, 92, 246, 0.03) 20px
            )
          `,
        }}
      />

      <div className="relative z-10 py-8 sm:py-20 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-12">
          {/* Blocs welcome - Design élégant avec ombres profondes */}
          {welcomeBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div
                className="bg-white rounded-xl sm:rounded-3xl p-6 sm:p-12 shadow-[0_20px_60px_rgba(139,92,246,0.15)] hover:shadow-[0_25px_70px_rgba(139,92,246,0.2)] transition-all duration-500 border border-purple-100/50"
              >
                <div className="space-y-6">
                  {renderBlock(block, undefined, () => {})}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Blocs formulaire - Design élégant avec dégradés */}
          {formBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: (welcomeBlocks.length + index) * 0.15,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div
                className="bg-white rounded-xl sm:rounded-3xl p-5 sm:p-10 shadow-[0_15px_50px_rgba(139,92,246,0.12)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.18)] hover:scale-[1.01] transition-all duration-500 border border-purple-100/50"
              >
                <div className="space-y-6">
                  {renderBlock(block, answers[block.id], onAnswer)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bouton - Style élégant avec dégradé */}
          {!hasOnlyInformationalBlocks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-8 flex justify-center"
          >
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-16 px-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl text-lg font-semibold shadow-[0_10px_40px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_50px_rgba(139,92,246,0.4)] hover:scale-105 transition-all duration-300 border-0"
              size="lg"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer avec élégance"}
            </Button>
          </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


