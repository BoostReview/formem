# 📋 Guide d'Utilisation des Prompts Modulaires

Ce document explique comment utiliser les 10 prompts modulaires pour développer le SaaS Form Builder en parallèle.

## 🎯 Objectif

Diviser le développement en **10 modules indépendants** pouvant être travaillés simultanément par différents agents Cursor.

## 📦 Modules Disponibles

### Module 1 : Setup Initial ⚙️
**Fichier :** `prompt-01-setup-initial.md`
- **Priorité :** 🔴 HAUTE (doit être fait en premier)
- **Description :** Configuration initiale Next.js, structure, dépendances
- **Durée estimée :** 1-2h
- **Dépendances :** Aucune

### Module 2 : Base de Données 🗄️
**Fichier :** `prompt-02-base-de-donnees.md`
- **Priorité :** 🔴 HAUTE (peut être fait en parallèle avec Module 1)
- **Description :** Schémas Supabase, tables, RLS, fonctions SQL
- **Durée estimée :** 2-3h
- **Dépendances :** Aucune (mais doit être fait avant Module 3+)

### Module 3 : Authentification 🔐
**Fichier :** `prompt-03-authentification.md`
- **Priorité :** 🟡 MOYENNE
- **Description :** Pages signin/signup, middleware, hooks
- **Durée estimée :** 2-3h
- **Dépendances :** Module 1, Module 2

### Module 4 : Design System 🎨
**Fichier :** `prompt-04-design-system.md`
- **Priorité :** 🟡 MOYENNE (peut être fait en parallèle)
- **Description :** Composants shadcn/ui, thème, design tokens
- **Durée estimée :** 3-4h
- **Dépendances :** Module 1

### Module 5 : Dashboard 📊
**Fichier :** `prompt-05-dashboard.md`
- **Priorité :** 🟡 MOYENNE
- **Description :** Dashboard principal, liste formulaires, navigation
- **Durée estimée :** 3-4h
- **Dépendances :** Module 1, Module 2, Module 3, Module 4

### Module 6 : Éditeur Builder 🛠️
**Fichier :** `prompt-06-editeur-builder.md`
- **Priorité :** 🔴 HAUTE (cœur du produit)
- **Description :** Éditeur visuel avec drag & drop, blocs, propriétés
- **Durée estimée :** 6-8h
- **Dépendances :** Module 1, Module 2, Module 4

### Module 7 : Renderer Public ✨
**Fichier :** `prompt-07-renderer-public.md`
- **Priorité :** 🔴 HAUTE (cœur du produit)
- **Description :** Rendu public des formulaires, layouts, animations
- **Durée estimée :** 5-6h
- **Dépendances :** Module 1, Module 2, Module 4

### Module 8 : Réponses et Tableau 📊
**Fichier :** `prompt-08-reponses-tableau.md`
- **Priorité :** 🟢 MOYENNE
- **Description :** Tableau des réponses, filtres, exports CSV/XLSX
- **Durée estimée :** 4-5h
- **Dépendances :** Module 1, Module 2, Module 4, Module 5

### Module 9 : Publication et Partage 🌍
**Fichier :** `prompt-09-publication-partage.md`
- **Priorité :** 🟡 MOYENNE
- **Description :** Publication, liens, QR codes, iFrame auto-height
- **Durée estimée :** 3-4h
- **Dépendances :** Module 1, Module 2, Module 6, Module 7

### Module 10 : Documentation 📚
**Fichier :** `prompt-10-documentation-finale.md`
- **Priorité :** 🟢 BASSE (fait à la fin)
- **Description :** README, documentation, finalisation
- **Durée estimée :** 2-3h
- **Dépendances :** Tous les autres modules

## 🔄 Ordre d'Exécution Recommandé

### Phase 1 : Fondations (Parallèle possible)
```
Agent 1 → Module 1 (Setup Initial)
Agent 2 → Module 2 (Base de Données)
```

### Phase 2 : Auth et Design (Parallèle possible)
```
Agent 1 → Module 3 (Authentification)
Agent 2 → Module 4 (Design System)
```

