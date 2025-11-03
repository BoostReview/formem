"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface ElegantOneByOneProps {
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

export function ElegantOneByOne({
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
}: ElegantOneByOneProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex flex-col relative">
      {/* Motif subtil en fond */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgb(51, 65, 85) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Barre de progression corporate */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-4 tracking-wider uppercase">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Question ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Contenu centré élégant et sobre */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white rounded-2xl p-14 shadow-2xl shadow-gray-900/5 border border-gray-200/80">
                {currentBlock && (
                  <div className="space-y-12">
                    <div className="space-y-10">
                      {renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )}
                    </div>

                    {/* Bouton Commencer corporate */}
                    {isInWelcomePhase && currentBlock.type === "welcome" && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="flex justify-start"
                      >
                        <Button
                          onClick={onNext}
                          className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 rounded-xl font-medium text-base shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/15 transition-all duration-250"
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

      {/* Navigation élégante et sobre */}
      {currentBlock && !isInWelcomePhase && (
        <div className="relative z-10 bg-white/90 backdrop-blur-md border-t border-gray-200/80 px-8 py-7">
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
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-5 rounded-xl font-medium transition-all duration-200"
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
                  className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/15 transition-all duration-250"
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

