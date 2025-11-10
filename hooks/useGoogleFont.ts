"use client";

import { useEffect } from "react";
import { getGoogleFontUrl } from "@/lib/google-fonts";

/**
 * Hook pour charger dynamiquement une police Google Fonts
 */
export function useGoogleFont(fontFamily: string | undefined) {
  useEffect(() => {
    if (!fontFamily) return;

    // Vérifier si la police est déjà chargée
    const linkId = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
    const existingLink = document.getElementById(linkId);

    if (existingLink) {
      // La police est déjà chargée
      return;
    }

    // Obtenir l'URL Google Fonts
    const fontUrl = getGoogleFontUrl(fontFamily);
    if (!fontUrl) {
      // Ce n'est pas une police Google Fonts ou elle n'est pas dans notre liste
      return;
    }

    // Créer le lien pour charger la police
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);

    // Nettoyage lors du démontage
    return () => {
      const linkToRemove = document.getElementById(linkId);
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [fontFamily]);
}




