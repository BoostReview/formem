import { create } from "zustand"
import { FormBlock, BlockType, ThemeJSON, SettingsJSON } from "@/types"

interface FormBuilderState {
  // Formulaire actuel
  formId: string | null
  title: string
  blocks: FormBlock[]
  theme: ThemeJSON
  settings: SettingsJSON
  
  // État de l'éditeur
  selectedBlockId: string | null
  isSaving: boolean
  lastSaved: Date | null
  previewFont: string | null // Pour la prévisualisation au survol
  
  // Actions
  setFormId: (id: string) => void
  setTitle: (title: string) => void
  setBlocks: (blocks: FormBlock[]) => void
  addBlock: (type: BlockType, position?: number) => void
  updateBlock: (id: string, updates: Partial<FormBlock>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  setSelectedBlock: (id: string | null) => void
  setTheme: (theme: ThemeJSON) => void
  setSettings: (settings: SettingsJSON) => void
  setIsSaving: (isSaving: boolean) => void
  setLastSaved: (date: Date | null) => void
  setPreviewFont: (font: string | null) => void
  reset: () => void
}

const defaultTheme: ThemeJSON = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    text: "#1e293b",
  },
  fonts: {
    family: "Inter",
    size: "16px",
  },
  radius: 8,
}

const defaultSettings: SettingsJSON = {}

export const useFormBuilder = create<FormBuilderState>((set, get) => ({
  formId: null,
  title: "",
  blocks: [],
  theme: defaultTheme,
  settings: defaultSettings,
  selectedBlockId: null,
  isSaving: false,
  lastSaved: null,
  previewFont: null,

  setFormId: (id) => set({ formId: id }),
  
  setTitle: (title) => set({ title }),
  
  setBlocks: (blocks) => set({ blocks }),
  
  addBlock: (type, position) => {
    const { blocks } = get()
    const newBlock: FormBlock = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: getDefaultLabel(type),
      required: false,
      ...getDefaultProps(type),
    }
    
    const newBlocks = [...blocks]
    if (position !== undefined) {
      newBlocks.splice(position, 0, newBlock)
    } else {
      newBlocks.push(newBlock)
    }
    
    set({ blocks: newBlocks, selectedBlockId: newBlock.id })
  },
  
  updateBlock: (id, updates) => {
    const { blocks } = get()
    set({
      blocks: blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    })
  },
  
  deleteBlock: (id) => {
    const { blocks, selectedBlockId } = get()
    set({
      blocks: blocks.filter((block) => block.id !== id),
      selectedBlockId: selectedBlockId === id ? null : selectedBlockId,
    })
  },
  
  duplicateBlock: (id) => {
    const { blocks } = get()
    const block = blocks.find((b) => b.id === id)
    if (!block) return
    
    const duplicated: FormBlock = {
      ...block,
      id: `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    
    const index = blocks.findIndex((b) => b.id === id)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, duplicated)
    
    set({ blocks: newBlocks, selectedBlockId: duplicated.id })
  },
  
  moveBlock: (fromIndex, toIndex) => {
    const { blocks } = get()
    const newBlocks = [...blocks]
    const [moved] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, moved)
    set({ blocks: newBlocks })
  },
  
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  
  setTheme: (theme) => set({ theme }),
  
  setSettings: (settings) => set({ settings }),
  
  setIsSaving: (isSaving) => set({ isSaving }),
  
  setLastSaved: (date) => set({ lastSaved: date }),
  
  setPreviewFont: (font) => set({ previewFont: font }),
  
  reset: () =>
    set({
      formId: null,
      title: "",
      blocks: [],
      theme: defaultTheme,
      settings: defaultSettings,
      selectedBlockId: null,
      isSaving: false,
      lastSaved: null,
      previewFont: null,
    }),
}))

function getDefaultLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    welcome: "Bienvenue",
    heading: "Nouveau titre",
    paragraph: "Nouveau paragraphe",
    "single-choice": "Choix unique",
    "multiple-choice": "Choix multiples",
    text: "Texte",
    textarea: "Zone de texte",
    email: "Email",
    phone: "Téléphone",
    number: "Nombre",
    slider: "Curseur",
    date: "Date",
    "yes-no": "Oui/Non",
    consent: "Consentement",
    captcha: "Vérification de sécurité",
    youtube: "Vidéo YouTube",
  }
  return labels[type] || "Nouveau bloc"
}

function getDefaultProps(type: BlockType): Partial<FormBlock> {
  const defaults: Record<BlockType, Partial<FormBlock>> = {
    welcome: {},
    heading: { level: "h2" as any },
    paragraph: {},
    "single-choice": { options: ["Option 1", "Option 2"] },
    "multiple-choice": { options: ["Option 1", "Option 2"] },
    text: { placeholder: "Entrez votre texte..." },
    textarea: { placeholder: "Entrez votre message..." },
    email: { placeholder: "exemple@email.com" },
    phone: { placeholder: "+33 6 12 34 56 78" },
    number: { min: 0, max: 100 } as any,
    slider: { min: 0, max: 100, step: 1 } as any,
    date: { dateType: "date" as any },
    "yes-no": {},
    consent: { consentText: "J'accepte les conditions" as any },
    captcha: { required: true },
    youtube: {},
  }
  return defaults[type] || {}
}

