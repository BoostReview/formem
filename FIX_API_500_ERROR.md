# 🔧 Correction de l'Erreur 500 sur l'API `/api/forms/[id]/lead`

## 🔍 Diagnostic

L'erreur 500 peut avoir plusieurs causes :

### 1. Variable d'Environnement Manquante

**Cause** : `SUPABASE_SERVICE_ROLE_KEY` n'est pas définie dans `.env.local`

**Solution** :
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez la **service_role key** (⚠️ **NE JAMAIS** l'exposer côté client)
5. Ajoutez-la dans votre `.env.local` :

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Redémarrer le Serveur

Après avoir ajouté/modifié `.env.local`, **redémarrez votre serveur de développement** :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 3. Vérifier les Logs

Ouvrez la console de votre terminal où tourne `npm run dev`. L'erreur exacte devrait maintenant être visible avec plus de détails.

### 4. Vérifier la Table `responses`

Assurez-vous que la table `responses` existe dans Supabase :

1. Allez sur https://app.supabase.com
2. Allez dans **Table Editor**
3. Vérifiez que la table `responses` existe
4. Si elle n'existe pas, exécutez le script SQL dans `supabase/schema.sql`

### 5. Vérifier les Permissions RLS

L'API utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS, mais si la table `responses` a des contraintes ou triggers, cela peut causer des erreurs.

## 🧪 Tester l'API

Une fois la configuration corrigée, testez avec :

```bash
curl -X POST http://localhost:3000/api/forms/YOUR_FORM_ID/lead \
  -H "Content-Type: application/json" \
  -d '{
    "form_id": "YOUR_FORM_ID",
    "answers_json": {},
    "source": "link",
    "time_elapsed": 1000
  }'
```

## 📝 Messages d'Erreur Améliorés

L'API renvoie maintenant des messages d'erreur plus détaillés :

- **Configuration invalide** : "Configuration serveur invalide. Vérifiez SUPABASE_SERVICE_ROLE_KEY"
- **Formulaire introuvable** : "Formulaire introuvable: [détails]"
- **Erreur insertion** : "Erreur lors de l'enregistrement" + détails + hint

Vérifiez les logs du serveur pour voir l'erreur exacte.


