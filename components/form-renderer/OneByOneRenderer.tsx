"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { useHotkeys } from "@/hooks/useHotkeys";
import { ThankYouPage } from "./ThankYouPage";
import { shouldBlockBeVisible } from "@/lib/form-logic/evaluateVisibility";
import type { Form, FormBlock } from "@/types";
import { MinimalOneByOne } from "./templates/one-by-one/MinimalOneByOne";
import { GlassmorphismOneByOne } from "./templates/one-by-one/GlassmorphismOneByOne";
import { ElegantOneByOne } from "./templates/one-by-one/ElegantOneByOne";
import { ModernOneByOne } from "./templates/one-by-one/ModernOneByOne";
import { NeonOneByOne } from "./templates/one-by-one/NeonOneByOne";
import { BoldOneByOne } from "./templates/one-by-one/BoldOneByOne";

interface OneByOneRendererProps {
  form: Form;
}

export function OneByOneRenderer({ form }: OneByOneRendererProps) {
  // schema_json est directement un array de blocs
  const allBlocks = Array.isArray(form.schema_json) ? form.schema_json : [];
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);

  const { submitForm, isSubmitting } = useFormSubmission(form.id);

  // Filtrer les blocs selon les conditions de visibilité
  const visibleBlocks = useMemo(() => {
    return allBlocks.filter((block) => shouldBlockBeVisible(block, answers, allBlocks));
  }, [allBlocks, answers]);

  // Séparer les blocs welcome du reste (après filtrage)
  const welcomeBlocks = visibleBlocks.filter((b) => b.type === "welcome");
  const blocks = visibleBlocks.filter((b) => b.type !== "welcome");

  const totalBlocks = welcomeBlocks.length + blocks.length;
  
  // Déterminer le bloc actuel et si on est dans les welcome blocks
  const isInWelcomePhase = currentIndex < welcomeBlocks.length;
  let currentBlock: FormBlock | undefined;
  let currentProgressIndex = currentIndex;
  
  if (isInWelcomePhase && welcomeBlocks.length > 0) {
    currentBlock = welcomeBlocks[currentIndex];
  } else if (blocks.length > 0) {
    const formBlockIndex = currentIndex - welcomeBlocks.length;
    if (formBlockIndex >= 0 && formBlockIndex < blocks.length) {
      currentBlock = blocks[formBlockIndex];
    }
  }
  
  const progress = totalBlocks > 0 ? ((currentProgressIndex + 1) / totalBlocks) * 100 : 0;

  // Sauvegarder les réponses dans localStorage
  useEffect(() => {
    const storageKey = `form_${form.id}_answers`;
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, form.id]);

  // Charger les réponses depuis localStorage au montage
  useEffect(() => {
    const storageKey = `form_${form.id}_answers`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
  }, [form.id]);

  const handleAnswer = (blockId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));

    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    // Navigation automatique pour single-choice et yes-no
    if (
      (block.type === "single-choice" || block.type === "yes-no") &&
      currentIndex < blocks.length - 1
    ) {
      setTimeout(() => {
        goToNext(value);
      }, 250);
    }
  };

  // Auto-avancement pour les blocs heading et paragraph
  useEffect(() => {
    if (!currentBlock) return;
    
    // Si le bloc actuel est un titre ou paragraphe, passer automatiquement au suivant
    if (currentBlock.type === "heading" || currentBlock.type === "paragraph") {
      const timer = setTimeout(() => {
        goToNext();
      }, 2000); // Attendre 2 secondes avant de passer au suivant
      
      return () => clearTimeout(timer);
    }
  }, [currentBlock, currentIndex]);

  const goToNext = (newValue?: unknown) => {
    // Valider le bloc actuel s'il est obligatoire
    if (currentBlock && currentBlock.required) {
      // Utiliser la nouvelle valeur si fournie, sinon lire depuis answers
      const answer = newValue !== undefined ? newValue : answers[currentBlock.id];
      
      // Vérifier si la réponse est vide
      const isEmpty = 
        answer === undefined ||
        answer === null ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0);
      
      if (isEmpty) {
        // Afficher une erreur
        setSubmissionError(`Ce champ est obligatoire`);
        return; // Bloquer la navigation
      }
    }
    
    // Effacer l'erreur si tout est OK
    setSubmissionError(null);
    
    // Si on est dans les blocs welcome
    if (currentIndex < welcomeBlocks.length - 1) {
      // Passer au prochain bloc welcome
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex < welcomeBlocks.length) {
      // Dernier bloc welcome, passer au premier bloc formulaire
      setCurrentIndex((prev) => prev + 1);
    } else {
      // On est dans les blocs du formulaire
      const formBlockIndex = currentIndex - welcomeBlocks.length;
      if (formBlockIndex < blocks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Réajuster l'index si le bloc actuel devient invisible
  useEffect(() => {
    if (!currentBlock || welcomeBlocks.length === 0 && blocks.length === 0) return;
    
    const isCurrentBlockVisible = shouldBlockBeVisible(currentBlock, answers, allBlocks);
    
    if (!isCurrentBlockVisible) {
      // Le bloc actuel est devenu invisible, trouver le prochain bloc visible
      const totalVisible = welcomeBlocks.length + blocks.length;
      if (currentIndex < totalVisible - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (blocks.length > 0) {
        // Plus de blocs visibles, soumettre si on a des blocs formulaire
        handleSubmit();
      }
    }
  }, [answers, visibleBlocks, currentBlock]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      // Si on passe du premier bloc formulaire au dernier bloc welcome
      if (currentIndex === welcomeBlocks.length) {
        // Aller au dernier bloc welcome
        setCurrentIndex(welcomeBlocks.length - 1);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmissionError(null);
    const result = await submitForm(answers, Date.now() - startTime);
    
    if (result.success) {
      setIsSubmitted(true);
      // Nettoyer le localStorage après soumission réussie
      const storageKey = `form_${form.id}_answers`;
      localStorage.removeItem(storageKey);
    } else {
      setSubmissionError(result.error || "Erreur lors de la soumission");
    }
  };

  // Hotkeys
  useHotkeys({
    onNext: goToNext,
    onPrevious: goToPrevious,
    onSelectOption: (index: number) => {
      if (currentBlock?.type === "single-choice" && currentBlock.options) {
        const optionIndex = index - 1; // 1-9 -> 0-8
        if (optionIndex >= 0 && optionIndex < currentBlock.options.length) {
          handleAnswer(currentBlock.id, currentBlock.options[optionIndex]);
        }
      }
    },
    enabled: !isSubmitted && !isSubmitting,
  });

  if (isSubmitted) {
    return <ThankYouPage form={form} />;
  }

  if (visibleBlocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Ce formulaire est vide</p>
      </div>
    );
  }

  // Le bouton suivant doit apparaître pour TOUS les blocs formulaire (pas welcome)
  // Mais pas pour les blocs heading et paragraph qui s'affichent automatiquement
  const isAfterWelcome = currentIndex >= welcomeBlocks.length;
  const isFormBlock = currentBlock && currentBlock.type !== "welcome";
  const isAutoAdvanceBlock = currentBlock && (currentBlock.type === "heading" || currentBlock.type === "paragraph");
  
  const showNextButton = !!(currentBlock && isAfterWelcome && isFormBlock && !isAutoAdvanceBlock);

  const showPreviousButton = currentIndex > 0;

  // Obtenir le style du template depuis le thème
  const theme = form.theme_json || {};
  const templateStyle = theme.style || "minimal";

  // Sélectionner le template approprié selon le style
  const templateProps = {
    form,
    welcomeBlocks,
    blocks,
    currentIndex,
    answers,
    progress,
    onAnswer: handleAnswer,
    onNext: goToNext,
    onPrevious: goToPrevious,
    onSubmit: handleSubmit,
    isSubmitting,
    showNextButton,
    showPreviousButton,
    error: submissionError,
  };

  switch (templateStyle) {
    case "minimal":
      return <MinimalOneByOne {...templateProps} />;
    case "glassmorphism":
      return <GlassmorphismOneByOne {...templateProps} />;
    case "elegant":
      return <ElegantOneByOne {...templateProps} />;
    case "modern":
      return <ModernOneByOne {...templateProps} />;
    case "neon":
      return <NeonOneByOne {...templateProps} />;
    case "bold":
      return <BoldOneByOne {...templateProps} />;
    default:
      return <MinimalOneByOne {...templateProps} />;
  }
}
