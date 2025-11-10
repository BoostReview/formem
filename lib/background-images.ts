/**
 * Images d'arrière-plan uploadées sur Cloudflare R2
 * Ce fichier est généré automatiquement par le script upload-backgrounds-batch.js
 */

export interface BackgroundImage {
  fileName: string
  url: string
  name: string
}

export interface BackgroundImagesData {
  generatedAt: string
  total: number
  images: BackgroundImage[]
}

// Charger les images depuis le JSON
// Importation statique qui fonctionne côté client et serveur
let backgroundImagesData: BackgroundImagesData | null = null

try {
  // Importation statique du JSON
  backgroundImagesData = require('./background-images.json') as BackgroundImagesData
} catch (e) {
  // Le fichier n'existe pas encore ou erreur de chargement
  backgroundImagesData = null
}

export function getBackgroundImages(): BackgroundImage[] {
  if (!backgroundImagesData || !backgroundImagesData.images) {
    return []
  }
  return backgroundImagesData.images
}

// Export par défaut pour compatibilité
export default backgroundImagesData

