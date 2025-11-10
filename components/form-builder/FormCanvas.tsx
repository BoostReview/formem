"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FormBlock, ThemeJSON } from "@/types"
import { Canvas } from "./Canvas"
import { DroppableCanvas } from "./DroppableCanvas"
import { BlockRenderer } from "./BlockRenderer"
import { DynamicButtonPreview } from "./DynamicButtonPreview"
import { cn } from "@/lib/utils"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { useGoogleFont } from "@/hooks/useGoogleFont"
import { motion } from "framer-motion"

interface SortableBlockProps {
  block: FormBlock
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormBlock>) => void
  onDuplicate: () => void
  onDelete: () => void
}

function SortableBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onRefSet,
}: SortableBlockProps & { onRefSet?: (id: string, element: HTMLDivElement | null) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node)
      onRefSet?.(block.id, node)
    },
    [setNodeRef, onRefSet, block.id]
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={combinedRef} style={style} className="mb-4">
      <BlockRenderer
        block={block}
        isSelected={isSelected && !isDragging}
        isEditing={isEditing}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  )
}

interface FormCanvasProps {
  blocks: FormBlock[]
  selectedBlockId: string | null
  isEditing?: boolean
  theme?: ThemeJSON
  previewFont?: string | null
  onBlockSelect: (id: string | null) => void
  onBlockUpdate: (id: string, updates: Partial<FormBlock>) => void
  onBlockDuplicate: (id: string) => void
  onBlockDelete: (id: string) => void
  onBlockAdd: (type: string, position?: number) => void
  onBlockMove: (fromIndex: number, toIndex: number) => void
  onDrop?: (type: string) => void
  className?: string
  dropPosition?: number | null
  draggingFromPalette?: string | null
}

