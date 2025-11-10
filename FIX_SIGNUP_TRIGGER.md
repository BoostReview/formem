# 🔧 Fix : Erreur "Database error saving new user"

## Problème
Lors de la création d'un compte, l'erreur "Database error saving new user" apparaît car le trigger SQL qui crée automatiquement le profil et l'organisation ne fonctionne pas correctement.

## Solution

Exécutez ce script SQL dans l'éditeur SQL de Supabase pour corriger le trigger :

```sql
-- Supprimer le trigger existant
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreer la fonction avec une meilleure gestion d'erreur
CREATE OR REPLACE FUNCTION create_org_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Creer une nouvelle organisation
  INSERT INTO public.orgs (name) 
  VALUES ('My Organization')
  RETURNING id INTO new_org_id;
  
  -- Creer le profil avec role owner
  INSERT INTO public.profiles (id, org_id, role)
  VALUES (NEW.id, new_org_id, 'owner');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur pour le debug
    RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
    -- Retourner NEW même en cas d'erreur pour ne pas bloquer la création de l'utilisateur
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_org_for_new_user();

-- S'assurer que la fonction ensure_user_profile existe aussi (fallback)
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

## Vérification

Après avoir exécuté le script :

1. Créez un nouveau compte de test
2. Vérifiez dans Supabase Table Editor que :
   - Un nouvel utilisateur existe dans `auth.users`
   - Une organisation existe dans `orgs`
   - Un profil existe dans `profiles` avec le `id` de l'utilisateur et le `org_id` de l'organisation

## Alternative : Créer manuellement le profil

Si le trigger ne fonctionne toujours pas, vous pouvez créer manuellement le profil dans le code d'inscription en ajoutant cela dans `app/actions/auth.ts` après `signUp` :

```typescript
// Après la création de l'utilisateur
if (data.user && data.user.id) {
  // Appeler la fonction RPC pour créer le profil
  await supabase.rpc("ensure_user_profile", {
    user_id: data.user.id,
  })
}
```





