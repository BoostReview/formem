import * as XLSX from "xlsx"
import { Response, Form } from "@/types"
import { formatResponseDate, formatPhone, formatAnswers } from "@/lib/formatters/formatResponse"

export async function exportToXLSX(
  responses: Response[],
  form: Form
): Promise<void> {
  if (responses.length === 0) {
    throw new Error("Aucune donnée à exporter")
  }

  const schema = Array.isArray(form.schema_json) ? form.schema_json : []

  // Créer les données pour la feuille principale
  const data = responses.map((response) => {
    const formattedAnswers = formatAnswers(
      response.answers_json || {},
      schema
    )

    const row: Record<string, unknown> = {
      Date: formatResponseDate(response.created_at),
      Email: response.email || "-",
      Téléphone: formatPhone(response.phone_e164 || response.phone_raw || null),
      Source: response.source === "link" ? "Lien" : "Intégration",
      "UTM Source": response.utm_json?.utm_source || "-",
      "UTM Medium": response.utm_json?.utm_medium || "-",
      "UTM Campaign": response.utm_json?.utm_campaign || "-",
    }

    // Ajouter les réponses
    schema.forEach((block) => {
      const label = block.label || block.id
      const value = formattedAnswers[label]
      row[label] = value !== undefined ? value : "-"
    })

    return row
  })

  // Créer le workbook
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Ajuster la largeur des colonnes
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, 15),
  }))
  worksheet["!cols"] = colWidths

  // Ajouter la feuille au workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Réponses")

  // Générer le fichier
  const fileName = `reponses-${form.title || form.id}-${new Date().toISOString().split("T")[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