### Phase 3 : Fonctionnalités Principales (Parallèle possible)
```
Agent 1 → Module 6 (Éditeur Builder)
Agent 2 → Module 7 (Renderer Public)
Agent 3 → Module 5 (Dashboard)
```

### Phase 4 : Fonctionnalités Secondaires (Parallèle possible)
```
Agent 1 → Module 8 (Réponses et Tableau)
Agent 2 → Module 9 (Publication et Partage)
```

### Phase 5 : Finalisation
```
Agent 1 → Module 10 (Documentation)
```

## 📝 Comment Utiliser les Prompts

### Pour chaque Agent Cursor :

1. **Ouvrir le prompt correspondant** (`prompt-XX-nom.md`)
2. **Lire attentivement** tout le prompt
3. **Vérifier les dépendances** (modules précédents terminés)
4. **Suivre les tâches** dans l'ordre
5. **Cocher les checklists** au fur et à mesure
6. **Valider** que tout fonctionne avant de passer au suivant

### Exemple d'utilisation :

```
Agent Cursor, tu dois implémenter le Module 3 : Authentification.

Lis le fichier prompt-03-authentification.md et implémente toutes les tâches listées.
Assure-toi que les Modules 1 et 2 sont terminés avant de commencer.
```

## ⚠️ Points d'Attention

### Communication entre Modules
- **Types TypeScript :** Les types doivent être partagés. Créer `types/index.ts` dans Module 1.
- **Composants partagés :** Le Module 4 (Design System) doit être fait avant les modules qui utilisent des composants UI.
- **Base de données :** Le Module 2 doit être validé avant tout module utilisant Supabase.

### Conflits Potentiels
- **Fichiers partagés :** Attention aux conflits Git si plusieurs agents modifient les mêmes fichiers (ex: `lib/utils.ts`)
- **Solution :** Assigner des fichiers spécifiques à chaque module quand possible.

### Validation Inter-Modules
- Chaque module doit être **testé indépendamment** mais aussi **intégré** avec les modules précédents.
- Utiliser les **checklists de validation** dans chaque prompt.

## 🎯 Définition de "Terminé"

Un module est considéré **terminé** quand :
- ✅ Toutes les tâches de la checklist sont cochées
- ✅ Le code fonctionne sans erreurs
- ✅ Les tests manuels passent
- ✅ Le code est propre et bien typé
- ✅ Les dépendances avec autres modules sont respectées

## 🚀 Démarrage Rapide

### Pour démarrer le projet :

```bash
# Agent 1 : Setup
# Lire et exécuter prompt-01-setup-initial.md

# Agent 2 : Base de données (en parallèle)
# Lire et exécuter prompt-02-base-de-donnees.md
```

### Après Phase 1 :

```bash
# Agent 1 : Auth
# Lire et exécuter prompt-03-authentification.md

# Agent 2 : Design System (en parallèle)
# Lire et exécuter prompt-04-design-system.md
```

Et ainsi de suite...

## 📊 Progression Globale

Suivre la progression avec cette checklist globale :

- [ ] Module 1 : Setup Initial
- [ ] Module 2 : Base de Données
- [ ] Module 3 : Authentification
- [ ] Module 4 : Design System
- [ ] Module 5 : Dashboard
- [ ] Module 6 : Éditeur Builder
- [ ] Module 7 : Renderer Public
- [ ] Module 8 : Réponses et Tableau
- [ ] Module 9 : Publication et Partage
- [ ] Module 10 : Documentation

## 💡 Conseils

1. **Ne pas deviner :** Si une dépendance n'est pas claire, consulter le module concerné ou demander.
2. **Tester régulièrement :** Ne pas attendre la fin du module pour tester.
3. **Code propre :** Respecter les conventions établies dans Module 1.
4. **Documentation :** Commenter le code complexe.
5. **Communication :** Si plusieurs agents travaillent, synchroniser les modifications importantes.

---

**Bon développement ! 🚀**





