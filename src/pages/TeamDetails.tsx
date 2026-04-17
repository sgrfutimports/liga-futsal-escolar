import { useState, useEffect } from "react";
import { Users, Calendar, Trophy, Goal, MapPin, Clock, ChevronRight, User } from "lucide-react";
import { useParams, Link } from "react-router";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function TeamDetails() {
  const { id } = useParams();
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allGames } = useSupaData('lfe_games', []);

  const team = allTeams.find((t: any) => String(t.id) === String(id)) || {};
  const players = allAthletes.filter((a: any) => String(a.teamId || a.team_id) === String(id));

  // Cálculo de gols dinâmico via súmulas
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

  const allTeamGames = allGames.filter((g: any) => {
    const homeId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
    const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
    const currentId = String(id || '').toLowerCase().trim();
    
    const matchesId = homeId === currentId || awayId === currentId;
    const teamName = (team?.name || '').toLowerCase().trim();
    const matchesName = teamName && (
      String(g.home_team_name || '').toLowerCase().trim().includes(teamName) ||
      String(g.away_team_name || '').toLowerCase().trim().includes(teamName)
    );
    return matchesId || matchesName;
  });

  const upcomingGames = allTeamGames.filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado').sort((a: any, b: any) => new Date(a.date || a.game_date).getTime() - new Date(b.date || b.game_date).getTime());

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Brand Header */}
      <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          {team.logo && <img src={team.logo} className="w-full h-full object-cover opacity-10 blur-2xl scale-125" alt="" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl p-4 shadow-2xl mb-4 border border-white/20">
            {team.logo ? <img src={team.logo} className="w-full h-full object-contain" /> : <Trophy className="w-full h-full text-gray-400" />}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter text-center px-4 drop-shadow-2xl">
            {team.name}
          </h1>
          <span className="text-primary font-display text-[10px] tracking-[0.5em] mt-2 uppercase opacity-60 font-bold">{team.city || "Sede Oficial LFE"}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-3 space-y-16">
            <h2 className="text-4xl font-display font-black text-white flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" /> ELENCO <span className="text-primary">OFICIAL</span>
            </h2>

            <div className="space-y-24">
              {Object.entries(
                players.reduce((acc: any, player: any) => {
                  const cat = player.category || "Sem Categoria";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(player);
                  return acc;
                }, {})
              ).sort().map(([category, catPlayers]: [string, any]) => (
                <div key={category} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <h3 className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-display font-black uppercase tracking-widest text-xs">
                      {category} <span className="text-white/40 ml-2">{catPlayers.length} ATLETAS</span>
                    </h3>
                    <div className="h-0.5 flex-1 bg-white/5"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);
                      const teamColor = team?.color || "#ccff00";

                      return (
                        <div 
                          key={player.id} 
                          className="group relative flex flex-col bg-[#010a1a] rounded-[3rem] border-2 border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] aspect-[10/14]"
                        >
                          {/* 1. BACKGROUND PHOTO (Full Area) */}
                          <div className="absolute inset-0 z-0">
                            {player.photo ? (
                              <img 
                                src={player.photo} 
                                className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-900/50 flex items-center justify-center">
                                <User className="w-32 h-32 text-white/5" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          </div>

                          {/* 2. OVERLAY HEADER */}
                          <div className="relative z-20 p-8 flex justify-between items-start">
                            <div className="px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                              <span className="text-[10px] font-display font-black text-white uppercase tracking-widest leading-none">
                                {player.category || "---"}
                              </span>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-end">
                                <span 
                                  className="font-display font-black text-7xl italic leading-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                                  style={{ color: teamColor, textShadow: `0 0 20px ${teamColor}60` }}
                                >
                                  {player.number}
                                </span>
                                <span className="text-[11px] font-display font-black text-white/90 uppercase tracking-[0.2em] mt-2 bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                                  {player.position || "JOG"}
                                </span>
                              </div>
                              {team?.logo && (
                                <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-2xl border border-white/10 transform rotate-3 समूह-hover:rotate-0 transition-transform">
                                  <img src={team.logo} className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 3. OVERLAY FOOTER */}
                          <div className="relative z-20 mt-auto p-10">
                            <div className="flex flex-col items-center">
                              <h3 className="font-display font-black text-3xl text-white text-center uppercase leading-none tracking-tighter mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                                {player.name}
                              </h3>
                              
                              <div className="w-full flex items-center justify-center gap-6 bg-black/60 backdrop-blur-3xl p-4 rounded-[1.5rem] border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3">
                                  <Goal className="w-5 h-5 text-primary" />
                                  <span className="text-[11px] font-display font-black text-gray-300 uppercase tracking-[0.25em] leading-none">Gols</span>
                                </div>
                                <span className="text-2xl font-display font-black text-white leading-none">{goals}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-10 sticky top-24">
               <h2 className="text-xl font-display font-black text-white flex items-center gap-3 border-b border-white/5 pb-4 mb-8 uppercase tracking-widest">
                 Sincronizado
               </h2>
               <div className="space-y-8">
                 <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/20">
                   <span className="text-[10px] text-primary uppercase font-display font-black tracking-widest">Base de Dados</span>
                   <p className="text-2xl font-display font-black text-white mt-1">LFE Oficial</p>
                 </div>
                 
                 <div className="space-y-6">
                   <h4 className="text-[10px] text-gray-500 font-display font-black uppercase tracking-widest">Agenda da Equipe</h4>
                   {upcomingGames.length > 0 ? upcomingGames.slice(0, 3).map((match: any) => (
                      <div key={match.id} className="text-xs group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-primary font-black uppercase tracking-widest">{match.date}</span>
                          <span className="text-gray-600 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> {match.time || "--:--"}</span>
                        </div>
                        <p className="text-white font-display font-black text-sm group-hover:text-primary transition-colors">vs {(match.home_team_name?.includes(team.name) ? match.away_team_name : match.home_team_name) || "Oponente"}</p>
                      </div>
                   )) : <p className="text-gray-600 italic text-sm">Sem jogos agendados.</p>}
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
