"use client"

import * as React from "react"
import { FormBlock, ThemeJSON, SettingsJSON } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Plus, X, Search, ChevronDown, Check } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { GOOGLE_FONTS, getFontDisplayName, getGoogleFontUrl } from "@/lib/google-fonts"
import { useGoogleFont } from "@/hooks/useGoogleFont"
import { ColorPicker } from "@/components/ui/color-picker"
import { ButtonStyleSelector } from "./ButtonStyleSelector"
import { ButtonSizeSelector } from "./ButtonSizeSelector"
import { ButtonAnimationSelector } from "./ButtonAnimationSelector"
import { ImageUploader } from "./ImageUploader"
import { BackgroundSelector } from "./BackgroundSelector"
import { PHONE_PREFIXES } from "@/lib/phone-prefixes"

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
        console.error('[PropertyPanel] Failed to load country flag font:', e)
      }
    }
    
    loadFont()
  }, [])
}

// Fonction pour générer l'emoji du drapeau
function generateFlagEmoji(countryCode: string | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "🌍"
  const offset = 127397
  return countryCode.toUpperCase().replace(/./g, (char) => 
    String.fromCodePoint(char.charCodeAt(0) + offset)
  )
}

interface PropertyPanelContentProps {
  selectedBlock: FormBlock | null
  blocks: FormBlock[] // Ajout pour la logique conditionnelle
  theme: ThemeJSON
  settings: SettingsJSON
  previewFont?: string | null
  onBlockUpdate: (updates: Partial<FormBlock>) => void
  onThemeUpdate: (theme: ThemeJSON) => void
  onSettingsUpdate: (settings: SettingsJSON) => void
  onPreviewFontChange?: (font: string | null) => void
}

