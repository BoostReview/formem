"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface MinimalOneByOneProps {
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

export function MinimalOneByOne({
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
}: MinimalOneByOneProps) {
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barre de progression ultra-minimaliste */}
      <div className="w-full bg-white px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-4 tracking-wider uppercase">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Question ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-gray-900 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {currentBlock && (
                <div className="space-y-12">
                  <div className="space-y-10">
                    {renderBlock(
                      currentBlock,
                      answers[currentBlock.id],
                      onAnswer
                    )}
                  </div>

                  {/* Bouton Commencer pour welcome */}
                  {isInWelcomePhase && currentBlock.type === "welcome" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-start"
                    >
                      <Button
                        onClick={onNext}
                        className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-200"
                        size="lg"
                      >
                        Commencer
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation minimaliste */}
      {currentBlock && !isInWelcomePhase && (
        <div className="bg-white border-t border-gray-100 px-8 py-7">
          <div className="max-w-3xl mx-auto">
            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
            
            <div className="flex items-center justify-between gap-4">
              {showPreviousButton ? (
                <Button
                  onClick={onPrevious}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-11 px-5 rounded-xl font-medium transition-all duration-200"
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
                  className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-200"
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

