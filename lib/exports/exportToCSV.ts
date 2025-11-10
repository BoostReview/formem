import { Response, Form, FormBlock } from "@/types"
import { formatResponseDate, formatPhone } from "@/lib/formatters/formatResponse"

// Fonction pour formater une valeur selon le type de bloc
function formatCellValue(value: unknown, block: FormBlock): string {
  if (value === null || value === undefined) {
    return "-"
  }

  switch (block.type) {
    case "multiple-choice":
      if (Array.isArray(value)) {
        // Utiliser | comme séparateur pour les choix multiples (plus clair dans CSV)
        return value.join(" | ")
      }
      return String(value)

    case "single-choice":
      return String(value)

    case "yes-no":
      return value ? "Oui" : "Non"

    case "consent":
      return value ? "Accepté" : "Refusé"

    case "date":
      try {
        return formatResponseDate(String(value))
      } catch {
        return String(value)
      }

    case "file":
      if (typeof value === "object" && value !== null && "originalName" in value) {
        const fileData = value as { originalName?: string; fileUrl?: string }
        // Pour CSV, afficher le nom du fichier et l'URL entre parenthèses
        if (fileData.fileUrl) {
          return `${fileData.originalName || "Fichier"} (${fileData.fileUrl})`
        }
        return fileData.originalName || "-"
      }
      return "-"

    case "number":
    case "slider":
      return String(value)

    case "email":
      return String(value)

    case "phone":
      return formatPhone(String(value))

    default:
      return String(value)
  }
}

export async function exportToCSV(
  responses: Response[],
  form: Form
): Promise<void> {
  if (responses.length === 0) {
    throw new Error("Aucune donnée à exporter")
  }

  const schema = Array.isArray(form.schema_json) ? form.schema_json : []

  // Filtrer uniquement les blocs qui peuvent avoir des réponses (pas welcome, heading, paragraph)
  const questionBlocks = schema.filter(
    (block) =>
      !["welcome", "heading", "paragraph", "youtube", "menu-restaurant"].includes(block.type)
  )

  // Créer les colonnes (Date + questions uniquement)
  const columns = [
    "Date",
    ...questionBlocks.map((block) => block.label || `Question ${block.id.slice(0, 8)}`),
  ]

  // Créer les lignes
  const rows = responses.map((response) => {
    const row = [
      formatResponseDate(response.created_at),
      ...questionBlocks.map((block) => {
        const value = (response.answers_json || {})[block.id]
        return formatCellValue(value, block)
      }),
    ]

    // Échapper les valeurs contenant des point-virgules, guillemets ou retours à la ligne
    return row.map((cell) => {
      const cellStr = String(cell)
      // Utiliser des guillemets si la cellule contient ; " ou \n
      if (cellStr.includes(";") || cellStr.includes('"') || cellStr.includes("\n")) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    })
  })

  // Créer le contenu CSV avec point-virgule comme séparateur (format français)
  const csvContent = [
    columns.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n")

  // Ajouter BOM pour UTF-8 (compatibilité Excel avec caractères français)
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { 
    type: "text/csv;charset=utf-8;" 
  })

  // Télécharger
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `reponses-${form.title || form.id}-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
