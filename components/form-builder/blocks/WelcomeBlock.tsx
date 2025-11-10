"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicButtonPreview } from "../DynamicButtonPreview";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { ArrowRight } from "lucide-react";
import type { FormBlock } from "@/types";

interface WelcomeBlockProps {
  block: FormBlock;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormBlock>) => void;
}

export function WelcomeBlock({ block, isEditing = false, onUpdate }: WelcomeBlockProps) {
  const title = (block.label as string) || (block.title as string) || "Bienvenue !";
  const description = (block.description as string) || "";
  const { theme } = useFormBuilder();

  if (isEditing) {
    return (
      <div className="space-y-6 p-6 border-2 border-dashed border-primary/30 rounded-[14px] bg-primary/5">
        <div className="text-center space-y-4">
          <Input
            value={title}
            onChange={(e) => onUpdate?.({ label: e.target.value })}
            placeholder="Titre de bienvenue"
            className="text-3xl sm:text-4xl font-bold text-center h-auto py-3"
          />
          <Textarea
            value={description}
            onChange={(e) => onUpdate?.({ description: e.target.value })}
            placeholder="Description de bienvenue..."
            className="text-base sm:text-lg text-muted-foreground text-center resize-none"
            rows={3}
          />
        </div>
        <div className="flex justify-center pt-2">
          <DynamicButtonPreview theme={theme} disabled className="cursor-not-allowed">
            Commencer
            <ArrowRight className="h-5 w-5 ml-2" />
          </DynamicButtonPreview>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Aperçu du bouton avec votre style personnalisé
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

