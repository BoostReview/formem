"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyForms() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-white/5">
      <div className="rounded-full bg-black/5 dark:bg-white/5 p-4 mb-4">
        <FileText className="h-8 w-8 text-black/40 dark:text-white/40" />
      </div>
      <h3 className="text-lg font-semibold text-black/90 dark:text-white/90 mb-2">
        Aucun formulaire
      </h3>
      <p className="text-sm text-black/60 dark:text-white/60 text-center mb-6 max-w-sm leading-relaxed">
        Créez votre premier formulaire pour commencer à collecter des réponses
      </p>
      <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
        <Link href="/dashboard/forms/new">
          <Plus className="h-4 w-4 mr-2" />
          Créer votre premier formulaire
        </Link>
      </Button>
    </div>
  )
}
