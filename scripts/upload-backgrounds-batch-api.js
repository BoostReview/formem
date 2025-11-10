/**
 * Script pour uploader plusieurs images d'arrière-plan en batch via l'API
 * Ce script utilise l'API /api/upload existante au lieu de se connecter directement à R2
 * 
 * Usage: node scripts/upload-backgrounds-batch-api.js <dossier-images>
 * Exemple: node scripts/upload-backgrounds-batch-api.js "C:\Users\elior\Desktop\BACKGROUND FORM"
 */

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

// Charger les variables d'environnement
try {
  require("dotenv").config({ path: ".env.local" });
} catch (e) {
  console.log("⚠️  dotenv non disponible, utilisation des variables d'environnement système");
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const UPLOAD_URL = `${BASE_URL}/api/upload`;

// Extensions d'images supportées
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Fonction pour uploader une image via l'API
async function uploadImage(imagePath, index, total) {
  try {
    const fileName = path.basename(imagePath);
    console.log(`📤 [${index + 1}/${total}] Upload de ${fileName}...`);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));
    formData.append("folder", "backgrounds"); // Spécifier le dossier backgrounds

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload échoué");
    }

    const fileUrl = result.fileUrl;
    
    console.log(`✅ [${index + 1}/${total}] ${fileName} uploadé!`);
    
    return {
      fileName,
      url: fileUrl,
      name: path.parse(fileName).name, // Nom sans extension pour l'affichage
    };
  } catch (error) {
    console.error(`❌ Erreur lors de l'upload de ${imagePath}:`, error.message);
    return null;
  }
}

// Fonction principale
async function uploadBatch(imagesDir) {
  try {
    // Vérifier que le dossier existe
    if (!fs.existsSync(imagesDir)) {
      console.error(`❌ Dossier introuvable: ${imagesDir}`);
      process.exit(1);
    }

    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(imagesDir);
    
    // Filtrer les fichiers images
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map(file => path.join(imagesDir, file));

    if (imageFiles.length === 0) {
      console.error(`❌ Aucune image trouvée dans ${imagesDir}`);
      console.log(`   Extensions supportées: ${IMAGE_EXTENSIONS.join(", ")}`);
      process.exit(1);
    }

    console.log(`\n🚀 Début de l'upload de ${imageFiles.length} image(s) via l'API...\n`);

    // Uploader toutes les images
    const results = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const result = await uploadImage(imageFiles[i], i, imageFiles.length);
      if (result) {
        results.push(result);
      }
      // Petit délai pour éviter de surcharger l'API
      if (i < imageFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Générer le fichier JSON avec les URLs
    const jsonPath = path.join(process.cwd(), "lib", "background-images.json");
    const jsonDir = path.dirname(jsonPath);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir, { recursive: true });
    }

    const jsonData = {
      generatedAt: new Date().toISOString(),
      total: results.length,
      images: results,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`\n✅ Upload terminé! ${results.length}/${imageFiles.length} image(s) uploadée(s)`);
    console.log(`📄 Fichier JSON généré: ${jsonPath}`);
    console.log(`\n📋 URLs générées:`);
    results.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.name}: ${img.url}`);
    });

    console.log(`\n💡 Les images sont maintenant disponibles dans BackgroundSelector!`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'upload batch:", error);
    process.exit(1);
  }
}

// Récupérer le dossier depuis les arguments
const imagesDir = process.argv[2];

if (!imagesDir) {
  console.error("❌ Usage: node scripts/upload-backgrounds-batch-api.js <dossier-images>");
  console.error("   Exemple: node scripts/upload-backgrounds-batch-api.js \"C:\\Users\\elior\\Desktop\\BACKGROUND FORM\"");
  process.exit(1);
}

uploadBatch(imagesDir);

