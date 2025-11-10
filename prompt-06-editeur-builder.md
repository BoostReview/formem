# 🛠️ Module 6 : Éditeur de Formulaire (Builder)

## Objectif
Créer l'éditeur visuel complet permettant de construire des formulaires avec drag & drop, édition inline, et panneau de propriétés.

## Contexte Global
L'éditeur est le cœur du produit. Il doit être fluide, intuitif, et permettre de créer des formulaires complexes facilement.

## Tâches à Réaliser

### 1. Layout de l'Éditeur

#### `app/dashboard/forms/[id]/edit/page.tsx`
- [ ] Topbar avec :
  - Titre du formulaire (éditable)
  - Tabs : Éditer | Prévisualiser | Publier
  - Indicateur "Sauvegardé ✓" ou "Enregistrement..."
  - Bouton "Quitter"
- [ ] Layout 3 colonnes :
  - **Gauche** : Palette de blocs (draggable)
  - **Centre** : Canvas (drop zone)
  - **Droite** : Panneau de propriétés

### 2. Types et Schémas

#### Types pour les Blocs (`types/form-builder.ts`)
```typescript
type BlockType = 
  | 'heading'
  | 'paragraph'
  | 'single-choice'
  | 'multiple-choice'
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'slider'
  | 'date'
  | 'yes-no'
  | 'consent'
  | 'youtube';

interface Block {
  id: string;
  type: BlockType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // pour single/multiple choice
  // ... autres props selon le type
}

interface FormSchema {
  blocks: Block[];
  theme: ThemeConfig;
  settings: SettingsConfig;
}
```

### 3. Palette de Blocs (Colonne Gauche)

#### `components/form-builder/BlockPalette.tsx`
- [ ] Liste de tous les blocs disponibles avec :
  - Icône (lucide-react)
  - Label
  - Description courte
- [ ] Blocs à inclure :
  - **Heading** - Titre
  - **Paragraph** - Paragraphe
  - **Single choice** - Radio buttons
  - **Multiple choice** - Checkboxes
  - **Text** - Input texte
  - **Textarea** - Zone de texte
  - **Email** - Input email
  - **Phone** - Input téléphone
  - **Number** - Input nombre
  - **Slider** - Slider
  - **Date** - Sélecteur de date
  - **Yes-No** - Oui/Non
  - **Consent** - Case consentement
  - **YouTube** - Vidéo YouTube (oEmbed)
- [ ] Drag & drop vers le canvas
- [ ] Animation au hover

### 4. Canvas (Zone Centrale)

#### `components/form-builder/FormCanvas.tsx`
- [ ] Zone de drop pour les blocs
- [ ] Affichage de tous les blocs du formulaire
- [ ] Sélection de bloc (highlight)
- [ ] Réorganisation par drag & drop
- [ ] Boutons : Dupliquer, Supprimer (sur sélection)
- [ ] Inline edit pour :
  - Labels
  - Placeholders
  - Options (pour choices)
- [ ] Animation légère à l'ajout (scale-in)
- [ ] Zones de drop visuelles entre blocs

### 5. Rendu des Blocs

#### `components/form-builder/blocks/HeadingBlock.tsx`
- [ ] Affiche un titre (h1, h2, h3)
- [ ] Inline edit du texte
- [ ] Propriétés : niveau (h1/h2/h3), alignement

#### `components/form-builder/blocks/ParagraphBlock.tsx`
- [ ] Affiche un paragraphe
- [ ] Inline edit du texte

#### `components/form-builder/blocks/SingleChoiceBlock.tsx`
- [ ] Radio buttons
- [ ] Inline edit des options
- [ ] Ajout/suppression d'options

#### `components/form-builder/blocks/MultipleChoiceBlock.tsx`
- [ ] Checkboxes
- [ ] Inline edit des options
- [ ] Ajout/suppression d'options

#### `components/form-builder/blocks/TextBlock.tsx`
- [ ] Input texte
- [ ] Placeholder éditable

#### `components/form-builder/blocks/EmailBlock.tsx`
- [ ] Input email
- [ ] Validation email

#### `components/form-builder/blocks/PhoneBlock.tsx`
- [ ] Input téléphone
- [ ] Formatage avec libphonenumber-js

#### `components/form-builder/blocks/NumberBlock.tsx`
- [ ] Input nombre
- [ ] Min/max configurables

#### `components/form-builder/blocks/SliderBlock.tsx`
- [ ] Slider (shadcn/ui)
- [ ] Min/max/step configurables

