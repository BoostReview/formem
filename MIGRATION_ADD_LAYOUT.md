# 🔧 Migration : Ajouter la colonne `layout` à la table `forms`

## Problème
La table `forms` existe dans Supabase mais n'a pas la colonne `layout`, ce qui cause l'erreur :
```
Could not find the 'layout' column of 'forms' in the schema cache
```

## Solution

Exécutez ce script SQL dans l'éditeur SQL de Supabase :

```sql
-- Vérifier et créer le type enum s'il n'existe pas
DO $$ BEGIN
    CREATE TYPE form_layout AS ENUM ('one', 'page');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Vérifier et ajouter la colonne layout si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'forms' 
        AND column_name = 'layout'
    ) THEN
        ALTER TABLE forms 
        ADD COLUMN layout form_layout NOT NULL DEFAULT 'one';
        
        RAISE NOTICE 'Colonne layout ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne layout existe déjà';
    END IF;
END $$;

-- Vérifier aussi que ensure_user_profile existe
CREATE OR REPLACE FUNCTION ensure_user_profile(user_id UUID)
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
  existing_profile_id UUID;
BEGIN
  -- Vérifier si le profil existe déjà
  SELECT id INTO existing_profile_id FROM profiles WHERE id = user_id;
  
  IF existing_profile_id IS NOT NULL THEN
    -- Le profil existe, retourner son org_id
    SELECT org_id INTO new_org_id FROM profiles WHERE id = user_id;
    RETURN new_org_id;
  END IF;
  
  -- Créer une nouvelle organisation
  INSERT INTO orgs (name) 
  VALUES ('My Organization')
  RETURNING id INTO new_org_id;
  
  -- Créer le profil avec role owner
  INSERT INTO profiles (id, org_id, role)
  VALUES (user_id, new_org_id, 'owner');
  
  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Instructions

1. Ouvrez Supabase Dashboard
2. Allez dans "SQL Editor"
3. Copiez-collez le script ci-dessus
4. Cliquez sur "Run"
5. Vérifiez que la colonne a été ajoutée dans "Table Editor" > `forms`

## Alternative : Réexécuter tout le schéma

Si vous préférez réinitialiser complètement (⚠️ supprime toutes les données) :

1. Dans Supabase SQL Editor, exécutez :
```sql
DROP TABLE IF EXISTS forms CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS orgs CASCADE;
```

2. Puis exécutez tout le contenu de `supabase/schema.sql`





