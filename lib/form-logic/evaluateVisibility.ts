import type { FormBlock } from "@/types";

/**
 * Évalue une condition unique
 */
function evaluateCondition(
  condition: {
    blockId: string;
    operator: string;
    value: string;
  },
  answers: Record<string, unknown>,
  allBlocks: FormBlock[]
): boolean {
  const answerValue = answers[condition.blockId];
  const conditionValue = condition.value;

  // Si pas de réponse, la condition est fausse
  if (answerValue === undefined || answerValue === null || answerValue === "") {
    return false;
  }

  // Trouver le bloc référencé pour connaître son type
  const referencedBlock = allBlocks.find((b) => b.id === condition.blockId);
  if (!referencedBlock) {
    return false;
  }

  // Convertir la réponse en string pour la comparaison
  const answerStr = String(answerValue);
  const conditionStr = String(conditionValue);

  switch (condition.operator) {
    case "equals":
      return answerStr === conditionStr;
    case "not-equals":
      return answerStr !== conditionStr;
    case "contains":
      return answerStr.includes(conditionStr);
    case "greater-than":
      const answerNum = Number(answerValue);
      const conditionNum = Number(conditionValue);
      if (!isNaN(answerNum) && !isNaN(conditionNum)) {
        return answerNum > conditionNum;
      }
      return false;
    case "less-than":
      const answerNum2 = Number(answerValue);
      const conditionNum2 = Number(conditionValue);
      if (!isNaN(answerNum2) && !isNaN(conditionNum2)) {
        return answerNum2 < conditionNum2;
      }
      return false;
    default:
      return false;
  }
}

/**
 * Évalue une règle de visibilité complète
 */
function evaluateRule(
  rule: {
    action: "show" | "hide";
    operator: "and" | "or";
    conditions: Array<{
      id?: string;
      blockId: string;
      operator: string;
      value: string;
    }>;
  },
  answers: Record<string, unknown>,
  allBlocks: FormBlock[]
): boolean {
  if (!rule.conditions || rule.conditions.length === 0) {
    // Pas de conditions = la règle ne s'applique pas
    return false;
  }

  // Évaluer toutes les conditions
  const conditionResults = rule.conditions.map((condition) =>
    evaluateCondition(condition, answers, allBlocks)
  );

  // Combiner avec ET ou OU
  let ruleMatches: boolean;
  if (rule.operator === "and") {
    ruleMatches = conditionResults.every((result) => result === true);
  } else {
    // OU
    ruleMatches = conditionResults.some((result) => result === true);
  }

  // Retourner true si la règle correspond (les conditions sont vraies)
  // L'action sera appliquée ensuite dans shouldBlockBeVisible
  return ruleMatches;
}

/**
 * Détermine si un bloc doit être visible selon ses règles de visibilité
 */
export function shouldBlockBeVisible(
  block: FormBlock,
  answers: Record<string, unknown>,
  allBlocks: FormBlock[]
): boolean {
  const visibility = block.visibility as
    | {
        enabled?: boolean;
        rules?: Array<{
          id?: string;
          action: "show" | "hide";
          operator: "and" | "or";
          conditions: Array<{
            id?: string;
            blockId: string;
            operator: string;
            value: string;
          }>;
        }>;
      }
    | undefined;

  // Si pas de visibilité configurée, toujours visible
  if (!visibility || !visibility.enabled || !visibility.rules) {
    return true;
  }

  // Évaluer toutes les règles
  // La dernière règle qui correspond détermine le résultat
  let isVisible = true; // Par défaut visible

  for (const rule of visibility.rules) {
    const ruleMatches = evaluateRule(rule, answers, allBlocks);
    
    // Si la règle correspond (les conditions sont vraies), appliquer son action
    if (ruleMatches) {
      // La dernière règle qui correspond écrase le résultat précédent
      if (rule.action === "show") {
        isVisible = true; // Afficher
      } else {
        // hide
        isVisible = false; // Masquer
      }
    }
  }

  return isVisible;
}

