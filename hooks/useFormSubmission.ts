"use client";

import { useState } from "react";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import type { AnswersJSON, UTMJSON } from "@/types";

interface UseFormSubmissionResult {
  submitForm: (
    answers: Record<string, unknown>,
    timeElapsed: number
  ) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function useFormSubmission(formId: string): UseFormSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractUTMParams = (): UTMJSON => {
    if (typeof window === "undefined") return {};
    
    const params = new URLSearchParams(window.location.search);
    const utm: UTMJSON = {};
    
    const utm_source = params.get("utm_source");
    const utm_medium = params.get("utm_medium");
    const utm_campaign = params.get("utm_campaign");
    const utm_term = params.get("utm_term");
    const utm_content = params.get("utm_content");

    if (utm_source) utm.utm_source = utm_source;
    if (utm_medium) utm.utm_medium = utm_medium;
    if (utm_campaign) utm.utm_campaign = utm_campaign;
    if (utm_term) utm.utm_term = utm_term;
    if (utm_content) utm.utm_content = utm_content;

    return utm;
  };

  const extractHiddenFields = (): Record<string, unknown> => {
    if (typeof window === "undefined") return {};
    
    const params = new URLSearchParams(window.location.search);
    const hidden: Record<string, unknown> = {};
    
    // Extraire tous les paramètres qui commencent par "ref" ou autres champs cachés
    params.forEach((value, key) => {
      if (key.startsWith("ref") || key.startsWith("hidden_")) {
        hidden[key] = value;
      }
    });

    return hidden;
  };

  const detectSource = (): "link" | "embed" => {
    if (typeof window === "undefined") return "link";
    return window.self !== window.top ? "embed" : "link";
  };

  const extractEmail = (answers: Record<string, unknown>): string | null => {
    for (const [key, value] of Object.entries(answers)) {
      if (
        typeof value === "string" &&
        (key.toLowerCase().includes("email") ||
          value.includes("@") ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      ) {
        return value;
      }
    }
    return null;
  };

  const extractAndFormatPhone = (
    answers: Record<string, unknown>
  ): { phone_raw: string | null; phone_e164: string | null } => {
    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === "string" && value.trim()) {
        const cleaned = value.replace(/\D/g, "");
        
        // Si c'est un numéro français (commence par 0 ou 33)
        let phoneStr = value;
        if (cleaned.startsWith("0")) {
          phoneStr = `+33${cleaned.slice(1)}`;
        } else if (cleaned.startsWith("33")) {
          phoneStr = `+${cleaned}`;
        } else if (cleaned.length >= 10) {
          // Tenter avec le préfixe français par défaut
          phoneStr = `+33${cleaned}`;
        }

        try {
          if (isValidPhoneNumber(phoneStr)) {
            const phoneNumber = parsePhoneNumber(phoneStr);
            return {
              phone_raw: value,
              phone_e164: phoneNumber.format("E.164"),
            };
          }
        } catch {
          // Si la validation échoue, retourner juste la valeur brute
          return {
            phone_raw: value,
            phone_e164: null,
          };
        }
      }
    }
    return { phone_raw: null, phone_e164: null };
  };

  const submitForm = async (
    answers: Record<string, unknown>,
    timeElapsed: number
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);

    try {
      const email = extractEmail(answers);
      const { phone_raw, phone_e164 } = extractAndFormatPhone(answers);
      const utm_json = extractUTMParams();
      const hidden_json = extractHiddenFields();
      const source = detectSource();

      // Récupérer la valeur du honeypot depuis le DOM
      let honeypotValue = "";
      if (typeof document !== "undefined") {
        const honeypotField = document.querySelector(
          'input[name="website_url"]'
        ) as HTMLInputElement;
        if (honeypotField) {
          honeypotValue = honeypotField.value || "";
        }
      }

      const payload = {
        form_id: formId,
        answers_json: answers as AnswersJSON,
        email,
        phone_raw,
        phone_e164,
        utm_json,
        hidden_json,
        source,
        honeypot: honeypotValue,
        time_elapsed: timeElapsed,
      };

      console.log("🚀 Envoi de la soumission:", {
        formId,
        payload: JSON.stringify(payload, null, 2),
      });

      const response = await fetch(`/api/forms/${formId}/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Capturer toutes les informations de la réponse AVANT de la lire
      const status = response.status;
      const statusText = response.statusText;
      const contentType = response.headers.get("content-type");
      const contentLength = response.headers.get("content-length");
      
      // Lire le texte brut d'abord (on ne peut le lire qu'une fois)
      let responseText = "";
      try {
        responseText = await response.text();
      } catch (textError) {
        console.error("❌ Impossible de lire le texte de la réponse:", textError);
        responseText = "[Impossible de lire la réponse]";
      }
      
      let data: any = {};
      
      // Afficher les infos de debug
      console.log("📋 Infos réponse:", {
        status,
        statusText,
        contentType,
        contentLength,
        textLength: responseText.length,
        textPreview: responseText.substring(0, 100),
      });
      
      try {
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          console.warn("⚠️ Réponse vide ou sans contenu");
          data = { 
            error: "Réponse serveur vide",
            status,
            statusText,
          };
        }
      } catch (parseError) {
        console.error("❌ Erreur parsing JSON:", parseError);
        console.error("❌ Contenu brut COMPLET de la réponse:");
        console.error(responseText);
        // Si ce n'est pas du JSON, utiliser le texte comme message d'erreur
        data = { 
          error: "Erreur serveur (réponse non-JSON)", 
          details: responseText || "Réponse invalide du serveur",
          status,
          statusText,
          rawResponse: responseText.substring(0, 500),
        };
      }

      if (!response.ok) {
        // Afficher TOUT ce qu'on sait sur l'erreur
        console.error("❌ Erreur API - Détails complets:", {
          status,
          statusText,
          contentType,
          contentLength,
          responseTextLength: responseText.length,
          parsedData: data,
          error: data.error,
          details: data.details,
          hint: data.hint,
          code: data.code,
          fullData: data,
        });
        
        // Construire un message d'erreur plus descriptif
        let errorMessage = data.error || `Erreur serveur (${status} ${statusText})`;
        if (data.details) {
          errorMessage += `: ${data.details}`;
        }
        if (data.hint) {
          errorMessage += ` (${data.hint})`;
        }
        if (responseText && !data.error && !data.details) {
          errorMessage += ` - Réponse: ${responseText.substring(0, 100)}`;
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log("✅ Soumission réussie:", data);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur lors de la soumission:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
}

