"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBackgroundImages } from "@/lib/background-images"

interface BackgroundOption {
  id: string
  name: string
  value: string
  preview: string // CSS gradient ou couleur
  isImage?: boolean // Indique si c'est une image (URL) ou un gradient
}

// Charger les images depuis le fichier JSON
const backgroundImagesData = getBackgroundImages()
const BACKGROUND_IMAGES: BackgroundOption[] = backgroundImagesData.map((img, index) => ({
  id: `bg-image-${index}`,
  name: img.name || img.fileName,
  value: img.url,
  preview: "",
  isImage: true,
}))

const PREDEFINED_BACKGROUNDS: BackgroundOption[] = [
  {
    id: "none",
    name: "Aucun",
    value: "",
    preview: "bg-white border-2 border-gray-200",
  },
  // Gradients modernes inspirés de WebGradients, UI Gradients, et Mesh Gradients
  {
    id: "warm-flame",
    name: "Flamme chaude",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    preview: "",
  },
  {
    id: "night-fade",
    name: "Nuit dégradée",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    preview: "",
  },
  {
    id: "spring-warmth",
    name: "Chaleur printanière",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    preview: "",
  },
  {
    id: "juicy-peach",
    name: "Pêche juteuse",
    value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    preview: "",
  },
  {
    id: "young-passion",
    name: "Passion jeune",
    value: "linear-gradient(135deg, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
    preview: "",
  },
  {
    id: "lady-lips",
    name: "Lèvres de dame",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    preview: "",
  },
  {
    id: "sunny-morning",
    name: "Matin ensoleillé",
    value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    preview: "",
  },
  {
    id: "rainy-ashville",
    name: "Cendres pluvieuses",
    value: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    preview: "",
  },
  {
    id: "frozen-dreams",
    name: "Rêves gelés",
    value: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    preview: "",
  },
  {
    id: "winter-neva",
    name: "Neva hivernale",
    value: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    preview: "",
  },
  {
    id: "dusty-grass",
    name: "Herbe poussiéreuse",
    value: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    preview: "",
  },
  {
    id: "tempting-azure",
    name: "Azure tentant",
    value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    preview: "",
  },
  {
    id: "heavy-rain",
    name: "Pluie intense",
    value: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    preview: "",
  },
  {
    id: "amy-crisp",
    name: "Amy croquant",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    preview: "",
  },
  {
    id: "mean-fruit",
    name: "Fruit intense",
    value: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    preview: "",
  },
  {
    id: "deep-blue",
    name: "Bleu profond",
    value: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    preview: "",
  },
  {
    id: "ripe-malinka",
    name: "Malinka mûre",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    preview: "",
  },
  {
    id: "cloudy-knoxville",
    name: "Knoxville nuageux",
    value: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    preview: "",
  },
  {
    id: "malibu-beach",
    name: "Plage Malibu",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    preview: "",
  },
  {
    id: "new-life",
    name: "Nouvelle vie",
    value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    preview: "",
  },
  {
    id: "true-sunset",
    name: "Vrai coucher",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%)",
    preview: "",
  },
  {
    id: "morpheus-den",
    name: "Tanière Morphée",
    value: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    preview: "",
  },
  {
    id: "rare-wind",
    name: "Vent rare",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    preview: "",
  },
  {
    id: "near-moon",
    name: "Près de la lune",
    value: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    preview: "",
  },
  {
    id: "wild-apple",
    name: "Pomme sauvage",
    value: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    preview: "",
  },
  {
    id: "saint-petersburg",
    name: "Saint-Pétersbourg",
    value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    preview: "",
  },
  {
    id: "arielles-smile",
    name: "Sourire d'Arielle",
    value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    preview: "",
  },
  {
    id: "plum-plate",
    name: "Assiette prune",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    preview: "",
  },
  {
    id: "everlasting-sky",
    name: "Ciel éternel",
    value: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
    preview: "",
  },
  {
    id: "happy-fisher",
    name: "Pêcheur heureux",
    value: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    preview: "",
  },
  {
    id: "blessing",
    name: "Bénédiction",
    value: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    preview: "",
  },
  {
    id: "sharpeye-eagle",
    name: "Aigle perçant",
    value: "linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)",
    preview: "",
  },
  {
    id: "ladoga-bottom",
    name: "Fond Ladoga",
    value: "linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)",
    preview: "",
  },
  {
    id: "lemon-gate",
    name: "Porte citron",
    value: "linear-gradient(135deg, #96fbc4 0%, #f9f047 100%)",
    preview: "",
  },
  {
    id: "itmeo-branding",
    name: "Branding Itmeo",
    value: "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
    preview: "",
  },
  {
    id: "zeus-milo",
    name: "Zeus Milo",
    value: "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)",
    preview: "",
  },
  {
    id: "blue-lagoon",
    name: "Lagon bleu",
    value: "linear-gradient(135deg, #43cbff 0%, #9708cc 100%)",
    preview: "",
  },
  {
    id: "electric-violet",
    name: "Violet électrique",
    value: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
    preview: "",
  },
  {
    id: "strong-bliss",
    name: "Félicité forte",
    value: "linear-gradient(135deg, #fce043 0%, #fb7ba2 100%)",
    preview: "",
  },
  {
    id: "sweet-morning",
    name: "Doux matin",
    value: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)",
    preview: "",
  },
  {
    id: "politics",
    name: "Politique",
    value: "linear-gradient(135deg, #2196f3 0%, #f44336 100%)",
    preview: "",
  },
  {
    id: "bright-vault",
    name: "Voûte lumineuse",
    value: "linear-gradient(135deg, #00d4ff 0%, #090979 100%)",
    preview: "",
  },
  {
    id: "solid-vault",
    name: "Voûte solide",
    value: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    preview: "",
  },
  {
    id: "sunset-orange",
    name: "Orange couchant",
    value: "linear-gradient(135deg, #fa8bff 0%, #2bd2ff 50%, #2bff88 100%)",
    preview: "",
  },
  {
    id: "purple-dream",
    name: "Rêve violet",
    value: "linear-gradient(135deg, #bf5ae0 0%, #a811da 100%)",
    preview: "",
  },
  {
    id: "celestial",
    name: "Céleste",
    value: "linear-gradient(135deg, #c33764 0%, #1d2671 100%)",
    preview: "",
  },
  {
    id: "coal",
    name: "Charbon",
    value: "linear-gradient(135deg, #eb4511 0%, #c0392b 50%, #8e44ad 100%)",
    preview: "",
  },
  {
    id: "warm-rust",
    name: "Rouille chaude",
    value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    preview: "",
  },
  {
    id: "eternal-constance",
    name: "Constance éternelle",
    value: "linear-gradient(135deg, #09203f 0%, #537895 100%)",
    preview: "",
  },
  {
    id: "japan-blush",
    name: "Rougeur japonaise",
    value: "linear-gradient(135deg, #ddd6fe 0%, #fa8bff 50%, #2bd2ff 100%)",
    preview: "",
  },
]

