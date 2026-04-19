import { useState, useEffect } from "react";
import { Users, Trophy, Goal, Calendar, Clock, User, MapPin, ChevronRight, BarChart3, Info } from "lucide-react";
import { useParams, Link } from "react-router";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import PlayerCard from "@/src/components/PlayerCard";

export default function TeamDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("elenco");
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
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 z-0">
          {team.logo ? (
            <img src={team.logo} className="w-full h-full object-cover opacity-20 blur-3xl scale-150" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-900/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
        </div>

        {/* Brand Information */}
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
          {/* TAB: ELENCO */}
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
                          <div 
                            key={player.id} 
                            className="group relative bg-[#0f172a] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                          >
                            {/* Athlete Photo */}
                            <div className="aspect-[4/5] relative overflow-hidden bg-slate-800">
                              {player.photo ? (
                                <img src={player.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={player.name} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                  <User className="w-24 h-24" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                              
                              {/* Overlay Number */}
                              <div className="absolute top-4 right-4 flex flex-col items-center">
                                <span className="text-5xl font-display font-black italic text-white/10 group-hover:text-primary/20 transition-colors leading-none">
                                  {player.number}
                                </span>
                              </div>
                            </div>

                            {/* Info & Stats */}
                            <div className="p-6">
                              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-4">
                                {player.name}
                              </h4>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col items-center p-2 bg-white/5 rounded-xl border border-white/5">
                                  <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest">Gols</span>
                                  <span className="text-sm font-display font-black text-white">{playerStats.goals}</span>
                                </div>
                                <div className="flex flex-col items-center p-2 bg-white/5 rounded-xl border border-white/5">
                                  <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest">Ast</span>
                                  <span className="text-sm font-display font-black text-white">{playerStats.assists}</span>
                                </div>
                                <div className="flex flex-col items-center p-2 bg-white/5 rounded-xl border border-white/5">
                                  <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest">Jog</span>
                                  <span className="text-sm font-display font-black text-white">{playerStats.games}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="text-[10px] font-display font-bold text-primary uppercase tracking-widest">
                                  {player.position || "ATLETA"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <Users className="w-20 h-20 text-gray-800 mb-6" />
                   <h3 className="text-2xl font-display font-bold text-gray-500 uppercase">Nenhum atleta homologado</h3>
                   <p className="text-gray-600 mt-2">Os atletas cadastrados aparecerão aqui após a confirmação técnica.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: JOGOS */}
          {activeTab === 'jogos' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Upcoming */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-white flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" /> PRÓXIMOS CONFRONTOS
                  </h3>
                  <div className="space-y-4">
                    {upcomingGames.length > 0 ? (
                      upcomingGames.map((game: any) => {
                        const hTeam = allTeams.find((t: any) => String(t.id) === String(game.home_team_id || game.homeTeamId));
                        const aTeam = allTeams.find((t: any) => String(t.id) === String(game.away_team_id || game.awayTeamId));
                        return (
                          <div key={game.id} className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all">
                            <div className="flex justify-between items-center mb-6 text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest">
                               <span>{game.date} • {game.time || "--:--"}</span>
                               <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30 uppercase">{game.category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-center gap-2 w-1/3">
                                <div className="w-14 h-14 bg-white rounded-xl p-2 border border-white/10 shadow-lg">
                                  <img src={hTeam?.logo} className="w-full h-full object-contain" alt="" />
                                </div>
                                <span className="text-xs font-display font-bold text-center line-clamp-1">{hTeam?.name}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-2xl font-display font-black text-gray-700 italic">VS</span>
                                <span className="text-[10px] text-gray-500 mt-2 uppercase tracking-tight text-center max-w-[100px]">{game.location}</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 w-1/3">
                                <div className="w-14 h-14 bg-white rounded-xl p-2 border border-white/10 shadow-lg">
                                  <img src={aTeam?.logo} className="w-full h-full object-contain" alt="" />
                                </div>
                                <span className="text-xs font-display font-bold text-center line-clamp-1">{aTeam?.name}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-600 font-display uppercase tracking-widest text-sm italic py-10 border border-white/5 border-dashed rounded-xl text-center">Nenhum jogo agendado</p>
                    )}
                  </div>
                </div>

                {/* Past Results */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-white flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-primary" /> RESULTADOS RECENTES
                  </h3>
                  <div className="space-y-4">
                    {pastGames.length > 0 ? (
                      pastGames.map((game: any) => {
                        const hTeam = allTeams.find((t: any) => String(t.id) === String(game.home_team_id || game.homeTeamId));
                        const aTeam = allTeams.find((t: any) => String(t.id) === String(game.away_team_id || game.awayTeamId));
                        const isHome = String(hTeam?.id) === String(id);
                        const win = isHome ? (game.home_score > game.away_score) : (game.away_score > game.home_score);
                        const draw = game.home_score === game.away_score;

                        return (
                          <div key={game.id} className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                            <div className={cn(
                              "absolute left-0 top-0 bottom-0 w-1",
                              win ? "bg-green-500" : draw ? "bg-yellow-500" : "bg-red-500"
                            )} />
                            <div className="flex justify-between items-center mb-4 text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest">
                               <span>{game.date}</span>
                               <span className={cn(
                                 "px-3 py-1 rounded-full text-[9px]",
                                 win ? "bg-green-500/10 text-green-500 border border-green-500/20" : 
                                 draw ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : 
                                 "bg-red-500/10 text-red-500 border border-red-500/20"
                               )}>
                                 {win ? "VITÓRIA" : draw ? "EMPATE" : "DERROTA"}
                               </span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-display font-black">
                               <div className="flex items-center gap-4 w-1/3">
                                  <img src={hTeam?.logo} className="w-8 h-8 object-contain" alt="" />
                                  <span className="truncate hidden md:block">{hTeam?.name}</span>
                               </div>
                               <div className="flex items-center gap-6 px-6 py-2 bg-[#020617] rounded-full border border-white/5">
                                 <span className={cn(isHome ? "text-primary" : "text-white")}>{game.home_score}</span>
                                 <span className="text-gray-700">-</span>
                                 <span className={cn(!isHome ? "text-primary" : "text-white")}>{game.away_score}</span>
                               </div>
                               <div className="flex items-center justify-end gap-4 w-1/3 text-right">
                                  <span className="truncate hidden md:block">{aTeam?.name}</span>
                                  <img src={aTeam?.logo} className="w-8 h-8 object-contain" alt="" />
                               </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-600 font-display uppercase tracking-widest text-sm italic py-10 border border-white/5 border-dashed rounded-xl text-center">Nenhum resultado registrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ESTATÍSTICAS */}
          {activeTab === 'estatisticas' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Jogos", value: stats.totalGames, color: "text-white" },
                  { label: "Vitórias", value: stats.wins, color: "text-green-500" },
                  { label: "Empates", value: stats.draws, color: "text-yellow-500" },
                  { label: "Derrotas", value: stats.losses, color: "text-red-500" }
                ].map((item, i) => (
                  <div key={i} className="bg-[#0f172a] border border-white/5 p-8 rounded-[2rem] text-center">
                    <span className="text-[10px] font-display font-bold text-gray-500 uppercase tracking-[0.3em] block mb-2">{item.label}</span>
                    <span className={cn("text-5xl font-display font-black", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Performance Chart Simulation (Cards) */}
                <div className="lg:col-span-2 space-y-8">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Balanço de Gols</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] flex items-center justify-between">
                       <div>
                         <span className="text-[10px] font-display font-medium text-primary uppercase tracking-widest mb-1 block">Gols Marcados</span>
                         <span className="text-5xl font-display font-black text-white">{stats.goalsFor}</span>
                       </div>
                       <Goal className="w-12 h-12 text-primary opacity-20" />
                    </div>
                    <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex items-center justify-between">
                       <div>
                         <span className="text-[10px] font-display font-medium text-red-500 uppercase tracking-widest mb-1 block">Gols Sofridos</span>
                         <span className="text-5xl font-display font-black text-white">{stats.goalsAgainst}</span>
                       </div>
                       <Info className="w-12 h-12 text-red-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Top Scorers */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Artilharia</h3>
                  <div className="space-y-4">
                    {topScorers.length > 0 ? (
                      topScorers.map((player: any, idx: number) => (
                        <div key={player.id} className="flex items-center justify-between p-4 bg-[#0f172a] border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-display font-black text-gray-800">#{idx+1}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
                              {player.photo && <img src={player.photo} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors">{player.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{player.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-display font-black text-primary">{player.goals}</span>
                            <span className="text-[9px] font-display font-bold text-gray-500 uppercase">Gols</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 italic text-sm">Nenhum gol registrado.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
