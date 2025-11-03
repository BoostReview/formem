-- Migration pour ajouter la colonne layout si elle n'existe pas
-- Cette migration est idempotente (peut être exécutée plusieurs fois)

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

