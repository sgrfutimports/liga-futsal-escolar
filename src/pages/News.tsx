import { useState } from "react";
import { Search, Calendar, ChevronRight, Hash, Newspaper } from "lucide-react";
import { Link } from "react-router";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

// Mock para quando não houver notícias no banco
const defaultNews = [
  {
    id: 1,
    slug: "abertura-oficial-liga-2026",
    title: "Grande Abertura da Liga de Futsal Escolar 2026",
    excerpt: "Com mais de 40 escolas confirmadas, a cerimônia de abertura promete ser a maior da história do Agreste Meridional.",
    category: "COMPETIÇÃO",
    date: "19 Abr 2026",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    slug: "novas-regras-arbitragem-futsal",
    title: "Workshop de Arbitragem: Atualizações nas Regras FIFA",
    excerpt: "Técnicos e árbitros se reúnem para discutir as novas diretrizes que serão aplicadas nesta temporada.",
    category: "TÉCNICO",
    date: "15 Abr 2026",
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    slug: "atletas-destaque-primeira-rodada",
    title: "Conheça os Atletas Destaque da 1ª Rodada",
    excerpt: "Uma análise detalhada das performances que agitaram as quadras no início da competição.",
    category: "ATLETAS",
    date: "12 Abr 2026",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function News() {
  const { data: serverNews } = useSupaData('lfe_news', []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODAS");

  const newsList = serverNews.length > 0 ? serverNews : defaultNews;

  const categories = ["TODAS", ...new Set(newsList.map((n: any) => n.category))];

  const filteredNews = newsList.filter((n: any) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODAS" || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
              PORTAL DE <span className="text-primary italic">NOTÍCIAS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-sans">
              Fique por dentro de tudo o que acontece na Liga de Futsal Escolar do Agreste Meridional.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              placeholder="Buscar notícias..."
            />
          </div>
        </div>

        {/* Categories Grid - Fast Access */}
        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto no-scrollbar pb-4 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full font-display text-xs uppercase tracking-[0.2em] transition-all border whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news: any) => (
            <Link 
              to={`/noticias/${news.slug}`}
              key={news.id}
              className="group flex flex-col bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] relative overflow-hidden bg-white/5">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-primary text-black font-display font-black text-[10px] rounded-lg uppercase tracking-widest shadow-lg">
                    {news.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-gray-500 mb-4 font-display text-[10px] uppercase tracking-widest font-bold">
                  <Calendar className="w-3.5 h-3.5" /> {news.date}
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors mb-4">
                  {news.title}
                </h3>
                <p className="text-gray-400 font-sans text-sm line-clamp-3 mb-8">
                  {news.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-primary font-display text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                  Ler Reportagem <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
             <Newspaper className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-20" />
             <p className="text-gray-500 font-display text-xl uppercase tracking-widest">Nenhuma notícia encontrada</p>
          </div>
        )}

      </div>
    </div>
  );
}
