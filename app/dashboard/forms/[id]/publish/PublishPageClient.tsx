"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { togglePublish } from "@/app/actions/publish"
import { PublishToggle } from "@/components/publish/PublishToggle"
import { LinkShare } from "@/components/publish/LinkShare"
import { EmbedCode } from "@/components/publish/EmbedCode"
import { FormSettings } from "@/components/publish/FormSettings"
import { TrackingInfo } from "@/components/publish/TrackingInfo"
import type { Form } from "@/types"

interface PublishPageClientProps {
  form: Form
  initialValidation: {
    valid: boolean
    warnings: string[]
    errors: string[]
  }
}

export function PublishPageClient({
  form,
  initialValidation,
}: PublishPageClientProps) {
  const router = useRouter()
  const [published, setPublished] = React.useState(form.published)
  const [slug, setSlug] = React.useState(form.slug || "")
  const [loading, setLoading] = React.useState(false)
  const [validation, setValidation] = React.useState(initialValidation)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const publicUrl = slug ? `${baseUrl}/f/${slug}` : ""

  const handleTogglePublish = async (newPublished: boolean) => {
    setLoading(true)

    try {
      const result = await togglePublish(form.id, newPublished)

      if (result.success) {
        setPublished(newPublished)
        if (result.slug) {
          setSlug(result.slug)
        }
        toast.success(newPublished ? "Formulaire publié" : "Formulaire dépublié", {
          description: newPublished
            ? "Votre formulaire est maintenant accessible publiquement"
            : "Votre formulaire n'est plus accessible publiquement",
        })

        // Recharger la validation
        const { validateFormForPublish } = await import("@/app/actions/publish")
        const newValidation = await validateFormForPublish(form.id)
        setValidation(newValidation)
      } else {
        toast.error("Erreur", {
          description: result.error || "Impossible de modifier le statut de publication",
        })
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur inattendue s'est produite",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Publier le formulaire</h1>
          <p className="text-muted-foreground mt-1">{form.title}</p>
        </div>
      </div>

      {/* Toggle Publication */}
      <PublishToggle
        published={published}
        onToggle={handleTogglePublish}
        warnings={validation.warnings}
        errors={validation.errors}
      />

      {published && slug && (
        <>
          {/* Lien public */}
          <Card>
            <CardHeader>
              <CardTitle>Lien public</CardTitle>
              <CardDescription>
                Partagez ce lien avec vos utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkShare url={publicUrl} slug={slug} />
            </CardContent>
          </Card>

          {/* Code iFrame */}
          <EmbedCode slug={slug} />

          {/* Paramètres */}
          <FormSettings
            formId={form.id}
            initialSettings={(form.settings_json || {}) as any}
          />

          {/* Tracking */}
          <TrackingInfo baseUrl={baseUrl} slug={slug} />
        </>
      )}

      {published && !slug && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Génération du slug en cours...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

