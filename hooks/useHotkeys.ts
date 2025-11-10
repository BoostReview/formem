"use client";

import { useEffect } from "react";

interface UseHotkeysOptions {
  onNext: () => void;
  onPrevious: () => void;
  onSelectOption?: (index: number) => void;
  enabled?: boolean;
}

export function useHotkeys({
  onNext,
  onPrevious,
  onSelectOption,
  enabled = true,
}: UseHotkeysOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas traiter les hotkeys si on est dans un input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // 1-9 : Sélectionner une option
      if (onSelectOption && e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key, 10);
        onSelectOption(index);
        return;
      }

      // Enter : Suivant
      if (e.key === "Enter") {
        e.preventDefault();
        onNext();
        return;
      }

      // ArrowRight : Suivant
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
        return;
      }

      // ArrowLeft : Précédent (mais pas visible dans l'UI)
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevious();
        return;
      }

      // Escape : Quitter (optionnel)
      if (e.key === "Escape") {
        // Optionnel : pourrait rediriger ou fermer
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious, onSelectOption, enabled]);
}





