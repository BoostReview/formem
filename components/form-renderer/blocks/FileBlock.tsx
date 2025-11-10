"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Loader2, Check } from "lucide-react";
import type { FormBlock } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAlignment, alignmentClasses } from "@/lib/block-alignment";

interface FileBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function FileBlock({ block, value, onChange }: FileBlockProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>(
    Array.isArray(value) ? value : (value ? [value] : [])
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const helpText = (block.helpText as string) || "";
  const maxSizeMB = (block.maxFileSize as number) || 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedTypes = (block.allowedTypes as string[]) || [];
  const multiple = (block.multiple as boolean) || false;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Vérifier les types de fichiers
    if (allowedTypes.length > 0) {
      const invalidFiles = files.filter(
        (file) => !allowedTypes.some((type) => file.type.includes(type) || file.name.endsWith(type))
      );
      if (invalidFiles.length > 0) {
        toast.error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(", ")}`);
        return;
      }
    }

    // Vérifier la taille
    const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Fichier(s) trop volumineux (max ${maxSizeMB}MB)`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'upload");
        }

        const result = await response.json();
        return {
          fileName: result.fileName,
          originalName: result.originalName,
          fileUrl: result.fileUrl,
          size: result.size,
          type: result.type,
        };
      });

      const uploaded = await Promise.all(uploadPromises);
      
      if (multiple) {
        const newFiles = [...uploadedFiles, ...uploaded];
        setUploadedFiles(newFiles);
        onChange(newFiles);
      } else {
        setUploadedFiles([uploaded[0]]);
        onChange(uploaded[0]);
      }
      
      toast.success(`${uploaded.length} fichier(s) uploadé(s) avec succès !`);
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index?: number) => {
    if (multiple && index !== undefined) {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      onChange(newFiles);
    } else {
      setUploadedFiles([]);
      onChange(multiple ? [] : null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const displayFiles = multiple ? uploadedFiles : (uploadedFiles[0] ? [uploadedFiles[0]] : []);
  const align = getAlignment(block as any)

  return (
    <div className="space-y-3 pt-6">
      <Label className={cn(
        "text-lg sm:text-xl font-medium block text-gray-900 dark:text-slate-100 leading-tight",
        alignmentClasses[align]
      )}>
        {block.label || "Télécharger un fichier"}
        {block.required && <span className="text-red-500 ml-1.5 text-base">*</span>}
      </Label>
      {helpText && (
        <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
          {helpText}
        </p>
      )}

      {displayFiles.length === 0 ? (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
            multiple={multiple}
            accept={allowedTypes.length > 0 ? allowedTypes.join(",") : undefined}
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              {uploading ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {uploading
                  ? "Upload en cours..."
                  : "Cliquez ou glissez un fichier"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Taille max: {maxSizeMB}MB
                {allowedTypes.length > 0 && ` • Types: ${allowedTypes.join(", ")}`}
                {multiple && " • Plusieurs fichiers autorisés"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {displayFiles.map((file, index) => (
            <div key={index} className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="p-1 rounded-full bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="ml-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {multiple && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Ajouter un autre fichier
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

