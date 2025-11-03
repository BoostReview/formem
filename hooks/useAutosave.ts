import { useEffect, useRef } from "react"
import { useFormBuilder } from "./useFormBuilder"
import { saveForm } from "@/app/actions/forms"
import { toast } from "sonner"

const AUTOSAVE_DELAY = 1000 // 1 seconde (plus rapide)
const DEBOUNCE_DELAY = 300 // 300ms de debounce (plus rapide)

export function useAutosave() {
  const { formId, title, blocks, theme, settings, setIsSaving, setLastSaved } =
    useFormBuilder()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>("")

  useEffect(() => {
    if (!formId) return

    // Debounce: attendre un peu avant de sauvegarder
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      // Vérifier si quelque chose a changé
      const currentState = JSON.stringify({ title, blocks, theme, settings })
      if (currentState === lastSavedRef.current) {
        return
      }

      // Annuler la sauvegarde précédente si elle n'est pas encore terminée
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Programmer la sauvegarde
      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        try {
          // schema_json doit être directement un array de FormBlock, pas un objet avec blocks
          const result = await saveForm(formId, {
            title,
            schema_json: blocks,
            theme_json: theme,
            settings_json: settings,
          })
          
          if (result.success) {
            lastSavedRef.current = JSON.stringify({ title, blocks, theme, settings })
            setLastSaved(new Date())
            // Toast discret pour l'autosave (plus court)
            toast.success("Enregistré", {
              duration: 1500,
              position: "bottom-right",
            })
          } else {
            toast.error("Erreur lors de l'enregistrement", {
              description: result.error,
              duration: 4000,
            })
          }
        } catch (error) {
          console.error("Erreur lors de la sauvegarde:", error)
          toast.error("Erreur lors de l'enregistrement", {
            description: error instanceof Error ? error.message : "Une erreur est survenue",
            duration: 4000,
          })
        } finally {
          setIsSaving(false)
        }
      }, AUTOSAVE_DELAY)
    }, DEBOUNCE_DELAY)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [formId, title, blocks, theme, settings, setIsSaving, setLastSaved])

  // Sauvegarde immédiate dans localStorage en cas de perte de connexion
  useEffect(() => {
    if (!formId) return

    try {
      localStorage.setItem(
        `form-draft-${formId}`,
        JSON.stringify({ title, blocks, theme, settings })
      )
    } catch (error) {
      console.error("Erreur lors de la sauvegarde locale:", error)
    }
  }, [formId, title, blocks, theme, settings])
}

