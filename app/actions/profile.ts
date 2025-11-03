"use server"

import { createServerSupabase } from "@/lib/supabase/server"
import type { Profile, Org } from "@/types"

export async function getProfile(): Promise<{
  success: boolean
  profile?: Profile
  org?: Org
  user?: { id: string; email: string }
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

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable" }
    }

    // Récupérer l'organisation
    const { data: org, error: orgError } = await supabase
      .from("orgs")
      .select("*")
      .eq("id", profile.org_id)
      .single()

    if (orgError || !org) {
      return { success: false, error: "Organisation introuvable" }
    }

    return {
      success: true,
      profile: profile as Profile,
      org: org as Org,
      user: {
        id: user.id,
        email: user.email || "",
      },
    }
  } catch (error) {
    console.error("Erreur récupération profil:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function updateProfile(data: {
  org_name?: string
}): Promise<{ success: boolean; error?: string }> {
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

    // Mettre à jour le nom de l'organisation si fourni
    if (data.org_name) {
      const { error: updateError } = await supabase
        .from("orgs")
        .update({ name: data.org_name })
        .eq("id", profile.org_id)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur mise à jour profil:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function updateEmail(newEmail: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createServerSupabase()

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur mise à jour email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase()

    // Vérifier le mot de passe actuel en se reconnectant
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return { success: false, error: "Utilisateur introuvable" }
    }

    // Vérifier l'ancien mot de passe
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      return { success: false, error: "Mot de passe actuel incorrect" }
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erreur mise à jour mot de passe:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}


