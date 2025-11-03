"use server"

import { createServerSupabase } from "@/lib/supabase/server"

export async function getRecentResponses(limit: number = 10): Promise<{
  success: boolean
  responses?: Array<{
    id: string
    form_id: string
    form_title: string
    created_at: string
    email: string | null
  }>
  error?: string
}> {
  try {
    const supabase = await createServerSupabase()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Non authentifié" }
    }

    // Récupérer le profil pour obtenir l'org_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable" }
    }

    // Récupérer les formulaires de l'organisation
    const { data: forms, error: formsError } = await supabase
      .from("forms")
      .select("id, title")
      .eq("org_id", profile.org_id)

    if (formsError || !forms) {
      return { success: false, error: "Erreur lors de la récupération des formulaires" }
    }

    const formIds = forms.map((f) => f.id)
    if (formIds.length === 0) {
      return { success: true, responses: [] }
    }

    // Récupérer les réponses récentes
    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("id, form_id, created_at, email")
      .in("form_id", formIds)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (responsesError) {
      return { success: false, error: responsesError.message }
    }

    // Enrichir avec les titres des formulaires
    const enrichedResponses = responses.map((r) => {
      const form = forms.find((f) => f.id === r.form_id)
      return {
        id: r.id,
        form_id: r.form_id,
        form_title: form?.title || "Formulaire supprimé",
        created_at: r.created_at,
        email: r.email,
      }
    })

    return {
      success: true,
      responses: enrichedResponses,
    }
  } catch (error) {
    console.error("Erreur récupération notifications:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<{
  success: boolean
  error?: string
}> {
  // Pour l'instant, on ne stocke pas les notifications lues
  // On pourrait créer une table notifications_read si nécessaire
  return { success: true }
}


