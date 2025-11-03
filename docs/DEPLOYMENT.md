# 🚢 Guide de Déploiement

Guide complet pour déployer FormBuilder SaaS en production.

## 🎯 Prérequis

- Compte Vercel (gratuit)
- Projet Supabase (gratuit ou payant)
- Repository GitHub/GitLab/Bitbucket
- Nom de domaine (optionnel)

## 📋 Checklist Pré-Déploiement

- [ ] Code testé localement
- [ ] Variables d'environnement préparées
- [ ] Base de données Supabase configurée
- [ ] Schéma SQL exécuté
- [ ] RLS activé et testé
- [ ] Build local réussi (`npm run build`)

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer le Code

1. Assurez-vous que votre code est sur GitHub/GitLab
2. Vérifiez que `.env.local` n'est **pas** committé (dans `.gitignore`)

### Étape 2 : Créer un Projet Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub/GitLab
3. Importez le projet
4. Vercel détecte automatiquement Next.js

### Étape 3 : Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Important** :
- `NEXT_PUBLIC_*` variables sont exposées au client
- Ne committez jamais `SUPABASE_SERVICE_ROLE_KEY` dans le code
- Utilisez les secrets Vercel pour toutes les clés sensibles

### Étape 4 : Configuration Vercel

#### Build Settings
- **Framework Preset** : Next.js
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

#### Environment Variables
Configurez toutes les variables nécessaires dans l'onglet "Environment Variables".

### Étape 5 : Déployer

1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-5 minutes)
3. Votre site est en ligne !

## 🗄️ Configuration Supabase Production

### Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et les clés API

### Exécuter le Schéma

1. Ouvrez l'éditeur SQL dans Supabase
2. Copiez le contenu de `supabase/schema.sql`
3. Exécutez le script
4. Vérifiez que les tables sont créées

### Configurer RLS

Les politiques RLS sont incluses dans `schema.sql`, mais vérifiez :

1. Allez dans Authentication > Policies
2. Vérifiez que toutes les tables ont des politiques
3. Testez avec un utilisateur de test

### Migrations Futures

Pour les mises à jour de schéma :
1. Créez un nouveau fichier SQL dans `supabase/migrations/`
2. Exécutez-le dans l'éditeur SQL Supabase
3. Documentez les changements

## 🌐 Domaines Personnalisés

### Ajouter un Domaine sur Vercel

1. Allez dans les paramètres du projet Vercel
2. Onglet "Domains"
3. Ajoutez votre domaine personnalisé
4. Suivez les instructions DNS

### Mettre à Jour les Variables

Une fois le domaine configuré :
```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### Configuration DNS

Pour un domaine personnalisé :
- Type : `CNAME`
- Name : `@` ou `www`
- Value : `cname.vercel-dns.com`

## 🔒 Sécurité Production

### Variables d'Environnement

✅ **À faire** :
- Utiliser les secrets Vercel
- Rotation régulière des clés
- Différentes clés dev/prod

❌ **À ne pas faire** :
- Committer des secrets
- Partager des clés
- Utiliser la même clé dev/prod

### Headers de Sécurité

Vercel ajoute automatiquement :
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

### HTTPS

Vercel fournit automatiquement HTTPS avec Let's Encrypt.

## 📊 Monitoring

### Vercel Analytics (Optionnel)

Activez Vercel Analytics dans les paramètres du projet pour suivre :
- Performance
- Core Web Vitals
- Utilisation

### Logs

Accédez aux logs :
1. Dashboard Vercel
2. Onglet "Deployments"
3. Cliquez sur un déploiement
4. Onglet "Logs"

### Supabase Monitoring

Dans le dashboard Supabase :
- Onglet "Database" : Performance SQL
- Onglet "API" : Utilisation API
- Onglet "Auth" : Connexions utilisateurs

## 🔄 Déploiements Continus

### Workflow Automatique

Vercel déploie automatiquement :
- À chaque push sur `main` → Production
- À chaque push sur autre branche → Preview

### Branches Preview

Chaque branche crée une URL preview unique :
- Utile pour tester avant merge
- Partage avec l'équipe
- Tests QA

## 🐛 Troubleshooting

### Build Échoue

**Erreur : Variables manquantes**
- Vérifiez que toutes les variables sont configurées dans Vercel
- Vérifiez les noms (sensible à la casse)

**Erreur : TypeScript**
```bash
npm run type-check
```
Corrigez les erreurs avant de déployer.

**Erreur : Dependencies**
```bash
npm install
npm run build
```
Testez localement avant de déployer.

### Erreurs Runtime

**Erreur : Supabase connection**
- Vérifiez `NEXT_PUBLIC_SUPABASE_URL`
- Vérifiez `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vérifiez les CORS dans Supabase

**Erreur : RLS**
- Vérifiez que RLS est activé
- Vérifiez les politiques RLS
- Testez avec un utilisateur authentifié

## 📈 Optimisation Post-Déploiement

### Cache

Vercel cache automatiquement :
- Statics assets
- Pages avec `getStaticProps`
- API routes avec cache headers

### CDN

Vercel utilise un CDN global pour :
- Assets statiques
- Images
- Fonts

### Performance

Pour améliorer :
1. Activez Vercel Analytics
2. Analysez Core Web Vitals
3. Optimisez les composants lents
4. Utilisez `next/image` pour les images

## 🔄 Mises à Jour

### Processus de Mise à Jour

1. Faire des changements localement
2. Tester (`npm run dev`)
3. Commit et push
4. Vercel déploie automatiquement
5. Vérifier le déploiement

### Rollback

Si quelque chose ne va pas :
1. Dashboard Vercel
2. Onglet "Deployments"
3. Trouvez le dernier déploiement fonctionnel
4. Cliquez sur "..." → "Promote to Production"

## 📝 Checklist Post-Déploiement

- [ ] Site accessible
- [ ] Authentification fonctionne
- [ ] Création de formulaire fonctionne
- [ ] Édition fonctionne
- [ ] Publication fonctionne
- [ ] Formulaires publics accessibles
- [ ] Soumission de réponses fonctionne
- [ ] Tableau de réponses fonctionne
- [ ] Exports fonctionnent
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse)

## 🎉 C'est Prêt !

Votre application est maintenant en production. Continuez à monitorer les logs et les performances.

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la [documentation Vercel](https://vercel.com/docs).


