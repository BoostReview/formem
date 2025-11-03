# 📊 Module 8 : Gestion des Réponses et Tableau

## Objectif
Créer le tableau de gestion des réponses avec filtres, recherche, exports (CSV/XLSX), et visualisation détaillée.

## Contexte Global
Les utilisateurs doivent pouvoir voir toutes les réponses de leurs formulaires dans un tableau moderne, les filtrer, et les exporter.

## Tâches à Réaliser

### 1. Page des Réponses

#### `app/dashboard/forms/[id]/responses/page.tsx`
- [ ] En-tête avec :
  - Titre du formulaire
  - Nombre total de réponses
  - Bouton "Exporter"
  - Filtres (dropdown)
- [ ] Tableau principal avec TanStack Table
- [ ] Pagination ou infinite scroll

### 2. Tableau avec TanStack Table

#### `components/responses/ResponsesTable.tsx`
- [ ] Colonnes à afficher :
  - **Date** : created_at (formaté)
  - **Email** : email (si présent)
  - **Téléphone** : phone_e164 (formaté)
  - **Source** : source (badge : link/embed)
  - **UTM** : utm_source, utm_medium, utm_campaign (expandable)
  - **Réponses** : aperçu des answers_json (truncated)
  - **Actions** : bouton "Voir détails"
- [ ] Tri sur chaque colonne
- [ ] Sélection multiple (checkboxes)
- [ ] Actions groupées : exporter sélection, supprimer sélection

### 3. Filtres et Recherche

#### `components/responses/ResponseFilters.tsx`
- [ ] Filtre par date :
  - Aujourd'hui
  - Cette semaine
  - Ce mois
  - Personnalisé (date picker)
- [ ] Filtre par source : link / embed / tous
- [ ] Recherche textuelle :
  - Dans email
  - Dans téléphone
  - Dans answers_json
- [ ] Bouton "Réinitialiser"

### 4. Export des Données

#### `components/responses/ExportButton.tsx`
- [ ] Dropdown : CSV, XLSX
- [ ] Exporter tout ou sélection
- [ ] Formatage des données :
  - Colonnes : Date, Email, Téléphone, Source, UTM, et toutes les réponses
  - Expand answers_json en colonnes individuelles
  - Format dates lisible
  - Format téléphones lisible

#### Fonctions d'export
```typescript
// lib/exports/exportToCSV.ts
export async function exportToCSV(data: Response[], formSchema: Form) {
  // Utiliser json2csv ou papaparse
  // Télécharger le fichier
}

// lib/exports/exportToXLSX.ts
export async function exportToXLSX(data: Response[], formSchema: Form) {
  // Utiliser xlsx
  // Créer workbook avec plusieurs sheets si nécessaire
  // Télécharger le fichier
}
```

### 5. Modal de Détails

#### `components/responses/ResponseDetailModal.tsx`
- [ ] Modal (Dialog shadcn/ui) avec :
  - Toutes les informations de la réponse
  - Answers_json formaté de manière lisible
  - Métadonnées : IP, User-Agent, date, source
  - UTM params si présents
  - Hidden fields si présents
- [ ] Design : liste claire et organisée
- [ ] Bouton "Fermer"

### 6. Server Actions

#### `app/actions/responses.ts`
```typescript
'use server'

export async function getResponses(formId: string, filters?: {
  dateFrom?: Date,
  dateTo?: Date,
  source?: 'link' | 'embed',
  search?: string
}) {
  // Récupérer réponses avec filtres
  // Pagination
  // Retourner { data, total, page, pageSize }
}

export async function deleteResponse(id: string) {
  // Supprimer une réponse
}

export async function deleteResponses(ids: string[]) {
  // Supprimer plusieurs réponses
}
```

### 7. Formatage des Données

#### Utilitaires
```typescript
// lib/formatters/formatResponse.ts
export function formatResponseDate(date: Date): string {
  // Format : "15 Jan 2024, 14:30"
}

export function formatPhone(phone: string): string {
  // Format lisible depuis phone_e164
}

export function formatAnswers(answers: JSONB, schema: FormSchema): Record<string, any> {
  // Expand answers_json selon le schema du formulaire
  // Créer un objet clé-valeur lisible
}
```

### 8. Statistiques des Réponses

#### `components/responses/ResponseStats.tsx`
- [ ] Widgets de stats :
  - Total réponses
  - Réponses aujourd'hui
  - Réponses cette semaine
  - Taux de complétion (si calculable)
- [ ] Graphique simple (optionnel) : évolution dans le temps

### 9. Gestion des Erreurs

#### États d'erreur
- [ ] Erreur de chargement : message + bouton réessayer
- [ ] Erreur d'export : toast d'erreur
- [ ] Aucune réponse : EmptyState

### 10. Performance

#### Optimisations
- [ ] Virtualisation du tableau (si beaucoup de réponses)
- [ ] Pagination côté serveur
- [ ] Debounce sur la recherche
- [ ] Lazy loading des détails

### 11. Exports Avancés

#### Expansion des Réponses
- [ ] Pour chaque champ du formulaire, créer une colonne
- [ ] Nom de colonne = label du bloc
- [ ] Valeur = réponse correspondante
- [ ] Gérer les réponses multiples (multiple-choice → join avec virgule)

#### Formats
- [ ] CSV : séparateur virgule, UTF-8
- [ ] XLSX : plusieurs sheets si nécessaire, formatage des dates

## Design à Respecter

### Style
- Tableau : propre et lisible
- Colonnes : largeurs adaptatives
- Lignes : hover effect subtil
- Badges : couleurs pour source (link=bleu, embed=violet)

### Interactions
- Clic sur ligne : ouvrir détails
- Hover : highlight subtil
- Tri : indicateur visuel (flèche)
- Export : loading state pendant génération

## Checklist de Validation
- [ ] Tableau affiche toutes les réponses
- [ ] Tri fonctionnel sur toutes les colonnes
- [ ] Filtres fonctionnels (date, source, recherche)
- [ ] Export CSV fonctionnel
- [ ] Export XLSX fonctionnel
- [ ] Modal de détails complète
- [ ] Pagination fonctionnelle
- [ ] Suppression (simple et multiple) fonctionnelle
- [ ] Formatage des données correct
- [ ] Performance acceptable (même avec beaucoup de réponses)
- [ ] Responsive mobile (tableau scrollable horizontal)

## Notes Importantes
- Performance : ne pas charger toutes les réponses d'un coup
- UX : feedback immédiat pour toutes les actions
- Données : expansion des answers_json doit être intelligente
- Code modulaire : composants réutilisables

## Livrable
Un système complet de gestion des réponses avec tableau moderne, filtres, exports CSV/XLSX, et visualisation détaillée, prêt pour production.