export function FormCanvas({
  blocks,
  selectedBlockId,
  isEditing = true,
  theme,
  previewFont,
  onBlockSelect,
  onBlockUpdate,
  onBlockDuplicate,
  onBlockDelete,
  onBlockAdd,
  onBlockMove,
  onDrop,
  className,
  dropPosition: externalDropPosition,
  draggingFromPalette: externalDraggingFromPalette,
}: FormCanvasProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)
  const blockRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
  
  // Utiliser les props externes si fournies, sinon état local (pour compatibilité)
  const draggingFromPalette = externalDraggingFromPalette ?? null
  const dropPosition = externalDropPosition ?? null
  
  // Appliquer la police du thème en temps réel (ou la prévisualisation au survol)
  const fontFamily = previewFont || theme?.fonts?.family || "Inter"
  useGoogleFont(fontFamily)
  
  // Appliquer le background du thème (dégradé ou image)
  const backgroundImage = theme?.backgroundImage
  const backgroundGradient = theme?.backgroundGradient
  const backgroundImageOpacity = theme?.backgroundImageOpacity ?? 1
  const backgroundImageBlur = theme?.backgroundImageBlur ?? 0
  const backgroundColor = theme?.colors?.background || "#ffffff"
  
  // Logs pour déboguer l'image de fond
  React.useEffect(() => {
    console.log('[FormCanvas] Background debug:', {
      hasTheme: !!theme,
      backgroundImage: backgroundImage || 'NULL',
      backgroundImageType: typeof backgroundImage,
      backgroundImageLength: backgroundImage ? String(backgroundImage).length : 0,
      backgroundGradient: backgroundGradient || 'NULL',
      backgroundImageOpacity,
      backgroundImageBlur,
      backgroundColor,
      themeKeys: theme ? Object.keys(theme) : [],
      fullTheme: JSON.stringify(theme, null, 2),
    })
  }, [theme, backgroundImage, backgroundGradient, backgroundImageOpacity, backgroundImageBlur, backgroundColor])
  
  const canvasStyle = React.useMemo(() => {
    const style: React.CSSProperties = {
      fontFamily: `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    }
    
    // Appliquer le background - NE PAS mélanger background et backgroundColor
    // Utiliser exclusivement l'une ou l'autre, jamais les deux
    if (backgroundGradient && !backgroundImage) {
      style.background = backgroundGradient
      // S'assurer que backgroundColor n'est pas défini
      delete (style as any).backgroundColor
    } else if (!backgroundImage && !backgroundGradient) {
      style.backgroundColor = backgroundColor
      // S'assurer que background n'est pas défini
      delete (style as any).background
    } else {
      // Si backgroundImage, on ne met rien ici car c'est géré par le div parent
      delete (style as any).background
      delete (style as any).backgroundColor
    }
    
    return style
  }, [fontFamily, backgroundGradient, backgroundImage, backgroundColor])

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string
    
    // Si c'est un bloc depuis la palette, le parent gère ça
    if (event.active.data.current?.type === "palette-block") {
      return
    }
    
    // Sinon, c'est un bloc existant
    setActiveId(activeId)
  }


  const activeBlock = activeId
    ? blocks.find((block) => block.id === activeId)
    : null

  return (
    <>
      <div 
        className="relative w-full h-full rounded-[14px] overflow-hidden"
        style={(() => {
          const style: React.CSSProperties = {
            minHeight: "600px",
          }
          // NE PAS mélanger background et backgroundColor - utiliser exclusivement l'une ou l'autre
          if (backgroundGradient && !backgroundImage) {
            style.background = backgroundGradient
            // S'assurer que backgroundColor n'est pas défini
            delete (style as any).backgroundColor
            console.log('[FormCanvas] Style appliqué: background gradient', backgroundGradient)
          } else if (!backgroundImage && !backgroundGradient) {
            style.backgroundColor = backgroundColor
            // S'assurer que background n'est pas défini
            delete (style as any).background
            console.log('[FormCanvas] Style appliqué: backgroundColor', backgroundColor)
          } else {
            // Si backgroundImage, backgroundColor transparent
            style.backgroundColor = "transparent"
            delete (style as any).background
            console.log('[FormCanvas] Style appliqué: backgroundColor transparent (image de fond)', {
              backgroundImage: backgroundImage || 'NULL',
              backgroundImageURL: backgroundImage ? `url(${backgroundImage})` : 'NULL',
              hasBackgroundImage: !!backgroundImage,
              backgroundImageOpacity,
              backgroundImageBlur,
            })
          }
          return style
        })()}
      >
        {/* Image de fond avec opacité et flou */}
        {backgroundImage ? (
          <>
            {(() => {
              const imageUrl = `url(${backgroundImage})`
              console.log('[FormCanvas] Rendu div image de fond:', {
                backgroundImage: String(backgroundImage),
                backgroundImageURL: imageUrl,
                opacity: backgroundImageOpacity,
                blur: backgroundImageBlur,
                hasBackgroundImage: !!backgroundImage,
              })
              return null
            })()}
            <div
              className="absolute inset-0 rounded-[14px]"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: backgroundImageOpacity,
                filter: backgroundImageBlur > 0 ? `blur(${backgroundImageBlur}px)` : "none",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          </>
        ) : null}
        
        {/* Overlay si image de fond - réduit pour laisser voir l'image */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 rounded-[14px]"
            style={{
              backgroundColor: backgroundColor,
              opacity: 0.3, // Réduit de 0.9 à 0.3 pour laisser voir l'image
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}
        
        <DroppableCanvas
          id="canvas-drop-zone"
          className={cn("w-full h-full relative", className)}
          style={{
            ...canvasStyle,
            position: "relative",
            zIndex: 2,
          }}
          onClick={(e) => {
            // Si on clique directement sur le canvas (pas sur un bloc), désélectionner
            if (e.target === e.currentTarget) {
              onBlockSelect(null)
            }
          }}
        >
        {blocks.length > 0 ? (
          <>
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-6 space-y-4 relative">
                {blocks.map((block, index) => (
                  <React.Fragment key={block.id}>
                    {/* Indicateur de position d'insertion */}
                    {draggingFromPalette && dropPosition === index && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-1.5 w-full bg-primary rounded-full mb-4 shadow-lg shadow-primary/50"
                      />
                    )}
                    <ScaleIn>
                      <SortableBlock
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        isEditing={isEditing}
                        onSelect={() => onBlockSelect(block.id)}
                        onUpdate={(updates) => onBlockUpdate(block.id, updates)}
                        onDuplicate={() => onBlockDuplicate(block.id)}
                        onDelete={() => onBlockDelete(block.id)}
                        onRefSet={(id, element) => {
                          if (element) {
                            blockRefs.current.set(id, element)
                          } else {
                            blockRefs.current.delete(id)
                          }
                        }}
                      />
                    </ScaleIn>
                  </React.Fragment>
                ))}
                {/* Indicateur à la fin si on drop après le dernier bloc */}
                {draggingFromPalette && dropPosition === blocks.length && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-1.5 w-full bg-primary rounded-full mt-4 shadow-lg shadow-primary/50"
                  />
                )}
              </div>
            </SortableContext>
            
            {/* Aperçu du bouton d'envoi avec le style personnalisé */}
            {blocks.some(b => b.type !== "welcome" && b.type !== "heading" && b.type !== "paragraph") && (
              <div className="px-8 pt-8 pb-20 border-t border-dashed border-gray-200 mt-4 overflow-visible">
                <div className="flex justify-center overflow-visible">
                  <DynamicButtonPreview theme={theme || {} as any} disabled className="cursor-not-allowed">
                    Envoyer
                  </DynamicButtonPreview>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Aperçu du bouton d'envoi avec votre style personnalisé
                </p>
              </div>
            )}
          </>
        ) : (
          // Indicateur quand il n'y a pas de blocs
          <div className="p-6">
            {draggingFromPalette && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2 }}
                className="h-1.5 w-full bg-primary rounded-full shadow-lg shadow-primary/50"
              />
            )}
          </div>
        )}
      </DroppableCanvas>
      </div>
    </>
  )
}

