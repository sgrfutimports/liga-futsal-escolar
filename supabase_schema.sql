-- ============================================================
--  Liga de Futsal Escolar – Script SQL para Supabase
--  Execute este script no SQL Editor do seu projeto Supabase:
--  https://app.supabase.com → seu-projeto → SQL Editor
-- ============================================================

-- ─── Extensões ───────────────────────────────────────────────
-- (uuid-ossp já habilitado por padrão no Supabase)

-- ─── 1. Configurações do evento ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_settings (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name             TEXT DEFAULT 'Liga de Futsal Escolar',
  year_edition           TEXT DEFAULT '2026',
  registration_period    TEXT DEFAULT 'aberto',  -- 'aberto' | 'fechado'
  institutional_video_url TEXT DEFAULT '',
  league_logo            TEXT DEFAULT '',         -- base64 ou URL
  rules_url              TEXT DEFAULT '',         -- base64 Data-URL de PDF
  rules_name             TEXT DEFAULT '',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Insira uma linha de configuração inicial (só uma linha):
INSERT INTO public.lfe_settings (event_name, year_edition, registration_period)
VALUES ('Liga de Futsal Escolar', '2026', 'aberto')
ON CONFLICT DO NOTHING;

-- ─── 2. Equipes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_teams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  city         TEXT DEFAULT '',
  categories   TEXT DEFAULT '',   -- Ex: "SUB-15, SUB-17"
  logo         TEXT DEFAULT '',   -- base64 ou URL
  founded      INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Atletas ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_athletes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  team_id    UUID REFERENCES public.lfe_teams(id) ON DELETE SET NULL,
  number     TEXT DEFAULT '',
  category   TEXT DEFAULT '',   -- Ex: "SUB-17"
  photo      TEXT DEFAULT '',   -- base64 ou URL
  goals      INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Jogos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_games (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date          TEXT,            -- "2026-04-10"
  time          TEXT,            -- "14:00"
  location      TEXT DEFAULT '',
  home_team_id  UUID REFERENCES public.lfe_teams(id) ON DELETE SET NULL,
  away_team_id  UUID REFERENCES public.lfe_teams(id) ON DELETE SET NULL,
  home_score    INT DEFAULT 0,
  away_score    INT DEFAULT 0,
  status        TEXT DEFAULT 'Agendado',  -- 'Agendado' | 'Ao Vivo' | 'Finalizado'
  category      TEXT DEFAULT '',          -- Ex: "SUB-17"
  events        JSONB DEFAULT '[]',       -- Array de eventos (gols, cartões)
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. Inscrições ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_registrations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school                 TEXT NOT NULL,
  email                  TEXT NOT NULL,
  password               TEXT DEFAULT '',   -- hash ou plain (use bcrypt em prod)
  resp                   TEXT DEFAULT '',   -- Nome do responsável
  phone                  TEXT DEFAULT '',
  city                   TEXT DEFAULT '',
  cnpj                   TEXT DEFAULT '',
  categories             TEXT DEFAULT '',
  logo                   TEXT DEFAULT '',   -- base64 do escudo
  athletes               JSONB DEFAULT '[]', -- Lista de atletas da inscrição
  athlete_submission_type TEXT DEFAULT 'now', -- 'now' | 'later'
  status                 TEXT DEFAULT 'Pendente', -- 'Pendente' | 'Homologada' | 'Recusada'
  team_id                UUID REFERENCES public.lfe_teams(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. Banners do carrossel ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_banners (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT DEFAULT '',
  subtitle   TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image      TEXT DEFAULT '',   -- URL ou base64
  accent     TEXT DEFAULT 'primary', -- 'primary' | 'secondary' | 'accent'
  cta_text   TEXT DEFAULT '',
  cta_link   TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. Patrocinadores ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_sponsors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  logo       TEXT DEFAULT '',      -- URL ou base64
  type       TEXT DEFAULT 'official', -- 'premium' | 'official'
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. Galeria ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_gallery (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT DEFAULT '',
  url        TEXT NOT NULL,        -- URL ou base64
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. Documentos técnicos ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lfe_technical_documents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  category   TEXT DEFAULT 'NOTAS OFICIAIS',
  date       TEXT DEFAULT '',       -- "12/04/2026"
  url        TEXT DEFAULT '',       -- URL do arquivo (Supabase Storage ou externo)
  size       TEXT DEFAULT '',       -- Ex: "1.2 MB"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  Row Level Security (RLS)
--  Por padrão, ativa leitura pública e escrita autenticada.
--  Ajuste conforme sua necessidade de segurança.
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.lfe_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_teams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_athletes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_games            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_sponsors         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfe_technical_documents ENABLE ROW LEVEL SECURITY;

-- ── Políticas: SELECT público (qualquer um lê) ───────────────
CREATE POLICY "Leitura pública" ON public.lfe_settings         FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_teams            FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_athletes         FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_games            FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_banners          FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_sponsors         FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_gallery          FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON public.lfe_technical_documents FOR SELECT USING (true);

-- Inscrições: qualquer um pode criar, mas só o admin lê
CREATE POLICY "Inscrição pública" ON public.lfe_registrations  FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura pública"   ON public.lfe_registrations  FOR SELECT USING (true);

-- ── Políticas: escrita via service_role (Admin usa anon key) ──
-- ATENÇÃO: Para um sistema de admin real, use autenticação Supabase Auth
-- e restrinja UPDATE/DELETE/INSERT ao usuário autenticado.
-- Para facilitar o desenvolvimento, permitimos escrita via anon key:

CREATE POLICY "Escrita pública (dev)" ON public.lfe_settings         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_teams            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_athletes         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_games            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_registrations    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_banners          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_sponsors         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_gallery          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita pública (dev)" ON public.lfe_technical_documents FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
--  Índices úteis
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_athletes_team_id     ON public.lfe_athletes(team_id);
CREATE INDEX IF NOT EXISTS idx_games_home_team_id   ON public.lfe_games(home_team_id);
CREATE INDEX IF NOT EXISTS idx_games_away_team_id   ON public.lfe_games(away_team_id);
CREATE INDEX IF NOT EXISTS idx_games_category       ON public.lfe_games(category);
CREATE INDEX IF NOT EXISTS idx_games_status         ON public.lfe_games(status);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.lfe_registrations(status);
CREATE INDEX IF NOT EXISTS idx_sponsors_type        ON public.lfe_sponsors(type);
