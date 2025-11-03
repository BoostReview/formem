# 🌍 Module 9 : Publication et Partage

## Objectif
Créer le système complet de publication, partage, QR codes, et intégration iFrame avec auto-height.

## Contexte Global
Les formulaires doivent être publiables, partageables via lien, QR code, ou iFrame, avec gestion des paramètres (max réponses, expiration, redirection).

## Tâches à Réaliser

### 1. Page Publication

#### `app/dashboard/forms/[id]/publish/page.tsx`
- [ ] En-tête : titre du formulaire
- [ ] Toggle principal : "Brouillon" / "Publié"
- [ ] Section "Lien public" :
  - URL complète : `https://app.domaine.com/f/[slug]`
  - Boutons : Copier, Ouvrir dans nouvel onglet
  - Génération QR code
- [ ] Section "iFrame" :
  - Code HTML `<iframe>`
  - Script auto-height (`/embed.js`)
  - Bouton "Copier"
- [ ] Section "Paramètres" :
  - Max réponses (input number)
  - Date d'expiration (date picker)
  - URL de redirection après soumission (input)
- [ ] Section "Tracking" :
  - UTM params disponibles
  - Hidden fields

### 2. Toggle Publication

#### Server Action
```typescript
'use server'

export async function togglePublish(formId: string, published: boolean) {
  // Mettre à jour forms.published
  // Générer slug si première publication
  // Retourner { success, slug? }
}
```

#### Génération Slug
- [ ] Si slug n'existe pas → générer depuis le titre
- [ ] Format : `mon-formulaire` (lowercase, hyphens)
- [ ] Vérifier unicité (si existe → ajouter suffixe)
- [ ] Utiliser `slugify` ou fonction custom

### 3. Partage de Lien

#### `components/publish/LinkShare.tsx`
- [ ] Affiche l'URL complète
- [ ] Bouton "Copier" avec feedback (toast)
- [ ] Bouton "Ouvrir" (nouvel onglet)
- [ ] QR code généré dynamiquement

#### Génération QR Code
```typescript
// lib/qrcode/generateQRCode.ts
import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  // Générer QR code en SVG ou PNG
  // Retourner data URL ou blob
}
```

#### Composant QR Code
- [ ] `components/publish/QRCodeDisplay.tsx`
- [ ] Affiche QR code (image)
- [ ] Bouton "Télécharger" (PNG/SVG)
- [ ] Tailles variantes

### 4. Intégration iFrame

#### Code iFrame à fournir
```html
<iframe
  src="https://app.domaine.com/f/[slug]?embed=true"
  width="100%"
  height="600"
  frameborder="0"
  id="form-iframe-[slug]"
></iframe>
<script src="https://app.domaine.com/embed.js"></script>
```

#### Script Auto-Height (`app/embed.js`)
```javascript
// Détecter iframes avec data-auto-height
// Écouter postMessage depuis le formulaire
// Ajuster la hauteur automatiquement
// Utiliser ResizeObserver en fallback
```

#### Composant Embed Code
- [ ] `components/publish/EmbedCode.tsx`
- [ ] Textarea avec code HTML (readonly)
- [ ] Bouton "Copier"
- [ ] Syntax highlighting (optionnel)

### 5. Auto-Height pour iFrame

#### Dans le Renderer Public
- [ ] Détecter si dans iframe (`window.parent !== window`)
- [ ] Envoyer postMessage avec hauteur lors de changements
- [ ] Utiliser ResizeObserver pour détecter changements de hauteur
- [ ] Débounce les messages (toutes les 100ms max)

#### Script `/embed.js`
- [ ] Écouter les postMessages
- [ ] Trouver l'iframe correspondant
- [ ] Ajuster la hauteur

### 6. Paramètres de Publication

#### Server Action
```typescript
'use server'

export async function updateFormSettings(
  formId: string, 
  settings: {
    maxResponses?: number,
    expiresAt?: Date,
    redirectUrl?: string
  }
) {
  // Mettre à jour forms.settings_json
  // Validation
}
```

#### Composant Settings
- [ ] `components/publish/FormSettings.tsx`
- [ ] Inputs pour chaque paramètre
- [ ] Validation (dates, URLs)
- [ ] Sauvegarde automatique ou bouton "Sauvegarder"

### 7. Tracking et UTM

#### Documentation UTM
- [ ] Afficher les paramètres UTM disponibles :
  - `?utm_source=...`
  - `?utm_medium=...`
  - `?utm_campaign=...`
- [ ] Exemple de lien avec UTM
- [ ] Explication de leur usage

#### Hidden Fields
- [ ] Documentation pour `?ref=...`
- [ ] Exemple d'utilisation

### 8. API Routes

#### `app/api/forms/[id]/publish/route.ts` (POST)
- [ ] Publier/dépublier un formulaire
- [ ] Générer slug si nécessaire
- [ ] Validation des paramètres

#### `app/api/forms/[id]/share/route.ts` (GET)
- [ ] Retourner données de partage :
  - URL publique
  - Code iFrame
  - QR code (data URL)
  - Paramètres

### 9. Vérifications Avant Publication

#### Validation
- [ ] Vérifier que le formulaire a au moins un bloc
- [ ] Vérifier que le titre est défini
- [ ] Afficher warnings si nécessaire

#### Feedback Utilisateur
- [ ] Toast de succès après publication
- [ ] Indicateur visuel du statut (publié/brouillon)
- [ ] Badge dans la liste des formulaires

### 10. Short Codes (Optionnel)

#### Génération short_code
- [ ] Utiliser `nanoid` pour générer code court
- [ ] Format : 6-8 caractères alphanumeriques
- [ ] URL alternative : `/f/s/[short_code]`
- [ ] Stocker dans `forms.share` (table séparée ou JSON)

### 11. Analytics de Partage

#### Tracking
- [ ] Compter les clics sur "Copier"
- [ ] Compter les générations de QR code
- [ ] Stocker dans DB (optionnel pour MVP)

## Design à Respecter

### Style
- Sections bien séparées
- Code blocks avec fond gris
- Boutons d'action clairs
- QR code centré et de bonne taille

### Interactions
- Copier → toast de confirmation
- Toggle → animation fluide
- QR code → hover effect (optionnel)

## Checklist de Validation
- [ ] Toggle publication fonctionnel
- [ ] Slug généré automatiquement
- [ ] Lien public copiable
- [ ] QR code généré et téléchargeable
- [ ] Code iFrame copiable
- [ ] Auto-height fonctionne dans iframe
- [ ] Paramètres sauvegardés (maxResponses, expiresAt, redirectUrl)
- [ ] Vérifications avant publication
- [ ] API routes fonctionnelles
- [ ] Design cohérent et moderne

## Notes Importantes
- Sécurité : vérifier permissions avant publication
- Performance : QR code généré à la demande (pas au chargement)
- UX : feedback immédiat pour toutes les actions
- Code : réutiliser composants existants

## Livrable
Un système complet de publication et partage avec toggle, liens, QR codes, iFrame avec auto-height, et tous les paramètres nécessaires.


