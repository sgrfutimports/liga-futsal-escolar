import { useState, useEffect } from "react";
import { Search, Trophy, Goal, User, Clock } from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

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
        
        if (isHome || isAway) totalGames++;
      }
    });

    const goalsCount = games.reduce((acc: number, game: any) => {
      if (game.status?.toLowerCase() === 'finalizado') {
        const events = Array.isArray(game.events) ? game.events : [];
        events.forEach((event: any) => {
          if (String(event.athleteId || event.atleta_id) === String(athleteId) && event.type === 'goal') {
            acc++;
          }
        });
      }
      return acc;
    }, 0);

    return { goals: goalsCount, games: totalGames };
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
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h1 className="text-5xl font-display font-bold text-white uppercase">Atletas</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-display"
              placeholder="Buscar atleta..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-dark-border/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 font-display text-sm rounded-full transition-all border uppercase",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary" 
                  : "bg-dark-card text-gray-500 border-dark-border hover:border-gray-600"
              )}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete: any) => {
            const team = teams.find((t: any) => String(t.id) === String(athlete.team_id || athlete.teamId));
            const stats = getAthleteStats(athlete.id, athlete.team_id || athlete.teamId);

            return (
              <div key={athlete.id} className="group relative bg-dark-card rounded-[2rem] border border-dark-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-2">
                <div className="aspect-[4/5] relative overflow-hidden">
                   {athlete.photo ? (
                     <img src={athlete.photo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={athlete.name} />
                   ) : (
                     <div className="w-full h-full bg-dark flex items-center justify-center"><User className="w-20 h-20 text-gray-800" /></div>
                   )}
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark to-transparent opacity-60" />
                   <div className="absolute top-4 right-4 text-6xl font-display font-black italic text-white/5 group-hover:text-primary/10 transition-colors uppercase">{athlete.number}</div>
                </div>
                <div className="p-8">
                   <h3 className="text-2xl font-display font-black text-white uppercase group-hover:text-primary transition-colors truncate">{athlete.name}</h3>
                   <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs font-display">
                      <span>{team?.name || "LFE"}</span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <span>{athlete.category}</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-dark/50 p-3 rounded-xl border border-dark-border">
                         <span className="text-[10px] text-gray-600 block uppercase font-bold">Gols</span>
                         <span className="text-xl font-display text-primary">{stats.goals}</span>
                      </div>
                      <div className="bg-dark/50 p-3 rounded-xl border border-dark-border">
                         <span className="text-[10px] text-gray-600 block uppercase font-bold">Jogos</span>
                         <span className="text-xl font-display text-white">{stats.games}</span>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
