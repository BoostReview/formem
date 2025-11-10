/**
 * Script simple pour uploader une image via l'API
 */

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

const imagePath = process.argv[2];

if (!imagePath) {
  console.error("Usage: node scripts/upload-image-simple.js <chemin-image>");
  process.exit(1);
}

if (!fs.existsSync(imagePath)) {
  console.error(`Fichier introuvable: ${imagePath}`);
  process.exit(1);
}

async function upload() {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ Image uploadée avec succès!");
      console.log(`📎 URL: ${data.fileUrl}`);
      console.log("\n💾 Ajoutez cette ligne dans votre fichier .env.local:");
      console.log(`NEXT_PUBLIC_LAYOUT_ONE_IMAGE=${data.fileUrl}`);
    } else {
      console.error("❌ Erreur:", data.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

upload();


