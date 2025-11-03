"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Globe, Shield, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function SettingsPageClient() {

  const [notifications, setNotifications] = React.useState({
    email: true,
    browser: false,
  })

  const [privacy, setPrivacy] = React.useState({
    analytics: true,
    shareData: false,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success("Paramètre mis à jour", {
      description: `Notifications ${key} ${!notifications[key] ? "activées" : "désactivées"}`,
    })
  }

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success("Paramètre mis à jour", {
      description: `Option ${key} ${!privacy[key] ? "activée" : "désactivée"}`,
    })
  }

  const handleDeleteAccount = () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return
    }

    toast.info("Fonctionnalité à venir", {
      description: "La suppression de compte sera disponible prochainement",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des emails pour les nouvelles réponses
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange("email")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="browser-notifications">
                Notifications navigateur
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications dans votre navigateur
              </p>
            </div>
            <Switch
              id="browser-notifications"
              checked={notifications.browser}
              onCheckedChange={() => handleNotificationChange("browser")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confidentialité */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Confidentialité</CardTitle>
              <CardDescription>
                Gérez vos préférences de confidentialité
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser l'analyse anonyme de l'utilisation
              </p>
            </div>
            <Switch
              id="analytics"
              checked={privacy.analytics}
              onCheckedChange={() => handlePrivacyChange("analytics")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="share-data">Partage de données</Label>
              <p className="text-sm text-muted-foreground">
                Partager des données anonymes pour améliorer le service
              </p>
            </div>
            <Switch
              id="share-data"
              checked={privacy.shareData}
              onCheckedChange={() => handlePrivacyChange("shareData")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Thème</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Le thème système est actuellement utilisé
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              La personnalisation du thème sera disponible prochainement
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-destructive">Supprimer le compte</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Supprimez définitivement votre compte et toutes vos données.
                Cette action est irréversible.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Supprimer mon compte
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

