"use client"

import * as React from "react"
import Link from "next/link"
import {
  MoreVertical,
  Edit,
  Eye,
  Share2,
  BarChart3,
  Copy,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Form } from "@/types"

// Fonction utilitaire pour formater les dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

interface FormCardProps {
  form: Form
  responseCount: number
  onEdit: (id: string) => void
  onPreview: (id: string) => void
  onShare: (id: string) => void
  onViewResponses: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function FormCard({
  form,
  responseCount,
  onEdit,
  onPreview,
  onShare,
  onViewResponses,
  onDuplicate,
  onDelete,
}: FormCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4 gap-4">
        {/* Colonne gauche: Titre et infos */}
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold mb-1">
              <Link
                href={`/dashboard/forms/${form.id}/edit`}
                className="hover:text-primary transition-colors block truncate"
              >
                {form.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant={form.published ? "success" : "secondary"} className="text-xs">
                {form.published ? "Publié" : "Brouillon"}
              </Badge>
              <span className="text-xs">
                {formatDate(form.created_at)}
              </span>
              <span className="text-xs">
                {responseCount} {responseCount <= 1 ? "réponse" : "réponses"}
              </span>
              <span className="text-xs">
                {form.layout === "one" ? "One-by-one" : "All-in-one"}
              </span>
            </div>
          </div>
        </div>

        {/* Colonne droite: Menu d'actions */}
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" suppressHydrationWarning>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu d'actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(form.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Éditer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(form.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Prévisualiser
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(form.id)}>
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewResponses(form.id)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Voir réponses ({responseCount})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDuplicate(form.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(form.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}

