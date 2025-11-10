"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PHONE_PREFIXES, findPrefixByCode } from "@/lib/phone-prefixes"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface PhoneBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

// Hook pour charger la police des drapeaux
function useCountryFlagFont() {
  React.useEffect(() => {
    if (document.getElementById('country-flag-font')) {
      return
    }
    
    const fontUrl = "https://country-flag.proca.app/font/TwemojiCountryFlags.woff2"
    const fontName = "countryFlags"
    
    const loadFont = async () => {
      try {
        const customFont = new FontFace(fontName, `url(${fontUrl})`, {
          unicodeRange: "U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067, U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F"
        })
        await customFont.load()
        document.fonts.add(customFont)
        
        const style = document.createElement("style")
        style.id = 'country-flag-font'
        style.textContent = `.country-flag-emoji { font-family: "${fontName}", system-ui, sans-serif !important; }`
        document.head.appendChild(style)
      } catch (e) {
        console.error('[PhoneBlock] Failed to load country flag font:', e)
      }
    }
    
    loadFont()
  }, [])
}

export function PhoneBlock({ block, isEditing = false, onUpdate }: PhoneBlockProps) {
  useCountryFlagFont()
  
  const helpText = (block.helpText as string) || ""
  const defaultValue = (block.defaultValue as string) || ""
  const enablePrefix = (block.enablePrefix as boolean) || false
  const availablePrefixes = (block.availablePrefixes as string[]) || []
  const defaultPrefix = (block.defaultPrefix as string) || "+33"
  const align = getAlignment(block as any)
  
  const prefixesToShow = availablePrefixes.length > 0 
    ? PHONE_PREFIXES.filter(p => availablePrefixes.includes(p.code))
    : PHONE_PREFIXES

  const [prefixInput, setPrefixInput] = React.useState(() => {
    // Initialiser directement avec defaultPrefix
    return defaultPrefix || "+33"
  })
  const [isPrefixPopoverOpen, setIsPrefixPopoverOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Initialiser le préfixe avec la valeur par défaut du bloc
  React.useEffect(() => {
    if (defaultPrefix && defaultPrefix !== prefixInput) {
      console.log('[PhoneBlock Editor] Updating prefixInput from defaultPrefix:', defaultPrefix)
      setPrefixInput(defaultPrefix)
    }
  }, [defaultPrefix, prefixInput])

  // Détecter le country code depuis le préfixe
  const detectedCountryCode = React.useMemo(() => {
    const prefix = findPrefixByCode(prefixInput)
    const countryCode = prefix?.countryCode || null
    console.log('[PhoneBlock Editor] detectedCountryCode:', {
      prefixInput,
      prefix,
      countryCode,
      hasPrefix: !!prefix,
      prefixCountryCode: prefix?.countryCode
    })
    return countryCode
  }, [prefixInput])

  // Filtrer les préfixes selon la recherche
  const filteredPrefixes = React.useMemo(() => {
    if (!searchQuery) return prefixesToShow
    const query = searchQuery.toLowerCase()
    return prefixesToShow.filter(
      (p) =>
        p.country.toLowerCase().includes(query) ||
        p.code.includes(query)
    )
  }, [prefixesToShow, searchQuery])

  const handlePrefixInputChange = (value: string) => {
    // Nettoyer l'input (garder seulement + et chiffres)
    const cleaned = value.replace(/[^\d+]/g, "")
    // Limiter à 4 caractères max (ex: +123)
    const limited = cleaned.length > 4 ? cleaned.slice(0, 4) : cleaned
    
    setPrefixInput(limited)
    
    // Si le préfixe correspond à un pays, mettre à jour
    const matched = PHONE_PREFIXES.find(p => p.code === limited)
    if (matched) {
      onUpdate?.({ defaultPrefix: limited })
    }
  }

  const handlePrefixSelect = (code: string) => {
    setPrefixInput(code)
    setIsPrefixPopoverOpen(false)
    setSearchQuery("")
    onUpdate?.({ defaultPrefix: code })
  }

  const selectedPrefixInfo = prefixesToShow.find(p => p.code === prefixInput) || prefixesToShow.find(p => p.code === defaultPrefix)
  const placeholder = selectedPrefixInfo?.placeholder || "6 12 34 56 78"

  // Générer l'emoji du drapeau
  const generateFlagEmoji = (code: string) => {
    if (!code || code.length !== 2) return "🌍"
    const offset = 127397
    return code.toUpperCase().replace(/./g, (char) => 
      String.fromCodePoint(char.charCodeAt(0) + offset)
    )
  }

  return (
    <div className="w-full space-y-4">
      {isEditing ? (
        <Input
          value={block.label || ""}
          onChange={(e) => onUpdate?.({ label: e.target.value })}
          placeholder="Label du champ"
          className={cn(
            "text-base font-medium h-auto py-1 border-dashed",
            alignmentClasses[align]
          )}
        />
      ) : (
        <Label className={cn(
          "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
          alignmentClasses[align]
        )}>
          {block.label || "Téléphone"}
          {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
        </Label>
      )}
      {helpText && !isEditing && (
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          {helpText}
        </p>
      )}
      {enablePrefix && !isEditing ? (
        <div className="space-y-1">
          <div className="relative flex items-center">
            {/* Préfixe intégré à gauche */}
            <Popover open={isPrefixPopoverOpen} onOpenChange={setIsPrefixPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "absolute left-0 z-10 flex items-center gap-1.5 px-3 h-14 text-base font-medium text-gray-700 dark:text-slate-300",
                    "hover:text-gray-900 dark:hover:text-slate-100 transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-slate-300 focus-visible:ring-offset-2 rounded-l-xl"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsPrefixPopoverOpen(true)
                  }}
                >
                  {(() => {
                    const flagEmoji = detectedCountryCode ? generateFlagEmoji(detectedCountryCode) : "🌍"
                    
                    return (
                      <>
                        <span 
                          className="country-flag-emoji"
                          style={{ 
                            fontSize: '1.25rem', 
                            display: 'inline-block',
                            lineHeight: '1',
                            fontFamily: 'countryFlags, system-ui, sans-serif'
                          }}
                          title={detectedCountryCode || "Pays"}
                        >
                          {flagEmoji}
                        </span>
                        <input
                    type="tel"
                    value={prefixInput}
                    onChange={(e) => handlePrefixInputChange(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPrefixPopoverOpen(true)
                    }}
                    onFocus={() => setIsPrefixPopoverOpen(true)}
                    placeholder="+33"
                    className="w-[60px] h-auto p-0 border-0 bg-transparent focus:outline-none text-base font-medium text-gray-700 dark:text-slate-300"
                    readOnly
                  />
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </>
                    )
                  })()}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2">
                  <div className="flex items-center border-b px-3 mb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Rechercher un pays..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredPrefixes.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Aucun pays trouvé
                      </div>
                    ) : (
                      filteredPrefixes.map((prefix) => {
                        const flagEmoji = prefix.countryCode ? generateFlagEmoji(prefix.countryCode) : "🌍"
                        
                        return (
                          <div
                            key={prefix.code}
                            onClick={() => handlePrefixSelect(prefix.code)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                              prefixInput === prefix.code && "bg-accent"
                            )}
                          >
                            <span 
                              className="country-flag-emoji"
                              style={{ 
                                fontSize: '1.5rem', 
                                display: 'inline-block',
                                lineHeight: '1',
                                minWidth: '1.5rem',
                                fontFamily: 'countryFlags, system-ui, sans-serif'
                              }}
                              title={prefix.country}
                            >
                              {flagEmoji}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{prefix.code}</div>
                              <div className="text-xs text-muted-foreground">{prefix.country}</div>
                            </div>
                            {prefixInput === prefix.code && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Input principal avec padding à gauche pour le préfixe */}
            <Input
              type="tel"
              placeholder={block.placeholder || placeholder}
              defaultValue={defaultValue}
              disabled
              className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 pl-[140px] pr-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
        </div>
      ) : (
        <Input
          type="tel"
          placeholder={block.placeholder || "+33 6 12 34 56 78"}
          defaultValue={defaultValue}
          disabled={!isEditing}
          onChange={(e) => {
            if (isEditing) {
              onUpdate?.({ placeholder: e.target.value })
            }
          }}
          className="h-14 text-base text-gray-900 dark:text-slate-100 rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
        />
      )}
    </div>
  )
}



