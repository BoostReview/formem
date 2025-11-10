/**
 * Script pour uploader l'image de layout sur Cloudflare R2
 * 
 * Usage: node scripts/upload-layout-image.js <chemin-vers-image>
 * Exemple: node scripts/upload-layout-image.js ./public/layout-one-by-one.png
 */

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// Charger les variables d'environnement
try {
  require("dotenv").config({ path: ".env.local" });
} catch (e) {
  // Si dotenv n'est pas disponible, essayer sans
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

async function uploadImage(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Fichier introuvable: ${imagePath}`);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `layout-one-by-one-${Date.now()}.${path.extname(imagePath).slice(1)}`;
    
    console.log(`📤 Upload de ${imagePath} vers R2...`);

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: `image/${path.extname(imagePath).slice(1) === "png" ? "png" : "jpeg"}`,
      })
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const fileUrl = `${baseUrl}/api/files/${fileName}`;

    console.log(`✅ Image uploadée avec succès!`);
    console.log(`📎 URL: ${fileUrl}`);
    console.log(`\n💾 Ajoutez cette URL dans app/dashboard/forms/new/page.tsx`);

    return fileUrl;
  } catch (error) {
    console.error("❌ Erreur lors de l'upload:", error);
    process.exit(1);
  }
}

// Récupérer le chemin de l'image depuis les arguments
const imagePath = process.argv[2];

if (!imagePath) {
  console.error("❌ Usage: node scripts/upload-layout-image.js <chemin-vers-image>");
  process.exit(1);
}

uploadImage(imagePath);

