"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)
    try {
      const result = await signIn(data.email, data.password)

      if (!result.success) {
        // Si l'erreur contient "Invalid login credentials", afficher un message en français
        const errorMessage =
          result.error?.includes("Invalid login credentials") ||
          result.error?.includes("Invalid")
            ? "Email ou mot de passe incorrect"
            : result.error || "Une erreur s'est produite"

        toast.error(errorMessage)
        setIsLoading(false)
      }
      // Si succès, signIn redirige automatiquement vers /dashboard
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite")
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Se connecter</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info("Fonctionnalité à venir")
                }}
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              S'inscrire
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
