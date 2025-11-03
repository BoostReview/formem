import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { createServerSupabase } from "@/lib/supabase/server"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabase()

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

