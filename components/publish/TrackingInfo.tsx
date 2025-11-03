"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TrackingInfoProps {
  baseUrl: string
  slug: string
}

export function TrackingInfo({ baseUrl, slug }: TrackingInfoProps) {
  const exampleUrl = `${baseUrl}/f/${slug}?utm_source=newsletter&utm_medium=email&utm_campaign=promo&ref=partner123`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking et paramètres UTM</CardTitle>
        <CardDescription>
          Utilisez ces paramètres pour suivre l'origine de vos réponses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Paramètres UTM disponibles</Label>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• <code className="bg-muted px-1 rounded">utm_source</code> - Source (ex: newsletter, facebook)</p>
            <p>• <code className="bg-muted px-1 rounded">utm_medium</code> - Medium (ex: email, social, banner)</p>
            <p>• <code className="bg-muted px-1 rounded">utm_campaign</code> - Campagne (ex: promo2024, summer-sale)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Champ caché (ref)</Label>
          <div className="text-sm text-muted-foreground">
            <p>Utilisez <code className="bg-muted px-1 rounded">?ref=...</code> pour stocker des données personnalisées</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Exemple de lien avec tracking</Label>
          <Input
            value={exampleUrl}
            readOnly
            className="font-mono text-xs"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <p className="text-xs text-muted-foreground">
            Ces paramètres seront automatiquement enregistrés avec chaque réponse
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


