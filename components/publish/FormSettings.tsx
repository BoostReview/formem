"use client"

import * as React from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { updateFormSettings } from "@/app/actions/publish"
import type { SettingsJSON } from "@/types"

interface FormSettingsProps {
  formId: string
  initialSettings: SettingsJSON
}

export function FormSettings({ formId, initialSettings }: FormSettingsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [settings, setSettings] = React.useState({
    maxResponses: initialSettings.maxResponses?.toString() || "",
    expiresAt: initialSettings.expiresAt
      ? new Date(initialSettings.expiresAt as string).toISOString().split("T")[0]
      : "",
    redirectUrl: initialSettings.redirectUrl?.toString() || "",
  })

  const handleSave = async () => {
    setLoading(true)

    try {
      const result = await updateFormSettings(formId, {
        maxResponses: settings.maxResponses
          ? parseInt(settings.maxResponses, 10)
          : null,
        expiresAt: settings.expiresAt ? new Date(settings.expiresAt).toISOString() : null,
        redirectUrl: settings.redirectUrl || null,
      })

      if (result.success) {
        toast({
          title: "Paramètres sauvegardés",
          description: "Les paramètres ont été mis à jour avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de sauvegarder les paramètres",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de publication</CardTitle>
        <CardDescription>
          Configurez les limites et les options de votre formulaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="maxResponses">Nombre maximum de réponses</Label>
          <Input
            id="maxResponses"
            type="number"
            min="0"
            placeholder="Illimité"
            value={settings.maxResponses}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, maxResponses: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Le formulaire sera automatiquement fermé une fois cette limite atteinte
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Date d'expiration</Label>
          <Input
            id="expiresAt"
            type="date"
            value={settings.expiresAt}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, expiresAt: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Le formulaire ne sera plus accessible après cette date
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirectUrl">URL de redirection après soumission</Label>
          <Input
            id="redirectUrl"
            type="url"
            placeholder="https://exemple.com/merci"
            value={settings.redirectUrl}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, redirectUrl: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            L'utilisateur sera redirigé vers cette URL après avoir soumis le formulaire
          </p>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? (
            "Sauvegarde..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les paramètres
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}


