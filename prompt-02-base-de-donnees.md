# 🗄️ Module 2 : Base de Données Supabase

## Objectif
Créer et configurer toutes les tables Supabase avec les schémas, relations, RLS (Row Level Security), et les fonctions nécessaires.

## Contexte Global
Nous construisons un SaaS de création de formulaires. La DB doit supporter : organisations, utilisateurs, formulaires, réponses, et templates.

## Tâches à Réaliser

### 1. Schéma SQL Complet
Créer `/supabase/schema.sql` avec :

#### Table `orgs`
```sql
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `forms`
```sql
CREATE TYPE form_layout AS ENUM ('one', 'page');

CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  layout form_layout NOT NULL DEFAULT 'one',
  schema_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_json JSONB DEFAULT '{}'::jsonb,
  settings_json JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forms_org_id ON forms(org_id);
CREATE INDEX idx_forms_slug ON forms(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_forms_published ON forms(published) WHERE published = true;
```

#### Table `templates`
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  schema_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `responses`
```sql
CREATE TYPE response_source AS ENUM ('link', 'embed');

CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip INET,
  ua TEXT,
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  email TEXT,
  phone_raw TEXT,
  phone_e164 TEXT,
  utm_json JSONB DEFAULT '{}'::jsonb,
  source response_source,
  hidden_json JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_responses_form_id ON responses(form_id);
CREATE INDEX idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX idx_responses_email ON responses(email) WHERE email IS NOT NULL;
```

### 2. Fonctions SQL Utiles

#### Fonction `update_updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

#### Fonction pour créer org automatiquement
```sql
CREATE OR REPLACE FUNCTION create_org_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  INSERT INTO orgs (name) 
  VALUES ('My Organization')
  RETURNING id INTO new_org_id;
  
  INSERT INTO profiles (id, org_id, role)
  VALUES (NEW.id, new_org_id, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_org_for_new_user();
```

### 3. Row Level Security (RLS)

#### Policies pour `profiles`
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Policies pour `forms`
```sql
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read forms from their org"
  ON forms FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert forms in their org"
  ON forms FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update forms in their org"
  ON forms FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Public can read published forms by slug"
  ON forms FOR SELECT
  USING (published = true AND slug IS NOT NULL);
```

#### Policies pour `responses`
```sql
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Insertion publique (via service role dans API route)
CREATE POLICY "Public can insert responses"
  ON responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read responses from their org forms"
  ON responses FOR SELECT
  USING (
    form_id IN (
      SELECT f.id FROM forms f
      JOIN profiles p ON f.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
  );
```

#### Policies pour `templates`
```sql
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read templates"
  ON templates FOR SELECT
  USING (true);
```

#### Policies pour `orgs`
```sql
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their org"
  ON orgs FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### 4. Validation et Contraintes

#### Contraintes additionnelles
- Slug unique avec format valide (alphanumeric + hyphens)
- schema_json doit être un array JSON valide
- settings_json doit contenir : `{ maxResponses?, expiresAt?, redirectUrl? }`

### 5. Helpers TypeScript
Créer `lib/supabase/types.ts` avec les types générés depuis Supabase :
- Types pour toutes les tables
- Types pour les JSONB (schema_json, theme_json, etc.)

## Checklist de Validation
- [ ] Toutes les tables créées
- [ ] Index créés pour performances
- [ ] RLS activé et testé
- [ ] Policies fonctionnelles
- [ ] Triggers fonctionnels
- [ ] Fonction create_org_for_new_user testée
- [ ] Types TypeScript générés
- [ ] Schéma validé dans Supabase dashboard

## Notes Importantes
- Tester chaque policy individuellement
- Vérifier que l'insertion publique des réponses fonctionne
- S'assurer que les utilisateurs ne peuvent pas lire les formulaires d'autres orgs
- Les formulaires publiés doivent être lisibles publiquement (pour le rendu)

## Livrable
Un fichier `supabase/schema.sql` complet et fonctionnel, prêt à être exécuté, avec toutes les tables, RLS, et fonctions nécessaires.





