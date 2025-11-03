"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import { FormList } from "@/components/dashboard/FormList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { getForms } from "@/app/actions/forms"
import { getStats } from "@/app/actions/stats"
import { deleteForm, duplicateForm } from "@/app/actions/forms"
import type { Form } from "@/types"

type StatusFilter = "all" | "published" | "draft"
type SortOption = "date-desc" | "date-asc" | "responses-desc" | "responses-asc"

export default function FormsPage() {
  const router = useRouter()
  const [forms, setForms] = React.useState<Form[]>([])
  const [responseCounts, setResponseCounts] = React.useState<Record<string, number>>({})
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [sortOption, setSortOption] = React.useState<SortOption>("date-desc")

  // Charger les formulaires
  React.useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [formsResult, statsResult] = await Promise.all([
        getForms(),
        getStats(),
      ])

      if (formsResult.success && formsResult.forms) {
        setForms(formsResult.forms)
      }

      if (statsResult.success) {
        setResponseCounts(statsResult.stats.responseCounts)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Filtrer et trier les formulaires
  const filteredAndSortedForms = React.useMemo(() => {
    let filtered = forms

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter((form) =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter === "published") {
      filtered = filtered.filter((form) => form.published)
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((form) => !form.published)
    }

    // Tri
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "responses-desc":
          return (responseCounts[b.id] || 0) - (responseCounts[a.id] || 0)
        case "responses-asc":
          return (responseCounts[a.id] || 0) - (responseCounts[b.id] || 0)
        default:
          return 0
      }
    })

    return sorted
  }, [forms, searchQuery, statusFilter, sortOption, responseCounts])

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
      toast.success("Formulaire dupliqué", {
        description: "Le formulaire a été dupliqué avec succès.",
      })
      // Recharger les données
      const formsResult = await getForms()
      if (formsResult.success && formsResult.forms) {
        setForms(formsResult.forms)
      }
    } else {
      toast.error("Erreur", {
        description: result.error || "Impossible de dupliquer le formulaire",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) {
      return
    }

    const result = await deleteForm(id)
    if (result.success) {
      toast.success("Formulaire supprimé", {
        description: "Le formulaire a été supprimé avec succès.",
      })
      // Recharger les données
      const formsResult = await getForms()
      if (formsResult.success && formsResult.forms) {
        setForms(formsResult.forms)
      }
    } else {
      toast.error("Erreur", {
        description: result.error || "Impossible de supprimer le formulaire",
      })
    }
  }

  return (
    <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Formulaires</h1>
            <p className="text-muted-foreground mt-1">
              Gérez tous vos formulaires
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/forms/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau formulaire
            </Link>
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={(value: string) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Plus récent</SelectItem>
              <SelectItem value="date-asc">Plus ancien</SelectItem>
              <SelectItem value="responses-desc">Plus de réponses</SelectItem>
              <SelectItem value="responses-asc">Moins de réponses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des formulaires */}
        <FormList
          forms={filteredAndSortedForms}
          responseCounts={responseCounts}
          loading={loading}
          onEdit={handleEdit}
          onPreview={handlePreview}
          onShare={handleShare}
          onViewResponses={handleViewResponses}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>
  )
}
