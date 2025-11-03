# Landing Page Components

Ce dossier contient tous les composants de la landing page (page d'accueil publique).

## Composants

### Navbar
Barre de navigation fixe en haut de la page avec :
- Logo et nom de l'application
- Liens de navigation
- Boutons CTA vers l'inscription et la connexion
- Menu mobile responsive

### Hero
Section principale avec :
- Titre accrocheur avec gradient
- Description de l'application
- Boutons CTA principaux (Commencer gratuitement / Se connecter)
- Animations de fond (blobs animés)
- Mockup de prévisualisation

### Features
Section présentant les fonctionnalités principales :
- Grille de 6 fonctionnalités clés
- Icônes colorées
- Effets de hover
- Animations au scroll (FadeIn)

### CTA (Call To Action)
Section avec fond gradient pour encourager l'inscription :
- Titre et description
- Boutons d'action
- Liste des avantages
- Design attrayant avec éléments décoratifs

### Footer
Pied de page complet avec :
- Logo et description
- Liens organisés par catégorie (Produit, Entreprise, Légal)
- Liens vers les réseaux sociaux
- Copyright

## Animations

Les composants utilisent des animations définies dans :
- `components/animations/FadeIn.tsx` - Apparition en fondu
- `components/animations/ScaleIn.tsx` - Apparition avec zoom
- `app/globals.css` - Animations CSS (blob, float)

## Utilisation

La landing page est composée dans `app/page.tsx` :

```tsx
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
```

## Personnalisation

Pour personnaliser la landing page :

1. **Couleurs** : Modifiez les classes Tailwind dans chaque composant
2. **Contenu** : Éditez directement les textes dans les composants
3. **Fonctionnalités** : Modifiez le tableau `features` dans `Features.tsx`
4. **Liens footer** : Modifiez l'objet `footerLinks` dans `Footer.tsx`
5. **Réseaux sociaux** : Modifiez le tableau `socialLinks` dans `Footer.tsx`

## Responsive Design

Tous les composants sont entièrement responsive avec :
- Design mobile-first
- Points de rupture : `sm:`, `md:`, `lg:`
- Menu mobile dans la Navbar
- Grilles adaptatives

## SEO

Les métadonnées sont définies dans `app/layout.tsx` pour optimiser le référencement.

