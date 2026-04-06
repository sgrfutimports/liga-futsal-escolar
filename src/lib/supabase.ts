import { createClient } from '@supabase/supabase-js';

// ─── Credenciais via variáveis de ambiente ────────────────────────────────────
// Crie um arquivo .env na raiz do projeto com:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGci...
// ─────────────────────────────────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas.\n' +
    'Crie um arquivo .env na raiz do projeto. Veja o arquivo .env.example.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

// ─── Nomes das tabelas ────────────────────────────────────────────────────────
export type TableName =
  | 'lfe_registrations'
  | 'lfe_teams'
  | 'lfe_athletes'
  | 'lfe_games'
  | 'lfe_banners'
  | 'lfe_sponsors'
  | 'lfe_gallery'
  | 'lfe_technical_documents'
  | 'lfe_settings';

// ─── Tipos TypeScript das entidades ──────────────────────────────────────────

export interface LfeRegistration {
  id?: string | number;
  school: string;
  email: string;
  password?: string;
  resp: string;
  city: string;
  cnpj?: string;
  phone?: string;
  categories?: string;
  logo?: string;
  athletes?: any[];
  athlete_submission_type?: 'now' | 'later';
  status: 'Pendente' | 'Homologada' | 'Recusada';
  team_id?: string | number;
  created_at?: string;
}

export interface LfeTeam {
  id?: string | number;
  name: string;
  city?: string;
  categories?: string;
  logo?: string;
  founded?: number;
}

export interface LfeAthlete {
  id?: string | number;
  name: string;
  team_id?: string | number;
  /** Alias usado localmente: team_id ou teamId */
  teamId?: string | number;
  number?: string | number;
  category?: string;
  photo?: string;
  goals?: number;
}

export interface LfeGame {
  id?: string | number;
  date?: string;
  time?: string;
  location?: string;
  home_team_id?: string | number;
  away_team_id?: string | number;
  /** Alias usados localmente */
  homeTeamId?: string | number;
  awayTeamId?: string | number;
  home_score?: number;
  away_score?: number;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  category?: string;
  events?: any[];
}

export interface LfeBanner {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  accent?: string;
  cta_text?: string;
  cta_link?: string;
  ctaText?: string;
  ctaLink?: string;
  sort_order?: number;
}

export interface LfeSponsor {
  id?: string | number;
  name: string;
  logo?: string;
  type: 'premium' | 'official';
  sort_order?: number;
}

export interface LfeGallery {
  id?: string | number;
  title?: string;
  url: string;
}

export interface LfeTechnicalDocument {
  id?: string | number;
  title: string;
  category?: string;
  date?: string;
  url?: string;
  size?: string;
}

export interface LfeSettings {
  id?: string | number;
  event_name?: string;
  year_edition?: string;
  registration_period?: string;
  institutional_video_url?: string;
  league_logo?: string;
  rules_url?: string;
  rules_name?: string;
  /** Aliases camelCase usados no legado */
  eventName?: string;
  yearEdition?: string;
  registrationPeriod?: string;
  institutionalVideoUrl?: string;
  leagueLogo?: string;
  rulesUrl?: string;
  rulesName?: string;
}
