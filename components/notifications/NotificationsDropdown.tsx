"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getRecentResponses } from "@/app/actions/notifications"
// Format simple sans dépendance externe pour l'instant
import { Loader2 } from "lucide-react"
import Link from "next/link"

const STORAGE_KEY = "notifications_read"

// Fonction utilitaire pour récupérer les IDs des notifications lues
function getReadNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Set()
    const ids = JSON.parse(stored) as string[]
    return new Set(ids)
  } catch {
    return new Set()
  }
}

// Fonction utilitaire pour marquer des notifications comme lues
function markNotificationsAsRead(ids: string[]): void {
  if (typeof window === "undefined") return
  try {
    const readIds = getReadNotificationIds()
    ids.forEach((id) => readIds.add(id))
    // Nettoyer les anciennes notifications (plus de 7 jours) pour éviter que localStorage ne devienne trop volumineux
    // On garde seulement les IDs récents (on ne peut pas vérifier la date ici, mais on limite à 1000 IDs max)
    const idsArray = Array.from(readIds)
    if (idsArray.length > 1000) {
      // Garder seulement les 1000 plus récents
      localStorage.setItem(STORAGE_KEY, JSON.stringify(idsArray.slice(-1000)))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(idsArray))
    }
  } catch {
    // Ignorer les erreurs de localStorage
  }
}

export function NotificationsDropdown() {
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [responses, setResponses] = React.useState<Array<{
    id: string
    form_id: string
    form_title: string
    created_at: string
    email: string | null
  }>>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)

  // Éviter l'erreur d'hydratation en ne rendant que côté client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Fonction pour charger uniquement le compteur (sans les détails)
  const loadUnreadCount = React.useCallback(async () => {
    try {
      const result = await getRecentResponses(10)
      if (result.success && result.responses) {
        const readIds = getReadNotificationIds()
        // Compter les notifications non lues (dernières 24h et non lues)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recent = result.responses.filter(
          (r) => new Date(r.created_at) > oneDayAgo && !readIds.has(r.id)
        )
        setUnreadCount(recent.length)
      }
    } catch (error) {
      console.error("Erreur chargement compteur notifications:", error)
    }
  }, [])

  const loadNotifications = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getRecentResponses(10)
      if (result.success && result.responses) {
        setResponses(result.responses)
        
        // Marquer toutes les notifications récentes comme lues quand on ouvre le popover
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recentIds = result.responses
          .filter((r) => new Date(r.created_at) > oneDayAgo)
          .map((r) => r.id)
        
        if (recentIds.length > 0) {
          markNotificationsAsRead(recentIds)
          // Mettre à jour le compteur immédiatement (synchrone) après avoir marqué comme lues
          const readIds = getReadNotificationIds()
          const unread = result.responses.filter(
            (r) => new Date(r.created_at) > oneDayAgo && !readIds.has(r.id)
          )
          setUnreadCount(unread.length)
        } else {
          // Pas de nouvelles notifications, mais on recalcule quand même au cas où
          const readIds = getReadNotificationIds()
          const unread = result.responses.filter(
            (r) => new Date(r.created_at) > oneDayAgo && !readIds.has(r.id)
          )
          setUnreadCount(unread.length)
        }
      }
    } catch (error) {
      console.error("Erreur chargement notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Charger le compteur au montage et périodiquement en arrière-plan
  React.useEffect(() => {
    if (!mounted) return
    
    // Charger immédiatement
    loadUnreadCount()
    
    // Recharger toutes les 30 secondes en arrière-plan
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000) // 30 secondes

    return () => clearInterval(interval)
  }, [mounted, loadUnreadCount])

  // Charger les détails complets quand le popover s'ouvre
  React.useEffect(() => {
    if (open) {
      loadNotifications()
      // Mettre à jour le compteur immédiatement quand on ouvre
      loadUnreadCount()
    }
  }, [open, loadNotifications, loadUnreadCount])

  // Recharger périodiquement quand ouvert
  React.useEffect(() => {
    if (!open) return

    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // Recharger toutes les 30 secondes

    return () => clearInterval(interval)
  }, [open, loadNotifications])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return "À l'instant"
      if (diffMins < 60) return `Il y a ${diffMins} min`
      if (diffHours < 24) return `Il y a ${diffHours}h`
      if (diffDays < 7) return `Il y a ${diffDays}j`
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    } catch {
      return "Récemment"
    }
  }

  // Ne pas rendre côté serveur pour éviter l'erreur d'hydratation
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild suppressHydrationWarning>
        <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" suppressHydrationWarning>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune notification
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {responses.map((response, index) => (
                <Link
                  key={response.id}
                  href={`/dashboard/forms/${response.form_id}/responses`}
                  onClick={() => setOpen(false)}
                  className="block hover:bg-accent transition-colors"
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Nouvelle réponse
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {response.form_title}
                        </p>
                        {response.email && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {response.email}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(response.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
        {responses.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link
                href="/dashboard/forms"
                onClick={() => setOpen(false)}
                className="block text-center text-sm text-primary hover:underline py-2"
              >
                Voir toutes les réponses
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

