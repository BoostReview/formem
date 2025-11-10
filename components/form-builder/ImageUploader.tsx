"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  placeholder?: string
  accept?: string
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "Sélectionner une image",
  accept = "image/*",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier que c'est une image
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image")
      return
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 10MB)")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.fileUrl) {
        onChange(data.fileUrl)
      } else {
        alert(data.error || "Erreur lors de l'upload")
      }
    } catch (error) {
      console.error("Erreur upload:", error)
      alert("Erreur lors de l'upload de l'image")
    } finally {
      setIsUploading(false)
      // Reset l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">{label}</Label>
      
      {/* Aperçu de l'image actuelle */}
      {value && (
        <div className="relative group">
          <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200 bg-muted shadow-sm">
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onChange(null)}
                className="shadow-lg"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
            {/* Badge de sélection */}
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
              Image active
            </div>
          </div>
        </div>
      )}

      {/* Input file caché */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
        disabled={isUploading}
      />

      {/* Bouton d'upload */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full h-10 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Upload en cours...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {value ? "Changer l'image" : placeholder}
          </>
        )}
      </Button>

      {/* URL manuelle */}
      <div className="space-y-2 pt-2 border-t">
        <Label htmlFor="image-url" className="text-xs font-medium text-muted-foreground">
          Ou entrez une URL d'image
        </Label>
        <Input
          id="image-url"
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://example.com/image.jpg"
          className="text-sm h-9"
        />
        <p className="text-xs text-muted-foreground">
          Formats acceptés : JPG, PNG, WebP (max 10MB)
        </p>
      </div>
    </div>
  )
}

