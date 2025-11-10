"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { FormLayout } from "@/types"

interface AIAssistantDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLayout: FormLayout | null
  onGenerate: (description: string, options: {
    objective: string
    length: number
    isMultiStep: boolean
  }) => Promise<void>
  isGenerating: boolean
  generationProgress: {
    step: string
    progress: number
  } | null
}

export function AIAssistantDrawer({
  open,
  onOpenChange,
  selectedLayout,
  onGenerate,
  isGenerating,
  generationProgress,
}: AIAssistantDrawerProps) {
  const [description, setDescription] = React.useState("")
  const [submittedMessage, setSubmittedMessage] = React.useState("")
  const [clarificationQuestions, setClarificationQuestions] = React.useState<string[]>([])
  const [displayedQuestions, setDisplayedQuestions] = React.useState<string[]>([])
  const [isCheckingClarity, setIsCheckingClarity] = React.useState(false)
  const [loadingTexts, setLoadingTexts] = React.useState<string[]>([])
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)
  const [welcomeText, setWelcomeText] = React.useState("")
  const [clarificationText, setClarificationText] = React.useState("")
  const textsRef = React.useRef<string[]>([])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  
  const fullWelcomeText = React.useMemo(
    () => "Bonjour ! Je suis votre assistant IA pour créer des formulaires. Décrivez-moi le formulaire que vous souhaitez créer et je le générerai pour vous.",
    []
  )

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [description])

  // Réinitialiser quand le drawer s'ouvre
  React.useEffect(() => {
    if (open) {
      setDescription("")
      setSubmittedMessage("")
      setClarificationQuestions([])
      setDisplayedQuestions([])
      setIsCheckingClarity(false)
      setLoadingTexts([])
      setCurrentTextIndex(0)
      setWelcomeText("")
      setClarificationText("")
      textsRef.current = []
      
      // Effet typewriter pour le message de bienvenue
      let currentIndex = 0
      const typeWriter = () => {
        if (currentIndex < fullWelcomeText.length) {
          setWelcomeText(fullWelcomeText.slice(0, currentIndex + 1))
          currentIndex++
          setTimeout(typeWriter, 10) // Vitesse d'écriture rapide (10ms par caractère)
        } else {
          // Focus sur le textarea une fois le message terminé
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 200)
        }
      }
      
      // Démarrer l'effet typewriter après un court délai
      setTimeout(typeWriter, 200)
    }
  }, [open, fullWelcomeText])

  // Effet typewriter pour les questions de clarification
  React.useEffect(() => {
    if (clarificationQuestions.length > 0 && !isGenerating) {
      setDisplayedQuestions([])
      setClarificationText("")
      
      const introText = "Avant de créer votre formulaire, j'aurais besoin de quelques précisions :"
      let introIndex = 0
      
      const typeIntro = () => {
        if (introIndex < introText.length) {
          setClarificationText(introText.slice(0, introIndex + 1))
          introIndex++
          setTimeout(typeIntro, 10)
        } else {
          // Une fois l'intro terminée, afficher les questions une par une
          let questionIndex = 0
          const showNextQuestion = () => {
            if (questionIndex < clarificationQuestions.length) {
              setDisplayedQuestions(clarificationQuestions.slice(0, questionIndex + 1))
              questionIndex++
              setTimeout(showNextQuestion, 300) // Délai entre chaque question
            }
          }
          setTimeout(showNextQuestion, 200)
        }
      }
      
      setTimeout(typeIntro, 300)
    }
  }, [clarificationQuestions, isGenerating])

  // Scroll vers le bas quand un nouveau message arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [submittedMessage, isGenerating, currentTextIndex, clarificationQuestions, displayedQuestions, clarificationText])

  // Générer les textes de chargement avec GPT
  React.useEffect(() => {
    if (!isGenerating || !submittedMessage.trim()) {
      return
    }

    // Textes par défaut en attendant GPT
    const defaultTexts = [
      "Analyse de votre demande...",
      "Construction du formulaire...",
      "Génération des champs...",
      "Optimisation de la structure...",
      "Finalisation...",
    ]

    textsRef.current = defaultTexts
    setLoadingTexts(defaultTexts)
    setCurrentTextIndex(0)

    // Générer les textes personnalisés avec GPT
    let timeoutId: NodeJS.Timeout | null = null
    let hasStarted = false

    const generateGPTTexts = async () => {
      try {
        const response = await fetch("/api/ai/generate-loading-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: submittedMessage,
          }),
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()
        
        if (data.success && data.texts && Array.isArray(data.texts) && data.texts.length > 0) {
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }
          
          textsRef.current = data.texts
          setLoadingTexts(data.texts)
          setCurrentTextIndex(0)
          hasStarted = true
          
          timeoutId = setTimeout(showNextText, 3000)
        }
      } catch (error) {
        console.error("[LOADING] Erreur génération textes GPT:", error)
      }
    }

    // Lancer la génération GPT
    generateGPTTexts()

    // Afficher les textes un par un
    const showNextText = () => {
      if (!isGenerating) {
        if (timeoutId) clearTimeout(timeoutId)
        return
      }

      hasStarted = true
      
      setCurrentTextIndex((prevIdx) => {
        const currentTexts = textsRef.current.length > 0 ? textsRef.current : defaultTexts
        const maxIndex = currentTexts.length - 1
        
        if (prevIdx < maxIndex) {
          const nextIdx = prevIdx + 1
          const isFinal = nextIdx === maxIndex || currentTexts[nextIdx]?.toLowerCase().includes("finalisation")
          const delay = isFinal ? 500 : 3000
          
          timeoutId = setTimeout(showNextText, delay)
          return nextIdx
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }
          return prevIdx
        }
      })
    }

    // Attendre max 4 secondes pour les textes GPT, puis commencer
    timeoutId = setTimeout(() => {
      if (!hasStarted) {
        hasStarted = true
        showNextText()
      }
    }, 4000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isGenerating, submittedMessage])

  const handleGenerate = async () => {
    if (!description.trim() || isGenerating || isCheckingClarity) return
    
    const messageToSend = description.trim()
    
    // Si on a déjà des questions de clarification, on génère directement
    if (clarificationQuestions.length > 0) {
      setSubmittedMessage(messageToSend)
      setClarificationQuestions([])
      setDescription("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
      await onGenerate(messageToSend, {
        objective: "custom",
        length: 5,
        isMultiStep: selectedLayout === "one",
      })
      return
    }
    
    // Sinon, vérifier la clarté d'abord
    setIsCheckingClarity(true)
    setSubmittedMessage(messageToSend)
    setDescription("")
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    
    try {
      const response = await fetch("/api/ai/check-clarity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: messageToSend,
        }),
      })
      
      const data = await response.json()
      
      if (data.needsClarification && data.questions && data.questions.length > 0) {
        // Afficher les questions de clarification
        setClarificationQuestions(data.questions)
        setIsCheckingClarity(false)
      } else {
        // Pas besoin de clarification, générer directement
        setClarificationQuestions([])
        setIsCheckingClarity(false)
        await onGenerate(messageToSend, {
          objective: "custom",
          length: 5,
          isMultiStep: selectedLayout === "one",
        })
      }
    } catch (error) {
      console.error("Erreur vérification clarté:", error)
      // En cas d'erreur, générer quand même
      setClarificationQuestions([])
      setIsCheckingClarity(false)
      await onGenerate(messageToSend, {
        objective: "custom",
        length: 5,
        isMultiStep: selectedLayout === "one",
      })
    }
  }
  
  const handleContinueAnyway = async () => {
    if (!submittedMessage || isGenerating) return
    
    setClarificationQuestions([])
    await onGenerate(submittedMessage, {
      objective: "custom",
      length: 5,
      isMultiStep: selectedLayout === "one",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating && !isCheckingClarity) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-hidden p-0 flex flex-col h-full">
        {/* Titres d'accessibilité - toujours présents mais cachés pendant le chargement */}
        <SheetHeader className="sr-only">
          <SheetTitle>Assistant IA de formulaire</SheetTitle>
          <SheetDescription>
            {isGenerating 
              ? "Génération du formulaire en cours..." 
              : "Décris ton besoin, je construis le formulaire"}
          </SheetDescription>
        </SheetHeader>

        {/* Écran de chargement - Style GPT */}
        {isGenerating && (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0f0f23]">
            {/* Header */}
            <div className="border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-3 flex-shrink-0 bg-white dark:bg-[#0f0f23]">
              <div className="flex items-center justify-center">
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assistant IA</h2>
              </div>
            </div>

            {/* Zone de messages avec réponse de l'IA - Structure comme ChatGPT */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="max-w-3xl mx-auto flex flex-col min-h-full">
                {/* Espaceur pour pousser les messages vers le bas */}
                <div className="flex-1" />
                
                <div className="py-8 space-y-6">
                  {/* Message de bienvenue avec effet typewriter */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-white dark:text-gray-900" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                        {welcomeText}
                        {welcomeText.length < fullWelcomeText.length && (
                          <span className="inline-block w-0.5 h-4 bg-gray-800 dark:bg-gray-200 ml-1 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Message de l'utilisateur */}
                  {submittedMessage && (
                    <div className="flex items-start gap-4">
                      <div className="flex-1" />
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">U</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {submittedMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Réponse de l'IA en cours */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-white dark:text-gray-900" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-1 mb-2">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <AnimatePresence mode="wait">
                        {loadingTexts.length > 0 && currentTextIndex < loadingTexts.length && (
                          <motion.p
                            key={currentTextIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-600 dark:text-gray-400 text-sm"
                          >
                            {loadingTexts[currentTextIndex]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input désactivé pendant la génération */}
            <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-[#0f0f23] flex-shrink-0">
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a2e] opacity-50">
                    <Textarea
                      placeholder="Message..."
                      value=""
                      disabled
                      rows={1}
                      className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-12 py-3 px-4 text-sm leading-6 min-h-[52px]"
                    />
                    <Button
                      disabled
                      size="sm"
                      className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg bg-gray-400 text-white cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu normal du drawer - Style OpenAI GPT */}
        {!isGenerating && (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0f0f23]">
            {/* Header minimaliste style GPT */}
            <div className="border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-3 flex-shrink-0 bg-white dark:bg-[#0f0f23]">
              <div className="flex items-center justify-center">
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assistant IA</h2>
              </div>
            </div>

            {/* Zone de messages style GPT - Structure comme ChatGPT */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="max-w-3xl mx-auto flex flex-col min-h-full">
                {/* Espaceur pour pousser les messages vers le bas */}
                <div className="flex-1" />
                
                <div className="py-8 space-y-6">
                  {/* Message de bienvenue avec effet typewriter */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-white dark:text-gray-900" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                        {welcomeText}
                        {welcomeText.length < fullWelcomeText.length && (
                          <span className="inline-block w-0.5 h-4 bg-gray-800 dark:bg-gray-200 ml-1 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Message de l'utilisateur s'il y en a un */}
                  {submittedMessage && (
                    <div className="flex items-start gap-4">
                      <div className="flex-1" />
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">U</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {submittedMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Questions de clarification avec effet typewriter */}
                  {clarificationQuestions.length > 0 && !isGenerating && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-white dark:text-gray-900" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                          {clarificationText}
                          {clarificationText.length < "Avant de créer votre formulaire, j'aurais besoin de quelques précisions :".length && (
                            <span className="inline-block w-0.5 h-4 bg-gray-800 dark:bg-gray-200 ml-1 animate-pulse" />
                          )}
                        </p>
                        {displayedQuestions.length > 0 && (
                          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                            {displayedQuestions.map((question, index) => (
                              <li key={index} className="leading-relaxed">
                                {question}
                              </li>
                            ))}
                          </ul>
                        )}
                        {displayedQuestions.length === clarificationQuestions.length && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={handleContinueAnyway}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Continuer quand même
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Indicateur de vérification */}
                  {isCheckingClarity && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-white dark:text-gray-900" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Analyse de votre demande...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input fixe en bas - Style GPT exact */}
            <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-[#0f0f23] flex-shrink-0">
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Message..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-12 py-3 px-4 text-sm leading-6 min-h-[52px] max-h-[200px]"
                    />
                    <Button
                      onClick={handleGenerate}
                      disabled={!description.trim() || isGenerating || isCheckingClarity}
                      size="sm"
                      className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Envoyer"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    L'assistant peut faire des erreurs. Vérifiez les informations importantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