export function PropertyPanelContent({
  selectedBlock,
  blocks = [],
  theme,
  settings,
  previewFont,
  onBlockUpdate,
  onThemeUpdate,
  onSettingsUpdate,
  onPreviewFontChange,
}: PropertyPanelContentProps) {
  useCountryFlagFont() // Charger la police des drapeaux
  
  // État pour la recherche de préfixe dans le panneau de propriétés
  const [prefixSearchQuery, setPrefixSearchQuery] = React.useState("")
  const [isPrefixPopoverOpen, setIsPrefixPopoverOpen] = React.useState(false)
  
  // Filtrer les préfixes selon la recherche
  const filteredPrefixesForSelect = React.useMemo(() => {
    if (!prefixSearchQuery) return PHONE_PREFIXES
    const query = prefixSearchQuery.toLowerCase()
    return PHONE_PREFIXES.filter(
      (p) =>
        p.country.toLowerCase().includes(query) ||
        p.code.includes(query)
    )
  }, [prefixSearchQuery])
  
  // Charger toutes les polices au montage pour qu'elles soient disponibles
  React.useEffect(() => {
    GOOGLE_FONTS.forEach((font) => {
      const fontUrl = getGoogleFontUrl(font.value)
      if (fontUrl) {
        const linkId = `google-font-${font.value.replace(/\s+/g, "-").toLowerCase()}`
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link")
          link.id = linkId
          link.rel = "stylesheet"
          link.href = fontUrl
          document.head.appendChild(link)
        }
      }
    })
  }, [])
  
  // Charger la police actuelle
  const currentFont = theme.fonts?.family || "Inter"
  useGoogleFont(currentFont)
  
  return (
    <>
      {/* Onglet Champs */}
      <TabsContent value="fields" className="space-y-6">
        {selectedBlock ? (
          <React.Fragment>
            {/* Section principale : Label et description */}
            <div className="space-y-4 pb-4 border-b">
              <div className="space-y-2">
                <Label htmlFor="block-label" className="text-sm font-semibold">Label</Label>
                <Input
                  id="block-label"
                  value={selectedBlock.label || ""}
                  onChange={(e) => onBlockUpdate({ label: e.target.value })}
                  placeholder="Label du champ"
                  className="text-sm"
                />
              </div>

              {/* Help Text / Description pour tous les blocs */}
              {selectedBlock.type !== "welcome" && (
                <div className="space-y-2">
                  <Label htmlFor="block-help-text" className="text-sm font-semibold">Texte d'aide</Label>
                  <Textarea
                    id="block-help-text"
                    value={(selectedBlock.helpText as string) || ""}
                    onChange={(e) => onBlockUpdate({ helpText: e.target.value })}
                    placeholder="Texte d'aide affiché sous le label..."
                    rows={2}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ce texte apparaîtra sous le label pour guider l'utilisateur
                  </p>
                </div>
              )}

              {selectedBlock.type === "welcome" && (
                <div className="space-y-2">
                  <Label htmlFor="block-description" className="text-sm font-semibold">Description</Label>
                  <Textarea
                    id="block-description"
                    value={(selectedBlock.description as string) || ""}
                    onChange={(e) => onBlockUpdate({ description: e.target.value })}
                    placeholder="Entrez votre message de bienvenue..."
                    rows={4}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le titre du bloc est défini par le champ "Label" ci-dessus
                  </p>
                </div>
              )}
            </div>

            {/* Section : Options de base */}
            {["text", "textarea", "email", "phone", "number", "website"].includes(selectedBlock.type) && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options de base</h3>
                  <p className="text-xs text-muted-foreground">
                    Personnalisez l'affichage et le comportement du champ
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-placeholder" className="text-sm">Placeholder</Label>
                    <Input
                      id="block-placeholder"
                      value={selectedBlock.placeholder || ""}
                      onChange={(e) => onBlockUpdate({ placeholder: e.target.value })}
                      placeholder="Texte d'aide..."
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-default-value" className="text-sm">Valeur par défaut</Label>
                    <Input
                      id="block-default-value"
                      value={(selectedBlock.defaultValue as string) || ""}
                      onChange={(e) => onBlockUpdate({ defaultValue: e.target.value })}
                      placeholder="Valeur pré-remplie..."
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Cette valeur sera pré-remplie dans le formulaire
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validations avancées pour TextBlock */}
            {selectedBlock.type === "text" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Validation</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez des règles de validation pour ce champ
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-min-length">Longueur min</Label>
                    <Input
                      id="block-min-length"
                      type="number"
                      value={(selectedBlock.minLength as number) || ""}
                      onChange={(e) => onBlockUpdate({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-max-length">Longueur max</Label>
                    <Input
                      id="block-max-length"
                      type="number"
                      value={(selectedBlock.maxLength as number) || ""}
                      onChange={(e) => onBlockUpdate({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="255"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-pattern">Pattern (regex)</Label>
                  <Input
                    id="block-pattern"
                    value={(selectedBlock.pattern as string) || ""}
                    onChange={(e) => onBlockUpdate({ pattern: e.target.value })}
                    placeholder="^[A-Za-z]+$"
                  />
                  <p className="text-xs text-muted-foreground">
                    Expression régulière pour valider le format (ex: ^[A-Za-z]+$ pour lettres uniquement)
                  </p>
                </div>
              </div>
            )}

            {/* Options avancées pour TextareaBlock */}
            {selectedBlock.type === "textarea" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Validation</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez des règles de validation pour ce champ
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="textarea-min-length">Longueur min</Label>
                    <Input
                      id="textarea-min-length"
                      type="number"
                      value={(selectedBlock.minLength as number) || ""}
                      onChange={(e) => onBlockUpdate({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textarea-max-length">Longueur max</Label>
                    <Input
                      id="textarea-max-length"
                      type="number"
                      value={(selectedBlock.maxLength as number) || ""}
                      onChange={(e) => onBlockUpdate({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textarea-rows">Nombre de lignes</Label>
                  <Input
                    id="textarea-rows"
                    type="number"
                    min={1}
                    max={20}
                    value={(selectedBlock.rows as number) || 5}
                    onChange={(e) => onBlockUpdate({ rows: parseInt(e.target.value) || 5 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Hauteur initiale de la zone de texte (entre 1 et 20 lignes)
                  </p>
                </div>
              </div>
            )}

            {/* Options avancées pour EmailBlock */}
            {selectedBlock.type === "email" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options avancées</h3>
                  <p className="text-xs text-muted-foreground">
                    Configurez les options spécifiques à ce champ email
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="block-confirm-email" className="text-sm">Demander confirmation</Label>
                    <p className="text-xs text-muted-foreground">
                      Afficher un second champ pour confirmer l'email
                    </p>
                  </div>
                  <Switch
                    id="block-confirm-email"
                    checked={(selectedBlock.confirmEmail as boolean) || false}
                    onCheckedChange={(checked) => onBlockUpdate({ confirmEmail: checked })}
                  />
                </div>
              </div>
            )}

            {/* Options avancées pour PhoneBlock */}
            {selectedBlock.type === "phone" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options téléphone</h3>
                  <p className="text-xs text-muted-foreground">
                    Configurez les options spécifiques au champ téléphone
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="block-enable-prefix" className="text-sm">Activer le sélecteur de préfixe</Label>
                    <p className="text-xs text-muted-foreground">
                      Permettre à l'utilisateur de choisir l'indicatif pays
                    </p>
                  </div>
                  <Switch
                    id="block-enable-prefix"
                    checked={(selectedBlock.enablePrefix as boolean) || false}
                    onCheckedChange={(checked) => onBlockUpdate({ enablePrefix: checked })}
                  />
                </div>
                {(selectedBlock.enablePrefix as boolean) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="block-default-prefix">Préfixe par défaut</Label>
                      <Popover open={isPrefixPopoverOpen} onOpenChange={setIsPrefixPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between h-10"
                            id="block-default-prefix"
                          >
                            {(() => {
                              const selected = PHONE_PREFIXES.find(p => p.code === ((selectedBlock.defaultPrefix as string) || "+33"))
                              return selected ? (
                                <span className="flex items-center gap-2">
                                  <span 
                                    className="country-flag-emoji"
                                    style={{ 
                                      fontSize: '1.25rem', 
                                      display: 'inline-block',
                                      lineHeight: '1',
                                      fontFamily: 'countryFlags, system-ui, sans-serif'
                                    }}
                                    title={selected.country}
                                  >
                                    {generateFlagEmoji(selected.countryCode)}
                                  </span>
                                  <span>{selected.code}</span>
                                  <span className="text-muted-foreground text-sm ml-2">{selected.country}</span>
                                </span>
                              ) : "Sélectionner un pays..."
                            })()}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <div className="p-2">
                            <div className="flex items-center border-b px-3 mb-2">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <Input
                                placeholder="Rechercher un pays..."
                                value={prefixSearchQuery}
                                onChange={(e) => setPrefixSearchQuery(e.target.value)}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                              />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                              {filteredPrefixesForSelect.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  Aucun pays trouvé
                                </div>
                              ) : (
                                filteredPrefixesForSelect.map((prefix) => {
                                  const isSelected = ((selectedBlock.defaultPrefix as string) || "+33") === prefix.code
                                  return (
                                    <div
                                      key={prefix.code}
                                      onClick={() => {
                                        onBlockUpdate({ defaultPrefix: prefix.code })
                                        setIsPrefixPopoverOpen(false)
                                        setPrefixSearchQuery("")
                                      }}
                                      className={cn(
                                        "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                                        isSelected && "bg-accent"
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
                                        {generateFlagEmoji(prefix.countryCode)}
                                      </span>
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{prefix.code}</div>
                                        <div className="text-xs text-muted-foreground">{prefix.country}</div>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {prefix.minLength}-{prefix.maxLength} chiffres
                                      </div>
                                      {isSelected && (
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
                      {(() => {
                        const selected = PHONE_PREFIXES.find(p => p.code === ((selectedBlock.defaultPrefix as string) || "+33"))
                        return selected && (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            <p className="font-medium mb-1">Format attendu :</p>
                            <p>Exemple : {selected.placeholder}</p>
                            <p className="mt-1">Longueur : {selected.minLength} à {selected.maxLength} chiffres</p>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="space-y-2">
                      <Label>Pays disponibles</Label>
                      <p className="text-xs text-muted-foreground">
                        Sélectionnez les pays à afficher (laisser vide pour tous)
                      </p>
                      <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {PHONE_PREFIXES.map((prefix) => {
                          const availablePrefixes = (selectedBlock.availablePrefixes as string[]) || []
                          // Si la liste est vide, tous sont sélectionnés par défaut
                          const isSelected = availablePrefixes.length === 0 || availablePrefixes.includes(prefix.code)
                          return (
                            <div key={prefix.code} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`prefix-${prefix.code}`}
                                checked={isSelected}
                                onChange={(e) => {
                                  const current = (selectedBlock.availablePrefixes as string[]) || []
                                  if (e.target.checked) {
                                    // Ajouter le préfixe
                                    if (current.length === 0) {
                                      // Si c'était vide (tous sélectionnés), on crée une liste avec tous
                                      onBlockUpdate({ availablePrefixes: PHONE_PREFIXES.map(p => p.code) })
                                    } else {
                                      onBlockUpdate({ availablePrefixes: [...current, prefix.code] })
                                    }
                                  } else {
                                    // Retirer le préfixe
                                    if (current.length === 0) {
                                      // Si c'était vide (tous sélectionnés), on crée une liste avec tous sauf celui qu'on décoche
                                      onBlockUpdate({ availablePrefixes: PHONE_PREFIXES.filter(p => p.code !== prefix.code).map(p => p.code) })
                                    } else {
                                      const newList = current.filter(p => p !== prefix.code)
                                      // Si la liste devient vide, on la remet à vide (tous sélectionnés)
                                      onBlockUpdate({ availablePrefixes: newList.length > 0 ? newList : [] })
                                    }
                                  }
                                }}
                                className="rounded"
                              />
                              <label htmlFor={`prefix-${prefix.code}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                <span 
                                  className="country-flag-emoji"
                                  style={{ 
                                    fontSize: '1.25rem', 
                                    display: 'inline-block',
                                    lineHeight: '1',
                                    fontFamily: 'countryFlags, system-ui, sans-serif'
                                  }}
                                  title={prefix.country}
                                >
                                  {generateFlagEmoji(prefix.countryCode)}
                                </span>
                                <span className="font-medium">{prefix.code}</span>
                                <span className="text-sm text-muted-foreground">{prefix.country}</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {prefix.minLength}-{prefix.maxLength} chiffres
                                </span>
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedBlock.type === "heading" && (
              <div className="space-y-2">
                <Label htmlFor="block-level">Niveau</Label>
                <Select
                  value={(selectedBlock.level as string) || "h2"}
                  onValueChange={(value) => onBlockUpdate({ level: value })}
                >
                  <SelectTrigger id="block-level">
                    <SelectValue>
                      {selectedBlock.level === "h1" && "H1 (Titre principal)"}
                      {selectedBlock.level === "h3" && "H3 (Sous-sous-titre)"}
                      {(!selectedBlock.level || selectedBlock.level === "h2") && "H2 (Sous-titre)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1 (Titre principal)</SelectItem>
                    <SelectItem value="h2">H2 (Sous-titre)</SelectItem>
                    <SelectItem value="h3">H3 (Sous-sous-titre)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {["single-choice", "multiple-choice"].includes(selectedBlock.type) && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options</h3>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez ou modifiez les choix disponibles
                  </p>
                </div>
                <div className="space-y-2">
                  {(selectedBlock.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedBlock.options || [])]
                          newOptions[index] = e.target.value
                          onBlockUpdate({ options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => {
                          const newOptions = (selectedBlock.options || []).filter(
                            (_, i) => i !== index
                          )
                          onBlockUpdate({ options: newOptions })
                        }}
                        disabled={(selectedBlock.options || []).length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [
                      ...(selectedBlock.options || []),
                      `Option ${(selectedBlock.options || []).length + 1}`,
                    ]
                    onBlockUpdate({ options: newOptions })
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une option
                </Button>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="block-has-other" className="text-sm">Option "Autre"</Label>
                      <p className="text-xs text-muted-foreground">
                        Permettre une réponse personnalisée
                      </p>
                    </div>
                    <Switch
                      id="block-has-other"
                      checked={(selectedBlock.hasOther as boolean) || false}
                      onCheckedChange={(checked) => onBlockUpdate({ hasOther: checked })}
                    />
                  </div>
                  {(selectedBlock.hasOther as boolean) && (
                    <div className="space-y-2">
                      <Label htmlFor="block-other-text" className="text-sm">Texte de l'option "Autre"</Label>
                      <Input
                        id="block-other-text"
                        value={(selectedBlock.otherText as string) || "Autre"}
                        onChange={(e) => onBlockUpdate({ otherText: e.target.value })}
                        placeholder="Autre"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedBlock.type === "number" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez les limites et le format du nombre
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-min" className="text-sm">Minimum</Label>
                    <Input
                      id="block-min"
                      type="number"
                      value={(selectedBlock.min as number) || ""}
                      onChange={(e) =>
                        onBlockUpdate({ min: e.target.value ? parseInt(e.target.value) : undefined })
                      }
                      placeholder="Aucun"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-max" className="text-sm">Maximum</Label>
                    <Input
                      id="block-max"
                      type="number"
                      value={(selectedBlock.max as number) || ""}
                      onChange={(e) =>
                        onBlockUpdate({ max: e.target.value ? parseInt(e.target.value) : undefined })
                      }
                      placeholder="Aucun"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-step" className="text-sm">Pas</Label>
                    <Input
                      id="block-step"
                      type="number"
                      value={(selectedBlock.step as number) || 1}
                      onChange={(e) =>
                        onBlockUpdate({ step: parseFloat(e.target.value) || 1 })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-decimals" className="text-sm">Décimales</Label>
                    <Input
                      id="block-decimals"
                      type="number"
                      min={0}
                      max={10}
                      value={(selectedBlock.decimals as number) || 0}
                      onChange={(e) =>
                        onBlockUpdate({ decimals: parseInt(e.target.value) || 0 })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedBlock.type === "slider" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez les limites et le comportement du curseur
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-min" className="text-sm">Minimum</Label>
                    <Input
                      id="block-min"
                      type="number"
                      value={(selectedBlock.min as number) || 0}
                      onChange={(e) =>
                        onBlockUpdate({ min: parseInt(e.target.value) || 0 })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-max" className="text-sm">Maximum</Label>
                    <Input
                      id="block-max"
                      type="number"
                      value={(selectedBlock.max as number) || 100}
                      onChange={(e) =>
                        onBlockUpdate({ max: parseInt(e.target.value) || 100 })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-step" className="text-sm">Pas</Label>
                  <Input
                    id="block-step"
                    type="number"
                    value={(selectedBlock.step as number) || 1}
                    onChange={(e) =>
                      onBlockUpdate({ step: parseInt(e.target.value) || 1 })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="block-min-label" className="text-sm">Label minimum</Label>
                    <Input
                      id="block-min-label"
                      value={(selectedBlock.minLabel as string) || ""}
                      onChange={(e) => onBlockUpdate({ minLabel: e.target.value })}
                      placeholder="Laisser vide pour valeur"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-max-label" className="text-sm">Label maximum</Label>
                    <Input
                      id="block-max-label"
                      value={(selectedBlock.maxLabel as string) || ""}
                      onChange={(e) => onBlockUpdate({ maxLabel: e.target.value })}
                      placeholder="Laisser vide pour valeur"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedBlock.type === "date" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez le type et les limites de date
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-date-type" className="text-sm">Type</Label>
                  <Select
                    value={(selectedBlock.dateType as string) || "date"}
                    onValueChange={(value) => onBlockUpdate({ dateType: value })}
                  >
                    <SelectTrigger id="block-date-type" className="text-sm">
                      <SelectValue>
                        {selectedBlock.dateType === "datetime-local" && "Date et heure"}
                        {selectedBlock.dateType === "time" && "Heure"}
                        {(!selectedBlock.dateType || selectedBlock.dateType === "date") && "Date"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="datetime-local">Date et heure</SelectItem>
                      <SelectItem value="time">Heure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-min-date" className="text-sm">Date minimum</Label>
                    <Input
                      id="block-min-date"
                      type="date"
                      value={(selectedBlock.minDate as string) || ""}
                      onChange={(e) => onBlockUpdate({ minDate: e.target.value || undefined })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-max-date" className="text-sm">Date maximum</Label>
                    <Input
                      id="block-max-date"
                      type="date"
                      value={(selectedBlock.maxDate as string) || ""}
                      onChange={(e) => onBlockUpdate({ maxDate: e.target.value || undefined })}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedBlock.type === "file" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez les limites et restrictions pour l'upload
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-max-file-size" className="text-sm">Taille max (MB)</Label>
                  <Input
                    id="block-max-file-size"
                    type="number"
                    min={1}
                    value={(selectedBlock.maxFileSize as number) || 10}
                    onChange={(e) => onBlockUpdate({ maxFileSize: parseInt(e.target.value) || 10 })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="block-multiple-files" className="text-sm">Plusieurs fichiers</Label>
                      <p className="text-xs text-muted-foreground">
                        Permettre l'upload de plusieurs fichiers
                      </p>
                    </div>
                    <Switch
                      id="block-multiple-files"
                      checked={(selectedBlock.multiple as boolean) || false}
                      onCheckedChange={(checked) => onBlockUpdate({ multiple: checked })}
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="block-allowed-types" className="text-sm">Types de fichiers autorisés</Label>
                  <Input
                    id="block-allowed-types"
                    value={((selectedBlock.allowedTypes as string[]) || []).join(", ")}
                    onChange={(e) => {
                      const types = e.target.value.split(",").map(t => t.trim()).filter(t => t)
                      onBlockUpdate({ allowedTypes: types })
                    }}
                    placeholder="Ex: .pdf, .jpg, .png (laisser vide pour tous)"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez les types par des virgules (ex: .pdf, .jpg, image/png)
                  </p>
                </div>
              </div>
            )}

            {selectedBlock.type === "dropdown" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options</h3>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez ou modifiez les choix de la liste déroulante
                  </p>
                </div>
                <div className="space-y-2">
                  {(selectedBlock.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedBlock.options || [])]
                          newOptions[index] = e.target.value
                          onBlockUpdate({ options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => {
                          const newOptions = (selectedBlock.options || []).filter(
                            (_, i) => i !== index
                          )
                          onBlockUpdate({ options: newOptions })
                        }}
                        disabled={(selectedBlock.options || []).length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [
                      ...(selectedBlock.options || []),
                      `Option ${(selectedBlock.options || []).length + 1}`,
                    ]
                    onBlockUpdate({ options: newOptions })
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            )}

            {selectedBlock.type === "rating" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Configurez le système de notation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-max-rating" className="text-sm">Nombre d'étoiles</Label>
                  <Input
                    id="block-max-rating"
                    type="number"
                    min={1}
                    max={10}
                    value={(selectedBlock.maxRating as number) || 5}
                    onChange={(e) => onBlockUpdate({ maxRating: parseInt(e.target.value) || 5 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nombre d'étoiles à afficher (entre 1 et 10)
                  </p>
                </div>
              </div>
            )}

            {selectedBlock.type === "website" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Options de base</h3>
                  <p className="text-xs text-muted-foreground">
                    Personnalisez l'affichage et le comportement du champ
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-placeholder" className="text-sm">Placeholder</Label>
                    <Input
                      id="block-placeholder"
                      value={selectedBlock.placeholder || ""}
                      onChange={(e) => onBlockUpdate({ placeholder: e.target.value })}
                      placeholder="https://exemple.com"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-default-value" className="text-sm">Valeur par défaut</Label>
                    <Input
                      id="block-default-value"
                      value={(selectedBlock.defaultValue as string) || ""}
                      onChange={(e) => onBlockUpdate({ defaultValue: e.target.value })}
                      placeholder="https://exemple.com"
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Cette valeur sera pré-remplie dans le formulaire
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedBlock.type === "consent" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Texte de consentement</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez le texte affiché avec la case à cocher
                  </p>
                </div>
                <div className="space-y-2">
                  <Textarea
                    id="block-consent-text"
                    value={(selectedBlock.consentText as string) || ""}
                    onChange={(e) => onBlockUpdate({ consentText: e.target.value })}
                    placeholder="J'accepte les conditions..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {selectedBlock.type === "menu-restaurant" && (
              <div className="space-y-6">
                {/* Arrière-plan du menu */}
                <div className="space-y-5 pb-5 border-b border-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900">Apparence du menu</h3>
                    <p className="text-xs text-muted-foreground">
                      Personnalisez l'arrière-plan de votre menu
                    </p>
                  </div>
                  <BackgroundSelector
                    value={(selectedBlock.backgroundImage as string) || null}
                    onChange={(value) => onBlockUpdate({ backgroundImage: value })}
                    label="Arrière-plan prédéfini"
                  />
                  <div className="pt-2">
                    <ImageUploader
                      value={(selectedBlock.backgroundImage as string) || null}
                      onChange={(url) => onBlockUpdate({ backgroundImage: url })}
                      label="Ou uploader une image"
                      placeholder="Uploader une image de fond"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sections du menu</Label>
                  <p className="text-xs text-muted-foreground">
                    Organisez votre menu en sections (Entrées, Plats, Desserts...)
                  </p>
                </div>
                {((selectedBlock.sections as any[]) || []).map((section: any, sectionIndex: number) => (
                  <div key={sectionIndex} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={section.name || ""}
                        onChange={(e) => {
                          const newSections = [...((selectedBlock.sections as any[]) || [])]
                          newSections[sectionIndex] = { ...section, name: e.target.value }
                          onBlockUpdate({ sections: newSections })
                        }}
                        placeholder="Nom de la section (ex: Entrées)"
                        className="flex-1 font-semibold"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSections = ((selectedBlock.sections as any[]) || []).filter(
                            (_, i) => i !== sectionIndex
                          )
                          onBlockUpdate({ sections: newSections })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 pl-4">
                      <Label className="text-xs">Plats</Label>
                      {(section.items || []).map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="p-3 bg-muted/30 rounded-md space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={item.name || ""}
                              onChange={(e) => {
                                const newSections = [...((selectedBlock.sections as any[]) || [])]
                                const newItems = [...(section.items || [])]
                                newItems[itemIndex] = { ...item, name: e.target.value }
                                newSections[sectionIndex] = { ...section, items: newItems }
                                onBlockUpdate({ sections: newSections })
                              }}
                              placeholder="Nom du plat"
                              className="flex-1"
                            />
                            <Input
                              value={item.price || ""}
                              onChange={(e) => {
                                const newSections = [...((selectedBlock.sections as any[]) || [])]
                                const newItems = [...(section.items || [])]
                                newItems[itemIndex] = { ...item, price: e.target.value }
                                newSections[sectionIndex] = { ...section, items: newItems }
                                onBlockUpdate({ sections: newSections })
                              }}
                              placeholder="Prix"
                              className="w-24"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSections = [...((selectedBlock.sections as any[]) || [])]
                                const newItems = (section.items || []).filter(
                                  (_: any, i: number) => i !== itemIndex
                                )
                                newSections[sectionIndex] = { ...section, items: newItems }
                                onBlockUpdate({ sections: newSections })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={item.description || ""}
                            onChange={(e) => {
                              const newSections = [...((selectedBlock.sections as any[]) || [])]
                              const newItems = [...(section.items || [])]
                              newItems[itemIndex] = { ...item, description: e.target.value }
                              newSections[sectionIndex] = { ...section, items: newItems }
                              onBlockUpdate({ sections: newSections })
                            }}
                            placeholder="Description du plat..."
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSections = [...((selectedBlock.sections as any[]) || [])]
                          const newItems = [
                            ...(section.items || []),
                            { name: "", description: "", price: "" }
                          ]
                          newSections[sectionIndex] = { ...section, items: newItems }
                          onBlockUpdate({ sections: newSections })
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un plat
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const newSections = [
                      ...((selectedBlock.sections as any[]) || []),
                      { name: "Nouvelle section", items: [] }
                    ]
                    onBlockUpdate({ sections: newSections })
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une section
                </Button>
              </div>
            )}

            {selectedBlock.type === "image" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="block-image-url">Image</Label>
                  <ImageUploader
                    value={(selectedBlock.imageUrl as string) || null}
                    onChange={(url) => onBlockUpdate({ imageUrl: url })}
                    label=""
                    placeholder="Sélectionner ou uploader une image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-alt-text">Texte alternatif (alt)</Label>
                  <Input
                    id="block-alt-text"
                    value={(selectedBlock.altText as string) || ""}
                    onChange={(e) => onBlockUpdate({ altText: e.target.value })}
                    placeholder="Description de l'image pour l'accessibilité"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-caption">Légende</Label>
                  <Input
                    id="block-caption"
                    value={(selectedBlock.caption as string) || ""}
                    onChange={(e) => onBlockUpdate({ caption: e.target.value })}
                    placeholder="Légende optionnelle sous l'image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-link-url">Lien (optionnel)</Label>
                  <Input
                    id="block-link-url"
                    type="url"
                    value={(selectedBlock.linkUrl as string) || ""}
                    onChange={(e) => onBlockUpdate({ linkUrl: e.target.value })}
                    placeholder="https://exemple.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'image sera cliquable et redirigera vers cette URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-size">Taille</Label>
                  <Select
                    value={(selectedBlock.size as string) || "medium"}
                    onValueChange={(value) => onBlockUpdate({ size: value })}
                  >
                    <SelectTrigger id="block-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="full">Pleine largeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-alignment">Alignement</Label>
                  <Select
                    value={(selectedBlock.alignment as string) || "center"}
                    onValueChange={(value) => onBlockUpdate({ alignment: value })}
                  >
                    <SelectTrigger id="block-alignment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Gauche</SelectItem>
                      <SelectItem value="center">Centre</SelectItem>
                      <SelectItem value="right">Droite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-border-radius">
                    Rayon des coins ({(typeof selectedBlock.borderRadius === 'number' ? selectedBlock.borderRadius : 8)}px)
                  </Label>
                  <Slider
                    value={[(typeof selectedBlock.borderRadius === 'number' ? selectedBlock.borderRadius : 8)]}
                    onValueChange={([value]) => onBlockUpdate({ borderRadius: value })}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-opacity">
                    Opacité ({(typeof selectedBlock.opacity === 'number' ? selectedBlock.opacity : 100)}%)
                  </Label>
                  <Slider
                    value={[(typeof selectedBlock.opacity === 'number' ? selectedBlock.opacity : 100)]}
                    onValueChange={([value]) => onBlockUpdate({ opacity: value })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}

            {/* Section : Configuration Altcha pour CAPTCHA */}
            {selectedBlock.type === "captcha" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Configuration Altcha</h3>
                  <p className="text-xs text-muted-foreground">
                    Configurez l'URL du challenge Altcha (optionnel)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-challenge-url" className="text-sm">URL du challenge (optionnel)</Label>
                  <Input
                    id="block-challenge-url"
                    type="url"
                    value={(selectedBlock.challengeUrl as string) || ""}
                    onChange={(e) => onBlockUpdate({ challengeUrl: e.target.value || undefined })}
                    placeholder="https://votre-serveur.com/api/altcha/challenge"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour utiliser le mode client uniquement. Pour une validation serveur complète, configurez votre propre endpoint Altcha.
                  </p>
                </div>
              </div>
            )}

            {/* Section : Validation requise */}
            {selectedBlock.type !== "welcome" && selectedBlock.type !== "menu-restaurant" && selectedBlock.type !== "image" && (
              <div className="space-y-4 pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">Validation</h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez si ce champ est obligatoire
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="block-required" className="text-sm">Obligatoire</Label>
                  <Switch
                    id="block-required"
                    checked={selectedBlock.required || false}
                    onCheckedChange={(checked) => onBlockUpdate({ required: checked })}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ) : (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Sélectionnez un bloc pour modifier ses propriétés
          </div>
        )}
      </TabsContent>

      {/* Onglet Apparence */}
      <TabsContent value="appearance" className="space-y-4">
        {selectedBlock ? (
          <>
            {/* Alignement pour tous les blocs sauf welcome, menu-restaurant */}
            {selectedBlock.type !== "welcome" && 
             selectedBlock.type !== "menu-restaurant" && (
              <div className="space-y-2">
                <Label htmlFor="block-align">Alignement</Label>
                <Select
                  value={(selectedBlock.align as string) || (selectedBlock.alignment as string) || "left"}
                  onValueChange={(value) => {
                    // Pour image, utiliser 'alignment', pour les autres 'align'
                    if (selectedBlock.type === "image") {
                      onBlockUpdate({ alignment: value })
                    } else {
                      onBlockUpdate({ align: value })
                    }
                  }}
                >
                  <SelectTrigger id="block-align">
                    <SelectValue>
                      {(() => {
                        const currentAlign = (selectedBlock.align as string) || (selectedBlock.alignment as string) || "left"
                        if (currentAlign === "center") return "Centre"
                        if (currentAlign === "right") return "Droite"
                        return "Gauche"
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="center">Centre</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Alignement du contenu du bloc
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Sélectionnez un bloc pour modifier son apparence
          </div>
        )}
      </TabsContent>

      {/* Onglet Thème */}
      <TabsContent value="theme" className="space-y-4">
        <div className="space-y-2">
          <ColorPicker
            value={theme.colors.primary}
            onChange={(color) =>
              onThemeUpdate({
                ...theme,
                colors: { ...theme.colors, primary: color },
              })
            }
            label="Couleur primaire"
          />
          <p className="text-xs text-muted-foreground">
            Cette couleur est utilisée pour les boutons du formulaire (couleur de fond, bordure, texte selon le style choisi)
          </p>
        </div>

          <div className="space-y-2">
              <Label htmlFor="theme-font">Police</Label>
              <Select
                value={theme.fonts.family || "Inter"}
                onValueChange={(value) =>
                  onThemeUpdate({
                    ...theme,
                    fonts: { ...theme.fonts, family: value },
                  })
                }
              >
                <SelectTrigger id="theme-font">
                  <SelectValue>{getFontDisplayName(theme.fonts.family || "Inter")}</SelectValue>
                </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              {/* Sans-serif populaires */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Sans-serif
              </div>
              {GOOGLE_FONTS.filter((font) => 
                ["Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Montserrat", "Raleway", "Ubuntu", "Nunito", "Source Sans Pro", "Work Sans", "DM Sans", "Noto Sans", "Lexend", "Figtree", "Outfit", "Plus Jakarta Sans", "Space Grotesk", "Sora", "Manrope", "Palanquin", "Fira Sans", "Comfortaa", "Quicksand", "Varela Round"].includes(font.name)
              ).map((font) => {
                const fontStyle = getGoogleFontUrl(font.value) ? {
                  fontFamily: `"${font.value}", sans-serif`,
                } : {}
                return (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    onMouseEnter={() => onPreviewFontChange?.(font.value)}
                    onMouseLeave={() => onPreviewFontChange?.(null)}
                    style={fontStyle}
                    className="cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                )
              })}
              
              {/* Serif */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                Serif
              </div>
              {GOOGLE_FONTS.filter((font) => 
                ["Merriweather", "Playfair Display", "Lora", "Crimson Text", "Libre Baskerville", "PT Serif"].includes(font.name)
              ).map((font) => {
                const fontStyle = getGoogleFontUrl(font.value) ? {
                  fontFamily: `"${font.value}", serif`,
                } : {}
                return (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    onMouseEnter={() => onPreviewFontChange?.(font.value)}
                    onMouseLeave={() => onPreviewFontChange?.(null)}
                    style={fontStyle}
                    className="cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                )
              })}
              
              {/* Display/Decorative */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                Display
              </div>
              {GOOGLE_FONTS.filter((font) => 
                ["Oswald", "Bebas Neue", "Righteous", "Fredoka One", "Bangers", "Lobster"].includes(font.name)
              ).map((font) => {
                const fontStyle = getGoogleFontUrl(font.value) ? {
                  fontFamily: `"${font.value}", sans-serif`,
                } : {}
                return (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    onMouseEnter={() => onPreviewFontChange?.(font.value)}
                    onMouseLeave={() => onPreviewFontChange?.(null)}
                    style={fontStyle}
                    className="cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                )
              })}
              
              {/* Handwriting */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                Script/Handwriting
              </div>
              {GOOGLE_FONTS.filter((font) => 
                ["Dancing Script", "Pacifico", "Kalam"].includes(font.name)
              ).map((font) => {
                const fontStyle = getGoogleFontUrl(font.value) ? {
                  fontFamily: `"${font.value}", cursive`,
                } : {}
                return (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    onMouseEnter={() => onPreviewFontChange?.(font.value)}
                    onMouseLeave={() => onPreviewFontChange?.(null)}
                    style={fontStyle}
                    className="cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                )
              })}
              
              {/* Mono */}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                Monospace
              </div>
              {GOOGLE_FONTS.filter((font) => 
                ["JetBrains Mono", "Source Code Pro"].includes(font.name)
              ).map((font) => {
                const fontStyle = getGoogleFontUrl(font.value) ? {
                  fontFamily: `"${font.value}", monospace`,
                } : {}
                return (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    onMouseEnter={() => onPreviewFontChange?.(font.value)}
                    onMouseLeave={() => onPreviewFontChange?.(null)}
                    style={fontStyle}
                    className="cursor-pointer"
                  >
                    {font.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {getFontDisplayName(theme.fonts.family || "Inter")} sera appliquée à votre formulaire
          </p>
        </div>

        {/* Styles de boutons */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Personnalisation des boutons</Label>
            <p className="text-xs text-muted-foreground">
              Cliquez sur les boutons pour choisir visuellement leur style
            </p>
          </div>
          
          <ButtonStyleSelector
            value={theme.buttonStyle || "default"}
            onChange={(value) => onThemeUpdate({ ...theme, buttonStyle: value as any })}
            primaryColor={theme.colors?.primary || "#000000"}
          />

          <ButtonSizeSelector
            value={theme.buttonSize || "md"}
            onChange={(value) => onThemeUpdate({ ...theme, buttonSize: value as any })}
            primaryColor={theme.colors?.primary || "#000000"}
          />

          <ButtonAnimationSelector
            value={theme.buttonAnimation || "none"}
            onChange={(value) => onThemeUpdate({ ...theme, buttonAnimation: value as any })}
            primaryColor={theme.colors?.primary || "#000000"}
          />
        </div>

        {/* Arrière-plan : Dégradés modernes */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-1">
            <Label className="text-base font-semibold">Arrière-plan</Label>
            <p className="text-xs text-muted-foreground">
              Choisissez un dégradé moderne ou uploadez une image
            </p>
          </div>
          
          <BackgroundSelector
            value={(theme.backgroundGradient || theme.backgroundImage) || null}
            onChange={(value) => {
              // Détecter si c'est une image (URL) ou un gradient
              const isImage = value && (
                value.startsWith('http://') || 
                value.startsWith('https://') || 
                value.startsWith('/api/files/')
              )
              
              onThemeUpdate({ 
                ...theme, 
                // Si c'est une image, mettre dans backgroundImage, sinon dans backgroundGradient
                backgroundImage: isImage ? (value || null) : null,
                backgroundGradient: !isImage ? (value || null) : null,
              })
            }}
            label="Arrière-plan"
          />
        </div>

        {/* Image de fond */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-1">
            <Label className="text-base font-semibold">Image de fond</Label>
            <p className="text-xs text-muted-foreground">
              Uploadez une image ou entrez une URL
            </p>
          </div>
          
          <ImageUploader
            value={theme.backgroundImage || null}
            onChange={(url) => {
              onThemeUpdate({ 
                ...theme, 
                backgroundImage: url || null,
                // Si on uploade une image, on enlève le dégradé
                backgroundGradient: url ? null : theme.backgroundGradient
              })
            }}
            label=""
            placeholder="Uploadez une image de fond"
          />
        </div>

        {theme.backgroundImage && (
          <>
            <div className="space-y-2">
              <Label htmlFor="theme-background-opacity">
                Opacité de l'image: {Math.round((theme.backgroundImageOpacity || 1) * 100)}%
              </Label>
              <Slider
                id="theme-background-opacity"
                value={[(theme.backgroundImageOpacity || 1) * 100]}
                onValueChange={([value]) =>
                  onThemeUpdate({ ...theme, backgroundImageOpacity: value / 100 })
                }
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme-background-blur">
                Flou de l'image: {theme.backgroundImageBlur || 0}px
              </Label>
              <Slider
                id="theme-background-blur"
                value={[theme.backgroundImageBlur || 0]}
                onValueChange={([value]) =>
                  onThemeUpdate({ ...theme, backgroundImageBlur: value })
                }
                min={0}
                max={20}
                step={1}
              />
            </div>
          </>
        )}
      </TabsContent>

      {/* Onglet Logique - Système de règles de visibilité multiples */}
      <TabsContent value="logic" className="space-y-4">
        {selectedBlock ? (
          <div className="space-y-4">
            {/* Activation des règles */}
            <div className="space-y-2">
              <Label>Gestion de la visibilité</Label>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm font-medium">Activer les règles de visibilité</p>
                </div>
                <Switch
                  checked={((selectedBlock.visibility as any)?.enabled as boolean) || false}
                  onCheckedChange={(checked) => {
                    const currentVisibility = (selectedBlock.visibility as any) || {}
                    if (checked && !currentVisibility.rules) {
                      currentVisibility.rules = []
                    }
                    onBlockUpdate({
                      visibility: {
                        ...currentVisibility,
                        enabled: checked,
                      },
                    })
                  }}
                />
              </div>
            </div>

            {/* Liste des règles */}
            {((selectedBlock.visibility as any)?.enabled as boolean) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Règles ({(((selectedBlock.visibility as any)?.rules as any[]) || []).length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentVisibility = (selectedBlock.visibility as any) || {}
                      const rules = currentVisibility.rules || []
                      onBlockUpdate({
                        visibility: {
                          ...currentVisibility,
                          rules: [
                            ...rules,
                            {
                              id: `rule-${Date.now()}`,
                              action: "show",
                              operator: "and",
                              conditions: [],
                            },
                          ],
                        },
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une règle
                  </Button>
                </div>

                {(((selectedBlock.visibility as any)?.rules as any[]) || []).length === 0 ? (
                  <div className="p-4 bg-muted/30 rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground">
                      Aucune règle
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(((selectedBlock.visibility as any)?.rules as any[]) || []).map((rule: any, ruleIndex: number) => (
                      <div key={rule.id || `rule-${ruleIndex}`} className="p-4 bg-card rounded-lg border-2 border-primary/20 space-y-4">
                        {/* En-tête de la règle */}
                        <div className="flex items-start justify-between pb-3 border-b">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {ruleIndex + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Règle {ruleIndex + 1}</span>
                                <span className={cn(
                                  "text-xs px-2 py-1 rounded-full",
                                  rule.action === "show"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                )}>
                                  {rule.action === "show" ? "Afficher" : "Masquer"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                            onClick={() => {
                              const currentVisibility = (selectedBlock.visibility as any) || {}
                              const rules = (currentVisibility.rules || []).filter(
                                (r: any, idx: number) => rule.id ? r.id !== rule.id : idx !== ruleIndex
                              )
                              onBlockUpdate({
                                visibility: {
                                  ...currentVisibility,
                                  rules,
                                },
                              })
                            }}
                            title="Supprimer cette règle"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Action de la règle */}
                        <div className="space-y-2">
                          <Label className="text-sm">Action</Label>
                          <Select
                            value={rule.action || "show"}
                            onValueChange={(value) => {
                              const currentVisibility = (selectedBlock.visibility as any) || {}
                              const rules = (currentVisibility.rules || []).map((r: any, idx: number) =>
                                (rule.id ? r.id === rule.id : idx === ruleIndex)
                                  ? { ...r, action: value }
                                  : r
                              )
                              onBlockUpdate({
                                visibility: {
                                  ...currentVisibility,
                                  rules,
                                },
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue>
                                {rule.action === "hide" ? "Masquer ce bloc si" : "Afficher ce bloc si"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="show">Afficher ce bloc si</SelectItem>
                              <SelectItem value="hide">Masquer ce bloc si</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Opérateur logique (ET/OU) pour cette règle */}
                        {((rule.conditions as any[]) || []).length > 1 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Combiner les conditions avec</Label>
                            <Select
                              value={rule.operator || "and"}
                              onValueChange={(value) => {
                                const currentVisibility = (selectedBlock.visibility as any) || {}
                                const rules = (currentVisibility.rules || []).map((r: any, idx: number) =>
                                  (rule.id ? r.id === rule.id : idx === ruleIndex)
                                    ? { ...r, operator: value }
                                    : r
                                )
                                onBlockUpdate({
                                  visibility: {
                                    ...currentVisibility,
                                    rules,
                                  },
                                })
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  {rule.operator === "or" ? "OU" : "ET"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="and">ET</SelectItem>
                                <SelectItem value="or">OU</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Liste des conditions de cette règle */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Conditions</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentVisibility = (selectedBlock.visibility as any) || {}
                                const rules = (currentVisibility.rules || []).map((r: any, idx: number) => {
                                  if (rule.id ? r.id === rule.id : idx === ruleIndex) {
                                    return {
                                      ...r,
                                      conditions: [
                                        ...(r.conditions || []),
                                        {
                                          id: `cond-${Date.now()}-${idx}`,
                                          blockId: "",
                                          operator: "equals",
                                          value: "",
                                        },
                                      ],
                                    }
                                  }
                                  return r
                                })
                                onBlockUpdate({
                                  visibility: {
                                    ...currentVisibility,
                                    rules,
                                  },
                                })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter une condition
                            </Button>
                          </div>

                          {((rule.conditions as any[]) || []).length === 0 ? (
                            <div className="p-3 bg-muted/30 rounded-lg border border-dashed text-center">
                              <p className="text-xs text-muted-foreground">
                                Aucune condition
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {((rule.conditions as any[]) || []).map((condition: any, condIndex: number) => {
                                const referencedBlock = blocks.find((b) => b.id === condition.blockId)
                                const isChoiceBlock = referencedBlock &&
                                  (referencedBlock.type === "single-choice" ||
                                    referencedBlock.type === "multiple-choice")
                                const options = isChoiceBlock ? (referencedBlock.options || []) : []

                                return (
                                  <div key={condition.id || `cond-${ruleIndex}-${condIndex}`} className="p-3 bg-muted/30 rounded-lg border space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="text-xs font-medium text-muted-foreground">
                                        Condition {condIndex + 1}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                        onClick={() => {
                                          const currentVisibility = (selectedBlock.visibility as any) || {}
                                          const rules = (currentVisibility.rules || []).map((r: any, rIdx: number) => {
                                            if (rule.id ? r.id === rule.id : rIdx === ruleIndex) {
                                              return {
                                                ...r,
                                                conditions: (r.conditions || []).filter(
                                                  (c: any, cIdx: number) =>
                                                    condition.id ? c.id !== condition.id : cIdx !== condIndex
                                                ),
                                              }
                                            }
                                            return r
                                          })
                                          onBlockUpdate({
                                            visibility: {
                                              ...currentVisibility,
                                              rules,
                                            },
                                          })
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-xs">Si le bloc</Label>
                                      <Select
                                        value={condition.blockId || ""}
                                        onValueChange={(value) => {
                                          const currentVisibility = (selectedBlock.visibility as any) || {}
                                          const rules = (currentVisibility.rules || []).map((r: any, rIdx: number) => {
                                            if (rule.id ? r.id === rule.id : rIdx === ruleIndex) {
                                              return {
                                                ...r,
                                                conditions: (r.conditions || []).map((c: any, cIdx: number) =>
                                                  (condition.id ? c.id === condition.id : cIdx === condIndex)
                                                    ? { ...c, blockId: value, value: "" }
                                                    : c
                                                ),
                                              }
                                            }
                                            return r
                                          })
                                          onBlockUpdate({
                                            visibility: {
                                              ...currentVisibility,
                                              rules,
                                            },
                                          })
                                        }}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="Sélectionner un bloc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {blocks.map((block) => {
                                            if (block.id === selectedBlock.id) return null
                                            if (["heading", "paragraph", "youtube", "welcome"].includes(block.type))
                                              return null
                                            return (
                                              <SelectItem key={block.id} value={block.id}>
                                                {block.label || block.type}
                                              </SelectItem>
                                            )
                                          })}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {condition.blockId && (
                                      <>
                                        <div className="space-y-2">
                                          <Label className="text-xs">Opérateur</Label>
                                          <Select
                                            value={condition.operator || "equals"}
                                            onValueChange={(value) => {
                                              const currentVisibility = (selectedBlock.visibility as any) || {}
                                              const rules = (currentVisibility.rules || []).map((r: any, rIdx: number) => {
                                                if (rule.id ? r.id === rule.id : rIdx === ruleIndex) {
                                                  return {
                                                    ...r,
                                                    conditions: (r.conditions || []).map((c: any, cIdx: number) =>
                                                      (condition.id ? c.id === condition.id : cIdx === condIndex)
                                                        ? { ...c, operator: value }
                                                        : c
                                                    ),
                                                  }
                                                }
                                                return r
                                              })
                                              onBlockUpdate({
                                                visibility: {
                                                  ...currentVisibility,
                                                  rules,
                                                },
                                              })
                                            }}
                                          >
                                            <SelectTrigger className="h-8 text-xs">
                                              <SelectValue>
                                                {condition.operator === "not-equals" && "N'est pas égal à"}
                                                {condition.operator === "contains" && "Contient"}
                                                {condition.operator === "greater-than" && "Supérieur à"}
                                                {condition.operator === "less-than" && "Inférieur à"}
                                                {(!condition.operator || condition.operator === "equals") && "Est égal à"}
                                              </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                              {isChoiceBlock ? (
                                                <>
                                                  <SelectItem value="equals">Est égal à</SelectItem>
                                                  <SelectItem value="not-equals">N'est pas égal à</SelectItem>
                                                </>
                                              ) : (
                                                <>
                                                  <SelectItem value="equals">Est égal à</SelectItem>
                                                  <SelectItem value="not-equals">N'est pas égal à</SelectItem>
                                                  <SelectItem value="contains">Contient</SelectItem>
                                                  <SelectItem value="greater-than">Supérieur à</SelectItem>
                                                  <SelectItem value="less-than">Inférieur à</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2">
                                          <Label className="text-xs">Valeur</Label>
                                          {isChoiceBlock && options.length > 0 ? (
                                            <Select
                                              value={condition.value || ""}
                                              onValueChange={(value) => {
                                                const currentVisibility = (selectedBlock.visibility as any) || {}
                                                const rules = (currentVisibility.rules || []).map((r: any, rIdx: number) => {
                                                  if (rule.id ? r.id === rule.id : rIdx === ruleIndex) {
                                                    return {
                                                      ...r,
                                                      conditions: (r.conditions || []).map((c: any, cIdx: number) =>
                                                        (condition.id ? c.id === condition.id : cIdx === condIndex)
                                                          ? { ...c, value }
                                                          : c
                                                      ),
                                                    }
                                                  }
                                                  return r
                                                })
                                                onBlockUpdate({
                                                  visibility: {
                                                    ...currentVisibility,
                                                    rules,
                                                  },
                                                })
                                              }}
                                            >
                                              <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Sélectionner une option" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {options.map((option: string, optIndex: number) => (
                                                  <SelectItem key={optIndex} value={option}>
                                                    {option}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          ) : (
                                            <Input
                                              value={condition.value || ""}
                                              onChange={(e) => {
                                                const currentVisibility = (selectedBlock.visibility as any) || {}
                                                const rules = (currentVisibility.rules || []).map((r: any, rIdx: number) => {
                                                  if (rule.id ? r.id === rule.id : rIdx === ruleIndex) {
                                                    return {
                                                      ...r,
                                                      conditions: (r.conditions || []).map((c: any, cIdx: number) =>
                                                        (condition.id ? c.id === condition.id : cIdx === condIndex)
                                                          ? { ...c, value: e.target.value }
                                                          : c
                                                      ),
                                                    }
                                                  }
                                                  return r
                                                })
                                                onBlockUpdate({
                                                  visibility: {
                                                    ...currentVisibility,
                                                    rules,
                                                  },
                                                })
                                              }}
                                              className="h-8 text-xs"
                                              placeholder={
                                                isChoiceBlock
                                                  ? "Aucune option disponible"
                                                  : "Valeur à comparer..."
                                              }
                                              disabled={isChoiceBlock && options.length === 0}
                                            />
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Sélectionnez un bloc pour configurer la logique conditionnelle
          </div>
        )}
      </TabsContent>
    </>
  )
}

