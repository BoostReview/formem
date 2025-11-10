"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PHONE_PREFIXES, findPrefixByCode, formatPhoneNumber } from "@/lib/phone-prefixes"
import { getAlignment, alignmentClasses } from "@/lib/block-alignment"

interface PhoneBlockProps {
  block: FormBlock
  value?: unknown
  onChange: (value: unknown) => void
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

export function PhoneBlock({ block, value, onChange }: PhoneBlockProps) {
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

  // Extraire le préfixe et le numéro depuis la valeur
  const currentValue = typeof value === "string" ? value : ""
  
  // Fonction pour extraire le préfixe et le numéro depuis une valeur
  const parsePhoneValue = React.useCallback((val: string) => {
    if (val && val.startsWith("+")) {
      const match = val.match(/^(\+\d{1,4})\s*(.*)$/)
      if (match) {
        return { prefix: match[1], number: match[2] || "" }
      }
    }
    return { prefix: defaultPrefix || "+33", number: val || "" }
  }, [defaultPrefix])
  
  const initialParsed = React.useMemo(() => parsePhoneValue(currentValue), [])
  
  const [phoneNumber, setPhoneNumber] = React.useState(initialParsed.number)
  const [prefixInput, setPrefixInput] = React.useState(initialParsed.prefix)
  
  const [isPrefixPopoverOpen, setIsPrefixPopoverOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Référence pour éviter les boucles infinies
  const isInternalUpdate = React.useRef(false)
  const lastSentValue = React.useRef<string>("")
  const isTyping = React.useRef(false)

  // Synchroniser avec la valeur externe si elle change (mais éviter les boucles)
  React.useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    
    // Ne pas synchroniser si l'utilisateur est en train de taper
    if (isTyping.current) {
      return
    }
    
    if (value !== undefined && typeof value === "string") {
      const parsed = parsePhoneValue(value)
      
      // Construire la valeur actuelle pour comparer
      const currentFullValue = enablePrefix && prefixInput 
        ? `${prefixInput} ${phoneNumber}`.trim()
        : phoneNumber.trim()
      
      // Ne mettre à jour que si la valeur externe est vraiment différente de ce qu'on a envoyé
      if (value !== lastSentValue.current && value !== currentFullValue) {
        setPrefixInput(parsed.prefix)
        setPhoneNumber(parsed.number)
        lastSentValue.current = value
      }
    }
  }, [value, parsePhoneValue, enablePrefix, prefixInput, phoneNumber]) // Inclure toutes les dépendances nécessaires

  // Mettre à jour la valeur complète quand le préfixe ou le numéro change
  React.useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    
    // Construire la valeur complète
    const fullValue = enablePrefix && prefixInput 
      ? `${prefixInput} ${phoneNumber}`.trim()
      : phoneNumber.trim()
    
    // Éviter les appels inutiles si la valeur n'a pas changé
    if (fullValue !== lastSentValue.current) {
      isInternalUpdate.current = true
      lastSentValue.current = fullValue
      // Envoyer la valeur complète (même si vide, la validation s'en occupera)
      onChange(fullValue)
    }
  }, [prefixInput, phoneNumber, enablePrefix]) // Ne pas inclure onChange pour éviter les boucles

  // Détecter le country code depuis le préfixe
  const detectedCountryCode = React.useMemo(() => {
    const prefix = findPrefixByCode(prefixInput)
    return prefix?.countryCode || null
  }, [prefixInput])

  // Obtenir les informations du préfixe sélectionné
  const selectedPrefix = React.useMemo(() => {
    return findPrefixByCode(prefixInput)
  }, [prefixInput])

  // Fonction pour formater et limiter le numéro selon le préfixe
  const handlePhoneNumberChange = React.useCallback((inputValue: string) => {
    if (!enablePrefix || !selectedPrefix) {
      // Si pas de préfixe, juste mettre à jour
      setPhoneNumber(inputValue)
      return
    }

    // Extraire uniquement les chiffres
    let digits = inputValue.replace(/\D/g, "")
    
    // Gérer le 0 entre parenthèses pour certains pays
    let digitsToCount = digits
    let hasLeadingZero = false
    
    if (digits.length > 0 && digits[0] === "0" && selectedPrefix.countryCode) {
      const COUNTRIES_WITH_ZERO_PARENTHESES = ["FR", "BE", "CH", "LU", "MC", "MA", "DZ", "TN", "TR"]
      if (COUNTRIES_WITH_ZERO_PARENTHESES.includes(selectedPrefix.countryCode)) {
        hasLeadingZero = true
        digitsToCount = digits.slice(1) // Le 0 ne compte pas dans la longueur
      }
    }
    
    // Limiter la longueur selon maxLength du préfixe
    const maxLength = selectedPrefix.maxLength || 15
    if (digitsToCount.length > maxLength) {
      // Si on dépasse, garder seulement les premiers chiffres
      if (hasLeadingZero) {
        digits = "0" + digitsToCount.slice(0, maxLength)
      } else {
        digits = digitsToCount.slice(0, maxLength)
      }
    }
    
    // Formater le numéro selon le pattern du préfixe
    const formatted = formatPhoneNumber(digits, selectedPrefix)
    
    setPhoneNumber(formatted)
  }, [enablePrefix, selectedPrefix])

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

  const handlePrefixSelect = (code: string) => {
    setPrefixInput(code)
    setIsPrefixPopoverOpen(false)
    setSearchQuery("")
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
      <Label className={cn(
        "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
        alignmentClasses[align]
      )}>
        {block.label || "Téléphone"}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      {helpText && (
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          {helpText}
        </p>
      )}
      {enablePrefix ? (
        <div className="space-y-1">
          <div className="relative flex items-center">
            {/* Préfixe intégré à gauche */}
            <Popover open={isPrefixPopoverOpen} onOpenChange={setIsPrefixPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                    className={cn(
                    "absolute left-0 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-12 sm:h-14 text-sm sm:text-base font-medium text-gray-700 dark:text-slate-300",
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
                        <span className="w-[60px] text-left text-base font-medium text-gray-700 dark:text-slate-300">
                          {prefixInput}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </>
                    )
                  })()}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[300px] p-0" align="start">
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
              value={phoneNumber}
              onChange={(e) => {
                isTyping.current = true
                handlePhoneNumberChange(e.target.value)
                // Réinitialiser le flag après un court délai
                setTimeout(() => {
                  isTyping.current = false
                }, 100)
              }}
              placeholder={block.placeholder || placeholder}
              className="h-12 sm:h-14 text-base text-gray-900 dark:text-slate-100 rounded-lg sm:rounded-xl border-0 bg-gray-50 dark:bg-slate-800 pl-[110px] sm:pl-[140px] pr-3 sm:pr-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
        </div>
      ) : (
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            isTyping.current = true
            // Si pas de préfixe, juste mettre à jour directement
            if (!enablePrefix) {
              setPhoneNumber(e.target.value)
            } else {
              handlePhoneNumberChange(e.target.value)
            }
            // Réinitialiser le flag après un court délai
            setTimeout(() => {
              isTyping.current = false
            }, 100)
          }}
          placeholder={block.placeholder || "+33 6 12 34 56 78"}
          className="h-12 sm:h-14 text-base text-gray-900 dark:text-slate-100 rounded-lg sm:rounded-xl border-0 bg-gray-50 dark:bg-slate-800 px-3 sm:px-4 ring-2 ring-transparent focus:ring-gray-900 dark:focus:ring-slate-300 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 placeholder:text-gray-400"
        />
      )}
    </div>
  )
}

