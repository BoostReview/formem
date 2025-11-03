import { redirect } from "next/navigation"
import { createServerSupabase } from "@/lib/supabase/server"
import { ReactNode } from "react"

// Layout spécifique pour l'éditeur qui bypass le DashboardLayout
// mais garde l'authentification
export default async function EditFormLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabase()

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  // Retourner les enfants sans DashboardLayout avec style pour masquer la sidebar parente
  // Utiliser un style inline pour garantir le z-index et la position
  return (
    <div 
      className="fixed inset-0 bg-background"
      style={{ 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999,
        position: 'fixed'
      }}
    >
      {children}
    </div>
  )
}

