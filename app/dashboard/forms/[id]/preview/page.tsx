"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { loadForm } from "@/app/actions/forms"
import { FormRenderer } from "@/components/form-renderer/FormRenderer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Form } from "@/types"
import { cn } from "@/lib/utils"

export default function PreviewFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = React.useState<Form | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [showMobilePreview, setShowMobilePreview] = React.useState(false)

  React.useEffect(() => {
    if (!formId) return

    const loadFormData = async () => {
      setIsLoading(true)
      try {
        const result = await loadForm(formId)
        if (result.success && result.form) {
          setForm(result.form)
        }
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFormData()
  }, [formId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Formulaire introuvable</h2>
          <Button onClick={() => router.push("/dashboard/forms")}>
            Retour aux formulaires
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Barre d'outils de prévisualisation */}
      <div className="border-b bg-background/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/forms/${formId}/edit`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'édition
            </Button>
            <h1 className="text-lg font-semibold">{form.title}</h1>
            <span className="text-sm text-muted-foreground">
              Mode: {form.layout === "one" ? "One-by-one" : "All-in-one"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
            >
              {showMobilePreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Vue desktop
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Vue mobile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Prévisualisation */}
      <div className={cn(
        "flex-1 overflow-auto flex items-start justify-center bg-muted/30",
        showMobilePreview && "max-w-md mx-auto border-x border-b"
      )}>
        <div 
          className="w-full transition-all py-8"
          style={{
            transform: showMobilePreview ? "scale(1)" : "scale(0.85)",
            transformOrigin: "center top"
          }}
        >
          <FormRenderer form={form} />
        </div>
      </div>
    </div>
  )
}
