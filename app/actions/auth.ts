"use server"

import { createServerSupabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  if (data.user && data.user.id) {
    // Attendre un peu pour laisser le trigger SQL se terminer
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Vérifier si le profil existe, sinon le créer via RPC
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single()

    if (!profile) {
      // Le trigger a peut-être échoué, utiliser la fonction RPC
      await supabase.rpc("ensure_user_profile", {
        user_id: data.user.id,
      })
    }

    revalidatePath("/", "layout")
    return {
      success: true,
      user: data.user,
    }
  }

  return {
    success: false,
    error: "Une erreur inattendue s'est produite",
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  if (data.user) {
    revalidatePath("/", "layout")
    redirect("/dashboard")
  }

  // Cette ligne ne sera jamais atteinte car redirect() lance une erreur,
  // mais nécessaire pour TypeScript
  return {
    success: false,
    error: "Une erreur inattendue s'est produite",
  }
}

export async function signOut() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/signin")
}

