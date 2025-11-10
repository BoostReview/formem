"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { useHotkeys } from "@/hooks/useHotkeys";
import { ThankYouPage } from "./ThankYouPage";
import { shouldBlockBeVisible } from "@/lib/form-logic/evaluateVisibility";
import { validateBlock } from "@/lib/form-validation/validateBlock";
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
  // Garder une trace des blocs avec lesquels l'utilisateur a interagi
  const [interactedBlocks, setInteractedBlocks] = useState<Set<string>>(new Set());
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
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    const previousValue = answers[blockId];
    
    // RÈGLE PRINCIPALE : Pour single-choice et yes-no
    // Si une valeur valide était déjà sélectionnée, NE JAMAIS afficher d'erreur
    if (block.type === "single-choice" || block.type === "yes-no") {
      // Vérifier si une valeur valide existait déjà
      if (previousValue !== undefined && previousValue !== null && previousValue !== "") {
        const previousValidation = validateBlock(block, previousValue, false);
        if (previousValidation.isValid) {
          // Une valeur valide existe déjà - ne jamais afficher d'erreur
          setSubmissionError(null);
          
          // Si la nouvelle valeur est vide, identique, ou invalide, garder l'ancienne valeur
          if (value === undefined || value === null || value === "" || value === previousValue) {
            // Ne rien faire, garder la valeur précédente
            return;
          }
          
          // Si nouvelle valeur différente et valide, mettre à jour
          const newValidation = validateBlock(block, value, false);
          if (newValidation.isValid) {
            setAnswers((prev) => ({ ...prev, [blockId]: value }));
            if (currentIndex < blocks.length - 1) {
              setTimeout(() => goToNext(value), 250);
            }
          }
          // Si nouvelle valeur invalide, garder l'ancienne (déjà dans answers)
          return;
        }
      }
      
      // Si pas de valeur précédente valide, continuer avec la logique normale
    }

    // Mettre à jour les answers
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
    
    // Marquer ce bloc comme interagi
    setInteractedBlocks((prev) => new Set(prev).add(blockId));

    // Effacer l'erreur si l'utilisateur entre une valeur
    if (value !== undefined && value !== null && value !== "") {
      setSubmissionError(null);
    }

    // Navigation automatique pour single-choice et yes-no
    if (
      (block.type === "single-choice" || block.type === "yes-no") &&
      currentIndex < blocks.length - 1
    ) {
      const validation = validateBlock(block, value, false);
      if (validation.isValid) {
        setTimeout(() => goToNext(value), 250);
      } else {
        // Afficher l'erreur SEULEMENT si le champ était vraiment vide avant
        // ET que la nouvelle valeur est aussi vide/invalide
        if ((previousValue === undefined || previousValue === null || previousValue === "") &&
            (value === undefined || value === null || value === "")) {
          console.error("❌ [ERREUR AFFICHÉE] handleAnswer - ligne 137:", {
            blockId,
            blockType: block.type,
            blockLabel: block.label,
            previousValue,
            value,
            validationError: validation.error
          });
          setSubmissionError(validation.error || "Ce champ est obligatoire");
        }
      }
    }
  };

  // Auto-avancement pour les blocs paragraph uniquement (pas pour heading)
  useEffect(() => {
    if (!currentBlock) return;
    
    // Si le bloc actuel est un paragraphe (mais pas un heading), passer automatiquement au suivant
    if (currentBlock.type === "paragraph") {
      const timer = setTimeout(() => {
        goToNext();
      }, 2000); // Attendre 2 secondes avant de passer au suivant
      
      return () => clearTimeout(timer);
    }
  }, [currentBlock, currentIndex]);

  const goToNext = (newValue?: unknown) => {
    // Ignorer si newValue est un événement React (SyntheticBaseEvent)
    if (newValue && typeof newValue === "object" && "nativeEvent" in newValue) {
      newValue = undefined;
    }
    
    // Si le bloc actuel est un heading et qu'il y a un bloc suivant affiché, valider le bloc suivant
    if (currentBlock && currentBlock.type === "heading" && !isInWelcomePhase) {
      const formBlockIndex = currentIndex - welcomeBlocks.length;
      if (formBlockIndex >= 0 && formBlockIndex < blocks.length - 1) {
        const nextBlock = blocks[formBlockIndex + 1];
        // Utiliser newValue si fourni, sinon chercher dans answers
        // newValue peut être la valeur qui vient d'être sélectionnée
        let answer = newValue !== undefined ? newValue : answers[nextBlock.id];
        
        // Pour single-choice et yes-no : si answer est vide mais qu'une valeur valide existe dans answers, l'utiliser
        if ((nextBlock.type === "single-choice" || nextBlock.type === "yes-no")) {
          if (answer === undefined || answer === null || answer === "") {
            const existingAnswer = answers[nextBlock.id];
            if (existingAnswer !== undefined && existingAnswer !== null && existingAnswer !== "") {
              const existingValidation = validateBlock(nextBlock, existingAnswer, false);
              if (existingValidation.isValid) {
                // Une valeur valide existe déjà - l'utiliser
                answer = existingAnswer;
              }
            }
          }
        }
        
        const validation = validateBlock(nextBlock, answer, false);
        
        if (!validation.isValid) {
          // Pour single-choice et yes-no : vérifier si une valeur valide existe déjà
          if ((nextBlock.type === "single-choice" || nextBlock.type === "yes-no")) {
            const existingAnswer = answers[nextBlock.id];
            if (existingAnswer !== undefined && existingAnswer !== null && existingAnswer !== "") {
              const existingValidation = validateBlock(nextBlock, existingAnswer, false);
              if (existingValidation.isValid) {
                // Une valeur valide existe déjà - l'utiliser et continuer sans erreur
                answer = existingAnswer;
                setAnswers((prev) => ({ ...prev, [nextBlock.id]: existingAnswer }));
                // Ne pas afficher d'erreur, continuer la navigation
              } else {
                console.error("❌ [ERREUR AFFICHÉE] goToNext - ligne 182 (heading, existingAnswer invalide):", {
                  blockId: nextBlock.id,
                  blockType: nextBlock.type,
                  blockLabel: nextBlock.label,
                  answer,
                  existingAnswer,
                  newValue,
                  validationError: validation.error
                });
                setSubmissionError(validation.error || "Ce champ est obligatoire");
                return;
              }
            } else {
              console.error("❌ [ERREUR AFFICHÉE] goToNext - ligne 182 (heading, pas d'existingAnswer):", {
                blockId: nextBlock.id,
                blockType: nextBlock.type,
                blockLabel: nextBlock.label,
                answer,
                newValue,
                allAnswers: answers,
                validationError: validation.error
              });
              setSubmissionError(validation.error || "Ce champ est obligatoire");
              return;
            }
          } else {
            // Pour les autres types : si le bloc est obligatoire, BLOQUER TOUJOURS
            if (nextBlock.required) {
              console.error("❌ [ERREUR AFFICHÉE] goToNext - heading, bloc suivant obligatoire non rempli:", {
                blockId: nextBlock.id,
                blockType: nextBlock.type,
                blockLabel: nextBlock.label,
                blockRequired: nextBlock.required,
                answer,
                newValue,
                validationError: validation.error
              });
              setSubmissionError(validation.error || "Ce champ est obligatoire");
              return; // BLOQUER la navigation
            }
            // Si le bloc suivant n'est pas obligatoire, on peut continuer
          }
        }
        
        // Si la validation passe, passer au bloc suivant (qui est déjà affiché)
        setSubmissionError(null);
        if (formBlockIndex + 1 < blocks.length - 1) {
          setCurrentIndex((prev) => prev + 2); // Passer au bloc après le bloc suivant
        } else {
          handleSubmit();
        }
        return;
      }
    }
    
    // Recalculer currentBlock pour être sûr qu'il est à jour
    let currentBlockToValidate: FormBlock | undefined;
    if (isInWelcomePhase && welcomeBlocks.length > 0) {
      currentBlockToValidate = welcomeBlocks[currentIndex];
    } else if (blocks.length > 0) {
      const formBlockIndex = currentIndex - welcomeBlocks.length;
      if (formBlockIndex >= 0 && formBlockIndex < blocks.length) {
        currentBlockToValidate = blocks[formBlockIndex];
      }
    }
    
    // Valider le bloc actuel (validation basique : juste vérifier si rempli, pas le format)
    if (!currentBlockToValidate) {
      console.error("❌ [ERREUR] goToNext - currentBlockToValidate est undefined:", {
        currentIndex,
        isInWelcomePhase,
        welcomeBlocksLength: welcomeBlocks.length,
        blocksLength: blocks.length,
        formBlockIndex: isInWelcomePhase ? currentIndex : currentIndex - welcomeBlocks.length
      });
      return; // Ne pas continuer si le bloc n'existe pas
    }
    
    if (currentBlockToValidate) {
      // Utiliser la nouvelle valeur si fournie, sinon lire depuis answers
      let answer = newValue !== undefined ? newValue : answers[currentBlockToValidate.id];
      
      // Pour le CAPTCHA, essayer de récupérer la valeur directement depuis le widget si elle n'est pas dans answers
      if (currentBlockToValidate.type === "captcha" && (!answer || answer === null || answer === "")) {
        try {
          // Essayer de récupérer depuis le widget Altcha directement
          const captchaWidget = document.querySelector(`altcha-widget`) as any;
          if (captchaWidget) {
            // Essayer getPayload() si disponible
            if (captchaWidget.getPayload && typeof captchaWidget.getPayload === "function") {
              const payload = captchaWidget.getPayload();
              if (payload) {
                console.log("[OneByOneRenderer] Found CAPTCHA payload from widget.getPayload():", payload);
                answer = payload;
                setAnswers((prev) => ({ ...prev, [currentBlockToValidate.id]: payload }));
              }
            }
            // Sinon, essayer getState() et récupérer depuis le champ caché
            if ((!answer || answer === null || answer === "") && captchaWidget.getState) {
              const state = captchaWidget.getState();
              console.log("[OneByOneRenderer] CAPTCHA widget state:", state);
              if (state === "verified") {
                // Chercher le champ caché (Altcha crée un input avec name="altcha" par défaut)
                const hiddenInput = document.querySelector(`input[name="altcha"]`) as HTMLInputElement;
                if (hiddenInput && hiddenInput.value) {
                  console.log("[OneByOneRenderer] Found CAPTCHA value from hidden input:", hiddenInput.value);
                  answer = hiddenInput.value;
                  setAnswers((prev) => ({ ...prev, [currentBlockToValidate.id]: hiddenInput.value }));
                }
              }
            }
          }
        } catch (error) {
          console.warn("[OneByOneRenderer] Error getting CAPTCHA value:", error);
        }
      }
      
      // Validation non stricte : on vérifie seulement si le champ est rempli, pas le format
      // La validation stricte du format se fera lors de la soumission finale
      const validation = validateBlock(currentBlockToValidate, answer, false);
      
      if (!validation.isValid) {
        // Pour single-choice et yes-no : vérifier si une valeur valide existe déjà dans answers
        if ((currentBlockToValidate.type === "single-choice" || currentBlockToValidate.type === "yes-no")) {
          const existingAnswer = answers[currentBlockToValidate.id];
          if (existingAnswer !== undefined && existingAnswer !== null && existingAnswer !== "") {
            const existingValidation = validateBlock(currentBlockToValidate, existingAnswer, false);
            if (existingValidation.isValid) {
              // Une valeur valide existe déjà - l'utiliser et continuer sans erreur
              answer = existingAnswer;
              setAnswers((prev) => ({ ...prev, [currentBlockToValidate.id]: existingAnswer }));
              // Ne pas afficher d'erreur, continuer la navigation
            } else {
              // La valeur existante n'est pas valide, afficher l'erreur
              console.error("❌ [ERREUR AFFICHÉE] goToNext - ligne 257 (existingAnswer invalide):", {
                blockId: currentBlockToValidate?.id || "UNKNOWN",
                blockType: currentBlockToValidate?.type || "UNKNOWN",
                blockLabel: currentBlockToValidate?.label || "UNKNOWN",
                existingAnswer,
                answer,
                validationError: validation.error
              });
              setSubmissionError(validation.error || "Ce champ est obligatoire");
              return;
            }
          } else {
            // Pas de valeur existante, afficher l'erreur
            console.error("❌ [ERREUR AFFICHÉE] goToNext - ligne 262 (pas d'existingAnswer):", {
              blockId: currentBlockToValidate?.id || "UNKNOWN",
              blockType: currentBlockToValidate?.type || "UNKNOWN",
              blockLabel: currentBlockToValidate?.label || "UNKNOWN",
              answer,
              allAnswers: answers,
              validationError: validation.error
            });
            setSubmissionError(validation.error || "Ce champ est obligatoire");
            return;
          }
        } else {
          // Pour les autres types, vérifier si le bloc est vraiment obligatoire
          // Certains blocs comme paragraph, heading, welcome ne devraient pas bloquer
          if (currentBlockToValidate.type === "paragraph" || 
              currentBlockToValidate.type === "heading" || 
              currentBlockToValidate.type === "welcome" ||
              currentBlockToValidate.type === "image" ||
              currentBlockToValidate.type === "youtube") {
            // Ces types ne devraient pas bloquer la navigation même s'ils sont "invalides"
            console.log("[OneByOneRenderer] goToNext: Bloc non-bloquant ignoré:", currentBlockToValidate.type);
            // Continuer la navigation
          } else {
            // Pour les champs obligatoires : BLOQUER TOUJOURS la navigation si non rempli
            // Ne pas vérifier hasInteracted - si c'est obligatoire, ça doit être rempli maintenant
            if (currentBlockToValidate && currentBlockToValidate.required) {
              console.error("❌ [ERREUR AFFICHÉE] goToNext - champ obligatoire non rempli:", {
                blockId: currentBlockToValidate?.id || "UNKNOWN",
                blockType: currentBlockToValidate?.type || "UNKNOWN",
                blockLabel: currentBlockToValidate?.label || "UNKNOWN",
                blockRequired: currentBlockToValidate?.required || false,
                answer,
                answerType: typeof answer,
                newValue,
                allAnswers: answers,
                validationError: validation.error,
                currentIndex,
                isInWelcomePhase,
                welcomeBlocksLength: welcomeBlocks.length,
                blocksLength: blocks.length,
                currentBlockToValidateExists: !!currentBlockToValidate,
                formBlockIndex: isInWelcomePhase ? currentIndex : currentIndex - welcomeBlocks.length
              });
              
              setSubmissionError(validation.error || "Ce champ est obligatoire");
              return; // BLOQUER la navigation
            }
            // Si le bloc n'est pas obligatoire, on peut continuer (l'erreur s'affichera lors de la soumission finale si nécessaire)
          }
        }
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
    // Valider tous les blocs visibles avant de soumettre (validation STRICTE)
    const formBlocks = blocks.filter((b) => b.type !== "welcome");
    const validationErrors: string[] = [];
    
    formBlocks.forEach((block) => {
      const answer = answers[block.id];
      // Validation stricte : vérifier le format (email, téléphone, etc.)
      const validation = validateBlock(block, answer, true);
      
      if (!validation.isValid) {
        validationErrors.push(validation.error || "Ce champ est invalide");
      }
    });
    
    if (validationErrors.length > 0) {
      setSubmissionError(validationErrors[0] || "Veuillez corriger les erreurs");
      // Revenir au premier bloc avec erreur pour que l'utilisateur puisse le corriger
      const firstErrorBlock = formBlocks.find((block) => {
        const answer = answers[block.id];
        const validation = validateBlock(block, answer, true);
        return !validation.isValid;
      });
      if (firstErrorBlock) {
        const errorIndex = welcomeBlocks.length + blocks.findIndex((b) => b.id === firstErrorBlock.id);
        if (errorIndex >= 0) {
          setCurrentIndex(errorIndex);
        }
      }
      return;
    }
    
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
  // Mais pas pour les blocs paragraph qui s'affichent automatiquement
  // Les blocs heading doivent avoir un bouton suivant pour passer au bloc suivant
  const isAfterWelcome = currentIndex >= welcomeBlocks.length;
  const isFormBlock = currentBlock && currentBlock.type !== "welcome";
  const isAutoAdvanceBlock = currentBlock && currentBlock.type === "paragraph";
  
  const showNextButton = !!(currentBlock && isAfterWelcome && isFormBlock && !isAutoAdvanceBlock);
  
  // Si le bloc actuel est un heading, trouver le bloc suivant pour l'afficher avec
  let nextBlockForHeading: FormBlock | undefined;
  if (currentBlock && currentBlock.type === "heading" && !isInWelcomePhase) {
    const formBlockIndex = currentIndex - welcomeBlocks.length;
    if (formBlockIndex >= 0 && formBlockIndex < blocks.length - 1) {
      nextBlockForHeading = blocks[formBlockIndex + 1];
    }
  }

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
    nextBlockForHeading, // Passer le bloc suivant si on est sur un heading
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
