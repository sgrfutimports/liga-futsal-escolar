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
    return homeId === String(id).toLowerCase().trim() || awayId === String(id).toLowerCase().trim();
  });

  const upcomingGames = allTeamGames.filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado');

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
          <div className="lg:col-span-3 space-y-24">
            <h2 className="text-3xl font-display font-black text-white flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" /> ELENCO <span className="text-primary">OFICIAL</span>
            </h2>

            <div className="space-y-20">
              {Object.entries(
                players.reduce((acc: any, player: any) => {
                  const cat = player.category || "Sem Categoria";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(player);
                  return acc;
                }, {})
              ).sort().map(([category, catPlayers]: [string, any]) => (
                <div key={category} className="space-y-12">
                  <div className="flex items-center gap-4">
                    <h3 className="px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-display font-bold uppercase tracking-widest text-[11px]">
                      {category} <span className="text-white ml-2 opacity-30">{catPlayers.length} ATLETAS</span>
                    </h3>
                    <div className="h-0.5 flex-1 bg-white/5"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);
                      
                      const nameParts = (player.name || "Uniformado").trim().split(" ");
                      const firstName = nameParts[0];
                      const lastName = nameParts.slice(1).join(" ") || firstName;

                      return (
                        <div 
                          key={player.id} 
                          className="group relative flex flex-col bg-[#011429] rounded-[2rem] border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] aspect-[10/14]"
                        >
                          {/* 1. TECHNICAL GRID BACKGROUND */}
                          <div className="absolute inset-0 z-0 opacity-[0.2]" style={{ 
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                          }}></div>
                          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#011429]/0 via-[#011429]/50 to-[#011429]" />

                          {/* 2. ATHLETE PHOTO */}
                          <div className="absolute inset-x-0 top-0 bottom-0 z-10 flex items-center justify-center p-4">
                            {player.photo ? (
                              <img src={player.photo} className="w-full h-full object-contain object-bottom transition-all duration-1000 group-hover:scale-105" />
                            ) : (
                              <User className="w-48 h-48 text-white/5" />
                            )}
                          </div>

                          {/* 3. OVERLAYS */}
                          <div className="relative z-20 p-8 h-full flex flex-col">
                            <span className="text-[10px] font-display font-black text-white/40 uppercase tracking-[0.3em]">
                              {player.category || "---"}
                            </span>

                            <div className="absolute top-6 right-8 flex flex-col items-center">
                              <span className="font-display font-black text-7xl leading-none italic tracking-tighter text-white drop-shadow-2xl">
                                {player.number}
                              </span>
                              {team?.logo && (
                                <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 border-2 border-white/20 shadow-xl overflow-hidden flex items-center justify-center">
                                  <img src={team.logo} className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>

                            <div className="mt-auto flex flex-col items-center">
                              <div className="flex flex-col items-center text-center">
                                <span className="text-white font-display font-black text-sm uppercase tracking-[0.4em] mb-[-4px] opacity-80">
                                  {firstName}
                                </span>
                                <h3 className="relative font-display font-black italic text-4xl text-white uppercase leading-none tracking-tighter">
                                   <span className="absolute -top-[1px] -left-[1px] text-primary/30 blur-[1px]">{lastName}</span>
                                   <span className="relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{lastName}</span>
                                </h3>
                              </div>

                              <div className="w-12 h-1.5 rounded-full bg-primary mt-6 mb-8 shadow-[0_0_15px_rgba(204,255,0,0.6)]" />

                              <div className="w-full flex items-center justify-center gap-6 bg-black/40 backdrop-blur-lg p-3 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2">
                                  <Goal className="w-4 h-4 text-primary" />
                                  <span className="text-[10px] font-display font-black text-gray-400 uppercase tracking-widest">Gols Oficiais</span>
                                </div>
                                <span className="text-xl font-display font-black text-white leading-none">{goals}</span>
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

          <div className="space-y-10">
             <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 shadow-xl">
               <h2 className="text-xl font-display font-black text-white border-b border-white/5 pb-4 mb-6 uppercase tracking-widest">Agenda</h2>
               {upcomingGames.length > 0 ? (
                 <div className="space-y-4">
                   {upcomingGames.slice(0, 3).map((match: any) => (
                      <div key={match.id} className="text-xs group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-primary font-bold uppercase">{match.date}</span>
                          <span className="text-gray-500 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> {match.time || "--:--"}</span>
                        </div>
                        <p className="text-white font-display font-bold group-hover:text-primary transition-colors truncate">vs {match.home_team_name?.includes(team.name) ? match.away_team_name : match.home_team_name}</p>
                      </div>
                   ))}
                 </div>
               ) : <p className="text-gray-500 text-xs italic">Sem jogos oficiais.</p>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
