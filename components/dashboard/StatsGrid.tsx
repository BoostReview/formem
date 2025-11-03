"use client"

import * as React from "react"
import { FileText, MessageSquare, CheckCircle2 } from "lucide-react"
import { StatCard } from "@/components/ui/StatCard"

interface StatsGridProps {
  totalForms: number
  totalResponses: number
  activeForms: number
}

export function StatsGrid({ totalForms, totalResponses, activeForms }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Total formulaires"
        value={totalForms}
        icon={FileText}
      />
      <StatCard
        label="Réponses totales"
        value={totalResponses}
        icon={MessageSquare}
      />
      <StatCard
        label="Formulaires actifs"
        value={activeForms}
        icon={CheckCircle2}
      />
    </div>
  )
}


