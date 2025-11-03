"use client"

import * as React from "react"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Response, Form } from "@/types"
import { exportToCSV } from "@/lib/exports/exportToCSV"
import { exportToXLSX } from "@/lib/exports/exportToXLSX"
import { toast } from "sonner"

interface ExportButtonProps {
  responses: Response[]
  form: Form
  selectedIds?: string[]
  className?: string
}

export function ExportButton({
  responses,
  form,
  selectedIds,
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)

  const responsesToExport = selectedIds
    ? responses.filter((r) => selectedIds.includes(r.id))
    : responses

  const handleExport = async (format: "csv" | "xlsx") => {
    if (responsesToExport.length === 0) {
      toast.error("Aucune donnée", {
        description: "Aucune réponse à exporter",
      })
      return
    }

    setIsExporting(true)
    try {
      if (format === "csv") {
        await exportToCSV(responsesToExport, form)
      } else {
        await exportToXLSX(responsesToExport, form)
      }
      toast.success("Export réussi", {
        description: `${responsesToExport.length} réponse(s) exportée(s) en ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      toast.error("Erreur d'export", {
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const label =
    selectedIds && selectedIds.length > 0
      ? `Exporter la sélection (${selectedIds.length})`
      : `Exporter tout (${responses.length})`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting || responsesToExport.length === 0}
          className={className}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? "Export en cours..." : "Exporter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exporter en XLSX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