interface BackgroundSelectorProps {
  value?: string | null
  onChange: (value: string | null) => void
  label?: string
}

// Combiner les gradients prédéfinis et les images
const ALL_BACKGROUNDS: BackgroundOption[] = [
  ...PREDEFINED_BACKGROUNDS,
  ...BACKGROUND_IMAGES,
]

export function BackgroundSelector({
  value,
  onChange,
  label = "Arrière-plan",
}: BackgroundSelectorProps) {
  const selectedId = React.useMemo(() => {
    if (!value) return "none"
    // Vérifier si c'est un arrière-plan prédéfini
    const found = PREDEFINED_BACKGROUNDS.find((bg) => bg.value === value)
    if (found) return found.id
    // Vérifier si c'est une image uploadée
    const imageFound = BACKGROUND_IMAGES.find((bg) => bg.value === value)
    if (imageFound) return imageFound.id
    // Si c'est une URL ou un gradient, c'est personnalisé
    return "custom"
  }, [value])
  
  const handleSelect = (bgId: string) => {
    if (bgId === "none") {
      onChange(null)
    } else {
      const bg = ALL_BACKGROUNDS.find((b) => b.id === bgId)
      if (bg) {
        onChange(bg.value)
      }
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">{label}</Label>
      
      {/* Section Gradients */}
      {PREDEFINED_BACKGROUNDS.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Dégradés</p>
          <div className="grid grid-cols-4 gap-2">
            {PREDEFINED_BACKGROUNDS.map((bg) => {
              const isSelected = selectedId === bg.id
              
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => handleSelect(bg.id)}
                  className={cn(
                    "group relative aspect-square rounded-xl border-2 transition-all duration-200 overflow-hidden",
                    "hover:scale-105 hover:shadow-lg active:scale-95",
                    bg.id === "none" ? bg.preview : "",
                    isSelected
                      ? "border-primary ring-2 ring-primary/50 ring-offset-2 shadow-lg shadow-primary/20"
                      : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                  )}
                  style={bg.id !== "none" && bg.value ? { background: bg.value } : undefined}
                  title={bg.name}
                >
                  {/* Overlay au hover */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-200",
                    isSelected ? "bg-black/5" : "bg-black/0 group-hover:bg-black/5"
                  )} />
                  
                  {/* Indicateur de sélection */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Section Images */}
      {BACKGROUND_IMAGES.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Images</p>
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUND_IMAGES.map((bg) => {
              const isSelected = selectedId === bg.id
              
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => handleSelect(bg.id)}
                  className={cn(
                    "group relative aspect-square rounded-xl border-2 transition-all duration-200 overflow-hidden",
                    "hover:scale-105 hover:shadow-lg active:scale-95",
                    isSelected
                      ? "border-primary ring-2 ring-primary/50 ring-offset-2 shadow-lg shadow-primary/20"
                      : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                  )}
                  style={{
                    backgroundImage: `url(${bg.value})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  title={bg.name}
                >
                  {/* Overlay au hover */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-200",
                    isSelected ? "bg-black/5" : "bg-black/0 group-hover:bg-black/5"
                  )} />
                  
                  {/* Indicateur de sélection */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {value && selectedId === "custom" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Arrière-plan personnalisé (image uploadée)</span>
        </div>
      )}
    </div>
  )
}

