"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { DynamicButton } from "../../DynamicButton"
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
  nextBlockForHeading?: FormBlock
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
  nextBlockForHeading,
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

  const isMenuRestaurant = currentBlock?.type === "menu-restaurant"

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Barre de progression ultra-minimaliste */}
      {!isMenuRestaurant && (
      <div className="w-full bg-white px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3 tracking-wider uppercase">
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
      )}

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-6 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {currentBlock && (
                <div className="space-y-4 sm:space-y-8">
                  <div className="space-y-6">
                    {/* Si c'est un heading et qu'il y a un bloc suivant, afficher les deux */}
                    {currentBlock.type === "heading" && nextBlockForHeading ? (
                      <>
                        {renderBlock(
                          currentBlock,
                          answers[currentBlock.id],
                          onAnswer
                        )}
                        {renderBlock(
                          nextBlockForHeading,
                          answers[nextBlockForHeading.id],
                          onAnswer
                        )}
                      </>
                    ) : (
                      renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )
                    )}
                  </div>

                  {/* Bouton Commencer pour welcome */}
                  {isInWelcomePhase && currentBlock.type === "welcome" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center"
                    >
                      <DynamicButton
                        onClick={onNext}
                        theme={form.theme_json || {}}
                        className="!w-auto"
                      >
                        Commencer
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </DynamicButton>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation minimaliste */}
      {currentBlock && !isInWelcomePhase && !isMenuRestaurant && (
        <div className="bg-white border-t border-gray-100 px-3 sm:px-6 py-4 sm:py-5 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
            
            <div className="flex items-center justify-between gap-3 overflow-visible">
              {showPreviousButton ? (
                <Button
                  onClick={onPrevious}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-10 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}
              {showNextButton && (
                <div className="overflow-visible">
                  <DynamicButton
                    onClick={() => {
                      if (currentIndex === totalBlocks - 1) {
                        onSubmit();
                      } else {
                        onNext();
                      }
                    }}
                    disabled={isSubmitting}
                    theme={form.theme_json || {}}
                    className="!w-auto"
                  >
                    {currentIndex === totalBlocks - 1 ? "Envoyer" : "Suivant"}
                    {currentIndex !== totalBlocks - 1 && (
                      <ChevronRight className="h-4 w-4 ml-1" />
                    )}
                  </DynamicButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

