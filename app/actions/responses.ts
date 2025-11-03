"use server"

import { createServerSupabase } from "@/lib/supabase/server"
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

    const { error } = await supabase
      .from("responses")
      .delete()
      .in("id", responseIds)

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


