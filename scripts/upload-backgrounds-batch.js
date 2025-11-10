/**
 * Script pour uploader plusieurs images d'arrière-plan en batch sur Cloudflare R2
 * 
 * Usage: node scripts/upload-backgrounds-batch.js <dossier-images>
 * Exemple: node scripts/upload-backgrounds-batch.js "C:\Users\elior\Desktop\BACKGROUND FORM"
 */

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// Charger les variables d'environnement
try {
  require("dotenv").config({ path: ".env.local" });
} catch (e) {
  console.log("⚠️  dotenv non disponible, utilisation des variables d'environnement système");
}

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "formulaires-uploads";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Extensions d'images supportées
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Fonction pour obtenir le Content-Type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return types[ext] || "image/jpeg";
}

// Fonction pour uploader une image
async function uploadImage(imagePath, index, total) {
  try {
    const fileName = path.basename(imagePath);
    const fileBuffer = fs.readFileSync(imagePath);
    const r2Key = `backgrounds/${fileName}`;
    
    console.log(`📤 [${index + 1}/${total}] Upload de ${fileName}...`);

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: getContentType(imagePath),
      })
    );

    const fileUrl = `${BASE_URL}/api/files/${r2Key}`;
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

    console.log(`\n🚀 Début de l'upload de ${imageFiles.length} image(s)...\n`);

    // Uploader toutes les images
    const results = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const result = await uploadImage(imageFiles[i], i, imageFiles.length);
      if (result) {
        results.push(result);
      }
      // Petit délai pour éviter de surcharger l'API
      if (i < imageFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
  console.error("❌ Usage: node scripts/upload-backgrounds-batch.js <dossier-images>");
  console.error("   Exemple: node scripts/upload-backgrounds-batch.js \"C:\\Users\\elior\\Desktop\\BACKGROUND FORM\"");
  process.exit(1);
}

uploadBatch(imagesDir);

