"use client"

import * as React from "react"
import { FormBlock, ThemeJSON, SettingsJSON } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { GOOGLE_FONTS, getFontDisplayName, getGoogleFontUrl } from "@/lib/google-fonts"
import { useGoogleFont } from "@/hooks/useGoogleFont"
import { ColorPicker } from "@/components/ui/color-picker"

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
      <TabsContent value="fields" className="space-y-4">
        {selectedBlock ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="block-label">Label</Label>
              <Input
                id="block-label"
                value={selectedBlock.label || ""}
                onChange={(e) => onBlockUpdate({ label: e.target.value })}
                placeholder="Label du champ"
              />
            </div>

            {selectedBlock.type === "welcome" && (
              <div className="space-y-2">
                <Label htmlFor="block-description">Description</Label>
                <Textarea
                  id="block-description"
                  value={(selectedBlock.description as string) || ""}
                  onChange={(e) => onBlockUpdate({ description: e.target.value })}
                  placeholder="Entrez votre message de bienvenue..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Le titre du bloc est défini par le champ "Label" ci-dessus
                </p>
              </div>
            )}

            {["text", "textarea", "email", "phone"].includes(selectedBlock.type) && (
              <div className="space-y-2">
                <Label htmlFor="block-placeholder">Placeholder</Label>
                <Input
                  id="block-placeholder"
                  value={selectedBlock.placeholder || ""}
                  onChange={(e) => onBlockUpdate({ placeholder: e.target.value })}
                  placeholder="Texte d'aide..."
                />
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
                    <SelectValue />
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
              <div className="space-y-2">
                <Label>Options</Label>
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

            {["number", "slider"].includes(selectedBlock.type) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="block-min">Minimum</Label>
                  <Input
                    id="block-min"
                    type="number"
                    value={(selectedBlock.min as number) || 0}
                    onChange={(e) =>
                      onBlockUpdate({ min: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-max">Maximum</Label>
                  <Input
                    id="block-max"
                    type="number"
                    value={(selectedBlock.max as number) || 100}
                    onChange={(e) =>
                      onBlockUpdate({ max: parseInt(e.target.value) || 100 })
                    }
                  />
                </div>
                {selectedBlock.type === "slider" && (
                  <div className="space-y-2">
                    <Label htmlFor="block-step">Pas</Label>
                    <Input
                      id="block-step"
                      type="number"
                      value={(selectedBlock.step as number) || 1}
                      onChange={(e) =>
                        onBlockUpdate({ step: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                )}
              </>
            )}

            {selectedBlock.type === "date" && (
              <div className="space-y-2">
                <Label htmlFor="block-date-type">Type</Label>
                <Select
                  value={(selectedBlock.dateType as string) || "date"}
                  onValueChange={(value) => onBlockUpdate({ dateType: value })}
                >
                  <SelectTrigger id="block-date-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="datetime-local">Date et heure</SelectItem>
                    <SelectItem value="time">Heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedBlock.type === "consent" && (
              <div className="space-y-2">
                <Label htmlFor="block-consent-text">Texte de consentement</Label>
                <Textarea
                  id="block-consent-text"
                  value={(selectedBlock.consentText as string) || ""}
                  onChange={(e) => onBlockUpdate({ consentText: e.target.value })}
                  placeholder="J'accepte les conditions..."
                  rows={3}
                />
              </div>
            )}

            {selectedBlock.type !== "welcome" && (
              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor="block-required">Obligatoire</Label>
                <Switch
                  id="block-required"
                  checked={selectedBlock.required || false}
                  onCheckedChange={(checked) => onBlockUpdate({ required: checked })}
                />
              </div>
            )}
          </>
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
            <div className="space-y-2">
              <Label htmlFor="block-width">Largeur</Label>
              <Select
                value={(selectedBlock.width as string) || "full"}
                onValueChange={(value) => onBlockUpdate({ width: value })}
              >
                <SelectTrigger id="block-width">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Pleine largeur</SelectItem>
                  <SelectItem value="1/2">50%</SelectItem>
                  <SelectItem value="1/3">33%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedBlock.type === "heading" && (
              <div className="space-y-2">
                <Label htmlFor="block-align">Alignement</Label>
                <Select
                  value={(selectedBlock.align as string) || "left"}
                  onValueChange={(value) => onBlockUpdate({ align: value })}
                >
                  <SelectTrigger id="block-align">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="center">Centre</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                  </SelectContent>
                </Select>
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
              <SelectValue placeholder="Sélectionner une police" />
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

        <div className="space-y-2">
          <Label htmlFor="theme-radius">
            Rayon des bordures: {theme.radius}px
          </Label>
          <Slider
            id="theme-radius"
            value={[theme.radius]}
            onValueChange={([value]) =>
              onThemeUpdate({ ...theme, radius: value })
            }
            min={0}
            max={20}
            step={1}
          />
        </div>
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
                              <SelectValue />
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
                                <SelectValue />
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
                                              <SelectValue />
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

