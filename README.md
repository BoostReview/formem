# 🚀 FormBuilder SaaS

Un SaaS moderne et complet pour créer, publier et gérer des formulaires en ligne avec une interface intuitive et des fonctionnalités avancées.

## ✨ Fonctionnalités

- 🎨 **Éditeur Visuel** - Créez des formulaires avec drag & drop
- 📱 **Layouts Flexibles** - One-by-one (comme Typeform) ou All-in-one
- 🎯 **14 Types de Blocs** - Titres, paragraphes, choix, inputs, dates, vidéos YouTube, etc.
- 💾 **Autosave** - Sauvegarde automatique pendant l'édition
- 📊 **Tableau de Réponses** - Gérez toutes vos réponses avec filtres et exports
- 📤 **Exports CSV/XLSX** - Exportez vos données facilement
- 🔗 **Partage Flexible** - Liens directs, QR codes, intégration iFrame avec auto-height
- 🎨 **Thèmes Personnalisables** - Personnalisez les couleurs et styles
- 🔒 **Sécurisé** - Authentification Supabase, RLS, validation serveur

## 🏗️ Architecture

- **Frontend** : Next.js 15 (App Router), React 18, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **State Management** : Zustand
- **Form Handling** : React Hook Form + Zod
- **Animations** : Framer Motion

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+ 
- npm, pnpm ou yarn
- Compte Supabase (gratuit)

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd pac-1euro
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
```

3. **Configurer l'environnement**

Copiez `.env.example` vers `.env.local` :
```bash
cp env.example .env.local
```

Remplissez les variables dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurer Supabase**

Exécutez le script SQL dans votre projet Supabase :
- Allez sur https://app.supabase.com
- Ouvrez l'éditeur SQL
- Copiez-collez le contenu de `supabase/schema.sql`
- Exécutez le script

5. **Lancer le projet**
```bash
npm run dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📖 Utilisation

### Créer un Formulaire

1. Connectez-vous ou créez un compte
2. Cliquez sur "Nouveau formulaire"
3. Choisissez le layout (One-by-one ou All-in-one)
4. Utilisez l'éditeur pour ajouter des blocs
5. Configurez les propriétés dans le panneau de droite
6. Prévisualisez avec l'onglet "Prévisualiser"
7. Publiez avec l'onglet "Publier"

### Utiliser l'Éditeur

- **Glisser-déposer** : Faites glisser des blocs depuis la palette vers le canvas
- **Réorganiser** : Glissez-déposez les blocs existants pour les réorganiser
- **Éditer** : Double-cliquez sur un bloc pour éditer son contenu
- **Propriétés** : Cliquez sur un bloc pour voir ses propriétés dans le panneau de droite
- **Dupliquer/Supprimer** : Utilisez les boutons qui apparaissent au hover

### Publier un Formulaire

1. Allez dans "Publier" depuis l'éditeur
2. Activez le toggle "Publier"
3. Le formulaire devient accessible via un lien public
4. Partagez le lien ou le QR code
5. Configurez les paramètres (limite de réponses, expiration, etc.)

### Intégration iFrame

```html
<iframe 
  src="https://votre-app.com/f/[slug]" 
  width="100%" 
  height="100%" 
  frameborder="0"
></iframe>
```

L'iFrame s'adapte automatiquement à la hauteur du formulaire grâce à l'auto-height.

### Voir les Réponses

1. Allez sur la page du formulaire
2. Cliquez sur "Réponses"
3. Filtrez par date, source, ou recherchez
4. Cliquez sur une réponse pour voir les détails
5. Exportez en CSV ou XLSX

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Vérification TypeScript
npm run type-check

# Formatage du code
npm run format
```

## 📦 Structure du Projet

```
pac-1euro/
├── app/                    # Routes Next.js (App Router)
│   ├── (auth)/            # Pages d'authentification
│   ├── dashboard/         # Dashboard et formulaires
│   ├── f/                 # Formulaires publics
│   └── api/               # API routes
├── components/            # Composants React
│   ├── form-builder/      # Éditeur de formulaire
│   ├── form-renderer/     # Rendu public
│   ├── responses/         # Gestion des réponses
│   └── ui/                # Composants UI (shadcn)
├── hooks/                 # React hooks personnalisés
├── lib/                   # Utilitaires et helpers
├── types/                 # Types TypeScript
└── supabase/              # Schémas SQL
```

## 🔒 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables Supabase
- **Validation serveur** avec Zod sur toutes les entrées
- **Authentification** sécurisée via Supabase Auth
- **Sanitization** des inputs utilisateur
- **Honeypot** pour prévenir les bots
- **Secrets** non committés (utilisez `.env.local`)

## 📊 Base de Données

Le schéma utilise 4 tables principales :
- `orgs` - Organisations
- `profiles` - Profils utilisateurs
- `forms` - Formulaires
- `responses` - Réponses aux formulaires

Voir `supabase/schema.sql` pour le schéma complet.

## 🚢 Déploiement

### Vercel (Recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet dans Vercel
3. Configurez les variables d'environnement
4. Déployez !

### Variables d'Environnement Production

```
NEXT_PUBLIC_SUPABASE_URL=votre-url-production
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-production
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-production
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## 🐛 Dépannage

### Le formulaire ne se sauvegarde pas

- Vérifiez que Supabase est bien configuré
- Vérifiez les variables d'environnement
- Consultez la console pour les erreurs

### Erreur d'authentification

- Vérifiez que les clés Supabase sont correctes
- Assurez-vous que RLS est activé sur les tables
- Vérifiez que le middleware d'auth fonctionne

### Problème d'hydratation React

- C'est normal en développement avec Radix UI
- Videz le cache du navigateur (Ctrl+Shift+R)
- En production, cela ne devrait pas apparaître

## 📚 Documentation Complète

- **[Architecture](./docs/ARCHITECTURE.md)** - Structure technique détaillée
- **[Déploiement](./docs/DEPLOYMENT.md)** - Guide de déploiement complet
- **[Guide Utilisateur](./docs/USER_GUIDE.md)** - Guide pour les utilisateurs finaux

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

ISC

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Développé avec ❤️ pour créer des formulaires facilement**





