"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Response, Form } from "@/types"
import { formatResponseDate, formatPhone, formatAnswers } from "@/lib/formatters/formatResponse"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { File, Download, Eye, Image as ImageIcon } from "lucide-react"

interface ResponseDetailModalProps {
  response: Response | null
  form: Form | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResponseDetailModal({
  response,
  form,
  open,
  onOpenChange,
}: ResponseDetailModalProps) {
  if (!response || !form) return null

  const schema = form.schema_json || []
  const formattedAnswers = formatAnswers(response.answers_json || {}, schema)

  // Fonction pour déterminer le type de fichier
  const getFileType = (fileName: string, fileType?: string): "image" | "pdf" | "other" => {
    const lowerName = fileName.toLowerCase()
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"]
    const pdfExtensions = [".pdf"]
    
    if (imageExtensions.some(ext => lowerName.endsWith(ext)) || fileType?.startsWith("image/")) {
      return "image"
    }
    if (pdfExtensions.some(ext => lowerName.endsWith(ext)) || fileType === "application/pdf") {
      return "pdf"
    }
    return "other"
  }

  // Fonction pour rendre la valeur d'une réponse
  const renderValue = (value: string, blockType: string) => {
    // Pour le CAPTCHA, afficher un badge "Validé" au lieu du token
    if (blockType === "captcha") {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            ✓ Validé
          </Badge>
        </div>
      )
    }
    
    // Détecter si c'est un fichier
    if (value.startsWith("FILE:")) {
      try {
        const fileData = JSON.parse(value.substring(5))
        const fileUrl = fileData.fileUrl || fileData.fileName
        const fileName = fileData.originalName || fileData.fileName || "Fichier"
        const fileType = getFileType(fileName, fileData.type)
        const isImage = fileType === "image"
        const isPdf = fileType === "pdf"
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                {isImage ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <File className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                {fileData.size && (
                  <p className="text-xs text-muted-foreground">
                    {fileData.size < 1024
                      ? `${fileData.size} B`
                      : fileData.size < 1024 * 1024
                      ? `${(fileData.size / 1024).toFixed(1)} KB`
                      : `${(fileData.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                )}
              </div>
              {fileUrl && (
                <div className="flex gap-2 flex-shrink-0">
                  {(isImage || isPdf) && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`${fileUrl}${fileUrl.includes('?') ? '&' : '?'}download=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Prévisualisation pour les images */}
            {isImage && fileUrl && (
              <div className="border rounded-lg overflow-hidden bg-muted/30">
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="w-full h-auto max-h-96 object-contain"
                  onError={(e) => {
                    // Si l'image ne charge pas, cacher la prévisualisation
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
            
            {/* Prévisualisation pour les PDF */}
            {isPdf && fileUrl && (
              <div className="border rounded-lg overflow-hidden bg-muted/30">
                <div className="w-full bg-white" style={{ height: "400px", minHeight: "400px" }}>
                  <embed
                    src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    type="application/pdf"
                    className="w-full h-full"
                    style={{ minHeight: "400px" }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      } catch {
        return <div className="text-base">{value}</div>
      }
    }
    
    return <div className="text-base">{value}</div>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Détails de la réponse</DialogTitle>
          <DialogDescription>
            Réponse du {formatResponseDate(response.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Réponses du formulaire */}
            <div>
              <h3 className="font-semibold mb-3">Réponses</h3>
              <div className="space-y-3">
                {schema.length > 0 ? (
                  schema.map((block) => {
                    const value = formattedAnswers[block.label || block.id]
                    if (value === "-" || !value) return null
                    return (
                      <div key={block.id} className="border rounded-lg p-3">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          {block.label || block.id}
                        </div>
                        {renderValue(value, block.type)}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Aucune réponse disponible
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Informations de contact */}
            {(response.email || response.phone_e164 || response.phone_raw) && (
              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <div className="space-y-2 text-sm">
                  {response.email && (
                    <div>
                      <span className="text-muted-foreground">Email : </span>
                      <span>{response.email}</span>
                    </div>
                  )}
                  {(response.phone_e164 || response.phone_raw) && (
                    <div>
                      <span className="text-muted-foreground">Téléphone : </span>
                      <span>
                        {formatPhone(response.phone_e164 || response.phone_raw || null)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(response.email || response.phone_e164 || response.phone_raw) && (
              <Separator />
            )}

            {/* Métadonnées */}
            <div>
              <h3 className="font-semibold mb-3">Métadonnées</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Date : </span>
                  <span>{formatResponseDate(response.created_at)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Source : </span>
                  <Badge variant={response.source === "link" ? "default" : "secondary"}>
                    {response.source === "link" ? "Lien" : "Intégration"}
                  </Badge>
                </div>
                {response.ip && (
                  <div>
                    <span className="text-muted-foreground">IP : </span>
                    <span className="font-mono">{response.ip}</span>
                  </div>
                )}
                {response.ua && (
                  <div>
                    <span className="text-muted-foreground">User-Agent : </span>
                    <span className="font-mono text-xs break-all">{response.ua}</span>
                  </div>
                )}
              </div>
            </div>

            {/* UTM Parameters */}
            {response.utm_json &&
              (response.utm_json.utm_source ||
                response.utm_json.utm_medium ||
                response.utm_json.utm_campaign) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Paramètres UTM</h3>
                    <div className="space-y-2 text-sm">
                      {response.utm_json.utm_source && (
                        <div>
                          <span className="text-muted-foreground">Source : </span>
                          <span>{response.utm_json.utm_source}</span>
                        </div>
                      )}
                      {response.utm_json.utm_medium && (
                        <div>
                          <span className="text-muted-foreground">Medium : </span>
                          <span>{response.utm_json.utm_medium}</span>
                        </div>
                      )}
                      {response.utm_json.utm_campaign && (
                        <div>
                          <span className="text-muted-foreground">Campagne : </span>
                          <span>{response.utm_json.utm_campaign}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

            {/* Hidden fields */}
            {response.hidden_json && Object.keys(response.hidden_json).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Champs cachés</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(response.hidden_json).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key} : </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

