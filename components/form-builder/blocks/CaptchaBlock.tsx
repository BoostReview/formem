"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";
import { loadAltcha } from "@/lib/altcha-loader";

interface CaptchaBlockProps {
  block: FormBlock;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormBlock>) => void;
}

export function CaptchaBlock({ block, isEditing, onUpdate }: CaptchaBlockProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetRef = React.useRef<HTMLElement | null>(null);
  const align = getAlignment(block as any);
  // Utiliser l'URL du challenge configurée ou l'endpoint par défaut (URL absolue)
  const defaultChallengeUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/altcha/challenge`
    : "/api/altcha/challenge";
  const challengeUrl = (block.challengeUrl as string) || defaultChallengeUrl;

  // Charger le script Altcha et créer le widget (seulement en mode non-édition)
  React.useEffect(() => {
    if (typeof window === "undefined" || isEditing || !containerRef.current) return;

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
        if (!isMounted || !containerRef.current) return;

        // Charger Altcha
        const loaded = await loadAltcha();
        if (!loaded || !isMounted || !containerRef.current) {
          console.error("Impossible de charger Altcha");
          return;
        }

        // Vérifier une dernière fois avant de créer le widget
        if (containerRef.current.querySelector("altcha-widget")) {
          return;
        }

        // Créer le widget
        const widget = document.createElement("altcha-widget") as any;
        
        if (challengeUrl) {
          widget.setAttribute("challengeurl", challengeUrl);
        }
        widget.setAttribute("hidelogo", "true");
        widget.setAttribute("auto", "onfocus");
        
        const strings = {
          label: block.label || "Je ne suis pas un robot",
          error: "La vérification a échoué, merci de réessayer.",
          footer: "Nous garantissons le traitement de ces données selon notre politique de confidentialité.",
          verified: "Vérifié !",
          verifying: "En cours de vérification...",
          waitAlert: "Merci de patienter...",
        };
        widget.setAttribute("strings", JSON.stringify(strings));
        
        widget.style.width = "100%";
        widget.style.maxWidth = "400px";

        if (containerRef.current && isMounted) {
          containerRef.current.appendChild(widget);
          widgetRef.current = widget;
        }
      } catch (error) {
        console.error("Erreur lors du chargement d'Altcha:", error);
      }
    };

    initializeAltcha();

    return () => {
      isMounted = false;
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current);
        widgetRef.current = null;
      }
      // Nettoyer tous les widgets restants
      const remainingWidgets = container.querySelectorAll("altcha-widget");
      remainingWidgets.forEach((widget) => {
        widget.remove();
      });
    };
  }, [isEditing, challengeUrl, block.label]);

  if (isEditing) {
    return (
      <div className="space-y-3">
        {onUpdate ? (
          <Input
            type="text"
            value={block.label || ""}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label de la vérification"
            className={cn(
              "text-base font-medium h-auto py-1 border-dashed",
              alignmentClasses[align]
            )}
          />
        ) : (
          <div className={cn("flex items-center gap-2", alignmentClasses[align])}>
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base font-medium">
              {block.label || "Vérification anti-spam"}
            </Label>
          </div>
        )}
        <div className="p-6 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-primary/60" />
            <span className="text-sm text-muted-foreground font-medium">
              Altcha - Vérification anti-spam
            </span>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Le widget Altcha s'affichera dans le formulaire public
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", alignmentClasses[align] === "text-center" && "flex flex-col items-center", alignmentClasses[align] === "text-right" && "flex flex-col items-end")}>
      <Label className={cn(
        "text-base font-medium flex items-center gap-2",
        alignmentClasses[align]
      )}>
        <Shield className="h-4 w-4" />
        {block.label || "Vérification anti-spam"}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div 
        ref={containerRef}
        className={cn(
          "w-full",
          alignmentClasses[align] === "text-center" && "flex justify-center",
          alignmentClasses[align] === "text-right" && "flex justify-end"
        )}
      />
    </div>
  );
}


