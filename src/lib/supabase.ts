import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase (Project URL e API Key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-aqui.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Tipagens para o Banco de Dados ---
/*
Tabelas sugeridas:
1. lfe_registrations (id, school, email, password, status, team_id, created_at)
2. lfe_teams (id, name, logo, city, categories)
3. lfe_athletes (id, team_id, name, number, category, photo)
4. lfe_games (id, date, time, location, home_team_id, away_team_id, home_score, away_score, status, category, events)
5. lfe_banners (id, title, subtitle, description, image, accent)
6. lfe_sponsors (id, name, logo, type)
7. lfe_gallery (id, title, url)
8. lfe_technical_documents (id, title, category, date, url, size)
9. lfe_settings (id, event_name, year_edition, league_logo, rules_url, video_url)
*/

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
