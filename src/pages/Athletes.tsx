import { useState, useEffect } from "react";
import { Search, Trophy, Goal, User, Clock } from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import PlayerCard from "@/src/components/PlayerCard";

export default function Athletes() {
  const { data: athletes } = useSupaData('lfe_athletes', []);
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const getAthleteStats = (athleteId: string, teamId: string) => {
    let goals = 0;
    let assists = 0;
    let totalGames = 0;

    games.forEach((game: any) => {
      if (game.status?.toLowerCase() === 'finalizado') {
        const isHome = String(game.home_team_id || game.homeTeamId) === String(teamId);
        const isAway = String(game.away_team_id || game.awayTeamId) === String(teamId);
        
        if (isHome || isAway) {
          totalGames++;
          const events = Array.isArray(game.events) ? game.events : [];
          events.forEach((event: any) => {
            const evAthleteId = String(event.athleteId || event.atleta_id);
            if (evAthleteId === String(athleteId)) {
              if (event.type === 'goal') goals++;
              if (event.type === 'assist') assists++;
            }
          });
        }
      }
    });

    return { goals, assists, games: totalGames };
  };

  const filteredAthletes = athletes.filter((athlete: any) => {
    const nameStr = String(athlete.name || "").toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
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
            <p className="text-gray-300 text-lg max-w-2xl">
              Confira as estatísticas detalhadas e o card oficial dos talentos da Liga.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete: any) => {
            const team = teams.find((t: any) => String(t.id) === String(athlete.team_id || athlete.teamId));
            const playerStats = getAthleteStats(athlete.id, athlete.team_id || athlete.teamId);
            const safeName = String(athlete.name || "Uniformado").trim();

            return (
              <div 
                key={athlete.id}
                className="group relative flex flex-col bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] aspect-[10/14]"
              >
                {/* 1. IMAGEM TOTAL */}
                <div className="absolute inset-0 z-0">
                  {athlete.photo ? (
                    <img 
                      src={athlete.photo} 
                      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User className="w-24 h-24 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                {/* 2. STATS MEIO ESQUERDA */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                   {/* Gols */}
                   <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-r-xl border-y border-r border-white/20 shadow-xl flex flex-col items-center group-hover:bg-primary transition-colors group-hover:border-primary w-14">
                      <span className="text-[7px] font-display font-black text-white/40 uppercase tracking-widest group-hover:text-black/40">Gols</span>
                      <span className="text-lg font-display font-black text-white group-hover:text-black leading-none">{playerStats.goals}</span>
                   </div>
                   {/* Assistências */}
                   <div className="bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-r-xl border-y border-r border-white/10 shadow-xl flex flex-col items-center group-hover:bg-primary transition-colors group-hover:border-primary w-14">
                      <span className="text-[7px] font-display font-black text-white/40 uppercase tracking-widest group-hover:text-black/40">Ast</span>
                      <span className="text-lg font-display font-black text-white group-hover:text-black leading-none">{playerStats.assists}</span>
                   </div>
                   {/* Jogos */}
                   <div className="bg-slate-900/70 backdrop-blur-md px-3 py-2 rounded-r-xl border-y border-r border-white/5 shadow-xl flex flex-col items-center group-hover:bg-primary transition-colors group-hover:border-primary w-14">
                      <span className="text-[7px] font-display font-black text-white/40 uppercase tracking-widest group-hover:text-black/40">Jog</span>
                      <span className="text-lg font-display font-black text-white group-hover:text-black leading-none">{playerStats.games}</span>
                   </div>
                </div>

                {/* 3. CABEÇALHO */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                   <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg text-[9px] font-display font-black text-slate-900 uppercase tracking-widest shadow-sm">
                      {String(athlete.category || "---").toUpperCase()}
                   </span>

                   <div className="flex flex-col items-center">
                      <span className="font-display font-black text-7xl italic leading-none tracking-tighter text-slate-900 drop-shadow-sm">
                        {athlete.number}
                      </span>
                      {team?.logo && (
                        <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 shadow-lg border border-slate-100 overflow-hidden flex items-center justify-center transform rotate-2">
                           <img src={team.logo} alt={safeName} className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                {/* 4. NOME NA BASE */}
                <div className="relative z-10 mt-auto p-8 flex flex-col items-center bg-gradient-to-t from-white via-white/80 to-transparent">
                   <h3 className="font-display font-black text-3xl text-slate-900 text-center uppercase leading-none tracking-tighter drop-shadow-sm group-hover:text-primary transition-colors">
                     {safeName}
                   </h3>
                   <div className="w-12 h-1.5 bg-slate-900 rounded-full mt-4 group-hover:bg-primary transition-colors" />
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
