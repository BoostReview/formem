"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponseFiltersProps {
  dateFrom?: Date
  dateTo?: Date
  source?: "link" | "embed"
  search?: string
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
  onSourceChange: (source: "link" | "embed" | undefined) => void
  onSearchChange: (search: string) => void
  onReset: () => void
  className?: string
}

export function ResponseFilters({
  dateFrom,
  dateTo,
  source,
  search,
  onDateFromChange,
  onDateToChange,
  onSourceChange,
  onSearchChange,
  onReset,
  className,
}: ResponseFiltersProps) {
  const handleQuickDateFilter = (period: "today" | "week" | "month") => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (period) {
      case "today":
        onDateFromChange(startOfDay)
        onDateToChange(now)
        break
      case "week":
        const weekAgo = new Date(now)
        weekAgo.setDate(now.getDate() - 7)
        onDateFromChange(weekAgo)
        onDateToChange(now)
        break
      case "month":
        const monthAgo = new Date(now)
        monthAgo.setMonth(now.getMonth() - 1)
        onDateFromChange(monthAgo)
        onDateToChange(now)
        break
    }
  }

  const hasFilters = dateFrom || dateTo || source || search

  return (
    <div className={cn("space-y-4", className)}>
      {/* Recherche textuelle */}
      <div className="space-y-2">
        <Label htmlFor="search">Recherche</Label>
        <Input
          id="search"
          placeholder="Rechercher dans email, téléphone, réponses..."
          value={search || ""}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtre par date */}
      <div className="space-y-2">
        <Label>Période</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDateFilter("today")}
          >
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDateFilter("week")}
          >
            Cette semaine
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickDateFilter("month")}
          >
            Ce mois
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="date-from" className="text-xs text-muted-foreground">
              Du
            </Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                onDateFromChange(e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="date-to" className="text-xs text-muted-foreground">
              Au
            </Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                onDateToChange(e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          </div>
        </div>
      </div>

      {/* Filtre par source */}
      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Select
          value={source || "all"}
          onValueChange={(value) =>
            onSourceChange(value === "all" ? undefined : (value as "link" | "embed"))
          }
        >
          <SelectTrigger id="source">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sources</SelectItem>
            <SelectItem value="link">Lien</SelectItem>
            <SelectItem value="embed">Intégration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bouton réinitialiser */}
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onReset} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  )
}





