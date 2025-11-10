# 🎨 Module 4 : Design System et Composants UI de Base

## Objectif
Créer tous les composants UI réutilisables avec shadcn/ui, configurer le thème, et établir le design system complet du projet.

## Contexte Global
Le design doit être moderne, fluide, et cohérent. Utiliser shadcn/ui comme base, TailwindCSS pour le styling, et Framer Motion pour les animations.

## Tâches à Réaliser

### 1. Configuration Tailwind

#### `tailwind.config.ts`
- [ ] Configurer la palette exacte :
  - Primaire : #0EA5E9 (sky-500)
  - Secondaire : #9333EA (violet-600)
  - Fond clair : #F8FAFC (slate-50)
  - Texte : #0F172A (slate-900)
- [ ] Radius par défaut : 14-16px
- [ ] Ombres : shadow-md, shadow-lg
- [ ] Transitions : 200-250ms

#### `app/globals.css`
- [ ] Importer Inter (Google Fonts)
- [ ] Variables CSS pour les couleurs
- [ ] Reset de base
- [ ] Styles globaux

### 2. Composants shadcn/ui à Installer

Installer via `npx shadcn-ui@latest add [component]` :

- [ ] `button` - Boutons principaux
- [ ] `input` - Champs de formulaire
- [ ] `label` - Labels
- [ ] `card` - Cartes/containers
- [ ] `toast` / `toaster` - Notifications
- [ ] `dialog` / `sheet` - Modals
- [ ] `tabs` - Onglets
- [ ] `select` - Dropdowns
- [ ] `checkbox` - Cases à cocher
- [ ] `radio-group` - Radio buttons
- [ ] `textarea` - Zones de texte
- [ ] `slider` - Sliders
- [ ] `switch` - Toggles
- [ ] `badge` - Badges
- [ ] `skeleton` - Loading states
- [ ] `separator` - Séparateurs
- [ ] `dropdown-menu` - Menus contextuels
- [ ] `tooltip` - Tooltips
- [ ] `progress` - Barres de progression
- [ ] `table` - Tableaux (pour réponses)

### 3. Composants Custom à Créer

#### `components/ui/LoadingSpinner.tsx`
- [ ] Spinner animé avec Framer Motion
- [ ] Tailles variantes (sm, md, lg)

#### `components/ui/EmptyState.tsx`
- [ ] État vide réutilisable
- [ ] Props : icon, title, description, action?

#### `components/ui/PageHeader.tsx`
- [ ] En-tête de page avec titre et actions
- [ ] Breadcrumbs optionnels

#### `components/ui/StatCard.tsx`
- [ ] Carte de statistique (pour dashboard)
- [ ] Props : label, value, icon, trend?

#### `components/layout/DashboardLayout.tsx`
- [ ] Layout principal du dashboard
- [ ] Sidebar navigation
- [ ] Header avec user menu
- [ ] Responsive (mobile hamburger)

#### `components/layout/FormBuilderLayout.tsx`
- [ ] Layout pour l'éditeur de formulaire
- [ ] 3 colonnes : blocs | canvas | propriétés
- [ ] Responsive avec panneaux collapsibles

### 4. Thème et Variantes

#### Personnaliser les composants shadcn/ui :
- [ ] Modifier `components/ui/button.tsx` avec variantes custom
- [ ] Ajouter variantes : "form", "ghost", "danger"
- [ ] Couleurs cohérentes avec la palette

#### Tokens de Design
Créer `lib/design-tokens.ts` :
```typescript
export const colors = {
  primary: '#0EA5E9',
  secondary: '#9333EA',
  // ...
}

export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  // ...
}
```

### 5. Animations Framer Motion

#### `components/animations/FadeIn.tsx`
- [ ] Wrapper pour fade-in
- [ ] Props : delay, duration

#### `components/animations/SlideIn.tsx`
- [ ] Wrapper pour slide-in
- [ ] Directions : up, down, left, right

#### `components/animations/ScaleIn.tsx`
- [ ] Wrapper pour scale-in
- [ ] Pour les modals/dialogs

### 6. Icons

#### Utiliser lucide-react pour :
- [ ] Tous les icons du projet
- [ ] Créer un fichier `components/icons/index.ts` pour exports centralisés

### 7. Utilitaires

#### `lib/utils.ts`
- [ ] Fonction `cn()` pour merge des classes Tailwind
- [ ] Helper `formatDate()`
- [ ] Helper `formatNumber()`
- [ ] Helper `classNames()`

### 8. Composants Spécifiques au Form Builder

#### `components/form-builder/BlockCard.tsx`
- [ ] Carte représentant un bloc
- [ ] Drag preview
- [ ] Icône + label

#### `components/form-builder/Canvas.tsx`
- [ ] Zone de drop pour les blocs
- [ ] Gestion drag & drop
- [ ] Zones de drop visuelles

#### `components/form-builder/PropertyPanel.tsx`
- [ ] Panneau de propriétés à droite
- [ ] Onglets : Champs / Apparence / Thème / Logique

### 9. Responsive Design

#### Breakpoints Tailwind
- [ ] Mobile : < 640px
- [ ] Tablet : 640px - 1024px
- [ ] Desktop : > 1024px

#### Composants Responsive
- [ ] DashboardLayout : sidebar collapsible sur mobile
- [ ] FormBuilderLayout : panneaux empilés sur mobile
- [ ] Tous les composants testés sur mobile

## Checklist de Validation
- [ ] Tous les composants shadcn/ui installés et fonctionnels
- [ ] Palette de couleurs respectée partout
- [ ] Design cohérent et moderne
- [ ] Animations fluides (200-250ms)
- [ ] Responsive sur tous les écrans
- [ ] Dark mode (optionnel pour MVP)
- [ ] Accessibilité de base (aria-labels, keyboard navigation)
- [ ] Types TypeScript pour tous les composants

## Notes Importantes
- Respecter scrupuleusement la palette définie
- Tous les composants doivent être réutilisables
- Code propre, bien documenté
- Performance : éviter les re-renders inutiles
- Utiliser `forwardRef` quand nécessaire

## Livrable
Un design system complet avec tous les composants UI de base, le thème configuré, et une cohérence visuelle parfaite dans tout le projet.





