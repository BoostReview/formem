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
      // Recharger les données
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
      // Recharger les données
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
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de vos formulaires
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <StatsGrid
        totalForms={stats.totalForms}
        totalResponses={stats.totalResponses}
        activeForms={stats.activeForms}
      />

      {/* Formulaires récents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Formulaires récents</h2>
          {forms.length > 5 && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard/forms">
                Voir tous les formulaires
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {recentForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-[14px]">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun formulaire</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre premier formulaire pour commencer
            </p>
            <Button asChild>
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

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-[14px] bg-card">
          <h3 className="font-semibold mb-2">Créer un formulaire</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Commencez à collecter des réponses en créant un nouveau formulaire
          </p>
          <Button asChild>
            <Link href="/dashboard/forms/new">
              Créer un formulaire
            </Link>
          </Button>
        </div>
        <div className="p-6 border rounded-[14px] bg-card">
          <h3 className="font-semibold mb-2">Voir tous les formulaires</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Accédez à tous vos formulaires et gérez-les en un seul endroit
          </p>
          <Button variant="outline" asChild>
            <Link href="/dashboard/forms">
              Voir tous les formulaires
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

