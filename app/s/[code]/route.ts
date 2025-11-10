import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleSupabase } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code invalide" },
        { status: 400 }
      )
    }

    // Utiliser le service role pour contourner RLS et permettre l'accès public
    const supabase = createServiceRoleSupabase()

    // Récupérer le lien raccourci
    const { data: shortLink, error } = await supabase
      .from("short_links")
      .select("original_url, clicks")
      .eq("code", code)
      .single()

    if (error || !shortLink) {
      return NextResponse.redirect(new URL("/404", request.url))
    }

    // Incrémenter le compteur de clics
    await supabase
      .from("short_links")
      .update({
        clicks: (shortLink.clicks || 0) + 1,
        last_clicked_at: new Date().toISOString(),
      })
      .eq("code", code)

    // Rediriger vers l'URL originale
    return NextResponse.redirect(new URL(shortLink.original_url))
  } catch (error) {
    console.error("Erreur redirection short link:", error)
    return NextResponse.redirect(new URL("/404", request.url))
  }
}


