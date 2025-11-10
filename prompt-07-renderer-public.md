# ✨ Module 7 : Renderer Public (Formulaire Visible)

## Objectif
Créer le système de rendu public des formulaires avec les deux layouts (one-by-one et all-in-one), animations fluides, et sécurité anti-spam.

## Contexte Global
Les formulaires publiés sont accessibles publiquement via `/f/[slug]`. Ils doivent être fluides, beaux, et sécurisés contre le spam.

## Tâches à Réaliser

### 1. Route Publique

#### `app/f/[slug]/page.tsx`
- [ ] Récupérer le formulaire par slug (Server Component)
- [ ] Vérifier : published = true
- [ ] Vérifier : non expiré (expiresAt)
- [ ] Vérifier : maxResponses non atteint
- [ ] Afficher le renderer selon le layout
- [ ] Gestion erreur 404 si formulaire inexistant/non publié

### 2. Composant Renderer Principal

#### `components/form-renderer/FormRenderer.tsx`
- [ ] Props : `form` (avec schema_json)
- [ ] Détecte le layout (form.layout)
- [ ] Rend soit OneByOneRenderer soit AllInOneRenderer
- [ ] Applique le thème global (theme_json)

### 3. Layout One-by-One

#### `components/form-renderer/OneByOneRenderer.tsx`
- [ ] Affiche une question par "page"
- [ ] Navigation automatique après réponse unique :
  - Single choice : clic = réponse enregistrée + transition
  - Yes-No : clic = transition
  - Instant select (pas de bouton "Suivant")
- [ ] Pour autres types : bouton "Suivant"
- [ ] Barre de progression en haut
- [ ] Calcul : (index actuel + 1) / total blocs
- [ ] Animations Framer Motion :
  - Sortie du bloc actuel : fadeOut + slideLeft
  - Entrée du bloc suivant : fadeIn + slideRight
  - Durée : 250ms
- [ ] Hotkeys :
  - `1-9` : sélectionner option (pour choices)
  - `Enter` : suivant
  - `ArrowRight` : suivant
  - `ArrowLeft` : précédent (optionnel, mais pas visible)
- [ ] Pas de bouton "Retour" visible
- [ ] État : sauvegarde progressive dans localStorage (réponses partielles)

### 4. Layout All-in-One

#### `components/form-renderer/AllInOneRenderer.tsx`
- [ ] Affiche tous les champs sur une page
- [ ] Validation globale avant soumission
- [ ] Bouton "Envoyer" en bas
- [ ] Scroll fluide vers erreurs si validation échoue
- [ ] Indicateur de progression (optionnel)

### 5. Rendu des Blocs (Public)

#### Créer les composants dans `components/form-renderer/blocks/`
- [ ] `HeadingBlock.tsx` - Titre
- [ ] `ParagraphBlock.tsx` - Paragraphe
- [ ] `SingleChoiceBlock.tsx` - Radio buttons
- [ ] `MultipleChoiceBlock.tsx` - Checkboxes
- [ ] `TextBlock.tsx` - Input texte
- [ ] `TextareaBlock.tsx` - Textarea
- [ ] `EmailBlock.tsx` - Input email
- [ ] `PhoneBlock.tsx` - Input téléphone (formatage)
- [ ] `NumberBlock.tsx` - Input nombre
- [ ] `SliderBlock.tsx` - Slider
- [ ] `DateBlock.tsx` - Date picker
- [ ] `YesNoBlock.tsx` - Toggle
- [ ] `ConsentBlock.tsx` - Checkbox consentement
- [ ] `YouTubeBlock.tsx` - Vidéo YouTube (oEmbed)

#### Chaque bloc doit :
- [ ] Respecter le thème global (couleurs, radius, police)
- [ ] Validation côté client (react-hook-form + zod)
- [ ] Messages d'erreur en français
- [ ] Accessibilité (aria-labels, keyboard navigation)

### 6. Gestion des Réponses

