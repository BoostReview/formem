# 🏗️ Architecture Technique

Documentation détaillée de l'architecture du projet FormBuilder SaaS.

## 📁 Structure du Projet

```
pac-1euro/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Groupe de routes d'authentification
│   │   ├── signin/              # Page de connexion
│   │   └── signup/              # Page d'inscription
│   ├── dashboard/               # Routes protégées du dashboard
│   │   ├── forms/              # Gestion des formulaires
│   │   │   ├── [id]/          # Formulaire spécifique
│   │   │   │   ├── edit/      # Éditeur
│   │   │   │   ├── preview/   # Prévisualisation
│   │   │   │   ├── publish/   # Publication
│   │   │   │   └── responses/  # Réponses
│   │   │   └── new/           # Nouveau formulaire
│   │   └── page.tsx            # Dashboard principal
│   ├── f/                      # Formulaires publics
│   │   └── [slug]/            # Formulaire public par slug
│   ├── api/                    # API Routes
│   │   ├── forms/             # API formulaires
│   │   └── embed.js          # Script embed auto-height
│   └── actions/               # Server Actions
│       ├── auth.ts           # Actions d'authentification
│       ├── forms.ts          # Actions formulaires
│       ├── responses.ts      # Actions réponses
│       └── stats.ts          # Actions statistiques
│
├── components/                  # Composants React
│   ├── form-builder/          # Éditeur de formulaire
│   │   ├── BlockPalette.tsx  # Palette de blocs
│   │   ├── FormCanvas.tsx    # Zone d'édition (drag & drop)
│   │   ├── PropertyPanel.tsx # Panneau de propriétés
│   │   └── blocks/           # Types de blocs individuels
│   ├── form-renderer/         # Rendu public des formulaires
│   │   ├── FormRenderer.tsx  # Renderer principal
│   │   ├── OneByOneRenderer.tsx # Layout one-by-one
│   │   ├── AllInOneRenderer.tsx # Layout all-in-one
│   │   └── blocks/           # Rendu des blocs publics
│   ├── responses/             # Gestion des réponses
│   │   ├── ResponsesTable.tsx # Tableau avec TanStack Table
│   │   ├── ResponseFilters.tsx # Filtres
│   │   └── ExportButton.tsx   # Exports CSV/XLSX
│   └── ui/                    # Composants UI (shadcn/ui)
│
├── hooks/                       # React Hooks personnalisés
│   ├── useFormBuilder.ts      # Store Zustand pour l'éditeur
│   ├── useAutosave.ts         # Autosave avec debounce
│   ├── useAuth.ts             # Hook d'authentification
│   └── useRequireAuth.ts      # Protection des routes
│
├── lib/                         # Utilitaires
│   ├── supabase/              # Clients Supabase
│   │   ├── client.ts         # Client browser
│   │   ├── server.ts         # Client server
│   │   └── middleware.ts     # Middleware auth
│   ├── exports/               # Fonctions d'export
│   │   ├── exportToCSV.ts
│   │   └── exportToXLSX.ts
│   └── formatters/            # Formatage des données
│       └── formatResponse.ts
│
├── types/                       # Types TypeScript
│   └── index.ts               # Types globaux
│
└── supabase/                    # Schémas de base de données
    └── schema.sql             # Schéma SQL complet
```

## 🔄 Flux de Données

### Authentification

```
Utilisateur → Sign Up/Sign In → Supabase Auth → 
Middleware → Session → Dashboard
```

### Création de Formulaire

```
Dashboard → Nouveau Formulaire → createForm() → 
Supabase INSERT → Redirect vers Éditeur
```

### Édition de Formulaire

```
Éditeur → useFormBuilder (Zustand) → 
useAutosave → saveForm() → Supabase UPDATE
```

### Soumission Publique

```
Formulaire Public → Submit → API Route → 
Validation → Supabase INSERT (response) → 
Thank You Page
```

### Affichage des Réponses

```
Dashboard → getResponses() → Supabase SELECT → 
ResponsesTable → Filtres/Exports
```

## 🗄️ Schéma de Base de Données

### Tables Principales

#### `orgs`
- `id` (UUID, PK)
- `name` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `profiles`
- `id` (UUID, PK, FK → auth.users)
- `org_id` (UUID, FK → orgs)
- `role` (TEXT: owner/admin/member)
- `created_at` (TIMESTAMPTZ)

