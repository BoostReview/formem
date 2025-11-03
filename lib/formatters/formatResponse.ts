import { Response, Form, FormBlock } from "@/types"
import { parsePhoneNumber } from "libphonenumber-js"

export function formatResponseDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ]
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-"
  try {
    const phoneNumber = parsePhoneNumber(phone)
    return phoneNumber.formatInternational()
  } catch {
    // Si le parsing échoue, retourner tel quel
    return phone
  }
}

export function formatAnswers(
  answers: Record<string, unknown>,
  schema: FormBlock[]
): Record<string, string> {
  const formatted: Record<string, string> = {}

  schema.forEach((block) => {
    const value = answers[block.id]
    if (value === undefined || value === null) {
      formatted[block.label || block.id] = "-"
      return
    }

    switch (block.type) {
      case "multiple-choice":
        if (Array.isArray(value)) {
          formatted[block.label || block.id] = value.join(", ")
        } else {
          formatted[block.label || block.id] = String(value)
        }
        break
      case "single-choice":
        formatted[block.label || block.id] = String(value)
        break
      case "yes-no":
        formatted[block.label || block.id] = value ? "Oui" : "Non"
        break
      case "consent":
        formatted[block.label || block.id] = value ? "Accepté" : "Non accepté"
        break
      case "date":
        if (typeof value === "string") {
          try {
            formatted[block.label || block.id] = formatResponseDate(value)
          } catch {
            formatted[block.label || block.id] = String(value)
          }
        } else {
          formatted[block.label || block.id] = String(value)
        }
        break
      default:
        formatted[block.label || block.id] = String(value)
    }
  })

  return formatted
}

export function getAnswersPreview(
  answers: Record<string, unknown>,
  schema: FormBlock[],
  maxLength: number = 100
): string {
  const formatted = formatAnswers(answers, schema)
  const entries = Object.entries(formatted)
    .filter(([_, value]) => value !== "-")
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ")

  if (entries.length > maxLength) {
    return entries.substring(0, maxLength) + "..."
  }

  return entries || "Aucune réponse"
}


