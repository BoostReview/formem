import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface CheckClarityRequest {
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const { description }: CheckClarityRequest = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description requise" },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Si pas de clé API, considérer que c'est toujours clair
      return NextResponse.json({
        needsClarification: false,
        questions: [],
      })
    }

    const systemPrompt = `Tu es un assistant expert en analyse de demandes pour la création de formulaires. 

Ta mission est d'analyser si une description de formulaire est suffisamment claire pour être générée directement, ou si tu as besoin de clarifications.

Réponds UNIQUEMENT avec un JSON au format suivant:
{
  "needsClarification": true/false,
  "questions": ["question 1", "question 2", ...] ou [] si pas besoin
}

Critères pour demander des clarifications:
- Description trop vague (ex: "un formulaire", "quelque chose")
- Informations manquantes essentielles (type de formulaire, champs nécessaires, contexte)
- Ambiguïtés sur le type de formulaire ou les champs
- Description très courte sans détails

Si la description est claire et contient suffisamment d'informations pour créer un formulaire, retourne needsClarification: false avec questions: [].

Si tu as besoin de clarifications, pose 1 à 3 questions maximum, courtes et précises.`

    const userPrompt = `Analyse cette description de formulaire et détermine si tu as besoin de clarifications:

"${description}"

Réponds avec le JSON uniquement.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      // En cas d'erreur, considérer que c'est clair
      return NextResponse.json({
        needsClarification: false,
        questions: [],
      })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({
        needsClarification: false,
        questions: [],
      })
    }

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError)
      return NextResponse.json({
        needsClarification: false,
        questions: [],
      })
    }

    return NextResponse.json({
      needsClarification: parsedContent.needsClarification === true,
      questions: Array.isArray(parsedContent.questions) ? parsedContent.questions : [],
    })
  } catch (error) {
    console.error("Erreur vérification clarté:", error)
    return NextResponse.json({
      needsClarification: false,
      questions: [],
    })
  }
}


