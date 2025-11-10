"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PublishToggleProps {
  published: boolean
  onToggle: (published: boolean) => void
  warnings: string[]
  errors: string[]
}

export function PublishToggle({
  published,
  onToggle,
  warnings,
  errors,
}: PublishToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-[14px] bg-card">
        <div className="flex items-center gap-3">
          <Switch
            id="publish-toggle"
            checked={published}
            onCheckedChange={onToggle}
            disabled={errors.length > 0}
          />
          <div>
            <Label htmlFor="publish-toggle" className="text-base font-semibold cursor-pointer">
              {published ? "Publié" : "Brouillon"}
            </Label>
            <div className="text-sm text-muted-foreground">
              {published
                ? "Le formulaire est accessible publiquement"
                : "Le formulaire n'est pas encore publié"}
            </div>
          </div>
        </div>
        <Badge variant={published ? "success" : "secondary"}>
          {published ? "Publié" : "Brouillon"}
        </Badge>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Impossible de publier :</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Avertissements :</p>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}





