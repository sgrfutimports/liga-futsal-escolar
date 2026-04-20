import { useState } from "react";
import { Search, Calendar, ChevronRight, Hash, Newspaper, Trophy, Filter } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
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

  const categories = ["TODAS", ...Array.from(new Set(newsList.map((n: any) => n.category)))];

  const filteredNews = newsList.filter((n: any) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODAS" || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-30" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 font-display text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Newspaper className="w-4 h-4 text-primary" /> Cobertura Oficial
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Portal de <span className="text-primary italic">Notícias</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60"
          >
            Fique por dentro de tudo o que acontece na maior liga escolar da região.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-20 z-40 bg-[#020617]/80 backdrop-blur-3xl border-y border-white/5 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar matérias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-display font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                />
             </div>

             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
                <Filter className="w-5 h-5 text-gray-700 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-display text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                      activeCategory === cat 
                        ? "bg-primary border-primary text-dark shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                        : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredNews.map((news: any) => (
            <Link 
              to={`/noticias/${news.slug}`}
              key={news.id}
              className="group relative overflow-hidden rounded-[4rem] bg-white/[0.03] border border-white/10 hover:border-primary/50 transition-all flex flex-col h-full backdrop-blur-xl shadow-2xl"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                 <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 mix-blend-screen" alt={news.title} />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] to-transparent" />
                 <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 bg-primary text-dark font-display font-black text-[10px] rounded-xl uppercase tracking-widest shadow-2xl">
                      {news.category}
                    </span>
                 </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                 <div className="flex items-center gap-2 text-gray-600 mb-6 font-display font-black text-[10px] uppercase tracking-[0.3em]">
                    <Calendar className="w-4 h-4 text-primary" /> {news.date}
                 </div>
                 <h3 className="text-3xl font-display font-black leading-[1.1] mb-6 uppercase tracking-tighter group-hover:text-primary transition-colors">{news.title}</h3>
                 <p className="text-gray-500 text-sm mb-8 line-clamp-3 uppercase font-bold tracking-tight opacity-80 leading-relaxed font-sans">
                    {news.excerpt}
                 </p>
                 <div className="mt-auto flex items-center gap-3 text-white font-display font-black text-xs uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all">
                   Ler Matéria Completa <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </div>
              </div>
            </Link>
          ))}
          {filteredNews.length === 0 && (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                 <Newspaper className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                 <h3 className="text-2xl font-display font-black text-gray-600 uppercase tracking-widest">Nenhuma notícia encontrada</h3>
                 <p className="text-gray-700 mt-2 font-display uppercase text-xs tracking-widest">Tente ajustar sua busca ou categoria.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
