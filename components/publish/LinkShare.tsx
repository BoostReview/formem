"use client"

import * as React from "react"
import { Copy, ExternalLink, Check } from "lucide-react"
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
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

  const handleOpen = () => {
    window.open(url, "_blank", "noopener,noreferrer")
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
            onClick={handleCopy}
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
            onClick={handleOpen}
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <QRCodeDisplay url={url} slug={slug} />
    </div>
  )
}


