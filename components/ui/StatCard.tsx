"use client"

import * as React from "react"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5",
      "hover:border-black/20 dark:hover:border-white/20 transition-all",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-black/60 dark:text-white/60 uppercase tracking-wide">
          {label}
        </span>
        {Icon && (
          <Icon className="h-5 w-5 text-black/40 dark:text-white/40" />
        )}
      </div>
      <div className="text-3xl font-bold text-black/90 dark:text-white/90 mb-1">
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 text-xs mt-2">
          {trend.isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={cn(
            "font-medium",
            trend.isPositive ? "text-[#10B981]" : "text-red-500"
          )}>
            {Math.abs(trend.value)}%
          </span>
          <span className="text-black/40 dark:text-white/40">vs mois dernier</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-black/60 dark:text-white/60 mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