#### `forms`
- `id` (UUID, PK)
- `org_id` (UUID, FK → orgs)
- `title` (TEXT)
- `slug` (TEXT, UNIQUE, nullable)
- `layout` (ENUM: one/page)
- `schema_json` (JSONB) - Array de FormBlock
- `theme_json` (JSONB)
- `settings_json` (JSONB)
- `published` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `responses`
- `id` (UUID, PK)
- `form_id` (UUID, FK → forms)
- `created_at` (TIMESTAMPTZ)
- `ip` (INET, nullable)
- `ua` (TEXT, nullable)
- `answers_json` (JSONB)
- `email` (TEXT, nullable)
- `phone_raw` (TEXT, nullable)
- `phone_e164` (TEXT, nullable)
- `utm_json` (JSONB, nullable)
- `source` (ENUM: link/embed)
- `hidden_json` (JSONB, nullable)

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS activées :
- Les utilisateurs ne peuvent voir que les formulaires de leur organisation
- Les utilisateurs ne peuvent modifier que leurs propres formulaires
- Les réponses sont accessibles uniquement aux membres de l'organisation

## 🔌 Routes API

### `/api/forms/[id]/lead`
Endpoint pour soumettre une réponse de formulaire.
- Method: POST
- Body: `{ answers: Record<string, unknown>, email?: string, ... }`
- Returns: `{ success: boolean }`

### `/api/forms/[id]/publish`
Endpoint pour publier/dépublier un formulaire.
- Method: POST
- Body: `{ published: boolean }`
- Returns: `{ success: boolean }`

### `/api/embed.js`
Script JavaScript pour auto-height des iFrames.

## 🧩 Composants Principaux

### FormBuilder
- **BlockPalette** : Liste des blocs disponibles avec drag
- **FormCanvas** : Zone principale avec @dnd-kit pour drag & drop
- **PropertyPanel** : Panneau de configuration avec 4 onglets
- **Blocks** : 14 types de blocs différents

### FormRenderer
- **FormRenderer** : Router vers OneByOne ou AllInOne
- **OneByOneRenderer** : Layout type Typeform
- **AllInOneRenderer** : Layout traditionnel
- **ThankYouPage** : Page de remerciement

### Responses
- **ResponsesTable** : Tableau avec TanStack Table
- **ResponseFilters** : Filtres par date, source, recherche
- **ExportButton** : Exports CSV/XLSX
- **ResponseDetailModal** : Modal de détails

## 🎨 State Management

### Zustand Stores

#### `useFormBuilder`
Gère l'état de l'éditeur :
- Formulaire actuel (id, title, blocks, theme, settings)
- Bloc sélectionné
- État de sauvegarde
- Actions (addBlock, updateBlock, deleteBlock, etc.)

### React Context

Pas de Context utilisé actuellement - tout passe par Zustand ou props.

## 🔐 Sécurité

### Authentification
- Supabase Auth avec sessions JWT
- Middleware Next.js pour protéger les routes
- Refresh automatique des tokens

### Validation
- Zod schemas pour toutes les entrées
- Validation serveur dans Server Actions
- Sanitization des inputs

### RLS
- Politiques RLS sur toutes les tables
- Accès basé sur org_id
- Isolation des données entre organisations

## 📦 Dépendances Principales

### Core
- `next` : Framework React
- `react` / `react-dom` : Bibliothèque UI
- `typescript` : Typage statique

### UI
- `tailwindcss` : Styling
- `shadcn/ui` : Composants UI
- `lucide-react` : Icônes
- `framer-motion` : Animations

### Data
- `@supabase/supabase-js` : Client Supabase
- `@supabase/ssr` : SSR pour Supabase
- `zod` : Validation de schémas
- `react-hook-form` : Gestion de formulaires

### Utils
- `zustand` : State management
- `@dnd-kit/*` : Drag & drop
- `@tanstack/react-table` : Tableaux
- `xlsx` / `papaparse` : Exports
- `libphonenumber-js` : Formatage téléphones
- `qrcode` : Génération QR codes

## 🚀 Performance

### Optimisations
- Code splitting automatique (Next.js)
- Lazy loading des composants lourds
- Debounce sur l'autosave
- Pagination côté serveur pour les réponses
- Virtualisation du tableau si nécessaire

### Bundle Size
- Tree-shaking activé
- Imports dynamiques pour les gros composants
- Optimisation des images (si ajoutées)

## 🔮 Architecture Future

### Améliorations Possibles
- Cache Redis pour les formulaires publics
- Webhooks pour notifications
- Analytics avancées
- Templates de formulaires
- Collaboration multi-utilisateurs
- Versioning des formulaires
- Webhooks pour intégrations tierces