#### Hook `hooks/useFormSubmission.ts`
- [ ] Collecte toutes les réponses
- [ ] Validation complète
- [ ] Extraction email, téléphone
- [ ] Formatage téléphone (libphonenumber-js → phone_e164)
- [ ] Récupération UTM params
- [ ] Récupération hidden fields (?ref=)
- [ ] Détection source (link ou embed)
- [ ] Envoi vers API route

### 7. API Route de Réception

#### `app/api/forms/[id]/lead/route.ts` (POST)
- [ ] Vérifier honeypot
- [ ] Vérifier délai minimum (300-500ms)
- [ ] Vérifier maxResponses
- [ ] Vérifier expiresAt
- [ ] Valider les données
- [ ] Extraire IP et User-Agent
- [ ] Sauvegarder dans `responses` table
- [ ] Retourner success ou erreur

### 8. Sécurité Anti-Spam

#### Honeypot
- [ ] Champ caché dans le formulaire
- [ ] Si rempli → rejeter la soumission
- [ ] Nom de champ : `website_url` ou similaire

#### Délai Minimum
- [ ] Calculer temps entre première interaction et soumission
- [ ] Si < 300ms → rejeter (bot probable)

#### Rate Limiting
- [ ] Limiter par IP (optionnel pour MVP)
- [ ] Utiliser headers ou middleware

### 9. Page de Remerciement

#### `components/form-renderer/ThankYouPage.tsx`
- [ ] Affichage après soumission réussie
- [ ] Personnalisable via settings_json :
  - Titre
  - Texte
  - Image (optionnel)
- [ ] Option de redirection :
  - Si `settings_json.redirectUrl` → rediriger après 2-3 secondes
- [ ] Animation d'apparition

### 10. Tracking et Analytics

#### Extraction UTM
- [ ] Récupérer depuis URL : `?utm_source=...&utm_medium=...&utm_campaign=...`
- [ ] Stocker dans `responses.utm_json`

#### Hidden Fields
- [ ] Récupérer depuis URL : `?ref=...`
- [ ] Stocker dans `responses.hidden_json`

#### Source
- [ ] Détecter si dans iframe → `source = 'embed'`
- [ ] Sinon → `source = 'link'`

### 11. Hotkeys et Accessibilité

#### Hook `hooks/useHotkeys.ts`
- [ ] Gestion des hotkeys pour one-by-one
- [ ] `1-9` : sélectionner option
- [ ] `Enter` : suivant
- [ ] `Escape` : quitter (optionnel)

### 12. Responsive Design

#### Mobile
- [ ] Layout optimisé pour mobile
- [ ] Animations adaptées (plus courtes)
- [ ] Touch-friendly (grandes zones de clic)
- [ ] Keyboard mobile (pas de hotkeys)

## Design à Respecter

### Style
- Fond : respecter theme_json ou défaut
- Typo : Inter
- Radius : 14-16px
- Espacement : généreux
- Animations : fluides (250ms)

### Animations One-by-One
- Slide out gauche + fade out
- Slide in droite + fade in
- Barre de progression animée

### États
- Focus : bordure primaire
- Erreur : bordure rouge + message
- Succès : feedback visuel après soumission

## Checklist de Validation
- [ ] Route `/f/[slug]` fonctionnelle
- [ ] Layout one-by-one fonctionnel avec animations
- [ ] Layout all-in-one fonctionnel
- [ ] Tous les types de blocs rendus correctement
- [ ] Validation côté client fonctionnelle
- [ ] Soumission fonctionnelle (API route)
- [ ] Honeypot fonctionne
- [ ] Délai minimum fonctionne
- [ ] Page de remerciement affichée
- [ ] Redirection optionnelle fonctionne
- [ ] UTM et hidden fields capturés
- [ ] Hotkeys fonctionnelles (one-by-one)
- [ ] Responsive mobile parfait
- [ ] Accessibilité de base

## Notes Importantes
- Performance : code splitting pour le renderer
- UX : feedback immédiat pour toutes les actions
- Sécurité : ne jamais faire confiance au client
- Code réutilisable : même logique de rendu que dans le builder (si possible)

## Livrable
Un système de rendu public complet, fluide et sécurisé, avec les deux layouts, animations, validation, et toutes les fonctionnalités nécessaires pour recevoir des réponses.





