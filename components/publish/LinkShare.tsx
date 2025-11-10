"use client"

import * as React from "react"
import { Copy, ExternalLink, Check, Link2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QRCodeDisplay } from "./QRCodeDisplay"
import { useToast } from "@/components/ui/use-toast"

interface LinkShareProps {
  url: string
  slug: string
}

export function LinkShare({ url, slug }: LinkShareProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)
  const [shortUrl, setShortUrl] = React.useState<string | null>(null)
  const [isShortening, setIsShortening] = React.useState(false)
  const [copiedShort, setCopiedShort] = React.useState(false)

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papiers",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      })
    }
  }

  const handleCopyShort = async () => {
    if (shortUrl) {
      await handleCopy(shortUrl)
      setCopiedShort(true)
      setTimeout(() => setCopiedShort(false), 2000)
    }
  }

  const handleOpen = (urlToOpen: string) => {
    window.open(urlToOpen, "_blank", "noopener,noreferrer")
  }

  const handleShorten = async () => {
    if (shortUrl) {
      // Si déjà raccourci, on copie le lien raccourci
      await handleCopy(shortUrl)
      return
    }

    setIsShortening(true)
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.success && data.shortUrl) {
        setShortUrl(data.shortUrl)
        toast({
          title: "Lien raccourci",
          description: "Le lien raccourci a été généré",
        })
      } else {
        const errorMessage = data.error || "Erreur lors du raccourcissement"
        console.error("Erreur raccourcissement:", errorMessage, data)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Erreur complète:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de raccourcir le lien. Les services externes peuvent être temporairement indisponibles.",
        variant: "destructive",
      })
    } finally {
      setIsShortening(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Lien public</label>
        <div className="flex gap-2">
          <Input
            value={url}
            readOnly
            className="font-mono text-sm"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCopy(url)}
            title="Copier le lien"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleOpen(url)}
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleShorten}
            title={shortUrl ? "Copier le lien raccourci" : "Raccourcir le lien"}
            disabled={isShortening}
            className="whitespace-nowrap"
          >
            {isShortening ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Raccourcissement...
              </>
            ) : shortUrl ? (
              copiedShort ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copié
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copier le lien court
                </>
              )
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Raccourcir
              </>
            )}
          </Button>
        </div>
      </div>

      {shortUrl && (
        <div>
          <label className="text-sm font-medium mb-2 block">Lien raccourci</label>
          <div className="flex gap-2">
            <Input
              value={shortUrl}
              readOnly
              className="font-mono text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyShort}
              title="Copier le lien raccourci"
            >
              {copiedShort ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleOpen(shortUrl)}
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <QRCodeDisplay url={shortUrl || url} slug={slug} />
    </div>
  )
}



