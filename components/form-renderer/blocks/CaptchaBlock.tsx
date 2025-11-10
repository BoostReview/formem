"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";
import { loadAltcha } from "@/lib/altcha-loader";

// Importer Altcha directement
if (typeof window !== "undefined") {
  import("altcha").catch(() => {
    // Ignorer les erreurs d'import, on utilisera le CDN en fallback
  });
}

// Le web component Altcha sera créé dynamiquement

interface CaptchaBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function CaptchaBlock({ block, value, onChange }: CaptchaBlockProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetRef = React.useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const align = getAlignment(block as any);
  // Utiliser l'URL du challenge configurée ou l'endpoint par défaut (URL absolue)
  const defaultChallengeUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/altcha/challenge`
    : "/api/altcha/challenge";
  const challengeUrl = (block.challengeUrl as string) || defaultChallengeUrl;

  // Charger le script Altcha et créer le widget
  React.useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    let isMounted = true;
    
    // Nettoyer les widgets existants avant de créer un nouveau
    const existingWidgets = container.querySelectorAll("altcha-widget");
    existingWidgets.forEach((widget) => {
      widget.remove();
    });

    const initializeAltcha = async () => {
      try {
        // Vérifier à nouveau si le composant est toujours monté
        if (!isMounted || !containerRef.current) {
          console.log("[CaptchaBlock] Component not mounted or container missing");
          return;
        }

        console.log("[CaptchaBlock] Starting Altcha initialization...");
        setIsLoading(true);
        setError(null);
        
        // Charger Altcha
        const loaded = await loadAltcha();
        console.log("[CaptchaBlock] loadAltcha returned:", loaded);
        
        if (!loaded) {
          console.error("[CaptchaBlock] Impossible de charger Altcha");
          setIsLoading(false);
          setError("Impossible de charger le widget de vérification. Veuillez rafraîchir la page.");
          return;
        }

        if (!isMounted || !containerRef.current) {
          console.log("[CaptchaBlock] Component unmounted during load");
          return;
        }

        // Vérifier une dernière fois avant de créer le widget
        if (containerRef.current.querySelector("altcha-widget")) {
          console.log("[CaptchaBlock] Widget already exists");
          return;
        }

        console.log("[CaptchaBlock] Creating altcha-widget element...");
        
        // Créer le widget
        const widget = document.createElement("altcha-widget") as any;
        
        if (challengeUrl) {
          widget.setAttribute("challengeurl", challengeUrl);
          console.log("[CaptchaBlock] Challenge URL:", challengeUrl);
        }
        widget.setAttribute("hidelogo", "true");
        widget.setAttribute("hidefooter", "true"); // Masquer le footer pour éviter la duplication
        widget.setAttribute("auto", "onfocus");
        
        // Utiliser le label du bloc si fourni, sinon utiliser le texte par défaut
        const widgetLabel = block.label || "Je ne suis pas un robot";
        
        const strings = {
          label: widgetLabel, // Label pour la checkbox
          error: "La vérification a échoué, merci de réessayer.",
          footer: "", // Pas de footer, masqué avec hidefooter
          verified: "Vérifié !",
          verifying: "En cours de vérification...",
          waitAlert: "Merci de patienter...",
        };
        widget.setAttribute("strings", JSON.stringify(strings));
        
        widget.style.width = "100%";
        widget.style.maxWidth = "400px";

        // Écouter les événements
        const handleStateChange = (event: Event) => {
          if (!isMounted) return;
          const customEvent = event as CustomEvent<{ state: string; payload?: string }>;
          console.log("[CaptchaBlock] State change:", customEvent.detail?.state, "payload:", customEvent.detail?.payload);
          if (customEvent.detail?.state === "verified" && customEvent.detail?.payload) {
            const payload = customEvent.detail.payload;
            console.log("[CaptchaBlock] Calling onChange with payload:", payload, "type:", typeof payload, "length:", payload.length);
            // S'assurer que la valeur est bien une string non vide
            if (payload && typeof payload === "string" && payload.trim().length > 0) {
              onChange(payload);
            } else {
              console.warn("[CaptchaBlock] Invalid payload, not calling onChange:", payload);
            }
          } else if (customEvent.detail?.state === "error" || customEvent.detail?.state === "expired") {
            console.log("[CaptchaBlock] Error or expired, calling onChange(null)");
            onChange(null);
          }
        };

        const handleVerified = (event: Event) => {
          if (!isMounted) return;
          const customEvent = event as CustomEvent<{ payload: string }>;
          const payload = customEvent.detail?.payload;
          console.log("[CaptchaBlock] Verified event:", payload, "type:", typeof payload);
          if (payload && typeof payload === "string" && payload.trim().length > 0) {
            console.log("[CaptchaBlock] Calling onChange with verified payload:", payload, "length:", payload.length);
            onChange(payload);
          } else {
            console.warn("[CaptchaBlock] Invalid verified payload, not calling onChange:", payload);
          }
        };

        widget.addEventListener("statechange", handleStateChange);
        widget.addEventListener("verified", handleVerified);

        // Exposer une méthode pour récupérer la valeur vérifiée directement
        (widget as any).getVerifiedValue = () => {
          try {
            // Essayer de récupérer la valeur depuis le widget Altcha
            const widgetElement = widget as any;
            if (widgetElement.getPayload) {
              return widgetElement.getPayload();
            }
            // Sinon, vérifier l'état
            if (widgetElement.getState && widgetElement.getState() === "verified") {
              // Essayer de récupérer depuis l'attribut name (champ caché)
              const hiddenInput = document.querySelector(`input[name="altcha"]`) as HTMLInputElement;
              if (hiddenInput && hiddenInput.value) {
                return hiddenInput.value;
              }
            }
            return null;
          } catch (error) {
            console.warn("[CaptchaBlock] Error getting verified value:", error);
            return null;
          }
        };

        if (containerRef.current && isMounted) {
          console.log("[CaptchaBlock] Appending widget to container");
          containerRef.current.appendChild(widget);
          widgetRef.current = widget;
          setIsLoading(false);
          console.log("[CaptchaBlock] Widget appended successfully");
        } else {
          console.warn("[CaptchaBlock] Cannot append widget - container or mounted state invalid");
          setIsLoading(false);
          setError("Erreur lors de l'ajout du widget");
        }
      } catch (error) {
        console.error("[CaptchaBlock] Erreur lors du chargement d'Altcha:", error);
        setIsLoading(false);
        setError(error instanceof Error ? error.message : "Erreur inconnue");
      }
    };

    initializeAltcha();

    return () => {
      isMounted = false;
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.removeEventListener("statechange", () => {});
        widgetRef.current.removeEventListener("verified", () => {});
        widgetRef.current.parentNode.removeChild(widgetRef.current);
        widgetRef.current = null;
      }
      // Nettoyer tous les widgets restants
      const remainingWidgets = container.querySelectorAll("altcha-widget");
      remainingWidgets.forEach((widget) => {
        widget.remove();
      });
    };
  }, [challengeUrl, block.label]); // Retirer onChange des dépendances

  return (
    <div className={cn("space-y-4", alignmentClasses[align] === "text-center" && "flex flex-col items-center", alignmentClasses[align] === "text-right" && "flex flex-col items-end")}>
      {(block.label || block.required) && (
        <Label className={cn(
          "text-base font-medium flex items-center gap-2",
          alignmentClasses[align]
        )}>
          <Shield className="h-5 w-5" />
          {block.label || "Vérification anti-spam"}
          {block.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div 
        ref={containerRef}
        className={cn(
          "w-full min-h-[100px]",
          alignmentClasses[align] === "text-center" && "flex justify-center",
          alignmentClasses[align] === "text-right" && "flex justify-end"
        )}
      >
        {/* Le widget Altcha sera inséré ici dynamiquement */}
        {isLoading && !error && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            Chargement de la vérification...
          </div>
        )}
        {error && (
          <div className="p-4 border-2 border-destructive/20 rounded-lg bg-destructive/5 text-sm text-destructive">
            Erreur: {error}
          </div>
        )}
      </div>
    </div>
  );
}

