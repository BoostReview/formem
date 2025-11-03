-- ============================================
-- Module 2 : Base de Donnees Supabase
-- Schema complet pour SaaS Form Builder
-- ============================================

-- ============================================
-- 0. NETTOYAGE (suppression des objets existants)
-- ============================================

-- Supprimer les triggers existants (seulement ceux sur auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer les types existants (si besoin de les recreer)
-- ATTENTION: Cela supprimera aussi les tables qui utilisent ces types
DROP TYPE IF EXISTS response_source CASCADE;
DROP TYPE IF EXISTS form_layout CASCADE;

-- ============================================
-- 1. TYPES ENUMS
-- ============================================

CREATE TYPE form_layout AS ENUM ('one', 'page');

CREATE TYPE response_source AS ENUM ('link', 'embed');

-- ============================================
-- 2. TABLES
-- ============================================

-- Table des organisations
CREATE TABLE IF NOT EXISTS orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des formulaires
CREATE TABLE IF NOT EXISTS forms (
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Contrainte : slug doit etre alphanumeric + hyphens uniquement
  CONSTRAINT valid_slug_format CHECK (
    slug IS NULL OR slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  -- Contrainte : schema_json doit etre un array
  CONSTRAINT valid_schema_json CHECK (
    jsonb_typeof(schema_json) = 'array'
  )
);

-- Table des templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  schema_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  theme_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Contrainte : schema_json doit etre un array
  CONSTRAINT valid_template_schema_json CHECK (
    jsonb_typeof(schema_json) = 'array'
  )
);

-- Table des reponses
CREATE TABLE IF NOT EXISTS responses (
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
  hidden_json JSONB DEFAULT '{}'::jsonb,
  -- Contrainte : answers_json doit etre un object
  CONSTRAINT valid_answers_json CHECK (
    jsonb_typeof(answers_json) = 'object'
  )
);

-- ============================================
-- 3. INDEX POUR PERFORMANCES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_forms_org_id ON forms(org_id);
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forms_published ON forms(published) WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- ============================================
-- 4. FONCTIONS SQL
-- ============================================

-- Fonction pour mettre a jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre a jour updated_at sur forms
DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Fonction pour creer automatiquement une org lors de la creation d'un utilisateur
CREATE OR REPLACE FUNCTION create_org_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Creer une nouvelle organisation
  -- SECURITY DEFINER permet de bypasser RLS
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

-- Trigger pour executer la fonction lors de la creation d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_org_for_new_user();

-- Fonction RPC pour créer un profil manuellement si nécessaire (bypass RLS)
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

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- ============================================
-- 5.1. Policies pour profiles
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 5.2. Policies pour forms
-- ============================================
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read forms from their org" ON forms;
CREATE POLICY "Users can read forms from their org"
  ON forms FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert forms in their org" ON forms;
CREATE POLICY "Users can insert forms in their org"
  ON forms FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update forms in their org" ON forms;
CREATE POLICY "Users can update forms in their org"
  ON forms FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete forms in their org" ON forms;
CREATE POLICY "Users can delete forms in their org"
  ON forms FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can read published forms by slug" ON forms;
CREATE POLICY "Public can read published forms by slug"
  ON forms FOR SELECT
  USING (published = true AND slug IS NOT NULL);

-- ============================================
-- 5.3. Policies pour responses
-- ============================================
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Insertion publique (via service role dans API route)
DROP POLICY IF EXISTS "Public can insert responses" ON responses;
CREATE POLICY "Public can insert responses"
  ON responses FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read responses from their org forms" ON responses;
CREATE POLICY "Users can read responses from their org forms"
  ON responses FOR SELECT
  USING (
    form_id IN (
      SELECT f.id FROM forms f
      JOIN profiles p ON f.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
  );

-- ============================================
-- 5.4. Policies pour templates
-- ============================================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read templates" ON templates;
CREATE POLICY "Anyone can read templates"
  ON templates FOR SELECT
  USING (true);

-- ============================================
-- 5.5. Policies pour orgs
-- ============================================
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their org" ON orgs;
CREATE POLICY "Users can read their org"
  ON orgs FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their org" ON orgs;
CREATE POLICY "Users can update their org"
  ON orgs FOR UPDATE
  USING (
    id IN (
      SELECT org_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Ajouter une politique pour permettre la création d'orgs via fonction SECURITY DEFINER
-- (La fonction ensure_user_profile utilise SECURITY DEFINER donc bypass RLS)
