"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ArrowRight, FileText } from "lucide-react"
import { StatsGrid } from "@/components/dashboard/StatsGrid"
import { FormList } from "@/components/dashboard/FormList"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getForms } from "@/app/actions/forms"
import { duplicateForm, deleteForm } from "@/app/actions/forms"
import type { Form } from "@/types"

interface DashboardPageClientProps {
  initialForms: Form[]
  initialStats: {
    totalForms: number
    totalResponses: number
    activeForms: number
    responseCounts: Record<string, number>
  }
}

export function DashboardPageClient({
  initialForms,
  initialStats,
}: DashboardPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [forms, setForms] = React.useState<Form[]>(initialForms)
  const [stats, setStats] = React.useState(initialStats)

  // Formulaires récents (derniers 5)
  const recentForms = forms.slice(0, 5)

  // Handlers
  const handleEdit = (id: string) => {
    router.push(`/dashboard/forms/${id}/edit`)
  }

  const handlePreview = (id: string) => {
    router.push(`/dashboard/forms/${id}/preview`)
  }

  const handleShare = (id: string) => {
    router.push(`/dashboard/forms/${id}/publish`)
  }

  const handleViewResponses = (id: string) => {
    router.push(`/dashboard/forms/${id}/responses`)
  }

  const handleDuplicate = async (id: string) => {
    const result = await duplicateForm(id)
    if (result.success) {
      toast({
        title: "Formulaire dupliqué",
        description: "Le formulaire a été dupliqué avec succès.",
      })
      const formsResult = await getForms()
      if (formsResult.success && formsResult.forms) {
        setForms(formsResult.forms)
      }
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Impossible de dupliquer le formulaire",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) {
      return
    }

    const result = await deleteForm(id)
    if (result.success) {
      toast({
        title: "Formulaire supprimé",
        description: "Le formulaire a été supprimé avec succès.",
      })
      const formsResult = await getForms()
      if (formsResult.success && formsResult.forms) {
        setForms(formsResult.forms)
      }
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Impossible de supprimer le formulaire",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black/90 dark:text-white/90 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Vue d'ensemble de vos formulaires et statistiques
          </p>
        </div>
        <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
          <Link href="/dashboard/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <StatsGrid
        totalForms={stats.totalForms}
        totalResponses={stats.totalResponses}
        activeForms={stats.activeForms}
      />

      {/* Recent forms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black/90 dark:text-white/90">Formulaires récents</h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              Vos derniers formulaires créés
            </p>
          </div>
          {forms.length > 5 && (
            <Button variant="ghost" asChild className="text-black/60 dark:text-white/60 hover:text-black/90 dark:hover:text-white/90">
              <Link href="/dashboard/forms" className="group">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>

        {recentForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-white/5">
            <div className="rounded-full bg-black/5 dark:bg-white/5 p-4 mb-4">
              <FileText className="h-8 w-8 text-black/40 dark:text-white/40" />
            </div>
            <h3 className="text-lg font-semibold text-black/90 dark:text-white/90 mb-2">Aucun formulaire</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6 text-center max-w-sm">
              Créez votre premier formulaire pour commencer à collecter des réponses
            </p>
            <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
              <Link href="/dashboard/forms/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer un formulaire
              </Link>
            </Button>
          </div>
        ) : (
          <FormList
            forms={recentForms}
            responseCounts={stats.responseCounts}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onShare={handleShare}
            onViewResponses={handleViewResponses}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}


