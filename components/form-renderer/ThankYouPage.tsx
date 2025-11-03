"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Form } from "@/types";

interface ThankYouPageProps {
  form: Form;
}

export function ThankYouPage({ form }: ThankYouPageProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const settings = (form.settings_json || {}) as {
    redirectUrl?: string;
    thankYouTitle?: string;
    thankYouText?: string;
    thankYouImage?: string;
  };
  const redirectUrl = settings.redirectUrl;
  const thankYouTitle: string = settings.thankYouTitle || "Merci !";
  const thankYouText: string =
    settings.thankYouText ||
    "Votre réponse a été enregistrée avec succès.";

  useEffect(() => {
    if (redirectUrl) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [redirectUrl]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div
        className="max-w-md w-full"
        style={{ animation: 'fadeInUp 0.4s ease-out' }}
      >
        <div className="text-center space-y-6">
          {/* Icône de succès sobre */}
          <div
            className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"
            style={{ animation: 'scaleIn 0.3s ease-out 0.15s both' }}
          >
            <Check className="w-8 h-8 text-gray-900" strokeWidth={2.5} />
          </div>

          {/* Titre sobre */}
          <div style={{ animation: 'fadeIn 0.5s ease-in 0.25s both' }}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">{thankYouTitle}</h1>
            <p className="text-base text-gray-600">{thankYouText}</p>
          </div>

          {/* Compte à rebours */}
          {redirectUrl && countdown !== null && countdown > 0 && (
            <p
              className="text-sm text-gray-500"
              style={{ animation: 'fadeIn 0.5s ease-in 0.35s both' }}
            >
              Redirection dans {countdown} seconde{countdown > 1 ? "s" : ""}...
            </p>
          )}

          {/* Image optionnelle */}
          {settings.thankYouImage && (
            <img
              src={settings.thankYouImage}
              alt="Merci"
              className="mx-auto rounded-lg max-w-full mt-8"
              style={{ animation: 'fadeIn 0.5s ease-in 0.4s both' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}


