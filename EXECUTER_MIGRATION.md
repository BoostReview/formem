# ⚠️ ACTION REQUISE : Exécuter la Migration SQL

## Erreur actuelle
```
Could not find the 'layout' column of 'forms' in the schema cache
```

## Solution rapide

**1. Ouvrez Supabase Dashboard**
- Allez sur https://app.supabase.com
- Sélectionnez votre projet

**2. Ouvrez l'éditeur SQL**
- Cliquez sur "SQL Editor" dans le menu de gauche

**3. Copiez-collez et exécutez ce script :**

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

-- S'assurer que la fonction ensure_user_profile existe aussi
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

**4. Cliquez sur "Run" ou appuyez sur Ctrl+Enter**

**5. Vérifiez que ça a fonctionné**
- Allez dans "Table Editor"
- Sélectionnez la table `forms`
- Vérifiez que la colonne `layout` existe

## Alternative : Exécuter tout le schéma

Si vous préférez réexécuter tout le schéma (⚠️ peut écraser des données) :

1. Ouvrez le fichier `supabase/schema.sql`
2. Copiez tout le contenu
3. Exécutez-le dans l'éditeur SQL Supabase

---

**IMPORTANT** : Cette migration doit être exécutée **MAINTENANT** pour que l'application fonctionne !





