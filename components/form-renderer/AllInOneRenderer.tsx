"use client";

import { useState, useRef, useMemo } from "react";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { ThankYouPage } from "./ThankYouPage";
import { shouldBlockBeVisible } from "@/lib/form-logic/evaluateVisibility";
import { validateBlock } from "@/lib/form-validation/validateBlock";
import type { Form } from "@/types";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { GlassmorphismTemplate } from "./templates/GlassmorphismTemplate";
import { NeonTemplate } from "./templates/NeonTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { BoldTemplate } from "./templates/BoldTemplate";

interface AllInOneRendererProps {
  form: Form;
}

export function AllInOneRenderer({ form }: AllInOneRendererProps) {
  // schema_json est directement un array de blocs
  const blocks = Array.isArray(form.schema_json) ? form.schema_json : [];
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { submitForm, isSubmitting } = useFormSubmission(form.id);

  // Filtrer les blocs selon les conditions de visibilité (DOIT être avant les early returns)
  const visibleBlocks = useMemo(() => {
    return blocks.filter((block) => shouldBlockBeVisible(block, answers, blocks));
  }, [blocks, answers]);

  const handleAnswer = (blockId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
    // Effacer l'erreur pour ce bloc
    if (errors[blockId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[blockId];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const formBlocks = visibleBlocks.filter((b) => b.type !== "welcome");
    const newErrors: Record<string, string> = {};

    // Valider uniquement les blocs visibles avec la fonction de validation complète
    formBlocks.forEach((block) => {
      const answer = answers[block.id];
      const validation = validateBlock(block, answer);
      
      if (!validation.isValid) {
        newErrors[block.id] = validation.error || "Ce champ est invalide";
      }
    });

    setErrors(newErrors);

    // Scroll vers la première erreur
    if (Object.keys(newErrors).length > 0) {
      const firstErrorId = Object.keys(newErrors)[0];
      const errorElement = errorRefs.current[firstErrorId];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmissionError(null);
    const result = await submitForm(answers, Date.now() - startTime);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmissionError(result.error || "Erreur lors de la soumission");
    }
  };

  // Early returns APRÈS tous les hooks
  if (isSubmitted) {
    return <ThankYouPage form={form} />;
  }

  if (blocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Ce formulaire est vide</p>
      </div>
    );
  }

  // Obtenir le style du template depuis le thème
  const theme = form.theme_json || {};
  const templateStyle = theme.style || "minimal";

  // Sélectionner le template approprié selon le style
  const templateProps = {
    form,
    blocks: visibleBlocks,
    answers,
    errors,
    errorRefs,
    onAnswer: handleAnswer,
    onSubmit: handleSubmit,
    isSubmitting,
  };

  switch (templateStyle) {
    case "minimal":
      return <MinimalTemplate {...templateProps} />;
    case "glassmorphism":
      return <GlassmorphismTemplate {...templateProps} />;
    case "neon":
      return <NeonTemplate {...templateProps} />;
    case "elegant":
      return <ElegantTemplate {...templateProps} />;
    case "modern":
      return <ModernTemplate {...templateProps} />;
    case "bold":
      return <BoldTemplate {...templateProps} />;
    default:
      return <MinimalTemplate {...templateProps} />;
  }
}
