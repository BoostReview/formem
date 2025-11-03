"use client"

import * as React from "react"
import { StatCard } from "@/components/ui/StatCard"
import { Response } from "@/types"
import { cn } from "@/lib/utils"

interface ResponseStatsProps {
  responses: Response[]
  className?: string
}

export function ResponseStats({ responses, className }: ResponseStatsProps) {
  const stats = React.useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)

    const total = responses.length
    const today = responses.filter(
      (r) => new Date(r.created_at) >= startOfToday
    ).length
    const thisWeek = responses.filter(
      (r) => new Date(r.created_at) >= startOfWeek
    ).length

    return { total, today, thisWeek }
  }, [responses])

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <StatCard
        title="Total des réponses"
        value={stats.total}
        description="Toutes les réponses"
      />
      <StatCard
        title="Aujourd'hui"
        value={stats.today}
        description="Réponses reçues aujourd'hui"
      />
      <StatCard
        title="Cette semaine"
        value={stats.thisWeek}
        description="Réponses des 7 derniers jours"
      />
    </div>
  )
}


