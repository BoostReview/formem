"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface FileBlockProps {
  block: FormBlock;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormBlock>) => void;
}

export function FileBlock({ block, isEditing = false, onUpdate }: FileBlockProps) {
  const label = block.label || "Télécharger un fichier";
  const helpText = (block.helpText as string) || "";
  const maxSizeMB = (block.maxFileSize as number) || 10;
  const allowedTypes = (block.allowedTypes as string[]) || [];
  const multiple = (block.multiple as boolean) || false;
  const align = getAlignment(block as any)

  if (isEditing) {
    return (
      <div className="space-y-3">
        {onUpdate ? (
          <Input
            value={label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Label du champ"
            className={cn(
              "text-base font-medium h-auto py-1 border-dashed",
              alignmentClasses[align]
            )}
          />
        ) : (
          <Label className={cn(
            "text-base font-medium block",
            alignmentClasses[align]
          )}>
            {label}
            {block.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {helpText && (
          <p className="text-sm text-muted-foreground -mt-1">
            {helpText}
          </p>
        )}

        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Cliquez ou glissez un fichier
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Taille max: {maxSizeMB}MB
                {allowedTypes.length > 0 && ` • Types: ${allowedTypes.join(", ")}`}
                {multiple && " • Plusieurs fichiers"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {label}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {helpText && (
        <p className="text-sm text-muted-foreground -mt-1">
          {helpText}
        </p>
      )}

      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 cursor-not-allowed opacity-60">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Aperçu uniquement
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Taille max: {maxSizeMB}MB
              {allowedTypes.length > 0 && ` • Types: ${allowedTypes.join(", ")}`}
              {multiple && " • Plusieurs fichiers"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

