import React, { useState } from "react";
import { Search, User, Star, Users, Trophy, Goal } from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: allGames } = useSupaData('lfe_games', []);
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] ?? {};

  // Função para calcular gols reais das súmulas em tempo real
  const getAthleteGoals = (athleteId: string) => {
    let total = 0;
    allGames.forEach((game: any) => {
      const events = Array.isArray(game.events) ? game.events : [];
      events.forEach((event: any) => {
        if (event.type === 'goal' && String(event.athleteId || event.atleta_id) === String(athleteId)) {
          total++;
        }
      });
    });
    return total;
  };

  const filteredAthletes = allAthletes.filter((athlete: any) => {
    const matchesSearch = athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || athlete.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase">
              NOSSOS <span className="text-primary">ATLETAS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              As grandes promessas da Liga de Futsal Escolar.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-dark-border rounded-xl leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm font-sans transition-all shadow-lg"
              placeholder="Buscar atleta por nome..."
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-dark-border/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 font-display text-sm rounded-full transition-all border uppercase tracking-wider",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-dark-card text-gray-500 border-dark-border hover:border-gray-600 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete: any) => {
            const team = allTeams.find((t: any) => String(t.id) === String(athlete.teamId || athlete.team_id));
            const goals = getAthleteGoals(athlete.id);
            const nameParts = (athlete.name || "Uniformado").split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || firstName;

            return (
              <div 
                key={athlete.id} 
                className="relative bg-[#020617] border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500 group cursor-pointer flex flex-col shadow-2xl hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(204,255,0,0.25)] aspect-[10/14]"
                style={{
                  borderColor: team?.color ? `${team.color}40` : 'rgba(255,255,255,0.05)',
                }}
              >
                
                {/* Sports Texture Layer */}
                <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Team Badge (Top Left Corner - Reposicionado) */}
                <div className="absolute top-8 left-8 z-30 w-14 h-14 bg-white rounded-2xl shadow-2xl p-2 border-2 border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    {team?.logo ? (
                      <img src={team.logo} className="w-full h-full object-contain" />
                    ) : (
                      <Trophy className="w-full h-full text-gray-300" />
                    )}
                </div>

                {/* Jersey Number (Top Right Corner - XL Style) */}
                <div className="absolute top-6 right-10 z-30 flex flex-col items-end">
                  <span className="font-display font-black text-9xl text-white/5 absolute -top-10 -right-4 italic select-none">
                    {athlete.number}
                  </span>
                  <span className="relative font-display font-black text-7xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] italic leading-none">
                    {athlete.number}
                  </span>
                  <span className="bg-primary px-3 py-1 rounded-md text-dark font-display font-black text-xs uppercase tracking-widest mt-1 shadow-xl transform skew-x-[-10deg]">
                    {athlete.position || "JOG"}
                  </span>
                </div>

                {/* Category Floater */}
                <div className="absolute top-24 left-8 z-30">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-display text-[10px] uppercase tracking-[0.2em] font-black shadow-lg">
                    {athlete.category || "SUB-XX"}
                  </span>
                </div>

                {/* Photo Container - Clear Face Area */}
                <div className="absolute inset-x-0 top-0 h-[80%] z-10 overflow-hidden">
                  {athlete.photo ? (
                    <img 
                      src={athlete.photo} 
                      alt={athlete.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-card/50">
                      <User className="w-48 h-48 text-gray-900 opacity-30" />
                    </div>
                  )}
                </div>
                
                {/* Premium Footer - Moving Name from Face Area */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/95 to-transparent z-20 flex flex-col justify-end p-10 pt-0">
                  
                  {/* Name Layout */}
                  <div className="flex flex-col items-center text-center -mb-2">
                    <span className="text-primary font-display font-black italic text-2xl uppercase tracking-[0.25em] opacity-90 mb-[-12px] drop-shadow-md">
                      {firstName}
                    </span>
                    <h3 className="font-display font-black italic text-5xl md:text-6xl text-white uppercase leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                      {lastName}
                    </h3>
                  </div>

                  {/* Dynamic Team Colored Divider */}
                  <div 
                    className="w-full h-1.5 mt-8 mb-6 rounded-full" 
                    style={{ 
                      backgroundColor: team?.color || 'var(--color-primary)',
                      boxShadow: `0 0 20px ${team?.color || 'rgba(204,255,0,0.6)'}`
                    }}
                  />

                  {/* Stats & Info Footer */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl border border-white/10 transition-colors backdrop-blur-md">
                      <Goal className="w-5 h-5 text-primary" />
                      <div className="flex flex-col">
                        <span className="font-display text-[10px] text-gray-400 uppercase tracking-widest leading-none">Total Gols</span>
                        <span className="font-display text-xl text-white font-black leading-none mt-1">{goals}</span>
                      </div>
                    </div>
                    {team?.city && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 font-display uppercase tracking-widest font-bold">Cidade</span>
                        <span className="text-xs text-white/80 font-display font-black">{team.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {filteredAthletes.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-sans text-lg">
                Nenhum atleta encontrado com o nome "<span className="text-white">{searchQuery}</span>".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
