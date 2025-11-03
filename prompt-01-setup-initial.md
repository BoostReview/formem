# 🚀 Module 1 : Setup Initial et Structure Projet

## Objectif
Configurer le projet Next.js 15 depuis zéro avec toute la structure de base, les dépendances, et la configuration nécessaire.

## Contexte Global
Nous construisons un SaaS de création de formulaires moderne (comme Jotform/Typeform) avec Next.js 15, Supabase, et shadcn/ui.

## Tâches à Réaliser

### 1. Initialisation Projet
- [ ] Créer un projet Next.js 15 avec TypeScript et App Router
- [ ] Configurer TailwindCSS + PostCSS + Autoprefixer
- [ ] Installer toutes les dépendances listées dans doc.md section 9
- [ ] Configurer ESLint et Prettier (format cohérent)

### 2. Structure des Dossiers
Créer cette structure exacte :
```
/app
 ├─ (auth)/
 │   ├─ signin/
 │   └─ signup/
 ├─ dashboard/
 │   ├─ forms/
 │   │   ├─ page.tsx (liste)
 │   │   └─ [id]/
 │   │        ├─ edit/
 │   │        ├─ preview/
 │   │        ├─ publish/
 │   │        └─ responses/
 ├─ f/
 │   └─ [slug]/
 │        └─ page.tsx (rendu public)
 └─ api/
     ├─ forms/
     │   ├─ route.ts
     │   └─ [id]/
     │        ├─ publish/
     │        ├─ share/
     │        └─ lead/
     └─ embed.js (pour iframe auto-height)

/components
 /lib
 /hooks
 /types
 /supabase
   └─ schema.sql (vide pour l'instant)
```

### 3. Configuration Supabase
- [ ] Créer `lib/supabase/client.ts` (client browser)
- [ ] Créer `lib/supabase/server.ts` (server actions)
- [ ] Créer `lib/supabase/middleware.ts` (auth check)
- [ ] Ajouter fichier `.env.example` avec :
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

### 4. Configuration Design System
- [ ] Initialiser shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Configurer Tailwind avec la palette :
  - Primaire : #0EA5E9 (sky-500)
  - Secondaire : #9333EA (violet-600)
  - Fond clair : #F8FAFC (slate-50)
  - Texte : #0F172A (slate-900)
- [ ] Radius : 14–16px par défaut
- [ ] Police : Inter (Google Fonts)
- [ ] Configurer `tailwind.config.ts` avec ces valeurs

### 5. Types TypeScript de Base
Créer `types/index.ts` avec :
- Types pour Form, Response, Profile, Org
- Enums pour layout ('one' | 'page')
- Types pour schema_json, theme_json, settings_json

### 6. Utilitaires de Base
- [ ] `lib/utils.ts` avec `cn()` (tailwind-merge)
- [ ] `lib/constants.ts` pour les constantes du projet

### 7. Configuration Vercel
- [ ] Créer `vercel.json` si nécessaire
- [ ] Préparer configuration pour déploiement

## Dépendances à Installer
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "framer-motion": "^11.0.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "@tanstack/react-table": "^8.11.0",
    "xlsx": "^0.18.0",
    "json2csv": "^6.0.0",
    "papaparse": "^5.4.0",
    "libphonenumber-js": "^1.11.0",
    "qrcode": "^1.5.0",
    "nanoid": "^5.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

## Checklist de Validation
- [ ] `pnpm install` fonctionne sans erreur
- [ ] `pnpm dev` démarre le serveur
- [ ] Structure de dossiers respectée
- [ ] Types TypeScript définis
- [ ] Configuration Tailwind avec palette correcte
- [ ] Fichiers Supabase créés (même si vides pour l'instant)
- [ ] `.env.example` présent et documenté

## Notes Importantes
- Utiliser pnpm (pas npm/yarn)
- Node 20+ requis
- Suivre les conventions Next.js 15 App Router
- Code propre, bien typé, prêt pour les autres modules

## Livrable
Un projet Next.js fonctionnel avec toute la structure de base, prêt à accueillir les autres modules.


