import { useState, useEffect } from "react";
import { Users, Trophy, Goal, Calendar, Clock, User, MapPin, ChevronRight, BarChart3, Info } from "lucide-react";
import { useParams, Link } from "react-router";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function TeamDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab ] = useState("elenco");
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allGames } = useSupaData('lfe_games', []);

  const team = allTeams.find((t: any) => String(t.id) === String(id)) || {};
  const players = allAthletes.filter((a: any) => String(a.teamId || a.team_id) === String(id));

  const getAthleteStats = (athleteId: string, playerTeamId: string) => {
    let goals = 0;
    let assists = 0;
    let totalGamesCount = 0;

    allGames.forEach((game: any) => {
      if (game.status?.toLowerCase() === 'finalizado') {
        const isHome = String(game.home_team_id || game.homeTeamId) === String(playerTeamId);
        const isAway = String(game.away_team_id || game.awayTeamId) === String(playerTeamId);
        
        if (isHome || isAway) {
          totalGamesCount++;
          const events = Array.isArray(game.events) ? game.events : [];
          events.forEach((event: any) => {
            if (String(event.athleteId || event.atleta_id) === String(athleteId)) {
              if (event.type === 'goal') goals++;
              if (event.type === 'assist') assists++;
            }
          });
        }
      }
    });
    return { goals, assists, games: totalGamesCount };
  };

  const teamGames = allGames.filter((g: any) => {
    const homeId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
    const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
    const currentId = String(id || '').toLowerCase().trim();
    return homeId === currentId || awayId === currentId;
  });

  const upcomingGames = teamGames.filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado');
  const pastGames = teamGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado');

  // Statistics Calculation
  const stats = {
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    totalGames: pastGames.length
  };

  pastGames.forEach((g: any) => {
    const isHome = String(g.home_team_id || g.homeTeamId).toLowerCase() === String(id).toLowerCase();
    const homeScore = Number(g.home_score ?? g.homeScore ?? 0);
    const awayScore = Number(g.away_score ?? g.awayScore ?? 0);
    
    const myScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    
    stats.goalsFor += myScore;
    stats.goalsAgainst += oppScore;
    
    if (myScore > oppScore) stats.wins++;
    else if (myScore === oppScore) stats.draws++;
    else stats.losses++;
  });

  const topScorers = players
    .map(p => ({ ...p, goals: getAthleteStats(p.id, p.team_id || p.teamId).goals }))
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      {/* 1. Header Premium / Banner */}
      <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {team.logo ? (
            <img src={team.logo} className="w-full h-full object-cover opacity-20 blur-3xl scale-150" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-900/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white/95 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl mb-8 border border-white/20 transform hover:scale-105 transition-transform duration-500">
              {team.logo ? (
                <img src={team.logo} className="w-full h-full object-contain" alt={team.name} />
              ) : (
                <Trophy className="w-full h-full text-gray-200" />
              )}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-display font-black text-white uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {team.name || "Equipe LFE"}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-primary font-display font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
            <MapPin className="w-4 h-4" />
            <span>{team.city || "Sede Oficial LFE"}</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Ano Fund. {team.founded || "---"}</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start gap-8 md:gap-12 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'elenco', label: 'Elenco', icon: Users },
              { id: 'jogos', label: 'Jogos', icon: Calendar },
              { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-6 border-b-2 transition-all font-display text-sm uppercase tracking-widest whitespace-nowrap",
                  activeTab === tab.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-500 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="min-h-[400px]">
          {activeTab === 'elenco' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {players.length > 0 ? (
                Object.entries(
                  players.reduce((acc: any, player: any) => {
                    const cat = player.category || "Sem Categoria";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(player);
                    return acc;
                  }, {})
                ).sort().map(([category, catPlayers]: [string, any]) => (
                  <div key={category} className="space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                        Categoria <span className="text-primary">{category}</span>
                      </h3>
                      <span className="text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        {catPlayers.length} ATLETAS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {catPlayers.map((player: any) => {
                        const playerStats = getAthleteStats(player.id, player.team_id || player.teamId);
                        return (
                          <div key={player.id} className="group relative bg-[#0f172a] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/50">
                            <div className="aspect-[4/5] relative overflow-hidden bg-slate-800">
                               {player.photo ? (
                                 <img src={player.photo} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={player.name} />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center opacity-20"><User className="w-24 h-24" /></div>
                               )}
                               <div className="absolute top-4 right-4 text-4xl font-display font-black italic text-white/20 group-hover:text-primary transition-colors">{player.number}</div>
                            </div>
                            <div className="p-6">
                               <h4 className="text-xl font-display font-black text-white uppercase group-hover:text-primary transition-colors truncate">{player.name}</h4>
                               <div className="grid grid-cols-3 gap-2 mt-4">
                                  <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                                     <span className="text-[8px] text-gray-500 block">Gols</span>
                                     <span className="font-display font-bold">{playerStats.goals}</span>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                                     <span className="text-[8px] text-gray-500 block">Ast</span>
                                     <span className="font-display font-bold">{playerStats.assists}</span>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                                     <span className="text-[8px] text-gray-500 block">Jogos</span>
                                     <span className="font-display font-bold">{playerStats.games}</span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500">Nenhum atleta homologado.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
