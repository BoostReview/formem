"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../blocks/BlockRenderer"
import type { Form, FormBlock } from "@/types"

interface BoldTemplateProps {
  form: Form
  blocks: FormBlock[]
  answers: Record<string, unknown>
  onAnswer: (blockId: string, value: unknown) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function BoldTemplate({
  form,
  blocks,
  answers,
  onAnswer,
  onSubmit,
  isSubmitting,
}: BoldTemplateProps) {
  const welcomeBlocks = blocks.filter((b) => b.type === "welcome")
  const formBlocks = blocks.filter((b) => b.type !== "welcome")

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      }}
    >
      {/* Motifs de fond dynamiques */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border-4 border-orange-400/20 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Blocs welcome - Design bold avec bordures épaisses */}
          {welcomeBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <div
                className="bg-white border-8 border-orange-500 rounded-2xl p-10 shadow-[0_15px_50px_rgba(245,158,11,0.3)] hover:border-red-500 hover:shadow-[0_20px_60px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-all duration-300 transform hover:rotate-1"
              >
                <div className="space-y-6">
                  {renderBlock(block, undefined, () => {})}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Blocs formulaire - Design bold énergique */}
          {formBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: (welcomeBlocks.length + index) * 0.12,
                type: "spring",
                stiffness: 120
              }}
            >
              <div
                className={`bg-white border-8 ${
                  index % 2 === 0 ? "border-orange-500" : "border-red-500"
                } rounded-2xl p-10 shadow-[0_12px_40px_rgba(245,158,11,0.25)] hover:border-yellow-500 hover:shadow-[0_18px_55px_rgba(245,158,11,0.35)] hover:scale-[1.02] transition-all duration-300 transform hover:-rotate-1`}
              >
                <div className="space-y-6">
                  {renderBlock(block, answers[block.id], onAnswer)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bouton - Style bold ultra visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            className="pt-6"
          >
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 border-8 border-orange-600 text-white rounded-2xl text-xl font-black shadow-[0_15px_50px_rgba(245,158,11,0.4)] hover:from-red-500 hover:to-orange-500 hover:shadow-[0_20px_60px_rgba(245,158,11,0.5)] hover:scale-110 transition-all duration-300 uppercase tracking-wider"
              size="lg"
            >
              {isSubmitting ? "ENVOI..." : "🚀 ENVOYER MAINTENANT 🚀"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

