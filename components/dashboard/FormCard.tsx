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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Form } from "@/types"

// Fonction utilitaire pour formater les dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('fr-FR', { month: 'short' })
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
    <div className="group p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title and info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/forms/${form.id}/edit`}
            className="block font-semibold text-black/90 dark:text-white/90 hover:text-black dark:hover:text-white truncate mb-2"
          >
            {form.title}
          </Link>
          <div className="flex items-center gap-3 flex-wrap text-xs text-black/50 dark:text-white/50">
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              form.published 
                ? "bg-[#10B981]/10 text-[#10B981]" 
                : "bg-[#A78BFA]/10 text-[#A78BFA]"
            )}>
              {form.published ? "Publié" : "Brouillon"}
            </span>
            <span>{formatDate(form.created_at)}</span>
            <span>{responseCount} réponse{responseCount !== 1 ? 's' : ''}</span>
            <span>{form.layout === "one" ? "One-by-one" : "All-in-one"}</span>
          </div>
        </div>

        {/* Right: Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5" 
              suppressHydrationWarning
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-black/10 dark:border-white/10">
            <DropdownMenuItem onClick={() => onEdit(form.id)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPreview(form.id)} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Prévisualiser
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(form.id)} className="cursor-pointer">
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
            <DropdownMenuItem onClick={() => onViewResponses(form.id)} className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              Réponses ({responseCount})
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
            <DropdownMenuItem onClick={() => onDuplicate(form.id)} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(form.id)}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
