"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Form } from "@/types";

interface ThankYouPageProps {
  form: Form;
}

export function ThankYouPage({ form }: ThankYouPageProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const settings = form.settings_json || {};
  const redirectUrl = settings.redirectUrl as string | undefined;
  const thankYouTitle = (settings.thankYouTitle as string) || "Merci !";
  const thankYouText =
    (settings.thankYouText as string) ||
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-md w-full"
      >
        <div className="text-center space-y-6">
          {/* Icône de succès sobre */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-gray-900" strokeWidth={2.5} />
          </motion.div>

          {/* Titre sobre */}
          {((
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">{thankYouTitle}</h1>
              <p className="text-base text-gray-600">{thankYouText}</p>
            </motion.div>
          ) as ReactNode)}

          {/* Compte à rebours */}
          {redirectUrl && countdown !== null && countdown > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-sm text-gray-500"
            >
              Redirection dans {countdown} seconde{countdown > 1 ? "s" : ""}...
            </motion.p>
          )}

          {/* Image optionnelle */}
          {settings.thankYouImage && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              src={settings.thankYouImage as string}
              alt="Merci"
              className="mx-auto rounded-lg max-w-full mt-8"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}


