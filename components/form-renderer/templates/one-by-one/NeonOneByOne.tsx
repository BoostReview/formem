"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { renderBlock } from "../../blocks/BlockRenderer"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Form, FormBlock } from "@/types"

interface NeonOneByOneProps {
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

export function NeonOneByOne({
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
}: NeonOneByOneProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Effet de grille subtile en fond */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Lueur ambiante bleue subtile */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />

      {/* Barre de progression dark professional */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3 tracking-wider uppercase">
            <span>
              {isInWelcomePhase 
                ? `Bienvenue`
                : `Question ${currentIndex - welcomeBlocks.length + 1} sur ${blocks.length}`}
            </span>
            <span className="text-blue-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Contenu centré dark professional */}
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
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 shadow-2xl shadow-black/20 border border-slate-700/50 ring-1 ring-blue-500/10">
                {currentBlock && (
                  <div className="space-y-12 text-slate-100">
                    <div className="space-y-10">
                      {renderBlock(
                        currentBlock,
                        answers[currentBlock.id],
                        onAnswer
                      )}
                    </div>

                    {/* Bouton Commencer dark professional */}
                    {isInWelcomePhase && currentBlock.type === "welcome" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-start"
                      >
                        <Button
                          onClick={onNext}
                          className="bg-blue-600 text-white hover:bg-blue-500 h-12 px-8 rounded-xl font-medium text-base shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-200"
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

      {/* Navigation dark professional */}
      {currentBlock && !isInWelcomePhase && (
        <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 px-8 py-7">
          <div className="max-w-3xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 bg-red-900/50 border border-red-700/50 rounded-xl text-sm text-red-200 font-medium"
              >
                {error}
              </motion.div>
            )}
            <div className="flex items-center justify-between gap-4">
              {showPreviousButton ? (
                <Button
                  onClick={onPrevious}
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 h-11 px-5 rounded-xl font-medium transition-all duration-200"
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
                  className="bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 h-11 px-8 rounded-xl font-medium text-base shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-200"
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

