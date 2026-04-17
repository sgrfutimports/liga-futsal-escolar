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
    const matchesSearch = (athlete.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || athlete.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-[#020617] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase tracking-tighter">
              ELITE <span className="text-primary">ATLETAS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-sans">
              Os rostos e os talentos que brilham nas quadras da LFE.
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
              className="block w-full pl-10 pr-3 py-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-sans transition-all"
              placeholder="Buscar atleta pelo nome..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 font-display text-xs rounded-xl transition-all border uppercase tracking-[0.2em]",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]" 
                  : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
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
            const teamColor = team?.color || "#ccff00";

            return (
              <div 
                key={athlete.id}
                className="group relative flex flex-col bg-[#010a1a] rounded-[2.5rem] border-2 border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] aspect-[10/14]"
              >
                {/* 1. BACKGROUND PHOTO (Takes full area) */}
                <div className="absolute inset-0 z-0">
                  {athlete.photo ? (
                    <img 
                      src={athlete.photo} 
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                      <User className="w-32 h-32 text-white/5" />
                    </div>
                  )}
                  {/* Overlays for depth and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
                </div>

                {/* 2. OVERLAY HEADER (Top corner info) */}
                <div className="relative z-20 p-6 flex justify-between items-start">
                  {/* CATEGORIA (Superior Esquerdo) */}
                  <div className="px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                    <span className="text-[11px] font-display font-black text-white uppercase tracking-[0.2em] leading-none">
                      {athlete.category || "---"}
                    </span>
                  </div>

                  {/* LOGO E NÚMERO (Superior Direito) */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-end">
                      <span 
                        className="font-display font-black text-7xl italic leading-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                        style={{ color: teamColor, textShadow: `0 0 20px ${teamColor}60` }}
                      >
                        {athlete.number}
                      </span>
                      <span className="text-[10px] font-display font-black text-white/80 uppercase tracking-widest mt-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                        {athlete.position || "JOG"}
                      </span>
                    </div>
                    {team?.logo && (
                      <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-2xl border border-white/20 transform rotate-3 group-hover:rotate-0 transition-transform">
                        <img src={team.logo} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. OVERLAY FOOTER (Full Name and Stats) */}
                <div className="relative z-20 mt-auto p-8">
                  <div className="flex flex-col items-center">
                    {/* FULL NAME OVERLAYED AT BASE */}
                    <h3 className="font-display font-black text-3xl text-white text-center uppercase leading-none tracking-tighter mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
                      {athlete.name}
                    </h3>

                    <div className="w-full grid grid-cols-2 gap-4 bg-black/60 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl">
                      <div className="flex flex-col items-center justify-center border-r border-white/10">
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Gols Oficiais</span>
                        <div className="flex items-center gap-2">
                          <Goal className="w-4 h-4 text-primary" />
                          <span className="text-xl font-display font-black text-white leading-none">{goals}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Equipe</span>
                        <span className="text-[10px] font-display font-bold text-white truncate max-w-full text-center uppercase">
                          {team?.name || "Sem Clube"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAthletes.length === 0 && (
          <div className="py-24 text-center">
            <Trophy className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
            <p className="text-gray-500 font-display text-xl uppercase tracking-widest">Nenhum atleta encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
