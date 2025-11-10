"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { loadForm } from "@/app/actions/forms"
import { getResponses, deleteResponses } from "@/app/actions/responses"
import { ResponseStats } from "@/components/responses/ResponseStats"
import { ResponseFilters } from "@/components/responses/ResponseFilters"
import { ResponsesTableMonday } from "@/components/responses/ResponsesTableMonday"
import { ResponseDetailModal } from "@/components/responses/ResponseDetailModal"
import { ExportButton } from "@/components/responses/ExportButton"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/EmptyState"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Form, Response as ResponseType } from "@/types"

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = React.useState<Form | null>(null)
  const [responses, setResponses] = React.useState<ResponseType[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedResponse, setSelectedResponse] = React.useState<ResponseType | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Filtres
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>()
  const [dateTo, setDateTo] = React.useState<Date | undefined>()
  const [source, setSource] = React.useState<"link" | "embed" | undefined>()
  const [search, setSearch] = React.useState("")

  // Pagination
  const [page, setPage] = React.useState(1)
  const pageSize = 50

  // Charger le formulaire et les réponses
  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [formResult, responsesResult] = await Promise.all([
        loadForm(formId),
        getResponses(formId, {
          filters: {
            dateFrom,
            dateTo,
            source,
            search: search.trim() || undefined,
          },
          page,
          pageSize,
        }),
      ])

      if (formResult.success && formResult.form) {
        setForm(formResult.form)
      }

      if (responsesResult.success && responsesResult.data) {
        setResponses(responsesResult.data)
      } else if (!responsesResult.success) {
        toast.error("Erreur", {
          description: responsesResult.error || "Impossible de charger les réponses",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue",
      })
    } finally {
      setLoading(false)
    }
  }, [formId, dateFrom, dateTo, source, search, page, pageSize, toast])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Debounce de la recherche - utiliser une version locale pour éviter les re-renders
  const [localSearch, setLocalSearch] = React.useState(search)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [localSearch])

  const handleViewDetails = (response: ResponseType) => {
    setSelectedResponse(response)
    setIsModalOpen(true)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return

    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedIds.length} réponse(s) ?`
      )
    ) {
      return
    }

    try {
      // Filtrer les IDs valides (UUIDs uniquement)
      const validIds = selectedIds.filter((id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        return uuidRegex.test(id)
      })

      if (validIds.length === 0) {
        toast.error("Erreur", {
          description: "Aucun ID valide à supprimer",
        })
        return
      }

      const result = await deleteResponses(validIds)
      if (result.success) {
        toast.success("Suppression réussie", {
          description: `${validIds.length} réponse(s) supprimée(s)`,
        })
        setSelectedIds([])
        // Attendre un peu pour que la suppression soit bien persistée
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Recharger les données
        await loadData()
      } else {
        toast.error("Erreur", {
          description: result.error || "Impossible de supprimer les réponses",
        })
      }
    } catch (error) {
      console.error("Erreur suppression:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
    }
  }

  const handleResetFilters = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setSource(undefined)
    setLocalSearch("")
    setSearch("")
    setPage(1)
  }

  if (loading && !form) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Formulaire introuvable"
          description="Le formulaire demandé n'existe pas ou vous n'avez pas accès."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/forms")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form.title}</h1>
            <p className="text-muted-foreground mt-1">
              {responses.length} réponse{responses.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer ({selectedIds.length})
            </Button>
          )}
          <ExportButton responses={responses} form={form} selectedIds={selectedIds.length > 0 ? selectedIds : undefined} />
        </div>
      </div>

      {/* Statistiques */}
      <ResponseStats responses={responses} />

      {/* Filtres */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Filtres</h2>
        <ResponseFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          source={source}
          search={localSearch}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onSourceChange={setSource}
          onSearchChange={setLocalSearch}
          onReset={handleResetFilters}
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : responses.length === 0 ? (
        <EmptyState
          title="Aucune réponse"
          description="Aucune réponse ne correspond à vos critères de recherche."
        />
      ) : (
        <ResponsesTableMonday
          responses={responses}
          form={form}
          onViewDetails={handleViewDetails}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      )}

      {/* Modal de détails */}
      <ResponseDetailModal
        response={selectedResponse}
        form={form}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
