import ExcelJS from "exceljs"
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
        return value.join(", ")
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
        const fileData = value as { originalName: string; fileUrl?: string }
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

export async function exportToXLSX(
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

  // Créer le workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Réponses")

  // Ajouter un titre
  const titleRow = worksheet.addRow([`Réponses du formulaire: ${form.title || "Sans titre"}`])
  titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: "FF000000" } }
  titleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" }
  titleRow.height = 25
  worksheet.mergeCells(1, 1, 1, questionBlocks.length + 1)
  worksheet.addRow([]) // Ligne vide

  // Définir les couleurs
  const headerFill: Partial<ExcelJS.Fill> = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF000000" }, // Noir
  }

  const headerFont: Partial<ExcelJS.Font> = {
    bold: true,
    color: { argb: "FFFFFFFF" }, // Blanc
    size: 11,
  }

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFD1D5DB" } },
    left: { style: "thin", color: { argb: "FFD1D5DB" } },
    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
    right: { style: "thin", color: { argb: "FFD1D5DB" } },
  }

  const alternateRowFill: Partial<ExcelJS.Fill> = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF9FAFB" }, // Gris très clair
  }

  // Couleurs pour les valeurs oui/non
  const yesFill: Partial<ExcelJS.Fill> = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD1FAE5" }, // Vert clair
  }

  const noFill: Partial<ExcelJS.Fill> = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFEE2E2" }, // Rouge clair
  }

  // Créer l'en-tête
  const headerRow = worksheet.addRow([
    "Date",
    ...questionBlocks.map((block) => block.label || `Question ${block.id.slice(0, 8)}`),
  ])

  // Styliser l'en-tête
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.fill = headerFill as ExcelJS.Fill
    cell.font = headerFont
    cell.border = borderStyle
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }
    cell.protection = { locked: true }
  })

  // Figer la ligne d'en-tête (ligne 3 après le titre et la ligne vide)
  worksheet.views = [{ state: "frozen", ySplit: 3 }]

  // Ajouter les données
  responses.forEach((response, rowIndex) => {
    const rowData: (string | number | boolean | null)[] = [
      formatResponseDate(response.created_at),
    ]

    // Ajouter les données des questions
    questionBlocks.forEach((block) => {
      const value = (response.answers_json || {})[block.id]
      rowData.push(formatCellValue(value, block))
    })

    const row = worksheet.addRow(rowData)

    // Appliquer le style aux cellules
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = borderStyle
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }

      // Style spécial pour la colonne Date
      if (colNumber === 1) {
        cell.font = { size: 10 }
        // Format français pour les dates : jj/mm/aaaa hh:mm
        cell.numFmt = "dd/mm/yyyy hh:mm"
        // Fond alterné pour la date
        if (rowIndex % 2 === 1) {
          cell.fill = alternateRowFill as ExcelJS.Fill
        }
      } else {
        // Pour les colonnes de questions
        const blockIndex = colNumber - 2 // -1 pour Date, -1 pour index 0-based
        const block = questionBlocks[blockIndex]

        // Appliquer les couleurs selon le type (sauf fichiers qui seront traités après)
        if (block) {
          if (block.type === "yes-no" || block.type === "consent") {
            // Utiliser la valeur brute pour déterminer la couleur
            const rawValue = (response.answers_json || {})[block.id]
            const isYes = rawValue === true || rawValue === "true" || 
                         (typeof rawValue === "string" && rawValue.toLowerCase() === "oui")
            cell.fill = (isYes ? yesFill : noFill) as ExcelJS.Fill
            cell.font = { 
              bold: true,
              color: isYes ? { argb: "FF065F46" } : { argb: "FF991B1B" } // Vert foncé ou rouge foncé
            }
          } else if (block.type !== "file") {
            // Fond alterné pour les autres types (les fichiers seront traités après)
            if (rowIndex % 2 === 1) {
              cell.fill = alternateRowFill as ExcelJS.Fill
            }
          } else {
            // Pour les fichiers, appliquer le fond alterné de base (le lien sera ajouté après)
            if (rowIndex % 2 === 1) {
              cell.fill = alternateRowFill as ExcelJS.Fill
            }
          }
        } else {
          // Fond alterné par défaut
          if (rowIndex % 2 === 1) {
            cell.fill = alternateRowFill as ExcelJS.Fill
          }
        }
      }
    })

    // Ajouter les liens hypertexte pour les fichiers APRÈS les styles
    questionBlocks.forEach((block, blockIndex) => {
      if (block.type === "file") {
        const value = (response.answers_json || {})[block.id]
        if (value && typeof value === "object" && value !== null && "fileUrl" in value) {
          const fileData = value as { originalName?: string; fileUrl?: string }
          const cell = row.getCell(blockIndex + 2) // +2 car Date est colonne 1
          
          if (fileData.fileUrl) {
            // Créer un lien hypertexte
            const fileName = fileData.originalName || "Fichier joint"
            cell.value = {
              text: fileName,
              hyperlink: fileData.fileUrl,
            }
            // Appliquer le style du lien (bleu, souligné)
            const existingFont = cell.font || {}
            cell.font = {
              ...existingFont,
              color: { argb: "FF0066CC" }, // Bleu
              underline: true,
              size: existingFont.size || 11,
            }
            // Préserver le fond alterné si nécessaire (déjà appliqué précédemment)
          }
        }
      }
    })

    // Hauteur de ligne
    row.height = 20
  })

  // Ajuster la largeur des colonnes
  worksheet.columns.forEach((column, index) => {
    if (index === 0) {
      // Colonne Date : largeur fixe
      column.width = 18
    } else {
      // Colonnes de questions : largeur automatique avec minimum et maximum
      let maxLength = 15
      worksheet.getColumn(index + 1).eachCell({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value?.toString() || ""
        if (cellValue.length > maxLength) {
          maxLength = Math.min(cellValue.length, 50) // Maximum 50 caractères
        }
      })
      column.width = Math.max(15, Math.min(maxLength + 2, 50))
    }
  })

  // Hauteur de l'en-tête
  headerRow.height = 25

  // Ajouter un filtre automatique (ligne 3 = headerRow)
  worksheet.autoFilter = {
    from: { row: headerRow.number, column: 1 },
    to: { row: headerRow.number, column: questionBlocks.length + 1 },
  }

  // Protéger la feuille (optionnel, peut être retiré si nécessaire)
  // worksheet.protect('', {
  //   selectLockedCells: false,
  //   selectUnlockedCells: true,
  // })

  // Générer le fichier
  const fileName = `reponses-${form.title || form.id}-${new Date().toISOString().split("T")[0]}.xlsx`
  
  // Pour le navigateur, on doit utiliser blob
  if (typeof window !== "undefined") {
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } else {
    // Pour Node.js (server-side)
    const fs = await import("fs")
    const path = await import("path")
    const filePath = path.join(process.cwd(), fileName)
    await workbook.xlsx.writeFile(filePath)
  }
}
