import { useEffect, useState, useCallback } from 'react';
import { supabase, TableName } from './supabase';
import { mockTeams, mockAthletes, mockGames, mockGallery, mockRegistrations, mockTechnicalDocs } from './mockData';

// ─── Utilidades de log / fallback ─────────────────────────────────────────────
export function getLogo(sponsor: any) {
  if (sponsor?.logo) return sponsor.logo;
  const name = (sponsor?.name || '').toUpperCase().trim();
  if (name.includes('FERREIRA')) return '/logos/FERREIRA_COSTA_LOGO.png';
  if (name.includes('UNICOMPRA')) return '/logos/UNICOMPRA_LOGO.jpg';
  if (name.includes('SESC')) return '/logos/logo-sesc.png';
  return null;
}

// ─── Dados padrão (fallback quando Supabase não responder) ───────────────────
export const defaultData: Record<string, any> = {
  teams: [],
  athletes: [],
  games: [],
  registrations: [],
  banners: [],
  sponsorsPremium: [],
  sponsorsOfficial: [],
  technical_documents: [],
  settings: {
    eventName: 'Liga de Futsal Escolar',
    yearEdition: '2026',
    registrationPeriod: 'aberto',
    institutionalVideoUrl: '',
    leagueLogo: '',
  },
};

// ─── CRUD Supabase ────────────────────────────────────────────────────────────

export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/(_\w)/g, (m) => m[1].toUpperCase())]: snakeToCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
}

export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => camelToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)]: camelToSnake(obj[key]),
      }),
      {}
    );
  }
  return obj;
}

export async function supaFetch(table: TableName): Promise<any[] | null> {
  const getMockData = () => {
    if (table === 'lfe_teams') return mockTeams;
    if (table === 'lfe_athletes') return mockAthletes;
    if (table === 'lfe_games') return mockGames;
    if (table === 'lfe_gallery') return mockGallery;
    if (table === 'lfe_registrations') return mockRegistrations;
    if (table === 'lfe_technical_documents') return mockTechnicalDocs;
    return null;
  };

  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`[Supabase] Fetch error [${table}]:`, error.message);
      return getMockData();
    }
    
    // Fallback para mock data se a tabela estiver completamente vazia (Para fins de demonstração)
    if (!data || data.length === 0) {
      const mockResult = getMockData();
      if (mockResult) return mockResult;
    }
    
    return data ? snakeToCamel(data) : [];
  } catch (e) {
    console.error(`[Supabase] Network error [${table}]:`, e);
    return getMockData();
  }
}

export async function supaUpsert(table: TableName, data: any): Promise<any> {
  const { data: result, error } = await supabase.from(table).upsert(camelToSnake(data)).select();
  if (error) {
    console.error(`[Supabase] Upsert error [${table}]:`, error.message);
    throw error;
  }
  return snakeToCamel(result);
}

export async function supaInsert(table: TableName, data: any): Promise<any> {
  const { data: result, error } = await supabase.from(table).insert(camelToSnake(data)).select().single();
  if (error) {
    console.error(`[Supabase] Insert error [${table}]:`, error.message);
    throw error;
  }
  return snakeToCamel(result);
}

export async function supaUpdate(table: TableName, id: any, data: any): Promise<void> {
  const { error } = await supabase.from(table).update(camelToSnake(data)).eq('id', id);
  if (error) {
    console.error(`[Supabase] Update error [${table}]:`, error.message);
    throw error;
  }
}

export async function supaDelete(table: TableName, id: any): Promise<void> {
  const { error } = await supabase.from(table).delete().match({ id });
  if (error) {
    console.error(`[Supabase] Delete error [${table}]:`, error.message);
    throw error;
  }
}

// ─── Hook genérico para carregar dados do Supabase ───────────────────────────
/**
 * useSupaData – carrega uma tabela do Supabase e atualiza o estado.
 * Retorna { data, loading, refresh }.
 * Se o Supabase falhar, usa o fallback fornecido.
 */
export function useSupaData<T = any>(
  table: TableName,
  fallback: T[] = [],
  realtime = false
): { data: T[]; loading: boolean; refresh: () => void } {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await supaFetch(table);
    setData(result && result.length > 0 ? (result as T[]) : fallback);
    setLoading(false);
  }, [table]); // fallback removed from deps to avoid infinite loops with array literals

  useEffect(() => {
    refresh();

    if (realtime) {
      const channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: table },
          () => {
            refresh();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refresh, realtime, table]);

  return { data, loading, refresh };
}

// ─── localStorage LEGACY (fallback read-only) ────────────────────────────────

export function getStoredData(key: string): any {
  const raw = localStorage.getItem(`lfe_${key}`);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return defaultData[key] ?? [];
}

export function setStoredData(key: string, data: any): void {
  try {
    localStorage.setItem(`lfe_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`[localStorage] Quota exceeded for key: lfe_${key}`);
  }
}

// ─── Utilitário de classificação ──────────────────────────────────────────
export function calculateStandings(teams: any[], games: any[], category: string = 'Geral') {
  if (!teams || teams.length === 0) return [];
  
  const relevantGames = (games || []).filter((g: any) => 
    (category === 'Geral' || g.category === category) && 
    String(g.status || '').toLowerCase() === 'finalizado'
  );

  return teams.map((t: any) => {
    let pts = 0, p = 0, v = 0, e = 0, d = 0, gp = 0, gc = 0;
    
    relevantGames.forEach((g: any) => {
      const hId = String(g.homeTeamId || g.home_team_id);
      const aId = String(g.awayTeamId || g.away_team_id);
      const tId = String(t.id);

      if (hId === tId || aId === tId) {
        p++;
        const hScore = Number(g.homeScore ?? g.home_score ?? 0);
        const aScore = Number(g.awayScore ?? g.away_score ?? 0);

        if (hId === tId) {
          gp += hScore; gc += aScore;
          if (hScore > aScore) { pts += 3; v++; }
          else if (hScore === aScore) { pts += 1; e++; }
          else d++;
        } else {
          gp += aScore; gc += hScore;
          if (aScore > hScore) { pts += 3; v++; }
          else if (hScore === aScore) { pts += 1; e++; }
          else d++;
        }
      }
    });

    return { ...t, pts, p, v, e, d, gp, gc, sg: gp - gc };
  }).sort((a: any, b: any) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.sg !== a.sg) return b.sg - a.sg;
    return b.gp - a.gp;
  });
}
