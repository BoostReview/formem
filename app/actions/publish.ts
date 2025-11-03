"use server"

import { createServerSupabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Form } from "@/types"

/**
 * Générer un slug à partir d'un titre
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Toggle publication d'un formulaire
 */
export async function togglePublish(
  formId: string,
  published: boolean
): Promise<{ success: boolean; slug?: string; error?: string }> {
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
    }
  }

  // Récupérer le profil pour vérifier l'org
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return {
      success: false,
      error: "Profil non trouvé",
    }
  }

  // Récupérer le formulaire
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .eq("org_id", profile.org_id)
    .single()

  if (fetchError || !form) {
    return {
      success: false,
      error: "Formulaire non trouvé",
    }
  }

  let slug = form.slug

  // Si on publie et qu'il n'y a pas de slug, générer un slug
  if (published && !slug) {
    const baseSlug = generateSlug(form.title)

    // Vérifier l'unicité
    let candidateSlug = baseSlug
    let counter = 1

    while (true) {
      const { data: existing } = await supabase
        .from("forms")
        .select("id")
        .eq("slug", candidateSlug)
        .neq("id", formId)
        .single()

      if (!existing) {
        slug = candidateSlug
        break
      }

      candidateSlug = `${baseSlug}-${counter}`
      counter++
    }
  }

  // Mettre à jour le formulaire
  const { error: updateError } = await supabase
    .from("forms")
    .update({
      published,
      ...(slug && { slug }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", formId)
    .eq("org_id", profile.org_id)

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    }
  }

  revalidatePath("/dashboard/forms")
  revalidatePath(`/dashboard/forms/${formId}/publish`)
  if (slug) {
    revalidatePath(`/f/${slug}`)
  }

  return {
    success: true,
    slug: slug || form.slug || undefined,
  }
}

/**
 * Mettre à jour les paramètres de publication
 */
export async function updateFormSettings(
  formId: string,
  settings: {
    maxResponses?: number | null
    expiresAt?: string | null
    redirectUrl?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
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
    }
  }

  // Récupérer le profil pour vérifier l'org
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return {
      success: false,
      error: "Profil non trouvé",
    }
  }

  // Récupérer le formulaire existant
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("settings_json, slug")
    .eq("id", formId)
    .eq("org_id", profile.org_id)
    .single()

  if (fetchError || !form) {
    return {
      success: false,
      error: "Formulaire non trouvé",
    }
  }

  // Fusionner avec les settings existants
  const currentSettings = (form.settings_json as Record<string, unknown>) || {}
  const updatedSettings = {
    ...currentSettings,
    ...(settings.maxResponses !== undefined && { maxResponses: settings.maxResponses }),
    ...(settings.expiresAt !== undefined && { expiresAt: settings.expiresAt }),
    ...(settings.redirectUrl !== undefined && { redirectUrl: settings.redirectUrl }),
  }

  // Mettre à jour
  const { error: updateError } = await supabase
    .from("forms")
    .update({
      settings_json: updatedSettings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formId)
    .eq("org_id", profile.org_id)

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    }
  }

  revalidatePath(`/dashboard/forms/${formId}/publish`)
  revalidatePath(`/f/${form.slug || ""}`)

  return {
    success: true,
  }
}

/**
 * Vérifier si un formulaire peut être publié
 */
export async function validateFormForPublish(
  formId: string
): Promise<{ valid: boolean; warnings: string[]; errors: string[] }> {
  const supabase = await createServerSupabase()

  // Récupérer l'utilisateur
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      valid: false,
      warnings: [],
      errors: ["Non authentifié"],
    }
  }

  // Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return {
      valid: false,
      warnings: [],
      errors: ["Profil non trouvé"],
    }
  }

  // Récupérer le formulaire
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .eq("org_id", profile.org_id)
    .single()

  if (fetchError || !form) {
    return {
      valid: false,
      warnings: [],
      errors: ["Formulaire non trouvé"],
    }
  }

  const warnings: string[] = []
  const errors: string[] = []

  // Vérifications obligatoires
  if (!form.title || form.title.trim().length === 0) {
    errors.push("Le titre du formulaire est requis")
  }

  // schema_json est directement un array de FormBlock
  const schemaBlocks = Array.isArray(form.schema_json)
    ? form.schema_json
    : (form.schema_json as any)?.blocks || []
  
  if (!schemaBlocks || schemaBlocks.length === 0) {
    errors.push("Le formulaire doit contenir au moins un bloc")
  }

  // Vérifications de warning
  if (schemaBlocks.length < 2) {
    warnings.push("Le formulaire contient très peu de questions")
  }

  if (!form.slug) {
    warnings.push("Un slug sera généré automatiquement lors de la publication")
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  }
}

