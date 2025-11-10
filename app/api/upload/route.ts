import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "formulaires-uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10MB)" },
        { status: 400 }
      );
    }

    // Générer un nom unique
    const fileExtension = file.name.split(".").pop();
    
    // Vérifier si un dossier est spécifié (pour les backgrounds)
    const folder = formData.get("folder") as string | null;
    const fileName = folder 
      ? `${folder}/${file.name}` // Garder le nom original dans le dossier spécifié
      : `${nanoid()}.${fileExtension}`; // Sinon générer un nom unique
    
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload vers R2
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // URL vers notre API pour télécharger le fichier
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const fileUrl = `${baseUrl}/api/files/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Erreur upload R2:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

