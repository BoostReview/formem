# 🔍 Vérification de la Configuration

Pour résoudre l'erreur 500, vérifiez que votre fichier `.env.local` contient bien :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

## 📝 Comment obtenir la clé SERVICE_ROLE

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Sous "Project API keys", copiez la **service_role key** (⚠️ **NE JAMAIS** l'exposer côté client)
5. Ajoutez-la dans `.env.local`

## ⚠️ Important

**Après avoir ajouté/modifié `.env.local`, redémarrez votre serveur :**

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

## 🔍 Vérifier les Logs

Ouvrez le **terminal où tourne `npm run dev`** et regardez les logs qui commencent par `[API Lead]`.

Vous devriez voir :
- `📥 [API Lead] Requête reçue`
- `🔐 [API Lead] Création client Supabase...`
- Si erreur : `❌ [API Lead] Erreur création client Supabase`

Si vous voyez l'erreur de création client, c'est que `SUPABASE_SERVICE_ROLE_KEY` manque ou est invalide.


