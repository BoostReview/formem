import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL invalide" },
        { status: 400 }
      )
    }

    // Valider que l'URL est valide
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: "URL invalide" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabase()

    // Récupérer l'utilisateur
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Récupérer le profil pour obtenir l'org_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single()

    if (!profile?.org_id) {
      return NextResponse.json(
        { error: "Organisation introuvable" },
        { status: 403 }
      )
    }

    // Extraire le form_id de l'URL si c'est un formulaire
    const formIdMatch = url.match(/\/f\/([a-z0-9-]+)/)
    const formId = formIdMatch ? null : null // On ne peut pas extraire l'ID du slug, on le laisse null

    // Générer un code unique court (8 caractères)
    let code: string
    let attempts = 0
    const maxAttempts = 10

    do {
      code = nanoid(8)
      const { data: existing } = await supabase
        .from("short_links")
        .select("id")
        .eq("code", code)
        .single()

      if (!existing) {
        break
      }

      attempts++
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: "Impossible de générer un code unique" },
          { status: 500 }
        )
      }
    } while (true)

    // Insérer le raccourci
    const { data: shortLink, error: insertError } = await supabase
      .from("short_links")
      .insert({
        code,
        original_url: url,
        org_id: profile.org_id,
        form_id: formId,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Erreur insertion short link:", insertError)
      return NextResponse.json(
        { error: "Erreur lors de la création du raccourci" },
        { status: 500 }
      )
    }

    // Construire l'URL raccourcie
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const shortUrl = `${baseUrl}/s/${code}`

    return NextResponse.json({
      success: true,
      shortUrl,
      originalUrl: url,
      code,
    })
  } catch (error) {
    console.error("Erreur raccourcissement URL:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Impossible de raccourcir l'URL",
      },
      { status: 500 }
    )
  }
}
