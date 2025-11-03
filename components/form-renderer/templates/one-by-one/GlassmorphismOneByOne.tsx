"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface GlassmorphismOneByOneProps {
  form: Form
  welcomeBlocks: FormBlock[]
  blocks: FormBlock[]
  currentIndex: number
  answers: Record<string, unknown>
  progress: number
  onAnswer: (blockId: string, value: unknown) => void
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
  showNextButton: boolean
  showPreviousButton: boolean
  error?: string | null
}

export function GlassmorphismOneByOne({
  form,
  welcomeBlocks,
  blocks,
  currentIndex,
  answers,
  progress,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  showNextButton,
  showPreviousButton,
  error,
}: GlassmorphismOneByOneProps) {
  const isInWelcomePhase = currentIndex < welcomeBlocks.length
  const totalBlocks = welcomeBlocks.length + blocks.length
  
  let currentBlock: FormBlock | undefined
  let currentProgressIndex = currentIndex
  
  if (isInWelcomePhase && welcomeBlocks.length > 0) {
    currentBlock = welcomeBlocks[currentIndex]
  } else if (blocks.length > 0) {
    const formBlockIndex = currentIndex - welcomeBlocks.length
    if (formBlockIndex >= 0 && formBlockIndex < blocks.length) {
      currentBlock = blocks[formBlockIndex]
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 50%, #fce7f3 100%)",
      }}
    >
      {/* Effets de fond animés doux */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Barre de progression glassmorphism douce */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/40 border-b border-white/60 px-8 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-3 tracking-wide">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Question ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-violet-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/60">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Contenu centré glassmorphism */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-2xl p-12 shadow-2xl shadow-gray-900/5">
                {currentBlock && (
                  <div className="space-y-12 text-gray-800">
                    <div className="space-y-10">
                      {renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )}
                    </div>

                    {/* Bouton Commencer glassmorphism */}
                    {isInWelcomePhase && currentBlock.type === "welcome" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-start"
                      >
                        <Button
                          onClick={onNext}
                          className="backdrop-blur-xl bg-white/60 border border-white/80 text-gray-800 hover:bg-white/70 h-12 px-8 rounded-xl font-medium text-base shadow-lg shadow-gray-900/10 transition-all duration-200"
                          size="lg"
                        >
                          Commencer
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation glassmorphism */}
      {currentBlock && !isInWelcomePhase && (
        <div className="relative z-10 backdrop-blur-2xl bg-white/40 border-t border-white/60 px-8 py-7">
          <div className="max-w-3xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
            <div className="flex items-center justify-between gap-4">
              {showPreviousButton ? (
                <Button
                  onClick={onPrevious}
                  variant="ghost"
                  className="backdrop-blur-xl bg-white/30 border border-white/50 text-gray-700 hover:bg-white/50 h-11 px-5 rounded-xl font-medium transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}
              {showNextButton && (
                <Button
                  onClick={currentIndex === totalBlocks - 1 ? onSubmit : onNext}
                  disabled={isSubmitting}
                  className="backdrop-blur-xl bg-white/60 border border-white/80 text-gray-800 hover:bg-white/70 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-lg shadow-gray-900/10 transition-all duration-200"
                >
                  {currentIndex === totalBlocks - 1 ? "Envoyer" : "Suivant"}
                  {currentIndex !== totalBlocks - 1 && (
                    <ChevronRight className="h-5 w-5 ml-1.5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

