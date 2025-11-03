# 📊 Module 5 : Dashboard et Navigation

## Objectif
Créer le tableau de bord principal avec la liste des formulaires, la navigation, et toutes les pages de gestion.

## Contexte Global
Le dashboard est l'interface principale après connexion. Il permet de voir tous les formulaires, leurs stats, et naviguer vers l'édition.

## Tâches à Réaliser

### 1. Layout Principal

#### `components/layout/DashboardLayout.tsx`
- [ ] Sidebar avec navigation :
  - Logo/titre
  - Menu : Dashboard, Formulaires, Paramètres
  - User menu (dropdown) : Profil, Déconnexion
- [ ] Header avec :
  - Bouton "Nouveau formulaire"
  - Recherche globale (optionnel)
  - Notifications (optionnel)
- [ ] Main content area
- [ ] Responsive : sidebar collapsible sur mobile
- [ ] Animations d'entrée/sortie

### 2. Page Dashboard Principal

#### `app/dashboard/page.tsx`
- [ ] Vue d'ensemble avec statistiques :
  - Nombre total de formulaires
  - Nombre de réponses totales
  - Formulaires actifs (publiés)
  - Graphique simple (optionnel)
- [ ] Liste des formulaires récents (derniers 5)
- [ ] Actions rapides :
  - "Créer un formulaire"
  - "Voir tous les formulaires"

### 3. Page Liste des Formulaires

#### `app/dashboard/forms/page.tsx`
- [ ] Tableau/liste avec colonnes :
  - Titre (lien vers édition)
  - Statut (Brouillon / Publié) avec badge
  - Date de création
  - Nombre de réponses
  - Dernière réponse
  - Actions (menu dropdown) :
    - Éditer
    - Prévisualiser
    - Partager
    - Voir réponses
    - Dupliquer
    - Supprimer
- [ ] Filtres :
  - Recherche par titre
  - Filtre par statut
  - Tri (date, réponses)
- [ ] Pagination ou infinite scroll
- [ ] État vide si aucun formulaire
- [ ] Bouton "Nouveau formulaire" en haut

### 4. Server Actions pour Formulaires

#### `app/actions/forms.ts`
```typescript
'use server'

export async function getForms() {
  // Récupérer tous les formulaires de l'org
}

export async function getForm(id: string) {
  // Récupérer un formulaire par ID
}

export async function createForm(data: { title: string, layout: 'one' | 'page' }) {
  // Créer un nouveau formulaire
  // Générer slug unique
  // Rediriger vers /dashboard/forms/[id]/edit
}

export async function updateForm(id: string, data: Partial<Form>) {
  // Mettre à jour un formulaire
}

export async function deleteForm(id: string) {
  // Supprimer un formulaire (soft delete ou hard)
}

export async function duplicateForm(id: string) {
  // Dupliquer un formulaire
}
```

### 5. Page Choix du Layout

#### `app/dashboard/forms/new/page.tsx`
- [ ] Écran de choix avec 2 options :
  - **"One-by-one"** : une question par page (comme Typeform)
  - **"All-in-one"** : tout sur une page
- [ ] Design : grandes cartes cliquables avec :
  - Illustration/icône
  - Titre
  - Description
  - Avantages listés
- [ ] Au clic : créer le formulaire et rediriger vers l'éditeur
- [ ] Bouton "Annuler" retour dashboard

### 6. Composants Dashboard

#### `components/dashboard/FormList.tsx`
- [ ] Composant réutilisable pour la liste
- [ ] Props : forms[], onEdit, onDelete, etc.
- [ ] Loading states avec skeleton

#### `components/dashboard/FormCard.tsx`
- [ ] Carte individuelle de formulaire
- [ ] Stats visuelles (nombre réponses)
- [ ] Badge statut
- [ ] Menu actions

#### `components/dashboard/StatsGrid.tsx`
- [ ] Grille de statistiques
- [ ] Utiliser StatCard (Module 4)

#### `components/dashboard/EmptyForms.tsx`
- [ ] État vide avec message
- [ ] Bouton CTA "Créer votre premier formulaire"

### 7. Navigation et Routing

#### Middleware de protection
- [ ] Vérifier que toutes les routes `/dashboard/**` sont protégées
- [ ] Redirection automatique si non authentifié

#### Navigation Sidebar
- [ ] Liens actifs highlight
- [ ] Utiliser `usePathname()` de Next.js
- [ ] Animation sur hover/active

### 8. Gestion des Erreurs

#### Error Boundaries
- [ ] `app/dashboard/error.tsx` pour erreurs globales
- [ ] Messages d'erreur user-friendly
- [ ] Bouton "Réessayer"

### 9. Loading States

#### Loading UI
- [ ] `app/dashboard/loading.tsx` pour loading global
- [ ] Skeleton loaders pour les listes
- [ ] Spinners pour les actions

## Design à Respecter

### Style
- Fond : `#F8FAFC` (slate-50)
- Cards : blanc avec shadow-md, radius 14px
- Espacement : gap-4, p-6
- Typo : Inter

### Couleurs
- Primaire : #0EA5E9 pour les CTAs
- Badge "Publié" : vert
- Badge "Brouillon" : gris

### Animations
- Fade-in pour les listes
- Hover effects sur les cartes
- Transitions fluides

## Checklist de Validation
- [ ] Dashboard affiche les stats correctes
- [ ] Liste des formulaires fonctionnelle
- [ ] Création de formulaire avec choix layout
- [ ] Actions (éditer, supprimer, dupliquer) fonctionnelles
- [ ] Navigation fonctionnelle
- [ ] Responsive mobile
- [ ] Loading states partout
- [ ] Gestion erreurs complète
- [ ] Design cohérent et moderne

## Notes Importantes
- Toutes les données doivent venir de Supabase
- Vérifier les permissions RLS (Module 2)
- Utiliser les Server Actions pour les mutations
- Code propre et bien typé
- Performance : pagination ou virtualisation pour grandes listes

## Livrable
Un dashboard complet et fonctionnel avec navigation, liste des formulaires, statistiques, et toutes les actions nécessaires pour gérer les formulaires.


