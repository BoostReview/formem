import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "formulaires-uploads";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;

    if (!pathArray || pathArray.length === 0) {
      return NextResponse.json(
        { error: "Chemin de fichier manquant" },
        { status: 400 }
      );
    }

    // Reconstruire le chemin complet du fichier
    const fileName = pathArray.join("/");

    // Récupérer le fichier depuis R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const response = await r2.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 }
      );
    }

    // Convertir le stream en buffer
    const chunks: Uint8Array[] = [];
    // @ts-ignore - Body peut être un ReadableStream
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Déterminer le Content-Type
    const contentType = response.ContentType || "application/octet-stream";
    
    // Vérifier si on doit afficher inline (pour les images et PDF)
    const isImage = contentType.startsWith("image/")
    const isPdf = contentType === "application/pdf"
    const shouldDisplayInline = isImage || isPdf
    
    // Vérifier si le paramètre "download" est présent dans l'URL
    const searchParams = request.nextUrl.searchParams
    const forceDownload = searchParams.get("download") === "true"

    // Extraire le nom du fichier pour le Content-Disposition
    const displayFileName = pathArray[pathArray.length - 1];

    // Retourner le fichier avec les bons headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": forceDownload || !shouldDisplayInline
          ? `attachment; filename="${displayFileName}"`
          : `inline; filename="${displayFileName}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Permettre l'affichage dans une iframe
        "X-Frame-Options": "SAMEORIGIN",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Erreur récupération fichier R2:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du fichier" },
      { status: 500 }
    );
  }
}

