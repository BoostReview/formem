"use client"

import * as React from "react"
import { FileText, MessageSquare, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsGridProps {
  totalForms: number
  totalResponses: number
  activeForms: number
}

export function StatsGrid({ totalForms, totalResponses, activeForms }: StatsGridProps) {
  const stats = [
    {
      label: "Total formulaires",
      value: totalForms,
      icon: FileText,
      color: "text-[#A78BFA]"
    },
    {
      label: "Réponses totales",
      value: totalResponses,
      icon: MessageSquare,
      color: "text-[#EC4899]"
    },
    {
      label: "Formulaires actifs",
      value: activeForms,
      icon: CheckCircle2,
      color: "text-[#10B981]"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-black/60 dark:text-white/60 uppercase tracking-wide">
                {stat.label}
              </span>
              <Icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className="text-3xl font-bold text-black/90 dark:text-white/90">
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
