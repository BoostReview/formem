"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { updateProfile, updateEmail, updatePassword } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, User, Building2, Mail, Lock } from "lucide-react"
import type { Profile, Org } from "@/types"

interface ProfilePageClientProps {
  profile: Profile
  org: Org
  user: { id: string; email: string }
}

export function ProfilePageClient({
  profile,
  org,
  user,
}: ProfilePageClientProps) {
  const router = useRouter()

  // États pour les formulaires
  const [orgName, setOrgName] = React.useState(org.name)
  const [email, setEmail] = React.useState(user.email)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [isUpdatingOrg, setIsUpdatingOrg] = React.useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = React.useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingOrg(true)

    try {
      const result = await updateProfile({ org_name: orgName })

      if (result.success) {
        toast.success("Succès", {
          description: "Nom de l'organisation mis à jour",
        })
      } else {
        toast.error("Erreur", {
          description: result.error || "Erreur lors de la mise à jour",
        })
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue",
      })
    } finally {
      setIsUpdatingOrg(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingEmail(true)

    try {
      const result = await updateEmail(email)

      if (result.success) {
        toast.success("Succès", {
          description: "Email mis à jour. Vérifiez votre boîte mail pour confirmer.",
        })
      } else {
        toast.error("Erreur", {
          description: result.error || "Erreur lors de la mise à jour",
        })
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue",
      })
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas",
      })
      return
    }

    if (newPassword.length < 6) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 6 caractères",
      })
      return
    }

    setIsUpdatingPassword(true)

    try {
      const result = await updatePassword(currentPassword, newPassword)

      if (result.success) {
        toast.success("Succès", {
          description: "Mot de passe mis à jour",
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error("Erreur", {
          description: result.error || "Erreur lors de la mise à jour",
        })
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Informations utilisateur */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Informations utilisateur</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Email actuel</Label>
              <Input value={user.email} disabled className="mt-1" />
            </div>
            <p className="text-sm text-muted-foreground">
              Compte créé le {new Date(profile.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Organisation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Organisation</CardTitle>
              <CardDescription>Modifiez le nom de votre organisation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateOrg} className="space-y-4">
            <div>
              <Label htmlFor="org-name">Nom de l'organisation</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" disabled={isUpdatingOrg}>
              {isUpdatingOrg ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Email</CardTitle>
              <CardDescription>
                Modifiez votre adresse email
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <Label htmlFor="email">Nouvelle adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" disabled={isUpdatingEmail}>
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour l'email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mot de passe */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Mot de passe</CardTitle>
              <CardDescription>
                Changez votre mot de passe
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Changer le mot de passe"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

