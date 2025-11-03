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
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          {block.label || block.id}
                        </div>
                        <div className="text-base">{value}</div>
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

