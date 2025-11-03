"use client";

import { useEffect, useId } from "react";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import type { FormBlock } from "@/types";
import { useFriendlyCaptcha } from "@/hooks/useFriendlyCaptcha";

interface CaptchaBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

// Clé site Friendly CAPTCHA (à configurer dans les variables d'environnement)
const FRIENDLY_CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY || "";

export function CaptchaBlock({ block, value, onChange }: CaptchaBlockProps) {
  const widgetId = useId();
  const containerId = `frc-captcha-${widgetId}`;
  const { solution, isReady, error } = useFriendlyCaptcha(
    FRIENDLY_CAPTCHA_SITE_KEY || null,
    containerId
  );

  // Mettre à jour la valeur quand la solution est prête
  useEffect(() => {
    if (solution && solution !== value) {
      onChange(solution);
    }
  }, [solution, value, onChange]);

  // Si pas de clé configurée
  if (!FRIENDLY_CAPTCHA_SITE_KEY) {
    return (
      <div className="space-y-4">
        <Label className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {block.label || "Vérification de sécurité"}
          <span className="text-red-500 ml-1.5 text-base">*</span>
        </Label>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Configuration Friendly CAPTCHA requise
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Ajoutez NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY dans vos variables d'environnement
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight flex items-center gap-2">
        <Shield className="h-5 w-5" />
        {block.label || "Vérification de sécurité"}
        <span className="text-red-500 ml-1.5 text-base">*</span>
      </Label>

      {/* Widget Friendly CAPTCHA */}
      <div className="space-y-3">
        <div 
          id={containerId}
          className="frc-captcha" 
          data-sitekey={FRIENDLY_CAPTCHA_SITE_KEY}
          data-lang="fr"
        />

        {/* Status badge */}
        {isReady && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                ✓ Vérification réussie
              </p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Friendly CAPTCHA */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
        <Shield className="h-3 w-3" />
        <span>
          Protégé par{" "}
          <a 
            href="https://friendlycaptcha.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-slate-300"
          >
            Friendly CAPTCHA
          </a>
          {" "}• Respectueux de la vie privée • Sans tracking
        </span>
      </div>
    </div>
  );
}

