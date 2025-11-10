"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface BoldOneByOneProps {
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

export function BoldOneByOne({
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
}: BoldOneByOneProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50 flex flex-col relative">
      {/* Motif géométrique subtil */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgb(20, 184, 166) 35px, rgb(20, 184, 166) 36px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgb(16, 185, 129) 35px, rgb(16, 185, 129) 36px)
          `,
        }}
      />

      {/* Barre de progression clean */}
      {!isMenuRestaurant && (
      <div className="relative z-10 bg-white/70 backdrop-blur-md border-b border-teal-200/60 px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-700 mb-3 tracking-wide">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Question ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-teal-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-teal-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>
      )}

      {/* Contenu centré clean */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl shadow-teal-100/50 border border-teal-200/40">
                {currentBlock && (
                  <div className="space-y-12">
                    <div className="space-y-10">
                      {renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )}
                    </div>

                    {/* Bouton Commencer clean */}
                    {isInWelcomePhase && currentBlock.type === "welcome" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-start"
                      >
                        <Button
                          onClick={onNext}
                          className="bg-teal-600 text-white hover:bg-teal-700 h-12 px-8 rounded-xl font-medium text-base shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all duration-200"
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

      {/* Navigation clean */}
      {currentBlock && !isInWelcomePhase && !isMenuRestaurant && (
        <div className="relative z-10 bg-white/70 backdrop-blur-md border-t border-teal-200/60 px-8 py-7 pb-12">
          <div className="max-w-3xl mx-auto">
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
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-11 px-5 rounded-xl font-medium transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}
              {showNextButton && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentIndex === totalBlocks - 1) {
                      onSubmit();
                    } else {
                      onNext();
                    }
                  }}
                  disabled={isSubmitting}
                  className="bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all duration-200"
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

