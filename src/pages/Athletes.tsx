import { useState, useEffect } from "react";
import { Search, Trophy, Goal, User, ChevronRight, Award } from "lucide-react";
import { Link } from "react-router";
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
    const matchesSearch = athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-sans transition-all"
                placeholder="Buscar atleta..."
              />
            </div>
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

            return (
              <div 
                key={athlete.id}
                className="group relative flex flex-col bg-[#0f172a] rounded-[2rem] border-2 border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] aspect-[10/14]"
              >
                {/* 1. TOP HEADER (No Overlap) */}
                <div className="p-5 flex justify-between items-start z-30 bg-gradient-to-b from-[#0f172a] to-transparent">
                  {/* Category (Left) */}
                  <div className="flex flex-col">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-display font-black text-white uppercase tracking-widest border border-white/10">
                      {athlete.category || "SUB-XX"}
                    </span>
                  </div>

                  {/* Right Side: Logo & Number */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-end">
                       <span 
                         className="font-display font-black text-5xl italic leading-none drop-shadow-lg"
                         style={{ color: teamColor }}
                       >
                         {athlete.number}
                       </span>
                       <span className="text-[9px] font-display font-bold text-gray-500 uppercase tracking-widest mt-1">
                         {athlete.position || "JOG"}
                       </span>
                    </div>
                    {team?.logo && (
                      <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-xl border border-white/20 transform rotate-3 group-hover:rotate-0 transition-transform">
                        <img src={team.logo} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. PHOTO AREA (Center Protected) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pt-20 pb-24">
                  <div className="w-full h-full relative">
                    {athlete.photo ? (
                      <img 
                        src={athlete.photo} 
                        className="w-full h-full object-cover rounded-2xl transition-all duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800/50 rounded-2xl flex items-center justify-center">
                        <User className="w-24 h-24 text-white/10" />
                      </div>
                    )}
                    {/* Dark gradient to ensure name contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent rounded-b-2xl" />
                  </div>
                </div>

                {/* 3. BASE DATA (Bottom) */}
                <div className="mt-auto p-6 z-20 flex flex-col items-center">
                  <div className="w-full border-t border-white/10 mb-4 opacity-50" />
                  
                  {/* FULL NAME */}
                  <h3 className="font-display font-black text-2xl text-white text-center uppercase leading-none tracking-tighter mb-4 px-2 group-hover:text-primary transition-colors">
                    {athlete.name}
                  </h3>

                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="flex flex-col items-start bg-white/5 p-2 rounded-xl flex-1 border border-white/5">
                      <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Total Gols</span>
                      <div className="flex items-center gap-1">
                        <Goal className="w-3 h-3 text-primary" />
                        <span className="text-sm font-display font-black text-white">{goals}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end bg-white/5 p-2 rounded-xl flex-1 border border-white/5">
                      <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Equipe</span>
                      <span className="text-[10px] font-display font-bold text-white truncate max-w-[80px] uppercase">
                        {team?.name || "Sem Equipe"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(204,255,0,0.1),transparent_70%)]" />
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