#### `components/form-builder/blocks/DateBlock.tsx`
- [ ] Sélecteur de date
- [ ] Types : date, datetime, time

#### `components/form-builder/blocks/YesNoBlock.tsx`
- [ ] Toggle Oui/Non
- [ ] Style moderne

#### `components/form-builder/blocks/ConsentBlock.tsx`
- [ ] Checkbox + texte
- [ ] Texte éditable

#### `components/form-builder/blocks/YouTubeBlock.tsx`
- [ ] Affiche vidéo YouTube (oEmbed)
- [ ] Input URL YouTube
- [ ] Validation URL

#### Composant Wrapper : `components/form-builder/blocks/BlockWrapper.tsx`
- [ ] Wrapper commun pour tous les blocs
- [ ] Gestion sélection
- [ ] Actions (dupliquer, supprimer)
- [ ] Drag handle

### 6. Panneau de Propriétés (Colonne Droite)

#### `components/form-builder/PropertyPanel.tsx`
- [ ] Tabs : Champs | Apparence | Thème | Logique
- [ ] Affiche les propriétés du bloc sélectionné

#### Onglet "Champs"
- [ ] Label (input)
- [ ] Placeholder (input)
- [ ] Required (switch)
- [ ] Options (pour choices) - liste éditable
- [ ] Validation (pour certains types)

#### Onglet "Apparence"
- [ ] Largeur (full, 1/2, 1/3)
- [ ] Alignement (left, center, right)
- [ ] Espacement (margin)

#### Onglet "Thème"
- [ ] Couleur primaire (color picker)
- [ ] Police (select)
- [ ] Radius (slider)
- [ ] Appliqué globalement au formulaire

#### Onglet "Logique"
- [ ] Show/Hide conditionnelle simple
- [ ] Si bloc X = valeur Y, alors afficher ce bloc

### 7. Drag & Drop

#### Utiliser `@dnd-kit/core` ou `react-beautiful-dnd`
- [ ] Drag depuis la palette
- [ ] Drop sur le canvas
- [ ] Réorganisation des blocs existants
- [ ] Visual feedback pendant le drag

### 8. Autosave

#### `hooks/useAutosave.ts`
- [ ] Sauvegarde automatique dans localStorage (débauche)
- [ ] Sauvegarde dans Supabase toutes les 2-3 secondes
- [ ] Indicateur visuel "Sauvegardé ✓"
- [ ] Gestion des conflits (si plusieurs onglets)

#### Server Action
```typescript
'use server'

export async function saveForm(id: string, schema: FormSchema) {
  // Sauvegarder schema_json dans Supabase
  // Retourner success/error
}
```

### 9. Prévisualisation

#### `app/dashboard/forms/[id]/preview/page.tsx`
- [ ] Utilise le même renderer que le rendu public (Module 7)
- [ ] Mode prévisualisation (pas de soumission réelle)
- [ ] Toggle entre layouts (one-by-one / all-in-one)
- [ ] Navigation fluide

### 10. Gestion d'État

#### Utiliser Zustand ou React Context
- [ ] Store pour le formulaire en cours
- [ ] Store pour le bloc sélectionné
- [ ] Store pour le mode (edit/preview)

## Design à Respecter

### Style
- Canvas : fond blanc avec bordure subtile
- Blocs : cards avec shadow-sm, radius 8px
- Sélection : bordure bleue (primary color)
- Hover : légère élévation

### Interactions
- Clic sur bloc = sélection
- Double-clic = inline edit
- Drag handle visible au hover
- Animations fluides (200-250ms)

## Checklist de Validation
- [ ] Tous les types de blocs créés et fonctionnels
- [ ] Drag & drop fonctionnel
- [ ] Inline edit fonctionnel
- [ ] Panneau de propriétés mis à jour selon sélection
- [ ] Autosave fonctionnel (localStorage + Supabase)
- [ ] Réorganisation des blocs fonctionnelle
- [ ] Duplication/suppression fonctionnelle
- [ ] Thème global appliqué
- [ ] Logique show/hide fonctionnelle
- [ ] Responsive (panneaux empilés sur mobile)

## Notes Importantes
- Performance : éviter les re-renders massifs
- UX : feedback visuel immédiat pour toutes les actions
- Code modulaire : chaque bloc est un composant indépendant
- Validation : schéma Zod pour valider le FormSchema

## Livrable
Un éditeur de formulaire complet, fluide et intuitif, permettant de créer des formulaires complexes avec tous les types de blocs, drag & drop, et édition en temps réel.





