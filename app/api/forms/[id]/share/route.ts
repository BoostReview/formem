import { NextRequest, NextResponse } from "next/server"
import { getForm } from "@/app/actions/forms"
import { generateQRCode } from "@/lib/qrcode/generateQRCode"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const baseUrl = request.nextUrl.origin

    // Récupérer le formulaire
    const formResult = await getForm(id)

    if (!formResult.success || !formResult.form) {
      return NextResponse.json(
        { error: "Formulaire non trouvé" },
        { status: 404 }
      )
    }

    const form = formResult.form

    if (!form.published || !form.slug) {
      return NextResponse.json(
        { error: "Le formulaire n'est pas publié" },
        { status: 400 }
      )
    }

    const publicUrl = `${baseUrl}/f/${form.slug}`

    // Générer le QR code
    let qrCodeUrl: string | null = null
    try {
      qrCodeUrl = await generateQRCode(publicUrl)
    } catch (error) {
      console.error("Erreur génération QR code:", error)
    }

    // Code iFrame
    const iframeId = `form-iframe-${form.slug}`
    const embedUrl = `${publicUrl}?embed=true`
    const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  id="${iframeId}"
  data-auto-height="true"
></iframe>
<script src="${baseUrl}/api/embed.js"></script>`

    return NextResponse.json({
      success: true,
      form: {
        id: form.id,
        title: form.title,
        slug: form.slug,
        published: form.published,
      },
      publicUrl,
      embedCode,
      qrCodeUrl,
      settings: form.settings_json || {},
    })
  } catch (error) {
    console.error("Erreur API share:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
