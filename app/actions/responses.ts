"use server"

import { createServerSupabase, createServiceRoleSupabase } from "@/lib/supabase/server"
import { Response } from "@/types"

interface ResponseFilters {
  dateFrom?: Date
  dateTo?: Date
  source?: "link" | "embed"
  search?: string
}

interface GetResponsesResult {
  success: boolean
  data?: Response[]
  total?: number
  page?: number
  pageSize?: number
  error?: string
}

export async function getResponses(
  formId: string,
  options?: {
    filters?: ResponseFilters
    page?: number
    pageSize?: number
  }
): Promise<GetResponsesResult> {
  try {
    const supabase = await createServerSupabase()

    // Vérifier que l'utilisateur a accès au formulaire
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("org_id")
      .eq("id", formId)
      .single()

    if (formError || !form) {
      return { success: false, error: "Formulaire introuvable" }
    }

    const page = options?.page || 1
    const pageSize = options?.pageSize || 50
    const filters = options?.filters || {}

    // Construire la query
    let query = supabase
      .from("responses")
      .select("*", { count: "exact" })
      .eq("form_id", formId)

    // Filtres par date
    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom.toISOString())
    }
    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo.toISOString())
    }

    // Filtre par source
    if (filters.source) {
      query = query.eq("source", filters.source)
    }

    // Tri par date décroissante
    query = query.order("created_at", { ascending: false })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    // Filtre de recherche textuelle (côté serveur basique)
    let filteredData = data || []

    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim()
      filteredData = filteredData.filter((response) => {
        // Rechercher dans email
        if (response.email?.toLowerCase().includes(searchLower)) return true
        // Rechercher dans phone_raw
        if (response.phone_raw?.toLowerCase().includes(searchLower)) return true
        // Rechercher dans answers_json (stringify pour recherche simple)
        if (JSON.stringify(response.answers_json).toLowerCase().includes(searchLower))
          return true
        return false
      })
    }

    return {
      success: true,
      data: filteredData as Response[],
      total: count || 0,
      page,
      pageSize,
    }
  } catch (error) {
    console.error("Erreur lors du chargement des réponses:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function deleteResponse(
  responseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    const { error } = await supabase.from("responses").delete().eq("id", responseId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function deleteResponses(
  responseIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Non authentifié" }
    }

    // Filtrer les IDs valides (UUIDs)
    const validIds = responseIds.filter((id) => {
      // Vérifier que c'est un UUID valide (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      return uuidRegex.test(id)
    })

    if (validIds.length === 0) {
      return { success: false, error: "Aucun ID valide à supprimer" }
    }

    // Récupérer les form_ids des réponses à supprimer pour vérifier les permissions
    const { data: responses, error: fetchError } = await supabase
      .from("responses")
      .select("id, form_id")
      .in("id", validIds)

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    if (!responses || responses.length === 0) {
      return { success: false, error: "Aucune réponse trouvée" }
    }

    // Récupérer l'org_id de l'utilisateur depuis profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.org_id) {
      return { success: false, error: "Profil ou organisation introuvable" }
    }

    // Vérifier que tous les formulaires appartiennent à l'organisation de l'utilisateur
    const formIds = [...new Set(responses.map((r) => r.form_id))]
    const { data: forms, error: formsError } = await supabase
      .from("forms")
      .select("id")
      .in("id", formIds)
      .eq("org_id", profile.org_id)

    if (formsError) {
      return { success: false, error: formsError.message }
    }

    if (!forms || forms.length === 0) {
      return { success: false, error: "Aucun formulaire trouvé avec les permissions nécessaires" }
    }

    // Vérifier que toutes les réponses appartiennent à des formulaires de l'utilisateur
    const authorizedFormIds = new Set(forms.map((f) => f.id))
    const authorizedResponses = responses.filter((r) => authorizedFormIds.has(r.form_id))
    
    if (authorizedResponses.length === 0) {
      return { success: false, error: "Aucune réponse n'appartient à vos formulaires" }
    }

    const authorizedIds = authorizedResponses.map((r) => r.id)

    // Utiliser le service role pour contourner RLS si nécessaire
    // Mais on a déjà vérifié toutes les permissions manuellement
    const serviceSupabase = createServiceRoleSupabase()
    
    // Supprimer uniquement les réponses autorisées
    const { error: deleteError, data: deletedData } = await serviceSupabase
      .from("responses")
      .delete()
      .in("id", authorizedIds)
      .select()

    if (deleteError) {
      console.error("Erreur Supabase lors de la suppression:", deleteError)
      return { success: false, error: deleteError.message }
    }

    const deletedCount = deletedData?.length || 0

    if (deletedCount === 0) {
      return { 
        success: false, 
        error: "Aucune réponse n'a pu être supprimée." 
      }
    }

    console.log(`Suppression réussie: ${deletedCount} réponse(s) supprimée(s) sur ${validIds.length} demandée(s)`)

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}



