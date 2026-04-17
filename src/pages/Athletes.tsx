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
    const nameStr = athlete.name || "";
    const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredAthletes.map((athlete: any) => {
            const team = teams.find((t: any) => String(t.id) === String(athlete.team_id || athlete.teamId));
            const goals = getAthleteGoals(athlete.id);
            const teamColor = team?.color || "#ccff00";
            
            const nameParts = (athlete.name || "Atleta").trim().split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || firstName;

            return (
              <div 
                key={athlete.id}
                className="group relative flex flex-col bg-[#011429] rounded-[2rem] border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_60px_90px_-20px_rgba(0,0,0,1)] aspect-[10/14]"
              >
                {/* 1. BACKGROUND (Technical Grid) */}
                <div className="absolute inset-0 z-0 opacity-[0.25]" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }}></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#011429] via-transparent to-transparent" />

                {/* 2. ATHLETE PHOTO (Isolated) */}
                <div className="absolute inset-0 z-10 flex items-end justify-center">
                  {athlete.photo ? (
                    <img 
                      src={athlete.photo} 
                      className="w-[95%] h-[95%] object-contain object-bottom transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-56 h-56 text-white/5" />
                  )}
                  {/* Bottom fade to integrate name */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#011429] via-[#011429]/40 to-transparent pointer-events-none" />
                </div>

                {/* 3. INFO OVERLAYS (Gvardiol Style) */}
                <div className="relative z-20 h-full flex flex-col p-6">
                  {/* TOP: Category & Number/Logo */}
                  <div className="flex justify-between items-start">
                    <span className="text-[12px] font-display font-black text-white/30 uppercase tracking-[0.4em] pt-2">
                       {athlete.category || "LFE"}
                    </span>
                    
                    <div className="flex flex-col items-center">
                      <span className="font-display font-black text-7xl leading-none italic tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                         {athlete.number}
                      </span>
                      {team?.logo && (
                        <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 border-2 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                           <img src={team.logo} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM: Name & Stats (Fixed at the base) */}
                  <div className="mt-auto flex flex-col items-center pb-2">
                    {/* Name block - Pushed lower */}
                    <div className="flex flex-col items-center text-center -mb-2">
                      <span className="text-white font-display font-black text-sm uppercase tracking-[0.5em] mb-[-6px] opacity-70">
                        {firstName}
                      </span>
                      <h3 className="relative font-display font-black italic text-5xl text-white uppercase leading-none tracking-tighter">
                        <span className="absolute -top-[1.5px] -left-[1.5px] text-primary/40 blur-[1px]">{lastName}</span>
                        <span className="relative z-10 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]">{lastName}</span>
                      </h3>
                    </div>

                    {/* Accent Bar */}
                    <div className="w-12 h-1.5 rounded-full bg-primary mt-6 mb-10 shadow-[0_0_20px_rgba(204,255,0,0.8)]" />

                    {/* Footer Stats */}
                    <div className="w-full flex justify-center gap-8 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                       <div className="flex flex-col items-center">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-2">Gols</span>
                          <span className="text-xl font-display font-black text-white leading-none">{goals}</span>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div className="flex flex-col items-center">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-2">Cidade</span>
                          <span className="text-xs font-display font-bold text-white uppercase leading-none">{athlete.city || "LFE"}</span>
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
