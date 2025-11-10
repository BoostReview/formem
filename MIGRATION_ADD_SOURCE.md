# 🔧 Migration : Ajouter la colonne `source` à la table `responses`

## Problème

L'erreur `Could not find the 'source' column of 'responses'` indique que la colonne `source` manque dans votre table `responses` dans Supabase.

## Solution

### Option 1 : Via l'éditeur SQL Supabase (Recommandé)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (menu de gauche)
4. Cliquez sur **New query**
5. Copiez-collez le contenu du fichier `supabase/migrations/add_source_column.sql`
6. Cliquez sur **Run** (ou Ctrl+Enter)
7. Vous devriez voir : `Colonne source ajoutée avec succès`

### Option 2 : Exécuter tout le schéma

Si la table `responses` n'a pas été créée correctement, vous pouvez réexécuter la section correspondante du fichier `supabase/schema.sql` :

```sql
-- Créer le type enum
CREATE TYPE response_source AS ENUM ('link', 'embed');

-- Créer/modifier la table (ajoute la colonne si elle n'existe pas)
ALTER TABLE responses 
ADD COLUMN IF NOT EXISTS source response_source DEFAULT 'link';
```

## Vérification

Après avoir exécuté la migration, vérifiez que la colonne existe :

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'responses' 
AND column_name = 'source';
```

Vous devriez voir une ligne avec `source` et `USER-DEFINED` (ou le nom de l'enum).

## Après la migration

1. Rechargez votre application
2. Essayez de soumettre un formulaire à nouveau
3. L'erreur devrait être résolue !





