"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuRestaurantBlockProps {
  block: FormBlock
  isEditing?: boolean
  onUpdate?: (updates: Partial<FormBlock>) => void
}

export function MenuRestaurantBlock({ block, isEditing = false, onUpdate }: MenuRestaurantBlockProps) {
  const sections = (block.sections as any[]) || []

  const handleSectionNameChange = (sectionIndex: number, newName: string) => {
    const newSections = [...sections]
    newSections[sectionIndex] = { ...newSections[sectionIndex], name: newName }
    onUpdate?.({ sections: newSections })
  }

  const handleItemChange = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const newSections = [...sections]
    const newItems = [...(newSections[sectionIndex].items || [])]
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
    newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems }
    onUpdate?.({ sections: newSections })
  }

  const addSection = () => {
    const newSections = [
      ...sections,
      { name: "Nouvelle section", items: [] }
    ]
    onUpdate?.({ sections: newSections })
  }

  const removeSection = (sectionIndex: number) => {
    const newSections = sections.filter((_, i) => i !== sectionIndex)
    onUpdate?.({ sections: newSections })
  }

  const addItem = (sectionIndex: number) => {
    const newSections = [...sections]
    const newItems = [
      ...(newSections[sectionIndex].items || []),
      { name: "", description: "", price: "" }
    ]
    newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems }
    onUpdate?.({ sections: newSections })
  }

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...sections]
    const newItems = (newSections[sectionIndex].items || []).filter((_: any, i: number) => i !== itemIndex)
    newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems }
    onUpdate?.({ sections: newSections })
  }

  const backgroundImage = (block.backgroundImage as string) || null
  const backgroundStyle = backgroundImage
    ? backgroundImage.startsWith("http") || backgroundImage.startsWith("/")
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {
          background: backgroundImage,
        }
    : {}

  return (
    <div 
      className="w-full space-y-6 rounded-lg p-6 transition-all"
      style={backgroundStyle}
    >
      {isEditing ? (
        <Input
          value={block.label || ""}
          onChange={(e) => onUpdate?.({ label: e.target.value })}
          placeholder="Titre du menu"
          className="text-2xl font-bold h-auto py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white/90 backdrop-blur-sm"
        />
      ) : (
        <div className="pb-3 pt-2 border-b-2 border-gray-300 mb-4">
          <Label className="text-2xl font-bold block leading-tight">
            {block.label || "Menu Restaurant"}
          </Label>
        </div>
      )}
      
      <div className="space-y-8">
        {sections.map((section: any, sectionIndex: number) => (
          <div key={sectionIndex} className="space-y-4 p-4 border rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
            {/* Titre de section avec bouton supprimer */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={section.name || ""}
                  onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
                  placeholder={`Section ${sectionIndex + 1}`}
                  className="text-xl font-semibold border-b pb-2 bg-transparent flex-1"
                />
              ) : (
                <h3 className="text-xl font-semibold border-b pb-2 flex-1">
                  {section.name || `Section ${sectionIndex + 1}`}
                </h3>
              )}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(sectionIndex)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Items de la section */}
            <div className="space-y-3 pl-2">
              {(section.items || []).map((item: any, itemIndex: number) => (
                <div 
                  key={itemIndex}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors group",
                    isEditing 
                      ? "bg-background border border-dashed border-muted-foreground/20 hover:border-muted-foreground/40" 
                      : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={item.name || ""}
                          onChange={(e) => handleItemChange(sectionIndex, itemIndex, "name", e.target.value)}
                          placeholder="Nom du plat"
                          className="font-medium text-base"
                        />
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) => handleItemChange(sectionIndex, itemIndex, "description", e.target.value)}
                          placeholder="Description du plat..."
                          rows={2}
                          className="text-sm resize-none"
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium text-base">
                          {item.name || "Plat sans nom"}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    {isEditing ? (
                      <Input
                        value={item.price || ""}
                        onChange={(e) => handleItemChange(sectionIndex, itemIndex, "price", e.target.value)}
                        placeholder="Prix"
                        className="w-24 font-semibold text-base"
                      />
                    ) : item.price ? (
                      <div className="font-semibold text-base whitespace-nowrap">
                        {item.price}
                      </div>
                    ) : null}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(sectionIndex, itemIndex)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(sectionIndex)}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un plat
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {isEditing && (
          <Button
            variant="outline"
            onClick={addSection}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        )}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          {isEditing 
            ? "Aucune section de menu. Cliquez sur le bouton ci-dessus pour commencer." 
            : "Ce menu n'a pas encore été configuré."}
        </div>
      )}
    </div>
  )
}

