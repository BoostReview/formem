"use client"

import * as React from "react"
import type { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface AddressBlockProps {
  block: FormBlock
  value?: unknown
  onChange: (value: unknown) => void
}

interface AddressSuggestion {
  label: string
  street: string
  city: string
  zip: string
  country: string
}

export function AddressBlock({ block, value, onChange }: AddressBlockProps) {
  const helpText = (block.helpText as string) || ""
  const addressValue = (value as { street?: string; city?: string; zip?: string; country?: string }) || {}
  const [searchQuery, setSearchQuery] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  // Fermer les suggestions quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Recherche d'adresses avec l'API Adresse.data.gouv.fr
  const searchAddresses = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
      )
      const data = await response.json()

      if (data.features && Array.isArray(data.features)) {
        const formattedSuggestions: AddressSuggestion[] = data.features.map((feature: any) => {
          const props = feature.properties
          // L'API retourne l'adresse complète dans "label" et les détails séparés
          return {
            label: props.label, // Adresse complète formatée
            street: props.name || props.housenumber ? `${props.housenumber || ""} ${props.name || ""}`.trim() : props.label.split(",")[0] || "",
            city: props.city || "",
            zip: props.postcode || "",
            country: "France", // L'API est française
          }
        })
        setSuggestions(formattedSuggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Erreur recherche adresse:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce de la recherche
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(query)
    }, 300)
  }

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const newAddress = {
      street: suggestion.label, // Utiliser l'adresse complète formatée
      city: suggestion.city,
      zip: suggestion.zip,
      country: suggestion.country,
    }
    onChange(newAddress)
    setSearchQuery(suggestion.label)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleStreetChange = (val: string) => {
    onChange({ ...addressValue, street: val })
    if (val.length >= 3) {
      handleSearchChange(val)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const align = getAlignment(block as any)

  return (
    <div className="space-y-4 pt-6">
      <Label className={cn(
        "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
        alignmentClasses[align]
      )}>
        {block.label}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      {helpText && (
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          {helpText}
        </p>
      )}
      <div className="space-y-3">
        {/* Champ de recherche avec autocomplétion */}
        <div className="relative" ref={suggestionsRef}>
          <Input
            placeholder="Commencez à taper une adresse..."
            value={addressValue.street || searchQuery || ""}
            onChange={(e) => {
              const val = e.target.value
              setSearchQuery(val)
              handleStreetChange(val)
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              } else if (addressValue.street && addressValue.street.length >= 3) {
                searchAddresses(addressValue.street)
              }
            }}
            className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {isLoading && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Recherche en cours...
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                >
                  <div className="font-medium text-gray-900 dark:text-slate-100">
                    {suggestion.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Code postal"
            value={addressValue.zip || ""}
            onChange={(e) => onChange({ ...addressValue, zip: e.target.value })}
            className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
          />
          <Input
            placeholder="Ville"
            value={addressValue.city || ""}
            onChange={(e) => onChange({ ...addressValue, city: e.target.value })}
            className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
        <Input
          placeholder="Pays"
          value={addressValue.country || "France"}
          onChange={(e) => onChange({ ...addressValue, country: e.target.value })}
          className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
        />
      </div>
    </div>
  )
}

