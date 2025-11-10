"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface NeonTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function NeonTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: NeonTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")
  
  // Vérifier si tous les blocs sont des blocs informatifs (menu-restaurant, heading, paragraph, etc.)
  const hasOnlyInformationalBlocks = formBlocks.length > 0 && 
    formBlocks.every(block => 
      ["menu-restaurant", "heading", "paragraph", "youtube"].includes(block.type)
    )

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff8a80 100%)",
      }}
    >
      {/* Effets néon animés */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-2 h-full bg-yellow-400 opacity-50"
          style={{ filter: "blur(40px)" }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleX: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-2 h-full bg-orange-400 opacity-50"
          style={{ filter: "blur(40px)" }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleX: [1, 1.5, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 py-8 sm:py-16 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-10">
          {/* Blocs welcome - Style néon */}
          {welcomeBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
            >
              <div
                className="bg-gray-900/90 border-4 border-yellow-400 rounded-lg sm:rounded-xl p-4 sm:p-8 relative overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(245, 158, 11, 0.1)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                />
                <div className="relative z-10 space-y-4 text-white">
                  {renderBlock(block, undefined, () => {})}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Blocs formulaire - Style néon */}
          {formBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: (welcomeBlocks.length + index) * 0.15,
                type: "spring",
                stiffness: 150 
              }}
            >
              <div
                className="bg-gray-900/90 border-4 border-yellow-400 rounded-lg sm:rounded-xl p-4 sm:p-8 hover:border-orange-400 transition-all duration-300 relative overflow-hidden"
                style={{
                  boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.3,
                  }}
                />
                <div className="relative z-10 space-y-6 text-white">
                  {renderBlock(block, answers[block.id], onAnswer)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bouton - Style néon */}
          {!hasOnlyInformationalBlocks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="pt-4"
          >
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full h-14 sm:h-16 bg-yellow-400 border-4 border-yellow-400 text-gray-900 hover:bg-orange-400 hover:border-orange-400 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.span>
                  Envoi...
                </span>
              ) : (
                "⚡ ENVOYER ⚡"
              )}
            </Button>
          </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


