"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UploadLayoutImagePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState("")
  const [envLine, setEnvLine] = useState("")

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier que c'est une image
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.fileUrl) {
        setFileUrl(data.fileUrl)
        const envVar = `NEXT_PUBLIC_LAYOUT_ONE_IMAGE=${data.fileUrl}`
        setEnvLine(envVar)
        toast.success("Image uploadée avec succès!")
      } else {
        toast.error(data.error || "Erreur lors de l'upload")
      }
    } catch (error) {
      console.error("Erreur upload:", error)
      toast.error("Erreur lors de l'upload de l'image")
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copié dans le presse-papiers!")
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Image Layout</h1>
          <p className="text-muted-foreground">
            Uploadez l'image pour l'option "Une question par page"
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {uploading ? "Upload en cours..." : "Cliquez pour sélectionner une image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, JPEG ou WebP (max 10MB)
              </p>
            </div>
          </label>
        </div>

        {fileUrl && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Image uploadée avec succès!
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                URL de l'image:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded text-xs break-all">
                  {fileUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(fileUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Variable d'environnement
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Ajoutez cette ligne dans votre fichier <code>.env.local</code>:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded text-xs break-all">
                  {envLine}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(envLine)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard/forms/new")}>
                Retour à la création de formulaire
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


