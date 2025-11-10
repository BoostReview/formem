import { NextRequest, NextResponse } from "next/server"
import { FormBlock, BlockType } from "@/types"

// Types de blocs disponibles
const AVAILABLE_BLOCKS: BlockType[] = [
  "welcome",
  "heading",
  "paragraph",
  "single-choice",
  "multiple-choice",
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "slider",
  "date",
  "yes-no",
  "consent",
  "captcha",
  "file",
  "youtube",
  "menu-restaurant",
  "image",
  "dropdown",
  "rating",
  "address",
  "website",
]

interface AIGenerateRequest {
  description: string
  layout: "one" | "page"
}

export async function POST(request: NextRequest) {
  try {
    const { description, layout }: AIGenerateRequest = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description requise" },
        { status: 400 }
      )
    }

    // Vérifier si on a une clé API OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "Configuration OpenAI manquante" },
        { status: 500 }
      )
    }

    // Construire le prompt pour l'IA
    const systemPrompt = `Tu es un expert en création de formulaires. Tu dois analyser la description fournie par l'utilisateur et générer un formulaire complet au format JSON.

Types de blocs disponibles:
- welcome: Message de bienvenue (label, description)
- heading: Titre (label, level: "h1" | "h2" | "h3")
- paragraph: Paragraphe de texte (label)
- single-choice: Choix unique (label, options: string[], required)
- multiple-choice: Choix multiples (label, options: string[], required)
- text: Champ texte court (label, placeholder, required)
- textarea: Zone de texte longue (label, placeholder, required)
- email: Email (label, placeholder, required)
- phone: Téléphone (label, placeholder, required)
- number: Nombre (label, placeholder, required)
- slider: Curseur (label, min, max, step, required)
- date: Date (label, required, dateType: "date" | "datetime" | "time")
- yes-no: Oui/Non (label, required)
- consent: Consentement (label, consentText, required)
- captcha: Vérification anti-spam (label, required)
- file: Upload fichier (label, required, maxFileSize)
- youtube: Vidéo YouTube (label, youtubeUrl)
- menu-restaurant: Menu restaurant (label, sections: [{name, items: [{name, description, price}]}])
- image: Image (label, imageUrl, altText?, caption?, linkUrl?, size?: "small" | "medium" | "large" | "full", alignment?: "left" | "center" | "right", borderRadius?: number, opacity?: number)
- dropdown: Liste déroulante (label, options: string[], required)
- rating: Note par étoiles (label, maxRating?: number, required)
- address: Adresse complète (label, required)
- website: URL de site web (label, placeholder, required)

Chaque bloc doit avoir:
- id: string unique (ex: "text-1", "email-1")
- type: BlockType
- label: string (titre/question)
- required: boolean (par défaut false sauf si indiqué)
- Autres propriétés selon le type

Structure attendue:
{
  "title": "Titre du formulaire (court, descriptif, maximum 50 caractères)",
  "schema": [
    {
      "id": "welcome-1",
      "type": "welcome",
      "label": "Titre de bienvenue",
      "description": "Description de bienvenue",
      "required": false
    },
    ...
  ]
}

IMPORTANT: Le champ "title" doit être un nom court et descriptif du formulaire (ex: "Formulaire de contact", "Inscription événement", "Sondage satisfaction"). Maximum 50 caractères. Ce titre sera affiché dans le dashboard.

Génère un formulaire complet et professionnel basé sur la description. Utilise des IDs uniques pour chaque bloc.`

    const userPrompt = `Crée un formulaire avec cette description: "${description}"

Layout: ${layout === "one" ? "Une question par page" : "Tout sur une page"}

Génère le JSON complet du formulaire avec tous les blocs nécessaires.`

    // Appeler l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Modèle économique
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Erreur OpenAI:", error)
      return NextResponse.json(
        { error: "Erreur lors de la génération avec l'IA" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: "Réponse vide de l'IA" },
        { status: 500 }
      )
    }

    // Parser le JSON
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError)
      // Essayer d'extraire le JSON si c'est dans du markdown
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error("Impossible de parser la réponse JSON")
      }
    }

    // Valider et formater le schéma
    const schema = Array.isArray(parsedContent.schema)
      ? parsedContent.schema
      : parsedContent.blocks || []

    // Nettoyer et valider chaque bloc
    const cleanedSchema: FormBlock[] = schema.map((block: any, index: number) => {
      // S'assurer que l'ID existe
      if (!block.id) {
        block.id = `${block.type || "block"}-${index + 1}`
      }

      // S'assurer que le type est valide
      if (!AVAILABLE_BLOCKS.includes(block.type)) {
        block.type = "text" // Fallback
      }

      // Propriétés par défaut
      return {
        id: block.id,
        type: block.type,
        label: block.label || "",
        required: block.required || false,
        ...block,
      }
    })

    return NextResponse.json({
      success: true,
      title: parsedContent.title || "Formulaire généré",
      schema: cleanedSchema,
    })
  } catch (error) {
    console.error("Erreur génération IA:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la génération du formulaire",
      },
      { status: 500 }
    )
  }
}

