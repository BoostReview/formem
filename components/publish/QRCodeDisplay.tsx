"use client"

import * as React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateQRCode, generateQRCodeSVG } from "@/lib/qrcode/generateQRCode"

interface QRCodeDisplayProps {
  url: string
  slug: string
}

export function QRCodeDisplay({ url, slug }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadQRCode() {
      try {
        setLoading(true)
        const dataUrl = await generateQRCode(url)
        setQrCodeUrl(dataUrl)
        setError(null)
      } catch (err) {
        setError("Impossible de générer le QR code")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadQRCode()
  }, [url])

  const handleDownloadPNG = async () => {
    if (!qrCodeUrl) return

    try {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `form-qr-${slug}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err)
    }
  }

  const handleDownloadSVG = async () => {
    try {
      const svg = await generateQRCodeSVG(url)
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `form-qr-${slug}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Erreur lors du téléchargement SVG:", err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Génération du QR code...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !qrCodeUrl) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-sm text-destructive">{error || "Erreur"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-lg border-2 border-gray-200 p-4 bg-white">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPNG}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PNG
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadSVG}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger SVG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

