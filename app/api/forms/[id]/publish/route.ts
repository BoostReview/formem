import { NextRequest, NextResponse } from "next/server"
import { togglePublish } from "@/app/actions/publish"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { published } = body

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "Le paramètre 'published' est requis (boolean)" },
        { status: 400 }
      )
    }

    const result = await togglePublish(id, published)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erreur lors de la publication" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      published,
      slug: result.slug,
    })
  } catch (error) {
    console.error("Erreur API publish:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
