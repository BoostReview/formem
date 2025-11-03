import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleSupabase } from "@/lib/supabase/server";
import type { Form, AnswersJSON, UTMJSON } from "@/types";

interface LeadPayload {
  form_id: string;
  answers_json: AnswersJSON;
  email?: string | null;
  phone_raw?: string | null;
  phone_e164?: string | null;
  utm_json?: UTMJSON;
  hidden_json?: Record<string, unknown>;
  source: "link" | "embed";
  honeypot?: string;
  time_elapsed?: number;
}

function getClientIP(request: NextRequest): string | null {
  // Vérifier plusieurs headers pour obtenir l'IP réelle
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    // x-forwarded-for peut contenir plusieurs IPs, prendre la première
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return null;
}

function getUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("📥 [API Lead] Requête reçue");
  
  try {
    const { id } = await params;
    console.log("📋 [API Lead] Form ID:", id);
    
    let body: LeadPayload;
    
    try {
      body = await request.json();
      console.log("📦 [API Lead] Body reçu:", {
        form_id: body.form_id,
        has_answers: !!body.answers_json,
        source: body.source,
        time_elapsed: body.time_elapsed,
      });
    } catch (jsonError) {
      console.error("❌ [API Lead] Erreur parsing JSON:", jsonError);
      return NextResponse.json(
        { error: "Format JSON invalide" },
        { status: 400 }
      );
    }

    // 1. Vérifier le honeypot
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json(
        { error: "Soumission rejetée" },
        { status: 400 }
      );
    }

    // 2. Vérifier le délai minimum (300ms)
    const timeElapsed = body.time_elapsed || 0;
    if (timeElapsed < 300) {
      return NextResponse.json(
        { error: "Soumission trop rapide" },
        { status: 400 }
      );
    }

    // 3. Vérifier que form_id correspond à l'ID dans l'URL
    if (body.form_id !== id) {
      return NextResponse.json(
        { error: "ID de formulaire invalide" },
        { status: 400 }
      );
    }

    // 4. Récupérer le formulaire avec service role (bypass RLS)
    console.log("🔐 [API Lead] Création client Supabase...");
    let supabase;
    try {
      supabase = createServiceRoleSupabase();
      console.log("✅ [API Lead] Client Supabase créé");
    } catch (error) {
      console.error("❌ [API Lead] Erreur création client Supabase:", error);
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("📝 [API Lead] Détails:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        errorMessage: errorMsg,
      });
      return NextResponse.json(
        { 
          error: "Configuration serveur invalide. Vérifiez SUPABASE_SERVICE_ROLE_KEY",
          details: errorMsg
        },
        { status: 500 }
      );
    }
    
    console.log("🔍 [API Lead] Récupération du formulaire...");
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (formError) {
      console.error("❌ [API Lead] Erreur récupération formulaire:", formError);
      return NextResponse.json(
        { error: `Formulaire introuvable: ${formError.message}` },
        { status: 404 }
      );
    }

    if (!form) {
      console.error("❌ [API Lead] Formulaire non trouvé (null)");
      return NextResponse.json(
        { error: "Formulaire introuvable" },
        { status: 404 }
      );
    }

    console.log("✅ [API Lead] Formulaire trouvé:", {
      id: form.id,
      title: form.title,
      published: form.published,
    });

    const formData = form as Form;

    // 5. Vérifier que le formulaire est publié
    if (!formData.published) {
      return NextResponse.json(
        { error: "Formulaire non publié" },
        { status: 403 }
      );
    }

    // 6. Vérifier expiresAt
    if (formData.settings_json?.expiresAt) {
      const expiresAt = new Date(formData.settings_json.expiresAt as string);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Formulaire expiré" },
          { status: 403 }
        );
      }
    }

    // 7. Vérifier maxResponses
    if (formData.settings_json?.maxResponses) {
      const { count } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true })
        .eq("form_id", id);

      const currentCount = count || 0;
      const maxResponses = formData.settings_json.maxResponses as number;

      if (currentCount >= maxResponses) {
        return NextResponse.json(
          { error: "Nombre maximum de réponses atteint" },
          { status: 403 }
        );
      }
    }

    // 8. Extraire IP et User-Agent
    const ip = getClientIP(request);
    const ua = getUserAgent(request);

    // 9. Préparer les données pour l'insertion
    const responseData: any = {
      form_id: id,
      answers_json: body.answers_json || {},
      email: body.email || null,
      phone_raw: body.phone_raw || null,
      phone_e164: body.phone_e164 || null,
      utm_json: body.utm_json || {},
      hidden_json: body.hidden_json || {},
      source: body.source || "link",
    };

    // Ajouter ip et ua seulement s'ils existent (pour éviter les erreurs de type)
    if (ip) {
      responseData.ip = ip;
    }
    if (ua) {
      responseData.ua = ua;
    }

    // 10. Insérer la réponse
    console.log("💾 [API Lead] Insertion de la réponse...");
    console.log("📊 [API Lead] Données à insérer:", JSON.stringify(responseData, null, 2));
    
    const { data: response, error: insertError } = await supabase
      .from("responses")
      .insert(responseData)
      .select()
      .single();

    if (insertError) {
      console.error("❌ [API Lead] Erreur insertion réponse:", insertError);
      console.error("📝 [API Lead] Détails erreur:", {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
      });
      return NextResponse.json(
        { 
          error: "Erreur lors de l'enregistrement",
          details: insertError.message,
          hint: insertError.hint || "Vérifiez que la table responses existe et que les colonnes correspondent",
          code: insertError.code,
        },
        { status: 500 }
      );
    }
    
    console.log("✅ [API Lead] Réponse insérée avec succès:", response?.id);

    if (!response) {
      console.error("Aucune réponse retournée après insertion");
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement: aucune donnée retournée" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, response_id: response.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [API Lead] Erreur catch globale:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("📝 [API Lead] Stack trace:", errorStack);
    
    // S'assurer qu'on renvoie toujours du JSON valide
    try {
      return NextResponse.json(
        { 
          error: "Erreur serveur",
          details: errorMessage,
          type: error instanceof Error ? error.constructor.name : typeof error,
        },
        { status: 500 }
      );
    } catch (jsonError) {
      // En dernier recours, renvoyer un texte simple
      console.error("❌ [API Lead] Impossible de créer la réponse JSON:", jsonError);
      return new NextResponse(
        JSON.stringify({ 
          error: "Erreur serveur critique",
          details: errorMessage
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
}

