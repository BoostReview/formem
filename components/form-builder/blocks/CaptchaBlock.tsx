"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import type { FormBlock } from "@/types";

interface CaptchaBlockProps {
  block: FormBlock;
  isEditing?: boolean;
  onUpdate: (updates: Partial<FormBlock>) => void;
}

export function CaptchaBlock({ block, isEditing, onUpdate }: CaptchaBlockProps) {
  if (!isEditing) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {block.label || "Vérification de sécurité"}
          <span className="text-red-500">*</span>
        </Label>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center gap-3">
          <Shield className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">Le CAPTCHA s'affichera ici</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={block.label || ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Label du CAPTCHA"
          className="text-base font-semibold"
        />
      </div>
      <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex items-center justify-center gap-3">
        <Shield className="h-6 w-6 text-primary/60" />
        <span className="text-sm text-muted-foreground">CAPTCHA (obligatoire)</span>
      </div>
      <p className="text-xs text-muted-foreground">
        ℹ️ Protège le formulaire contre les bots et le spam
      </p>
    </div>
  );
}

