"use server"

import { createServerSupabase } from "@/lib/supabase/server"
import { Form, SchemaJSON, ThemeJSON, SettingsJSON } from "@/types"

interface SaveFormData {
  title?: string
  schema_json?: SchemaJSON
  theme_json?: ThemeJSON
  settings_json?: SettingsJSON
}

export async function saveForm(
  formId: string,
  data: SaveFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    // Vérifier que l'utilisateur a accès au formulaire
    const { data: form, error: fetchError } = await supabase
      .from("forms")
      .select("org_id")
      .eq("id", formId)
      .single()

    if (fetchError || !form) {
      return { success: false, error: "Formulaire introuvable" }
    }

    // Vérifier les permissions via RLS (implémenté dans Supabase)
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.title !== undefined) {
      updates.title = data.title
    }
    if (data.schema_json !== undefined) {
      updates.schema_json = data.schema_json as any
    }
    if (data.theme_json !== undefined) {
      updates.theme_json = data.theme_json as any
    }
    if (data.settings_json !== undefined) {
      updates.settings_json = data.settings_json as any
    }

    const { error: updateError } = await supabase
      .from("forms")
      .update(updates)
      .eq("id", formId)

    if (updateError) {
      console.error("Erreur Supabase:", updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function loadForm(
  formId: string
): Promise<{ success: boolean; form?: Form; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    const { data: form, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    if (!form) {
      return { success: false, error: "Formulaire introuvable" }
    }

    return { success: true, form: form as Form }
  } catch (error) {
    console.error("Erreur lors du chargement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

// Alias pour compatibilité
export const getForm = loadForm

export async function getForms(): Promise<{
  success: boolean
  forms?: Form[]
  error?: string
}> {
  try {
    const supabase = await createServerSupabase()

    // Récupérer l'utilisateur actuel
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

    // Récupérer tous les formulaires de l'organisation
    const { data: forms, error } = await supabase
      .from("forms")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, forms: (forms || []) as Form[] }
  } catch (error) {
    console.error("Erreur lors du chargement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function deleteForm(
  formId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    const { error } = await supabase.from("forms").delete().eq("id", formId)

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

export async function duplicateForm(
  formId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    // Charger le formulaire original
    const { data: originalForm, error: fetchError } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single()

    if (fetchError || !originalForm) {
      return { success: false, error: "Formulaire introuvable" }
    }

    // Créer une copie avec un nouveau titre
    const { data: newForm, error: insertError } = await supabase
      .from("forms")
      .insert({
        org_id: originalForm.org_id,
        title: `${originalForm.title} (Copie)`,
        slug: null, // Le slug sera généré plus tard si nécessaire
        layout: originalForm.layout,
        schema_json: originalForm.schema_json,
        theme_json: originalForm.theme_json,
        settings_json: originalForm.settings_json,
        published: false,
      })
      .select()
      .single()

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la duplication:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function createForm(data: {
  title: string
  layout: "one" | "page"
  templateId?: string
}): Promise<{ success: boolean; formId?: string; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    // Récupérer l'utilisateur actuel
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Non authentifié" }
    }

    // Récupérer le profil pour obtenir l'org_id
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single()

    // Si le profil n'existe pas, utiliser une fonction SQL RPC pour le créer
    if (profileError || !profile) {
      console.log("Profil introuvable, création en cours via fonction SQL RPC...")
      
      // Utiliser la fonction SQL ensure_user_profile qui utilise SECURITY DEFINER (bypass RLS)
      const { data: orgId, error: functionError } = await supabase.rpc("ensure_user_profile", {
        user_id: user.id,
      })
      
      if (functionError || !orgId) {
        console.error("Erreur création via fonction SQL RPC:", functionError)
        return { 
          success: false, 
          error: functionError?.message || "Impossible de créer le profil. Veuillez exécuter le script SQL ensure_user_profile dans Supabase." 
        }
      }
      
      // Récupérer le profil créé
      const { data: newProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single()
      
      if (fetchError || !newProfile) {
        console.error("Erreur récupération profil:", fetchError)
        return { success: false, error: "Profil créé mais introuvable" }
      }
      
      profile = newProfile
      console.log("Profil créé avec succès, org_id:", orgId)
    }

    // À ce point, profile doit exister
    if (!profile) {
      return { success: false, error: "Profil introuvable" }
    }

    // Charger le template si fourni
    let initialSchema: any[] = []
    let initialTheme = {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        background: "#ffffff",
        text: "#1e293b",
      },
      fonts: {
        family: "Inter",
        size: "16px",
      },
      radius: 8,
    }

    if (data.templateId) {
      const { getTemplateById } = await import("@/lib/templates")
      const template = getTemplateById(data.templateId)
      if (template && template.layout === data.layout) {
        initialSchema = template.schema
        initialTheme = template.theme
      }
    }

    // Créer le formulaire avec des valeurs par défaut ou le template
    const { data: newForm, error: insertError } = await supabase
      .from("forms")
      .insert({
        org_id: profile.org_id,
        title: data.title,
        slug: null, // Le slug sera généré lors de la publication
        layout: data.layout,
        schema_json: initialSchema,
        theme_json: initialTheme,
        settings_json: {},
        published: false,
      })
      .select()
      .single()

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    return { success: true, formId: newForm.id }
  } catch (error) {
    console.error("Erreur lors de la création:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}
