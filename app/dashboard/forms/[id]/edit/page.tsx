"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useFormBuilder } from "@/hooks/useFormBuilder"
import { useAutosave } from "@/hooks/useAutosave"
import { loadForm } from "@/app/actions/forms"
import { FormBuilderLayout } from "@/components/layout/FormBuilderLayout"
import { BlockPalette } from "@/components/form-builder/BlockPalette"
import { FormCanvas } from "@/components/form-builder/FormCanvas"
import { BlockCard } from "@/components/form-builder/BlockCard"
import {
  Sparkles,
  Type,
  FileText,
  Circle,
  CheckSquare,
  Edit,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Sliders,
  Calendar,
  ToggleLeft,
  FileCheck,
  Youtube,
  UtensilsCrossed,
  Upload,
} from "lucide-react"
import { PropertyPanel } from "@/components/form-builder/PropertyPanel"
import { PropertyPanelContent } from "@/components/form-builder/PropertyPanelContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Loader2, ArrowLeft, Blocks } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { FormBlock } from "@/types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const {
    formId: storeFormId,
    title,
    blocks,
    theme,
    settings,
    selectedBlockId,
    isSaving,
    lastSaved,
    previewFont,
    setFormId,
    setTitle,
    setBlocks,
    setTheme,
    setSettings,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    setSelectedBlock,
    setPreviewFont,
    reset,
  } = useFormBuilder()

  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview" | "publish">("edit")
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false)
  const [dropPosition, setDropPosition] = React.useState<number | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [draggingBlockType, setDraggingBlockType] = React.useState<string | null>(null)

  // DndContext pour gérer le drag & drop global
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    
    // Si c'est un bloc depuis la palette
    if (event.active.data.current?.type === "palette-block") {
      setDraggingBlockType(event.active.data.current.blockType as string)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    // Si on drag depuis la palette, calculer la position
    if (active.data.current?.type === "palette-block" && over) {
      // Si on est au-dessus d'un bloc existant
      const overBlockIndex = blocks.findIndex((block) => block.id === over.id)
      
      if (overBlockIndex !== -1) {
        // Utiliser les coordonnées du drag pour déterminer avant/après
        const activeRect = active.rect.current.translated
        const overElement = document.getElementById(String(over.id))
        
        if (activeRect && overElement) {
          const overRect = overElement.getBoundingClientRect()
          // Seuil plus sensible pour une meilleure détection
          const threshold = overRect.top + overRect.height / 3
          
          if (activeRect.top < threshold) {
            // Au-dessus du seuil = insérer avant
            setDropPosition(overBlockIndex)
          } else {
            // En-dessous du seuil = insérer après
            setDropPosition(overBlockIndex + 1)
          }
        } else {
          setDropPosition(overBlockIndex)
        }
      } else if (over.id === "canvas-drop-zone") {
        // Drop sur le canvas vide = à la fin
        setDropPosition(blocks.length)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Nettoyer l'état
    setActiveId(null)
    setDraggingBlockType(null)
    
    if (!over) {
      setDropPosition(null)
      return
    }

    const wasFromPalette = active.data.current?.type === "palette-block"

    if (wasFromPalette && active.data.current) {
      const blockType = active.data.current.blockType as string
      
      // Utiliser la position calculée
      let insertIndex = dropPosition ?? blocks.length
      
      // Si on drop sur un bloc existant (pas le canvas)
      if (over.id !== "canvas-drop-zone") {
        const overBlockIndex = blocks.findIndex((block) => block.id === over.id)
        if (overBlockIndex !== -1) {
          if (dropPosition === null) {
            // Fallback : utiliser les coordonnées
            const activeRect = active.rect.current.translated
            const overElement = document.getElementById(String(over.id))
            
            if (activeRect && overElement) {
              const overRect = overElement.getBoundingClientRect()
              const threshold = overRect.top + overRect.height / 2
              insertIndex = activeRect.top < threshold ? overBlockIndex : overBlockIndex + 1
            } else {
              insertIndex = overBlockIndex
            }
          } else {
            insertIndex = dropPosition
          }
        }
      } else {
        // Drop sur le canvas = utiliser la position calculée ou la fin
        insertIndex = dropPosition ?? blocks.length
      }
      
      // S'assurer que l'index est valide
      insertIndex = Math.max(0, Math.min(insertIndex, blocks.length))
      
      console.log("🟢 [DragEnd] Ajout bloc:", blockType, "à position:", insertIndex)
      addBlock(blockType as any, insertIndex)
      toast.success("Bloc ajouté", {
        description: `Le bloc a été ajouté avec succès`,
      })
      setDropPosition(null)
      return
    }

    // Sinon, c'est un réordonnancement de blocs existants
    if (active.id !== over.id && over.id !== "canvas-drop-zone") {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex)
      }
    }
    
    setDropPosition(null)
  }

  // Charger le formulaire
  React.useEffect(() => {
    if (!formId) return

    const loadFormData = async () => {
      setIsLoading(true)
      try {
        const result = await loadForm(formId)
        if (result.success && result.form) {
          setFormId(result.form.id)
          setTitle(result.form.title)
          // schema_json est directement un array de FormBlock
          const schemaBlocks = Array.isArray(result.form.schema_json)
            ? result.form.schema_json
            : (result.form.schema_json as any)?.blocks || []
          setBlocks(schemaBlocks as FormBlock[])
          setTheme(result.form.theme_json || {
            colors: { primary: "#3b82f6", secondary: "#64748b", background: "#ffffff", text: "#1e293b" },
            fonts: { family: "Inter", size: "16px" },
            radius: 8,
          })
          setSettings(result.form.settings_json || {})
        } else {
          console.error("Erreur lors du chargement:", result.error)
        }
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFormData()

    // Restaurer depuis localStorage si disponible
    try {
      const draft = localStorage.getItem(`form-draft-${formId}`)
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed.blocks) setBlocks(parsed.blocks)
        if (parsed.title) setTitle(parsed.title)
      }
    } catch (error) {
      console.error("Erreur lors de la restauration locale:", error)
    }

    return () => {
      reset()
    }
  }, [formId, setFormId, setTitle, setBlocks, setTheme, setSettings, reset])

  // Autosave
  useAutosave()

  // Nettoyer au démontage
  React.useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null

  const formatLastSaved = () => {
    if (!lastSaved) return ""
    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()
    if (diff < 5000) return "À l'instant"
    if (diff < 60000) return `Il y a ${Math.floor(diff / 1000)}s`
    return `Il y a ${Math.floor(diff / 60000)}min`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 left-0 top-0 flex flex-col bg-background" style={{ zIndex: 9999 }}>
      {/* Topbar améliorée */}
      <div className="border-b bg-background/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/forms")}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quitter
            </Button>
            <Button
              variant={leftPanelCollapsed ? "default" : "outline"}
              size="sm"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className="shrink-0"
              title={leftPanelCollapsed ? "Ouvrir les blocs" : "Fermer les blocs"}
            >
              <Blocks className="h-4 w-4 mr-2" />
              Blocs
            </Button>
            <div className="flex-1 max-w-md min-w-0">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du formulaire"
                className="font-semibold text-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Tabs value={activeTab} onValueChange={(v) => {
              setActiveTab(v as typeof activeTab)
              if (v === "preview") {
                router.push(`/dashboard/forms/${formId}/preview`)
              } else if (v === "publish") {
                router.push(`/dashboard/forms/${formId}/publish`)
              }
            }}>
              <TabsList>
                <TabsTrigger value="edit">Éditer</TabsTrigger>
                <TabsTrigger value="preview">Prévisualiser</TabsTrigger>
                <TabsTrigger value="publish">Publier</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Indicateur de sauvegarde amélioré */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
              isSaving 
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" 
                : lastSaved 
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-muted text-muted-foreground"
            )}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Enregistrement...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Sauvegardé {formatLastSaved()}</span>
                </>
              ) : (
                <span className="text-xs">Modifications non sauvegardées</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layout 3 colonnes */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <FormBuilderLayout
          selectedBlockId={selectedBlockId}
          onBlockDeselect={() => setSelectedBlock(null)}
          leftCollapsed={leftPanelCollapsed}
          onLeftCollapsedChange={setLeftPanelCollapsed}
          leftPanel={<BlockPalette />}
          centerPanel={
            <FormCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              isEditing={true}
              theme={theme}
              previewFont={previewFont}
              dropPosition={dropPosition}
              draggingFromPalette={dropPosition !== null ? "dragging" : null}
              onBlockSelect={setSelectedBlock}
              onBlockUpdate={(id, updates) => updateBlock(id, updates)}
              onBlockDuplicate={duplicateBlock}
              onBlockDelete={deleteBlock}
              onBlockAdd={(type, position) => addBlock(type as any, position)}
              onBlockMove={moveBlock}
            />
          }
        rightPanel={
          <PropertyPanel>
            <PropertyPanelContent
              selectedBlock={selectedBlock}
              blocks={blocks}
              theme={theme}
              settings={settings}
              previewFont={previewFont}
              onBlockUpdate={(updates) => {
                if (selectedBlockId) {
                  updateBlock(selectedBlockId, updates)
                }
              }}
              onThemeUpdate={setTheme}
              onSettingsUpdate={setSettings}
              onPreviewFontChange={setPreviewFont}
            />
          </PropertyPanel>
        }
      />
      <DragOverlay>
        {draggingBlockType && (() => {
          const blockDefinitions: Record<string, { label: string; description: string; icon: any }> = {
            welcome: { label: "Bienvenue", description: "Message de bienvenue", icon: Sparkles },
            heading: { label: "Titre", description: "Titre ou sous-titre", icon: Type },
            paragraph: { label: "Paragraphe", description: "Texte descriptif", icon: FileText },
            "single-choice": { label: "Choix unique", description: "Radio buttons", icon: Circle },
            "multiple-choice": { label: "Choix multiples", description: "Cases à cocher", icon: CheckSquare },
            text: { label: "Texte", description: "Champ texte court", icon: Edit },
            textarea: { label: "Zone de texte", description: "Champ texte long", icon: AlignLeft },
            email: { label: "Email", description: "Adresse email", icon: Mail },
            phone: { label: "Téléphone", description: "Numéro de téléphone", icon: Phone },
            number: { label: "Nombre", description: "Valeur numérique", icon: Hash },
            slider: { label: "Curseur", description: "Slider de valeur", icon: Sliders },
            date: { label: "Date", description: "Sélecteur de date", icon: Calendar },
            "yes-no": { label: "Oui/Non", description: "Toggle Oui/Non", icon: ToggleLeft },
            consent: { label: "Consentement", description: "Case de consentement", icon: FileCheck },
            youtube: { label: "Vidéo YouTube", description: "Vidéo intégrée", icon: Youtube },
            file: { label: "Fichier", description: "Upload", icon: Upload },
            "menu-restaurant": { label: "Menu Restaurant", description: "Menu modulable", icon: UtensilsCrossed },
          }
          
          const blockDef = blockDefinitions[draggingBlockType]
          if (!blockDef) return null
          
          return (
            <div className="opacity-90 rotate-2 scale-105 shadow-2xl transition-transform pointer-events-none">
              <BlockCard
                icon={blockDef.icon as any}
                label={blockDef.label}
                description={blockDef.description}
                draggable={false}
              />
            </div>
          )
        })()}
      </DragOverlay>
      </DndContext>
    </div>
  )
}
