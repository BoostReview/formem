import { NextRequest, NextResponse } from "next/server";

/**
 * API Route pour vérifier les solutions Friendly CAPTCHA
 * 
 * Friendly CAPTCHA utilise un système de Proof-of-Work (preuve de travail).
 * Le client résout un puzzle cryptographique et envoie la solution.
 * Cette API vérifie la solution auprès de l'API Friendly CAPTCHA.
 */
export async function POST(request: NextRequest) {
  try {
    const { solution } = await request.json();

    if (!solution) {
      return NextResponse.json(
        { success: false, error: "Solution CAPTCHA manquante" },
        { status: 400 }
      );
    }

    const secretKey = process.env.FRIENDLY_CAPTCHA_SECRET_KEY;
    const siteKey = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY;

    if (!secretKey || !siteKey) {
      console.error("Clés Friendly CAPTCHA non configurées");
      return NextResponse.json(
        { success: false, error: "Configuration serveur incorrecte" },
        { status: 500 }
      );
    }

    // Vérifier la solution auprès de l'API Friendly CAPTCHA
    // Documentation: https://docs.friendlycaptcha.com/#/verification_api
    const verificationResponse = await fetch(
      "https://api.friendlycaptcha.com/api/v1/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solution,
          secret: secretKey,
          sitekey: siteKey,
        }),
      }
    );

    if (!verificationResponse.ok) {
      console.error(
        "Erreur API Friendly CAPTCHA:",
        verificationResponse.status
      );
      return NextResponse.json(
        { success: false, error: "Erreur lors de la vérification" },
        { status: 500 }
      );
    }

    const verificationData = await verificationResponse.json();

    // La réponse de l'API contient:
    // {
    //   "success": true/false,
    //   "errors": [] // tableau d'erreurs si success = false
    // }

    if (verificationData.success) {
      return NextResponse.json({
        success: true,
        message: "CAPTCHA vérifié avec succès",
      });
    } else {
      console.warn("Vérification CAPTCHA échouée:", verificationData.errors);
      return NextResponse.json(
        {
          success: false,
          error: "Vérification CAPTCHA échouée",
          details: verificationData.errors,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la vérification Friendly CAPTCHA:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la vérification",
      },
      { status: 500 }
    );
  }
}




