# 🔐 Module 3 : Authentification et Middleware

## Objectif
Implémenter le système d'authentification complet avec Supabase Auth : pages de connexion/inscription, middleware de protection, et hooks utilitaires.

## Contexte Global
L'authentification utilise Supabase Auth (email/password). Les utilisateurs doivent pouvoir s'inscrire, se connecter, et être protégés par middleware sur les routes privées.

## Tâches à Réaliser

### 1. Pages d'Authentification

#### Page Sign Up (`/app/(auth)/signup/page.tsx`)
- [ ] Formulaire avec :
  - Email (validation)
  - Password (min 8 caractères)
  - Confirm Password
  - Bouton "Créer un compte"
  - Lien vers Sign In
- [ ] Design moderne avec shadcn/ui
- [ ] Gestion erreurs (email déjà utilisé, etc.)
- [ ] Toast de succès après inscription
- [ ] Redirection vers `/dashboard` après succès
- [ ] Loading states

#### Page Sign In (`/app/(auth)/signin/page.tsx`)
- [ ] Formulaire avec :
  - Email
  - Password
  - Bouton "Se connecter"
  - Lien "Mot de passe oublié ?" (optionnel pour MVP)
  - Lien vers Sign Up
- [ ] Design cohérent avec Sign Up
- [ ] Gestion erreurs (credentials invalides)
- [ ] Redirection vers `/dashboard` après succès
- [ ] Loading states

#### Layout Auth (`/app/(auth)/layout.tsx`)
- [ ] Layout centré et minimaliste
- [ ] Logo/titre de l'app
- [ ] Fond avec gradient ou couleur de fond claire

### 2. Middleware de Protection

#### Middleware (`/middleware.ts`)
- [ ] Vérifier l'authentification avec Supabase
- [ ] Protéger les routes `/dashboard/**`
- [ ] Rediriger vers `/signin` si non authentifié
- [ ] Rediriger vers `/dashboard` si authentifié accède à `/signin` ou `/signup`
- [ ] Laisser `/f/[slug]` et `/api/**` publiques

### 3. Hooks et Utilitaires

#### Hook `useAuth()` (`/hooks/useAuth.ts`)
- [ ] Retourne : `{ user, loading, signOut }`
- [ ] Utilise Supabase client
- [ ] Gère les états de chargement

#### Hook `useRequireAuth()` (`/hooks/useRequireAuth.ts`)
- [ ] Redirige si non authentifié
- [ ] Affiche un loader pendant la vérification

#### Client Supabase (`/lib/supabase/client.ts`)
- [ ] Singleton pour le client browser
- [ ] Configuration correcte

#### Server Supabase (`/lib/supabase/server.ts`)
- [ ] Fonctions pour server components/actions
- [ ] `createClient()` pour server-side

### 4. Server Actions

#### Action Sign Up (`/app/actions/auth.ts`)
```typescript
'use server'

export async function signUp(email: string, password: string) {
  // Appel Supabase Auth
  // Gérer erreurs
  // Retourner { success, error }
}
```

#### Action Sign In (`/app/actions/auth.ts`)
```typescript
'use server'

export async function signIn(email: string, password: string) {
  // Appel Supabase Auth
  // Gérer erreurs
  // Retourner { success, error }
}
```

#### Action Sign Out (`/app/actions/auth.ts`)
```typescript
'use server'

export async function signOut() {
  // Déconnexion Supabase
  // Redirection
}
```

### 5. Composants UI

#### Utiliser shadcn/ui pour :
- [ ] `Button` (boutons de formulaire)
- [ ] `Input` (champs email/password)
- [ ] `Label` (labels de formulaire)
- [ ] `Card` (conteneur des formulaires)
- [ ] `Toast` (notifications)

### 6. Validation Formulaire

#### Utiliser react-hook-form + zod :
- [ ] Schéma Zod pour Sign Up
- [ ] Schéma Zod pour Sign In
- [ ] Validation côté client
- [ ] Messages d'erreur en français

## Design à Respecter

### Style
- Fond : `#F8FAFC` (slate-50)
- Carte centrée avec shadow-md
- Radius : 14-16px
- Espacement : p-6, gap-4
- Typo : Inter

### Palette
- Primaire : #0EA5E9 (sky-500) pour boutons
- Texte : #0F172A (slate-900)

### Animations
- Transitions : 200-250ms
- Hover effects sur boutons

## Checklist de Validation
- [ ] Inscription fonctionnelle (création user + org automatique)
- [ ] Connexion fonctionnelle
- [ ] Middleware protège `/dashboard`
- [ ] Redirections correctes
- [ ] Gestion erreurs complète
- [ ] Design cohérent et moderne
- [ ] Responsive mobile
- [ ] Loading states partout
- [ ] Toasts pour feedback

## Notes Importantes
- Vérifier que la fonction `create_org_for_new_user` (Module 2) est active
- Tester les cas d'erreur (email invalide, mot de passe faible, etc.)
- S'assurer que les routes publiques (`/f/[slug]`) ne sont pas protégées
- Code propre et bien typé

## Livrable
Un système d'authentification complet et fonctionnel, avec pages modernes, middleware de protection, et tous les hooks/utilitaires nécessaires.





