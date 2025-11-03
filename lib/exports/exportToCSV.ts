import { Response, Form } from "@/types"
import { formatResponseDate, formatPhone, formatAnswers } from "@/lib/formatters/formatResponse"

export async function exportToCSV(
  responses: Response[],
  form: Form
): Promise<void> {
  if (responses.length === 0) {
    throw new Error("Aucune donnée à exporter")
  }

  // Créer les colonnes
  const schema = Array.isArray(form.schema_json) ? form.schema_json : []
  const columns = [
    "Date",
    "Email",
    "Téléphone",
    "Source",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    ...schema.map((block) => block.label || block.id),
  ]

  // Créer les lignes
  const rows = responses.map((response) => {
    const formattedAnswers = formatAnswers(
      response.answers_json || {},
      schema
    )

    const row = [
      formatResponseDate(response.created_at),
      response.email || "-",
      formatPhone(response.phone_e164 || response.phone_raw || null),
      response.source === "link" ? "Lien" : "Intégration",
      response.utm_json?.utm_source || "-",
      response.utm_json?.utm_medium || "-",
      response.utm_json?.utm_campaign || "-",
      ...schema.map((block) => {
        const value = formattedAnswers[block.label || block.id]
        return value !== undefined ? value : "-"
      }),
    ]

    // Échapper les valeurs contenant des virgules ou des guillemets
    return row.map((cell) => {
      const cellStr = String(cell)
      if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    })
  })

  // Créer le contenu CSV
  const csvContent = [
    columns.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n")

  // Ajouter BOM pour UTF-8 (compatibilité Excel)
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })

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

