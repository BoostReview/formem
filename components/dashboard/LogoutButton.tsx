"use client"

import * as React from "react"
import { LogOut } from "lucide-react"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/actions/auth"

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    // signOut() redirige automatiquement, donc setLoading(false) ne sera jamais appelé
  }

  return (
    <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Déconnexion..." : "Déconnexion"}
    </DropdownMenuItem>
  )
}


