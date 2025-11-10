-- Table pour les liens raccourcis
CREATE TABLE IF NOT EXISTS short_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMPTZ
);

-- Index pour recherche rapide par code
CREATE INDEX IF NOT EXISTS idx_short_links_code ON short_links(code);
CREATE INDEX IF NOT EXISTS idx_short_links_org_id ON short_links(org_id);
CREATE INDEX IF NOT EXISTS idx_short_links_form_id ON short_links(form_id) WHERE form_id IS NOT NULL;

-- RLS pour les short_links
ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les liens de leur organisation
CREATE POLICY "Users can read own org short links"
  ON short_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.org_id = short_links.org_id
    )
  );

-- Les utilisateurs peuvent créer des liens pour leur organisation
CREATE POLICY "Users can create short links for own org"
  ON short_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.org_id = short_links.org_id
    )
  );

-- Les utilisateurs peuvent supprimer les liens de leur organisation
CREATE POLICY "Users can delete own org short links"
  ON short_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.org_id = short_links.org_id
    )
  );

-- Permettre l'accès public en lecture pour les redirections (via service role)
-- Cette politique permet de lire le code pour rediriger, mais seulement pour les codes existants
CREATE POLICY "Public can read short links by code"
  ON short_links FOR SELECT
  USING (true);


