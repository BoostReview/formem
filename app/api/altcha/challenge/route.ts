import { NextRequest, NextResponse } from "next/server";
import { createChallenge } from "altcha-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Génère un challenge Altcha avec signature
 * Utilise la bibliothèque altcha-lib pour générer correctement le challenge
 * Documentation: https://altcha.org/docs/server-integration
 */
export async function GET(request: NextRequest) {
  try {
    // Clé secrète pour signer le challenge (HMAC key)
    // En production, utilisez une variable d'environnement
    const hmacKey = process.env.ALTCHA_HMAC_KEY || process.env.ALTCHA_SECRET_KEY || "default-secret-key-change-in-production";
    
    // Générer le challenge en utilisant altcha-lib
    const challenge = await createChallenge({
      hmacKey: hmacKey,
      maxNumber: 1000000, // Difficulté modérée
    });

    return NextResponse.json(challenge, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Erreur génération challenge Altcha:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du challenge" },
      { status: 500 }
    );
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

