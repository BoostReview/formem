"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface GlassmorphismTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function GlassmorphismTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: GlassmorphismTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Effets de fond animés */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Blocs welcome - Effet glassmorphism */}
          {welcomeBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
            >
              <div
                className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <div className="space-y-4 text-white">
                  {renderBlock(block, undefined, () => {})}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Blocs formulaire - Effet glassmorphism */}
          {formBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: (welcomeBlocks.length + index) * 0.15,
                type: "spring",
                stiffness: 100 
              }}
            >
              <div
                className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl hover:bg-white/25 transition-all duration-300"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <div className="space-y-6 text-white">
                  {renderBlock(block, answers[block.id], onAnswer)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bouton - Style glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full h-14 backdrop-blur-xl bg-white/30 border border-white/50 text-white hover:bg-white/40 rounded-2xl text-lg font-semibold shadow-2xl transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le formulaire"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

