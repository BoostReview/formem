import { NextRequest, NextResponse } from "next/server"

// Configuration runtime pour Next.js
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  console.log("[API] /api/ai/generate-loading-text appelé")
  try {
    const { description } = await request.json()
    console.log("[API] Description reçue:", description?.substring(0, 100))

    if (!description || typeof description !== "string") {
      console.error("[API] Description manquante ou invalide")
      return NextResponse.json(
        { error: "Description requise" },
        { status: 400 }
      )
    }

    // Vérifier si on a une clé API OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY
    console.log("[API] Clé API OpenAI présente:", !!openaiApiKey)

    if (!openaiApiKey) {
      console.warn("[API] Pas de clé API OpenAI, retour des textes par défaut")
      // Retourner des textes par défaut si la clé API n'est pas configurée
      return NextResponse.json({
        success: true,
        texts: [
          "Analyse de votre demande...",
          "Construction du formulaire...",
          "Génération des champs...",
          "Optimisation de la structure...",
          "Finalisation...",
        ],
      })
    }

    // Prompt amélioré pour générer des textes vraiment personnalisés
    const prompt = `Tu es un assistant qui crée des messages de progression personnalisés pour la génération de formulaires.

DESCRIPTION DU FORMULAIRE DEMANDÉ PAR L'UTILISATEUR:
"${description}"

TA MISSION:
Génère exactement 4 ou 5 textes courts (maximum 55 caractères chacun) qui décrivent VRAIMENT ce qui se passe pour créer CE FORMULAIRE SPÉCIFIQUE. Chaque texte doit:

1. ÊTRE ULTRA-PERSONNALISÉ : Mentionne des détails spécifiques de la description (domaine, type, contexte, etc.)
2. Être au présent de l'indicatif
3. Se terminer par "..."
4. Montrer que tu comprends le besoin spécifique de l'utilisateur
5. Être dans l'ordre logique de création (analyse → structure → champs → validation → finalisation)

EXEMPLE 1 - Si la description est "Formulaire de contact pour un salon de coiffure":
❌ GÉNÉRIQUE: "Analyse de votre demande..."
✅ PERSONNALISÉ: "Adaptation des champs pour votre salon..."

EXEMPLE 2 - Si la description est "Questionnaire satisfaction restaurant":
❌ GÉNÉRIQUE: "Construction du formulaire..."
✅ PERSONNALISÉ: "Création des questions de satisfaction culinaire..."

IMPORTANT: 
- Sois SPÉCIFIQUE et mentionne des éléments de la description
- Montre que tu comprends le contexte métier
- Utilise un langage professionnel mais chaleureux
- Chaque texte doit être unique et refléter l'attention portée à CE formulaire

Réponds UNIQUEMENT avec les textes, un par ligne, sans numérotation, sans guillemets, sans formatage.`

    console.log("[API] Appel OpenAI avec prompt:", prompt.substring(0, 200))
    
    // Appeler l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 250,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Erreur OpenAI:", errorText)
      // Retourner des textes par défaut
      return NextResponse.json({
        success: true,
        texts: [
          "Analyse de votre demande...",
          "Construction du formulaire...",
          "Génération des champs...",
          "Optimisation de la structure...",
          "Finalisation...",
        ],
      })
    }

    const data = await response.json()
    console.log("[API] Réponse OpenAI reçue", { hasChoices: !!data.choices, choicesLength: data.choices?.length })
    
    const content = data.choices[0]?.message?.content?.trim()
    console.log("[API] Contenu brut GPT:", content?.substring(0, 200))

    if (!content) {
      console.warn("[API] Contenu vide, retour des textes par défaut")
      // Retourner des textes par défaut si la réponse est vide
      return NextResponse.json({
        success: true,
        texts: [
          "Analyse de votre demande...",
          "Construction du formulaire...",
          "Génération des champs...",
          "Optimisation de la structure...",
          "Finalisation...",
        ],
      })
    }

    // Nettoyer et séparer les textes (un par ligne)
    const texts = content
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((text: string) => text.replace(/^["']|["']$/g, "")) // Enlever guillemets
      .slice(0, 5) // Maximum 5 textes

    console.log("[API] Textes extraits:", texts)

    // S'assurer qu'on a au moins 4 textes
    if (texts.length < 4) {
      console.log("[API] Moins de 4 textes, ajout de Finalisation...")
      // Vérifier qu'on n'a pas déjà "Finalisation..."
      if (!texts.some((t: string) => t.toLowerCase().includes("finalisation"))) {
        texts.push("Finalisation...")
      }
    } else {
      // Si on a assez de textes, vérifier si le dernier est "Finalisation"
      const lastText = texts[texts.length - 1].toLowerCase()
      if (!lastText.includes("finalisation")) {
        // Vérifier qu'on n'a pas déjà "Finalisation..." ailleurs
        if (!texts.some((t: string) => t.toLowerCase().includes("finalisation"))) {
          console.log("[API] Ajout de Finalisation à la fin")
          texts.push("Finalisation...")
        }
      }
    }

    console.log("[API] Textes finaux retournés:", texts)
    return NextResponse.json({
      success: true,
      texts: texts,
    })
  } catch (error) {
    console.error("Erreur génération texte:", error)
    // Retourner des textes par défaut pour ne pas bloquer l'UI
    return NextResponse.json({
      success: true,
      texts: [
        "Analyse de votre demande...",
        "Construction du formulaire...",
        "Génération des champs...",
        "Optimisation de la structure...",
        "Finalisation...",
      ],
    })
  }
}