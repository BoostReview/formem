"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, FileText, Check, Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createForm } from "@/app/actions/forms"
import { cn } from "@/lib/utils"
import type { FormLayout } from "@/types"
import { TemplateSelector } from "@/components/templates/TemplateSelector"
import type { FormTemplate } from "@/lib/templates"

export default function NewFormPage() {
  const router = useRouter()
  const [selectedLayout, setSelectedLayout] = React.useState<FormLayout | null>(null)
  const [selectedTemplate, setSelectedTemplate] = React.useState<FormTemplate | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [step, setStep] = React.useState<"layout" | "template">("layout")

  const handleSelectLayout = (layout: FormLayout) => {
    setSelectedLayout(layout)
    setSelectedTemplate(null) // Réinitialiser le template
    setStep("template")
  }

  const handleCreateForm = async () => {
    if (loading || !selectedLayout) return

    setLoading(true)

    try {
      const result = await createForm({
        title: selectedTemplate?.name || "Nouveau formulaire",
        layout: selectedLayout,
        templateId: selectedTemplate?.id,
      })

      if (result.success && result.formId) {
        console.log("Formulaire créé avec succès, ID:", result.formId)
        toast.success("Formulaire créé", {
          description: selectedTemplate
            ? `Template "${selectedTemplate.name}" appliqué`
            : "Redirection vers l'éditeur...",
        })
        setTimeout(() => {
          router.push(`/dashboard/forms/${result.formId}/edit`)
        }, 100)
      } else {
        console.error("Erreur lors de la création:", result.error)
        toast.error("Erreur", {
          description: result.error || "Impossible de créer le formulaire",
        })
        setLoading(false)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la création",
      })
      setLoading(false)
    }
  }

  const layouts = [
    {
      type: "one" as FormLayout,
      title: "One-by-one",
      description: "Une question par page",
      icon: Sparkles,
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (step === "template") {
              setStep("layout")
            } else {
              router.push("/dashboard")
            }
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau formulaire</h1>
          <p className="text-muted-foreground mt-1">
            {step === "layout"
              ? "Choisissez le type de layout pour votre formulaire"
              : "Sélectionnez un template ou commencez avec un formulaire vide"}
          </p>
        </div>
      </div>

      {/* Étapes de navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn(step === "layout" && "text-foreground font-medium")}>
          1. Layout
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className={cn(step === "template" && "text-foreground font-medium")}>
          2. Template
        </span>
      </div>

      {step === "layout" ? (
        /* Options de layout */
        <div className="grid gap-6 md:grid-cols-2">
          {layouts.map((layout) => {
            const Icon = layout.icon
            const isSelected = selectedLayout === layout.type

            return (
              <Card
                key={layout.type}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
                  isSelected && "ring-2 ring-primary",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !loading && handleSelectLayout(layout.type)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{layout.title}</CardTitle>
                        <CardDescription>{layout.description}</CardDescription>
                      </div>
                    </div>
                    {loading && selectedLayout === layout.type ? (
                      <div className="rounded-full bg-primary text-primary-foreground p-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : isSelected ? (
                      <div className="rounded-full bg-primary text-primary-foreground p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {layout.advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Sélection de template */
        <div className="space-y-6">
          <TemplateSelector
            layout={selectedLayout!}
            selectedTemplateId={selectedTemplate?.id || null}
            onSelectTemplate={setSelectedTemplate}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="ghost" onClick={() => setStep("layout")}>
              Retour
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Création en cours...
                  </span>
                ) : (
                  selectedTemplate
                    ? `Template "${selectedTemplate.name}" sélectionné`
                    : "Formulaire vide sélectionné"
                )}
              </div>
              <Button
                onClick={handleCreateForm}
                disabled={loading}
                size="lg"
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

