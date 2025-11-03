"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyForms() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun formulaire</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
          Créez votre premier formulaire pour commencer à collecter des réponses
        </p>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier formulaire
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}


