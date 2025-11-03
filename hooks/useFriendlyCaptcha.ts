"use client";

import { useEffect, useRef, useState } from "react";
import { WidgetInstance } from "friendly-challenge";

export function useFriendlyCaptcha(
  siteKey: string | null,
  containerId: string
) {
  const widgetRef = useRef<WidgetInstance | null>(null);
  const [solution, setSolution] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      setIsReady(false);
      return;
    }

    // Import dynamique du widget
    import("friendly-challenge").then((module) => {
      const container = document.getElementById(containerId);
      
      if (!container) {
        setError("Container element not found");
        return;
      }

      // Créer le widget Friendly CAPTCHA
      const widget = new module.WidgetInstance(container, {
        sitekey: siteKey,
        language: "fr",
        doneCallback: (solution) => {
          setSolution(solution);
          setIsReady(true);
        },
        errorCallback: (err) => {
          console.error("Friendly CAPTCHA error:", err);
          setError("Erreur lors de la vérification");
        },
      });

      widgetRef.current = widget;

      // Démarrer le widget
      widget.start();
    }).catch((err) => {
      console.error("Failed to load Friendly CAPTCHA:", err);
      setError("Impossible de charger le CAPTCHA");
    });

    // Cleanup
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [siteKey, containerId]);

  const reset = () => {
    if (widgetRef.current) {
      widgetRef.current.reset();
      setSolution("");
      setIsReady(false);
    }
  };

  return { solution, isReady, error, reset };
}

