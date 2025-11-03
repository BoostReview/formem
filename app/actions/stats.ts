"use server"

import { createServerSupabase } from "@/lib/supabase/server"

/**
 * Récupérer les statistiques pour le dashboard
 */
export async function getStats() {
  const supabase = await createServerSupabase()

  // Récupérer l'utilisateur
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      error: "Non authentifié",
      stats: {
        totalForms: 0,
        totalResponses: 0,
        activeForms: 0,
        responseCounts: {},
      },
    }
  }

  // Récupérer le profil pour avoir org_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return {
      success: false,
      error: "Profil non trouvé",
      stats: {
        totalForms: 0,
        totalResponses: 0,
        activeForms: 0,
        responseCounts: {},
      },
    }
  }

  // Récupérer les formulaires
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("id, published")
    .eq("org_id", profile.org_id)

  if (formsError) {
    return {
      success: false,
      error: formsError.message,
      stats: {
        totalForms: 0,
        totalResponses: 0,
        activeForms: 0,
        responseCounts: {},
      },
    }
  }

  const totalForms = forms?.length || 0
  const activeForms = forms?.filter((f) => f.published).length || 0
  const formIds = forms?.map((f) => f.id) || []

  // Récupérer le nombre de réponses par formulaire
  const responseCounts: Record<string, number> = {}
  let totalResponses = 0

  if (formIds.length > 0) {
    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("form_id")
      .in("form_id", formIds)

    if (!responsesError && responses) {
      totalResponses = responses.length

      // Compter les réponses par formulaire
      responses.forEach((response) => {
        responseCounts[response.form_id] = (responseCounts[response.form_id] || 0) + 1
      })
    }
  }

  return {
    success: true,
    stats: {
      totalForms,
      totalResponses,
      activeForms,
      responseCounts,
    },
  }
}


