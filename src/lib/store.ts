import { supabase, TableName } from './supabase';

export function getLogo(sponsor: any) {
  if (sponsor?.logo) return sponsor.logo;
  const name = (sponsor?.name || "").toUpperCase().trim();
  if (name.includes("FERREIRA")) return "https://upload.wikimedia.org/wikipedia/commons/7/7b/Ferreira_Costa_logo.svg";
  if (name.includes("UNICOMPRA")) return "https://logo.clearbit.com/unicompra.com.br";
  if (name.includes("SESC")) return "/logos/logo-sesc.png";
  return null;
}

export const defaultData = {
  teams: [
    { id: 1, name: "Colégio Diocesano", city: "Garanhuns", founded: 1915, categories: "SUB-15, SUB-17", logo: "" },
    { id: 2, name: "Colégio Santa Sofia", city: "Garanhuns", founded: 1940, categories: "SUB-15, SUB-17", logo: "" }
  ],
  athletes: [
    { id: 1, name: "João Silva", team_id: 1, number: 10, category: "SUB-17", goals: 5, photo: "" },
    { id: 2, name: "Pedro Santos", team_id: 2, number: 9, category: "SUB-15", goals: 3, photo: "" }
  ],
  games: [
    { id: 1, date: "2026-04-10", time: "14:00", location: "Ginásio do SESC", home_team_id: 1, away_team_id: 2, home_score: 0, away_score: 0, status: "Agendado" }
  ],
  registrations: [],
  banners: [],
  sponsorsPremium: [],
  sponsorsOfficial: [],
  technical_documents: [],
  settings: {
    eventName: "Liga de Futsal Escolar",
    yearEdition: "2026",
    registrationPeriod: "aberto",
    institutionalVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    leagueLogo: ""
  }
};

// --- SUPABASE WRAPPERS ---

export async function supaFetch(table: TableName) {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) {
    console.error(`Supabase Fetch Error [${table}]:`, error);
    return null;
  }
  return data;
}

export async function supaUpsert(table: TableName, data: any) {
  const { error } = await supabase
    .from(table)
    .upsert(data);
  
  if (error) {
    console.error(`Supabase Upsert Error [${table}]:`, error);
    throw error;
  }
}

export async function supaDelete(table: TableName, id: any) {
  const { error } = await supabase
    .from(table)
    .delete()
    .match({ id });
  
  if (error) {
    console.error(`Supabase Delete Error [${table}]:`, error);
    throw error;
  }
}

// --- LEGACY LOCALSTORAGE (FALLBACK) ---

export function getStoredData(key: string) {
  const data = localStorage.getItem(`lfe_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing localStorage for ${key}`, e);
    }
  }
  // @ts-ignore
  return defaultData[key] || [];
}

export function setStoredData(key: string, data: any) {
  try {
    localStorage.setItem(`lfe_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error setting localStorage for ${key}. Quota Exceeded?`, e);
  }
}

// Image Resizer Helper to prevent payload bloating
export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            width = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
