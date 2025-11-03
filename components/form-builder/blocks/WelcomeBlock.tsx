"use client";

import type { FormBlock } from "@/types";

interface WelcomeBlockProps {
  block: FormBlock;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormBlock>) => void;
}

export function WelcomeBlock({ block, isEditing = false }: WelcomeBlockProps) {
  const title = (block.label as string) || (block.title as string) || "Bienvenue !";
  const description = (block.description as string) || "";

  if (isEditing) {
    return (
      <div className="space-y-4 p-6 border-2 border-dashed border-primary/30 rounded-[14px] bg-primary/5">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          Modifiez ce bloc dans le panneau de propriétés à droite
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

