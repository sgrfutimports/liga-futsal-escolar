export function getLogo(sponsor: any) {
  if (sponsor.logo) return sponsor.logo;
  const name = (sponsor.name || "").toUpperCase().trim();
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
    { id: 1, name: "João Silva", teamId: 1, number: 10, category: "SUB-17", goals: 5, photo: "" },
    { id: 2, name: "Pedro Santos", teamId: 2, number: 9, category: "SUB-15", goals: 3, photo: "" }
  ],
  games: [
    { id: 1, date: "2026-04-10", time: "14:00", location: "Ginásio do SESC", homeTeamId: 1, awayTeamId: 2, homeScore: 0, awayScore: 0, status: "Agendado" }
  ],
  registrations: [
    { id: 1, date: "2026-03-27", school: "Colégio Santa Cruz", resp: "Carlos Silva", status: "Pendente" },
    { id: 2, date: "2026-03-26", school: "Colégio Diocesano", resp: "Marcos Paulo", status: "Aprovado" },
    { id: 3, date: "2026-03-25", school: "Colégio Santa Sofia", resp: "Ana Souza", status: "Aprovado" },
    { id: 4, date: "2026-03-24", school: "Escola Simoa Gomes", resp: "Paulo Freire", status: "Rejeitado" }
  ],
  banners: [
    {
      id: 1,
      title: "INSCRIÇÕES ABERTAS 2026",
      subtitle: "A MAIOR LIGA DE FUTSAL ESCOLAR DO AGRESTE",
      description: "Garanta a vaga da sua escola na competição que revela os futuros craques da nossa região.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbb1925713?q=80&w=2000&auto=format&fit=crop",
      ctaText: "INSCREVA SUA ESCOLA",
      ctaLink: "/inscricao",
      accent: "primary"
    },
    {
      id: 2,
      title: "CLASSIFICAÇÃO ATUALIZADA",
      subtitle: "CONFIRA QUEM LIDERA A TABELA",
      description: "Acompanhe o desempenho das equipes em todas as categorias. Resultados em tempo real.",
      image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=2000&auto=format&fit=crop",
      ctaText: "VER TABELA",
      ctaLink: "/classificacao",
      accent: "secondary"
    },
    {
      id: 3,
      title: "GALERIA DE CRAQUES",
      subtitle: "OS MELHORES MOMENTOS DA LIGA",
      description: "Fotos e vídeos exclusivos das partidas mais emocionantes da temporada.",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop",
      ctaText: "VER ATLETAS",
      ctaLink: "/atletas",
      accent: "accent"
    }
  ],
  sponsorsPremium: [
    { id: 1, name: "FERREIRA COSTA", logo: "/logos/FERREIRA_COSTA_LOGO.png" },
    { id: 2, name: "UNICOMPRA", logo: "/logos/UNICOMPRA_LOGO.jpg" },
    { id: 3, name: "BC ENERGIA", logo: "/logos/BC_ENERGIA_LOGO.jpg" }
  ],
  sponsorsOfficial: [
    { id: 1, name: "SESC PE", logo: "/logos/logo-sesc.png" },
    { id: 4, name: "AZEVEDO", logo: "/logos/AZEVEDO_LOGO.jpg" },
    { id: 5, name: "BREJÃO", logo: "/logos/BREJÃO_LOGO.jpg" },
    { id: 6, name: "COLINAS MOTOR", logo: "/logos/COLINAS_MOTOR_LOGO.jpg" },
    { id: 7, name: "DIEGO ESPORTES", logo: "/logos/DIEGO_ESPORTES_LOGO.jpg" },
    { id: 8, name: "ORTOBOM", logo: "/logos/ORTOBOM_LOGO.jpg" },
    { id: 9, name: "WS", logo: "/logos/WS_LOGO.jpg" },
    { id: 10, name: "CASA DAS BALAS", logo: "/logos/casa_das_balas_logo.jpg" },
    { id: 11, name: "IAUPE", logo: "/logos/IAUPE LOGO.jfif" },
    { id: 12, name: "CMA", logo: "/logos/CMA LOGO.jpg" },
    { id: 13, name: "GRE", logo: "/logos/GRE  LOGO.png" }
  ],
  technical_documents: [
    { id: 1, title: "NOTA OFICIAL 001/2026 - ABERTURA DE INSCRIÇÕES", category: "NOTAS OFICIAIS", date: "27/03/2026", url: "#", size: "124 KB" },
    { id: 2, title: "REGULAMENTO GERAL DA COMPETIÇÃO - EDIÇÃO 2026", category: "REGULAMENTOS", date: "25/03/2026", url: "#", size: "450 KB" },
    { id: 3, title: "CRONOGRAMA DE JOGOS - FASE DE GRUPOS - ABRIL", category: "BOLETIM", date: "30/03/2026", url: "#", size: "88 KB" },
    { id: 4, title: "FORMULÁRIO DE AUTORIZAÇÃO DE ATLETA (MENOR DE IDADE)", category: "FORMULÁRIOS", date: "20/03/2026", url: "#", size: "65 KB" },
    { id: 5, title: "COMUNICADO 002/2026 - ALTERAÇÃO DE ENDEREÇO DO CONGRESSO TÉCNICO", category: "COMUNICADOS", date: "29/03/2026", url: "#", size: "110 KB" }
  ],
  settings: {
    eventName: "Liga de Futsal Escolar",
    yearEdition: "2026",
    registrationPeriod: "aberto",
    institutionalVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    leagueLogo: ""
  }
};

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
    alert('Erro ao salvar dados (limite de armazenamento atingido). Tente usar Imagens por URL ao invés de uploads diretos.');
  }
}

// Image Resizer Helper to prevent localStorage from inflating
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
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality JPEG
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
