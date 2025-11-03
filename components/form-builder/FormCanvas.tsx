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
  
  const canvasStyle = React.useMemo(() => ({
    fontFamily: `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  }), [fontFamily])

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
      <DroppableCanvas
        id="canvas-drop-zone"
        className={cn("w-full h-full", className)}
        style={canvasStyle}
        onClick={(e) => {
          // Si on clique directement sur le canvas (pas sur un bloc), désélectionner
          if (e.target === e.currentTarget) {
            onBlockSelect(null)
          }
        }}
      >
        {blocks.length > 0 ? (
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
    </>
  )
}

