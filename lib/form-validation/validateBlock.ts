import { FormBlock } from "@/types"
import { PHONE_PREFIXES } from "@/lib/phone-prefixes"

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Valide une valeur pour un bloc donné
 * @param strict - Si true, valide aussi le format (email, téléphone, etc.). Si false, vérifie seulement si le champ est rempli.
 */
export function validateBlock(block: FormBlock, value: unknown, strict: boolean = true): ValidationResult {
  // Si le bloc n'est pas obligatoire et la valeur est vide, c'est valide
  if (!block.required) {
    return { isValid: true }
  }

  // Vérifier si la valeur est vide
  const isEmpty = 
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)

  if (isEmpty) {
    return {
      isValid: false,
      error: "Ce champ est obligatoire",
    }
  }

  // Pour le CAPTCHA, vérifier spécifiquement (même en mode non-strict)
  if (block.type === "captcha") {
    if (typeof value !== "string" || value.trim() === "") {
      return {
        isValid: false,
        error: "Veuillez compléter la vérification anti-spam",
      }
    }
    // Vérifier que c'est un token valide (format base64url généralement)
    // Altcha génère un payload qui fait généralement plus de 10 caractères
    if (value.length < 10) {
      return {
        isValid: false,
        error: "Vérification incomplète, veuillez réessayer",
      }
    }
    // Si le CAPTCHA est valide, retourner directement (pas besoin de validation stricte supplémentaire)
    return { isValid: true }
  }

  // Pour le téléphone, même en mode non-strict, vérifier qu'il y a un numéro (pas juste le préfixe)
  if (block.type === "phone" && !strict) {
    if (typeof value !== "string" || value.trim() === "") {
      return {
        isValid: false,
        error: "Ce champ est obligatoire",
      }
    }
    // Vérifier qu'il y a au moins un numéro après le préfixe
    const enablePrefix = (block.enablePrefix as boolean) || false
    if (enablePrefix) {
      // Extraire le préfixe et le numéro
      const prefixMatch = value.match(/^(\+?\d{1,4})\s*(.*)/)
      if (prefixMatch) {
        const phoneNumber = prefixMatch[2].replace(/\s/g, "")
        const phoneDigits = phoneNumber.replace(/\D/g, "")
        // Si seulement le préfixe est présent sans numéro, c'est invalide
        if (phoneDigits.length === 0) {
          return {
            isValid: false,
            error: "Veuillez entrer un numéro de téléphone",
          }
        }
        // Vérifier qu'il y a au moins 4 chiffres (minimum raisonnable)
        if (phoneDigits.length < 4) {
          return {
            isValid: false,
            error: "Numéro de téléphone incomplet",
          }
        }
      } else {
        // Pas de préfixe détecté, vérifier qu'il y a au moins des chiffres
        const phoneDigits = value.replace(/\D/g, "")
        if (phoneDigits.length < 4) {
          return {
            isValid: false,
            error: "Numéro de téléphone incomplet",
          }
        }
      }
    } else {
      // Pas de préfixe, vérifier qu'il y a au moins des chiffres
      const phoneDigits = value.replace(/\D/g, "")
      if (phoneDigits.length < 4) {
        return {
          isValid: false,
          error: "Numéro de téléphone incomplet",
        }
      }
    }
    // Si on arrive ici, le téléphone a au moins un numéro valide
    return { isValid: true }
  }

  // Si strict est false, on accepte toute valeur non vide (validation basique)
  // Sauf pour le CAPTCHA et le téléphone qui ont déjà été validés ci-dessus
  if (!strict) {
    return { isValid: true }
  }

  // Validations spécifiques selon le type
  switch (block.type) {
    case "email":
      if (typeof value !== "string") {
        return { isValid: false, error: "Email invalide" }
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          error: "Veuillez entrer une adresse email valide",
        }
      }
      break

    case "phone":
      if (typeof value !== "string") {
        return { isValid: false, error: "Numéro de téléphone invalide" }
      }
      
      // Si le préfixe est activé, valider selon les règles du pays
      const enablePrefix = (block.enablePrefix as boolean) || false
      if (enablePrefix) {
        // Extraire le préfixe et le numéro (gérer aussi le format avec (0))
        const prefixMatch = value.match(/^(\+?\d{1,4})\s*(.*)/)
        if (prefixMatch) {
          const prefixCode = prefixMatch[1]
          let phoneNumber = prefixMatch[2].replace(/\s/g, "")
          
          // Valider selon les règles du préfixe
          const prefixInfo = PHONE_PREFIXES.find((p) => p.code === prefixCode)
          
          if (prefixInfo) {
            // Extraire tous les chiffres du numéro
            let phoneDigits = phoneNumber.replace(/\D/g, "")
            
            // Gérer le 0 entre parenthèses pour certains pays
            // Si le numéro commence par (0) ou 0 et que le pays utilise cette convention
            const COUNTRIES_WITH_ZERO_PARENTHESES = ["FR", "BE", "CH", "LU", "MC", "MA", "DZ", "TN", "TR"]
            if (prefixInfo.countryCode && COUNTRIES_WITH_ZERO_PARENTHESES.includes(prefixInfo.countryCode)) {
              // Si le numéro commence par 0, le retirer du comptage pour la validation
              if (phoneDigits.length > 0 && phoneDigits[0] === "0") {
                phoneDigits = phoneDigits.slice(1)
              }
            }
            
            // Valider la longueur (sans compter le 0 initial pour les pays concernés)
            if (phoneDigits.length < prefixInfo.minLength) {
              return {
                isValid: false,
                error: `Numéro invalide pour ${prefixInfo.country} (minimum ${prefixInfo.minLength} chiffres)`,
              }
            }
            if (phoneDigits.length > prefixInfo.maxLength) {
              return {
                isValid: false,
                error: `Numéro invalide pour ${prefixInfo.country} (maximum ${prefixInfo.maxLength} chiffres)`,
              }
            }
          } else {
            // Fallback si le préfixe n'est pas trouvé
            const phoneDigits = phoneNumber.replace(/\D/g, "")
            if (phoneDigits.length < 8) {
              return {
                isValid: false,
                error: "Numéro de téléphone invalide (minimum 8 chiffres)",
              }
            }
          }
        } else {
          return {
            isValid: false,
            error: "Format de numéro invalide (préfixe requis)",
          }
        }
      } else {
        // Validation basique si le préfixe n'est pas activé
        const phoneDigits = value.replace(/\D/g, "")
        if (phoneDigits.length < 8) {
          return {
            isValid: false,
            error: "Numéro de téléphone invalide (minimum 8 chiffres)",
          }
        }
      }
      break

    case "number":
      if (typeof value !== "number" && typeof value !== "string") {
        return { isValid: false, error: "Valeur numérique requise" }
      }
      const numValue = typeof value === "string" ? parseFloat(value) : value
      if (isNaN(numValue)) {
        return {
          isValid: false,
          error: "Veuillez entrer un nombre valide",
        }
      }
      // Vérifier min/max si définis
      const minValue = typeof block.min === "number" ? block.min : undefined
      const maxValue = typeof block.max === "number" ? block.max : undefined
      
      if (minValue !== undefined && numValue < minValue) {
        return {
          isValid: false,
          error: `La valeur doit être supérieure ou égale à ${minValue}`,
        }
      }
      if (maxValue !== undefined && numValue > maxValue) {
        return {
          isValid: false,
          error: `La valeur doit être inférieure ou égale à ${maxValue}`,
        }
      }
      break

    case "slider":
      if (typeof value !== "number" && typeof value !== "string") {
        return { isValid: false, error: "Valeur requise" }
      }
      const sliderValue = typeof value === "string" ? parseFloat(value) : value
      if (isNaN(sliderValue)) {
        return { isValid: false, error: "Valeur invalide" }
      }
      break

    case "date":
      if (typeof value !== "string") {
        return { isValid: false, error: "Date invalide" }
      }
      const dateValue = new Date(value)
      if (isNaN(dateValue.getTime())) {
        return {
          isValid: false,
          error: "Veuillez entrer une date valide",
        }
      }
      break

    case "single-choice":
      if (typeof value !== "string" || !block.options?.includes(value)) {
        return {
          isValid: false,
          error: "Veuillez sélectionner une option",
        }
      }
      break

    case "multiple-choice":
      if (!Array.isArray(value) || value.length === 0) {
        return {
          isValid: false,
          error: "Veuillez sélectionner au moins une option",
        }
      }
      // Vérifier que toutes les options sont valides
      const invalidOptions = value.filter(
        (opt) => typeof opt !== "string" || !block.options?.includes(opt)
      )
      if (invalidOptions.length > 0) {
        return {
          isValid: false,
          error: "Options invalides sélectionnées",
        }
      }
      break

    case "consent":
      if (value !== true) {
        return {
          isValid: false,
          error: "Vous devez accepter pour continuer",
        }
      }
      break

    case "file":
      if (!value || (typeof value === "object" && !("originalName" in value))) {
        return {
          isValid: false,
          error: "Veuillez télécharger un fichier",
        }
      }
      break

    case "text":
    case "textarea":
      if (typeof value !== "string" || value.trim().length === 0) {
        return {
          isValid: false,
          error: "Ce champ est obligatoire",
        }
      }
      // Vérifier la longueur min/max si définie
      const minLength = typeof block.minLength === "number" ? block.minLength : undefined
      const maxLength = typeof block.maxLength === "number" ? block.maxLength : undefined
      
      if (minLength !== undefined && value.length < minLength) {
        return {
          isValid: false,
          error: `Le texte doit contenir au moins ${minLength} caractères`,
        }
      }
      if (maxLength !== undefined && value.length > maxLength) {
        return {
          isValid: false,
          error: `Le texte ne doit pas dépasser ${maxLength} caractères`,
        }
      }
      break

    case "yes-no":
      // Accepter true/false (booléens) ou "yes"/"no"/"oui"/"non" (strings)
      const isValidYesNo = 
        value === true || 
        value === false || 
        value === "yes" || 
        value === "no" || 
        value === "oui" || 
        value === "non"
      
      if (!isValidYesNo) {
        return {
          isValid: false,
          error: "Veuillez répondre par Oui ou Non",
        }
      }
      break

    default:
      // Pour les autres types, on vérifie juste que ce n'est pas vide
      break
  }

  return { isValid: true }
}

