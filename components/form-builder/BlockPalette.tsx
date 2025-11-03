"use client"

import * as React from "react"
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
  Shield,
  Youtube,
} from "lucide-react"
import { useDraggable } from "@dnd-kit/core"
import { BlockCard } from "./BlockCard"
import { BlockType } from "@/types"
import { cn } from "@/lib/utils"

interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const blocks: BlockDefinition[] = [
  {
    type: "welcome",
    label: "Bienvenue",
    description: "Message de bienvenue",
    icon: Sparkles,
  },
  {
    type: "heading",
    label: "Titre",
    description: "Titre ou sous-titre",
    icon: Type,
  },
  {
    type: "paragraph",
    label: "Paragraphe",
    description: "Texte descriptif",
    icon: FileText,
  },
  {
    type: "single-choice",
    label: "Choix unique",
    description: "Radio buttons",
    icon: Circle,
  },
  {
    type: "multiple-choice",
    label: "Choix multiples",
    description: "Cases à cocher",
    icon: CheckSquare,
  },
  {
    type: "text",
    label: "Texte",
    description: "Champ texte court",
    icon: Edit,
  },
  {
    type: "textarea",
    label: "Zone de texte",
    description: "Champ texte long",
    icon: AlignLeft,
  },
  {
    type: "email",
    label: "Email",
    description: "Adresse email",
    icon: Mail,
  },
  {
    type: "phone",
    label: "Téléphone",
    description: "Numéro de téléphone",
    icon: Phone,
  },
  {
    type: "number",
    label: "Nombre",
    description: "Valeur numérique",
    icon: Hash,
  },
  {
    type: "slider",
    label: "Curseur",
    description: "Slider de valeur",
    icon: Sliders,
  },
  {
    type: "date",
    label: "Date",
    description: "Sélecteur de date",
    icon: Calendar,
  },
  {
    type: "yes-no",
    label: "Oui/Non",
    description: "Toggle Oui/Non",
    icon: ToggleLeft,
  },
  {
    type: "consent",
    label: "Consentement",
    description: "Case de consentement",
    icon: FileCheck,
  },
  {
    type: "captcha",
    label: "CAPTCHA",
    description: "Protection anti-spam",
    icon: Shield,
  },
  {
    type: "youtube",
    label: "Vidéo YouTube",
    description: "Vidéo intégrée",
    icon: Youtube,
  },
]

interface BlockPaletteProps {
  onBlockDragStart?: (type: BlockType) => void
  className?: string
}

function DraggableBlockCard({ block }: { block: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${block.type}`,
    data: {
      type: "palette-block",
      blockType: block.type,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.3 : 1,
        transition: isDragging ? "none" : "opacity 0.2s ease-out",
      }
    : { 
        opacity: isDragging ? 0.3 : 1,
        transition: "opacity 0.2s ease-out",
      }

      const Icon = block.icon
      if (!Icon) {
        console.error("Icon is undefined for block type:", block.type)
        return null
      }

      return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
          <BlockCard
            icon={Icon as any}
            label={block.label}
            description={block.description}
            draggable={true}
          />
        </div>
      )
}

export function BlockPalette({ onBlockDragStart, className }: BlockPaletteProps) {
  return (
    <div className={cn("flex flex-col h-full border-r bg-muted/30", className)}>
      <div className="p-4 border-b bg-background">
        <h2 className="text-lg font-semibold">Blocs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Glissez-déposez pour ajouter
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {blocks.map((block) => (
            <DraggableBlockCard key={block.type} block={block} />
          ))}
        </div>
      </div>
    </div>
  )
}

