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
    
    return data ?? [];
  } catch (e) {
    console.error(`[Supabase] Network error [${table}]:`, e);
    return getMockData();
  }
}

export async function supaUpsert(table: TableName, data: any): Promise<any> {
  const { data: result, error } = await supabase.from(table).upsert(data).select();
  if (error) {
    console.error(`[Supabase] Upsert error [${table}]:`, error.message);
    throw error;
  }
  return result;
}

export async function supaInsert(table: TableName, data: any): Promise<any> {
  const { data: result, error } = await supabase.from(table).insert(data).select().single();
  if (error) {
    console.error(`[Supabase] Insert error [${table}]:`, error.message);
    throw error;
  }
  return result;
}

export async function supaUpdate(table: TableName, id: any, data: any): Promise<void> {
  const { error } = await supabase.from(table).update(data).eq('id', id);
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
  }, [table, fallback]);

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

// ─── Utilitário de resize de imagem ──────────────────────────────────────────
export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        } else {
          if (height > maxHeight) { width = Math.round(width * maxHeight / height); height = maxHeight; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
