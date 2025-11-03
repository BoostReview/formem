"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface EmbedCodeProps {
  slug: string
}

export function EmbedCode({ slug }: EmbedCodeProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const embedUrl = `${baseUrl}/f/${slug}?embed=true`
  const iframeId = `form-iframe-${slug}`

  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  id="${iframeId}"
  data-auto-height="true"
></iframe>
<script src="${baseUrl}/api/embed.js"></script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      toast({
        title: "Code copié",
        description: "Le code iFrame a été copié dans le presse-papiers",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code iFrame</CardTitle>
        <CardDescription>
          Intégrez ce formulaire dans votre site web en copiant ce code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={embedCode}
            readOnly
            className="font-mono text-sm min-h-[180px] resize-none"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
        </div>
        <Button onClick={handleCopy} className="w-full">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Code copié
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copier le code
            </>
          )}
        </Button>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• La hauteur s'ajustera automatiquement grâce au script auto-height</p>
          <p>• Vous pouvez modifier la largeur et la hauteur initiale dans le code</p>
        </div>
      </CardContent>
    </Card>
  )
}


