"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface ModernOneByOneProps {
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

export function ModernOneByOne({
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
}: ModernOneByOneProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col">
      {/* Barre de progression moderne avec accent bleu */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-8 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3 tracking-wide">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Étape ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Contenu centré avec carte moderne */}
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
              <div className="bg-white rounded-2xl p-12 shadow-xl shadow-slate-200/40 border border-slate-200/50">
                {currentBlock && (
                  <div className="space-y-12">
                    <div className="space-y-10">
                      {renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )}
                    </div>

                    {/* Bouton Commencer moderne */}
                    {isInWelcomePhase && currentBlock.type === "welcome" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-start"
                      >
                        <Button
                          onClick={onNext}
                          className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-xl font-medium text-base shadow-md hover:shadow-lg transition-all duration-200"
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

      {/* Navigation moderne */}
      {currentBlock && !isInWelcomePhase && (
        <div className="bg-white/90 backdrop-blur-md border-t border-slate-200/60 px-8 py-7">
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
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-11 px-5 rounded-xl font-medium transition-all duration-200"
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
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-md hover:shadow-lg transition-all duration-200"
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

