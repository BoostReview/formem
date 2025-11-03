import { DashboardPageClient } from "./DashboardPageClient"
import { getForms } from "@/app/actions/forms"
import { getStats } from "@/app/actions/stats"

export default async function DashboardPage() {

  // Récupérer les données
  const formsResult = await getForms()
  const statsResult = await getStats()

  const forms = formsResult.success && formsResult.forms ? formsResult.forms : []
  const stats = statsResult.success ? statsResult.stats : {
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0,
    responseCounts: {},
  }

  return (
    <DashboardPageClient
      initialForms={forms}
      initialStats={stats}
    />
  )
}
