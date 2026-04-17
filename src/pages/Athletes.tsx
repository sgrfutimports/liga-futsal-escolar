import { useState, useEffect } from "react";
import { Search, Trophy, Goal, User } from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Athletes() {
  const { data: athletes } = useSupaData('lfe_athletes', []);
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  // Cálculo de gols dinâmico via súmulas
  const getAthleteGoals = (athleteId: string) => {
    let total = 0;
    games.forEach((game: any) => {
      const events = Array.isArray(game.events) ? game.events : [];
      events.forEach((event: any) => {
        if (event.type === 'goal' && String(event.athleteId || event.atleta_id) === String(athleteId)) {
          total++;
        }
      });
    });
    return total;
  };

  const filteredAthletes = athletes.filter((athlete: any) => {
    const nameStr = (athlete.name || "").toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || athlete.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-4 uppercase tracking-tighter">
              ELITE <span className="text-primary">ATLETAS</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl font-sans">
              O banco de talentos oficial da Liga de Futsal Escolar.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-sans transition-all shadow-sm"
              placeholder="Buscar atleta..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 font-display text-xs rounded-xl transition-all border uppercase tracking-[0.2em] font-bold",
                activeCategory === cat 
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete: any) => {
            const team = teams.find((t: any) => String(t.id) === String(athlete.team_id || athlete.teamId));
            const goals = getAthleteGoals(athlete.id);

            return (
              <div 
                key={athlete.id}
                className="group relative flex flex-col bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] aspect-[10/14] border border-slate-100"
              >
                {/* 1. IMAGEM TOTAL (Fundo) */}
                <div className="absolute inset-0 z-0">
                  {athlete.photo ? (
                    <img 
                      src={athlete.photo} 
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <User className="w-24 h-24 text-slate-200" />
                    </div>
                  )}
                  {/* Gradiente branco suave na base para o nome */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                {/* 2. INFORMAÇÕES DE GOLS (Meio do Canto Esquerdo) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                   <div className="bg-slate-900/90 backdrop-blur-md px-3 py-4 rounded-r-2xl border-y border-r border-white/20 shadow-xl flex flex-col items-center gap-1 group-hover:bg-primary transition-colors group-hover:border-primary">
                      <Goal className="w-4 h-4 text-primary group-hover:text-black" />
                      <span className="text-[9px] font-display font-black text-white/40 uppercase tracking-widest group-hover:text-black/40">Gols</span>
                      <span className="text-xl font-display font-black text-white group-hover:text-black leading-none">{goals}</span>
                   </div>
                </div>

                {/* 3. CABEÇALHO (Categoria e Logo/Número) */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                   <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg text-[9px] font-display font-black text-slate-900 uppercase tracking-widest shadow-sm">
                      {athlete.category || "LFE"}
                   </span>

                   <div className="flex flex-col items-center">
                      <span className="font-display font-black text-7xl italic leading-none tracking-tighter text-slate-900 drop-shadow-sm">
                        {athlete.number}
                      </span>
                      {team?.logo && (
                        <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 shadow-lg border border-slate-100 overflow-hidden flex items-center justify-center transform rotate-2">
                           <img src={team.logo} className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                {/* 4. NOME NA BASE (Alinhado na Base) */}
                <div className="relative z-10 mt-auto p-8 flex flex-col items-center bg-gradient-to-t from-white via-white/80 to-transparent">
                   <h3 className="font-display font-black text-3xl text-slate-900 text-center uppercase leading-none tracking-tighter drop-shadow-sm group-hover:text-primary transition-colors">
                     {athlete.name}
                   </h3>
                   {/* Detalhe da barra na base */}
                   <div className="w-12 h-1.5 bg-slate-900 rounded-full mt-4 group-hover:bg-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredAthletes.length === 0 && (
          <div className="py-24 text-center">
            <Trophy className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <p className="text-slate-400 font-display text-xl uppercase tracking-widest">Nenhum atleta encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
