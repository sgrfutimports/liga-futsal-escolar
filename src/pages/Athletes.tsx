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
    <div className="min-h-screen bg-[#020617] py-12">
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
              className="block w-full pl-10 pr-3 py-4 border border-white/5 rounded-xl leading-5 bg-[#0f172a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm font-sans transition-all shadow-lg"
              placeholder="Buscar atleta por nome..."
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 font-display text-sm rounded-full transition-all border uppercase tracking-wider",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-[#0f172a] text-gray-500 border-white/5 hover:border-gray-600 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete: any) => {
            const team = teams.find((t: any) => String(t.id) === String(athlete.team_id || athlete.teamId));
            const playerStats = getAthleteStats(athlete.id, athlete.team_id || athlete.teamId);

            return (
              <PlayerCard 
                key={athlete.id}
                player={athlete}
                teamLogo={team?.logo}
                stats={playerStats}
              />
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
