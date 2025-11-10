"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, FileText, Loader2, Check, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createForm } from "@/app/actions/forms"
import { cn } from "@/lib/utils"
import { AIAssistantDrawer } from "@/components/form-builder/AIAssistantDrawer"
import type { FormLayout } from "@/types"

export default function NewFormPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState<FormLayout | null>(null)
  const [aiLoading, setAiLoading] = React.useState(false)
  const [aiDrawerOpen, setAiDrawerOpen] = React.useState(false)
  const [selectedLayout, setSelectedLayout] = React.useState<FormLayout | null>(null)
  const [generationProgress, setGenerationProgress] = React.useState<{
    step: string
    progress: number
  } | null>(null)

  const handleCreateForm = async (layout: FormLayout, schema?: any[]) => {
    if (loading) return

    setLoading(layout)

    try {
      const result = await createForm({
        title: "Nouveau formulaire",
        layout: layout,
        schema: schema,
      })

      if (result.success && result.formId) {
        toast.success("Formulaire créé", {
          description: schema ? "Formulaire généré par l'IA créé !" : "Redirection vers l'éditeur...",
        })
        setTimeout(() => {
          router.push(`/dashboard/forms/${result.formId}/edit`)
        }, 100)
      } else {
        console.error("Erreur lors de la création:", result.error)
        toast.error("Erreur", {
          description: result.error || "Impossible de créer le formulaire",
        })
        setLoading(null)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la création",
      })
      setLoading(null)
    }
  }

  const handleAIGenerate = async (
    description: string,
    options: {
      objective: string
      length: number
      isMultiStep: boolean
    }
  ) => {
    if (!selectedLayout) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un layout",
      })
      return
    }

    setAiLoading(true)
    setGenerationProgress({ step: "Analyse de ta description", progress: 10 })

    // Simuler la progression
    const progressSteps = [
      { step: "Analyse de ta description", progress: 25 },
      { step: "Construction des questions", progress: 60 },
      { step: "Optimisation de l'ordre des champs", progress: 90 },
    ]

    let progressIndex = 0
    const progressInterval = setInterval(() => {
      if (progressIndex < progressSteps.length) {
        setGenerationProgress(progressSteps[progressIndex])
        progressIndex++
      }
    }, 800)

    try {
      // Enrichir la description avec les options
      const enrichedDescription = `${description}. Objectif: ${options.objective}. Longueur: ${options.length}/10. Style: ${options.isMultiStep ? "multi-étapes" : "une page"}.`

      const response = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: enrichedDescription,
          layout: selectedLayout,
        }),
      })

      const data = await response.json()

      // Arrêter l'interval de progression et mettre à 100%
      clearInterval(progressInterval)
      setGenerationProgress({ step: "Finalisation...", progress: 100 })

      if (data.success && data.schema) {
        // Créer le formulaire AVANT de fermer le drawer
        // Utiliser le titre généré par l'IA, ou un titre par défaut
        const formTitle = data.title || "Formulaire généré"
        const result = await createForm({
          title: formTitle,
          layout: selectedLayout,
          schema: data.schema,
        })

        if (result.success && result.formId) {
          // Maintenir le loading jusqu'à la redirection
          // L'écran de chargement restera visible jusqu'à ce que isGenerating soit false
          // On le met à false seulement après un court délai pour laisser voir "Finalisation..."
          setTimeout(() => {
            setAiLoading(false)
            setGenerationProgress(null)
            setAiDrawerOpen(false)
            
            toast.success("Formulaire généré !", {
              description: "Redirection vers l'éditeur...",
            })
            
            // Rediriger vers l'éditeur
            setTimeout(() => {
              router.push(`/dashboard/forms/${result.formId}/edit`)
            }, 300)
          }, 500)
        } else {
          clearInterval(progressInterval)
          setAiLoading(false)
          setGenerationProgress(null)
          throw new Error(result.error || "Erreur lors de la création")
        }
      } else {
        clearInterval(progressInterval)
        setAiLoading(false)
        setGenerationProgress(null)
        throw new Error(data.error || "Erreur lors de la génération")
      }
    } catch (error) {
      console.error("Erreur génération IA:", error)
      clearInterval(progressInterval)
      setAiLoading(false)
      setGenerationProgress(null)
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Impossible de générer le formulaire avec l'IA",
      })
    }
  }

  const layouts = [
    {
      type: "one" as FormLayout,
      title: "One-by-one",
      description: "Une question par page",
      icon: Sparkles,
      previewImage: process.env.NEXT_PUBLIC_LAYOUT_ONE_IMAGE || "/api/files/AeVaWerY74rdiUw8e67kW.png", // URL relative qui fonctionne en prod
      advantages: [
        "Expérience immersive et focalisée",
        "Réduction de l'abandon",
        "Idéal pour les formulaires longs",
        "Design moderne comme Typeform",
      ],
    },
    {
      type: "page" as FormLayout,
      title: "All-in-one",
      description: "Tout sur une page",
      icon: FileText,
      previewImage: process.env.NEXT_PUBLIC_LAYOUT_PAGE_IMAGE || "/api/files/FD2Cpy1ZeIJnX4pqt4svq.png", // URL relative qui fonctionne en prod
      advantages: [
        "Vue d'ensemble complète",
        "Navigation rapide",
        "Idéal pour les formulaires courts",
        "Expérience traditionnelle",
      ],
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="transition-all duration-200 hover:scale-110 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouveau formulaire</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Choisissez le type de layout pour votre formulaire
            </p>
          </div>
        </div>
      </div>

      {/* Options de layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {layouts.map((layout) => {
          const Icon = layout.icon
          const isLoading = loading === layout.type
          const isSelected = selectedLayout === layout.type

          return (
            <Card
              key={layout.type}
              className={cn(
                "cursor-pointer transition-all duration-300",
                "hover:shadow-xl hover:border-primary/20 hover:-translate-y-1",
                isLoading && "ring-2 ring-primary shadow-lg",
                isSelected && "ring-2 ring-primary border-primary/30 shadow-md",
                loading && !isLoading && "opacity-50 cursor-not-allowed hover:shadow-lg hover:translate-y-0"
              )}
              onClick={() => {
                if (!loading) {
                  setSelectedLayout(layout.type)
                }
              }}
            >
              {layout.previewImage ? (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{layout.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {layout.description}
                        </CardDescription>
                      </div>
                      {isSelected && !isLoading && (
                        <div className="rounded-full bg-primary text-primary-foreground p-2 shadow-sm">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      {isLoading && (
                        <div className="rounded-full bg-primary text-primary-foreground p-2 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                      <img 
                        src={layout.previewImage} 
                        alt={layout.description}
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "rounded-xl p-3 transition-all duration-300",
                          isSelected 
                            ? "bg-primary/15 ring-2 ring-primary/20" 
                            : "bg-muted/50 hover:bg-primary/10"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6 transition-colors duration-300",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{layout.title}</CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {layout.description}
                          </CardDescription>
                        </div>
                      </div>
                      {isLoading && (
                        <div className="rounded-full bg-primary text-primary-foreground p-2 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {isSelected && !isLoading && (
                        <div className="rounded-full bg-primary text-primary-foreground p-2 shadow-sm">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {layout.advantages.map((advantage, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 text-sm transition-opacity duration-200"
                        >
                          <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground leading-relaxed">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </>
              )}
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      {selectedLayout && (
        <div className="flex items-center justify-center gap-4 pt-8 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleCreateForm(selectedLayout)}
            disabled={loading !== null}
            className="transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            {loading === selectedLayout ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Créer manuellement
              </>
            )}
          </Button>

          <AIAssistantDrawer
            open={aiDrawerOpen}
            onOpenChange={setAiDrawerOpen}
            selectedLayout={selectedLayout}
            onGenerate={handleAIGenerate}
            isGenerating={aiLoading}
            generationProgress={generationProgress}
          />
          
          <Button
            size="lg"
            onClick={() => setAiDrawerOpen(true)}
            disabled={loading !== null}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Assistant IA de formulaire
          </Button>
        </div>
      )}
    </div>
  )
}
