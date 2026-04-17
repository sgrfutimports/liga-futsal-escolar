import { useState, useEffect } from "react";
import { Users, Calendar, Trophy, Goal, MapPin, Clock, User } from "lucide-react";
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

  const upcomingGames = allGames.filter((g: any) => {
    const homeId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
    const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
    const currentId = String(id || '').toLowerCase().trim();
    return homeId === currentId || awayId === currentId;
  }).filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado');

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
          <span className="text-primary font-display text-[11px] tracking-[0.5em] mt-2 uppercase opacity-60 font-black">{team.city || "LFE Oficial"}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-3 space-y-24">
            <h2 className="text-4xl font-display font-black text-white flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" /> ELENCO <span className="text-primary">OFICIAL</span>
            </h2>

            <div className="space-y-32">
              {Object.entries(
                players.reduce((acc: any, player: any) => {
                  const cat = player.category || "Sem Categoria";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(player);
                  return acc;
                }, {})
              ).sort().map(([category, catPlayers]: [string, any]) => (
                <div key={category} className="space-y-12">
                  <div className="flex items-center gap-6">
                    <h3 className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-display font-black uppercase tracking-widest text-[12px]">
                      {category} <span className="text-white/30 ml-2 font-bold">{catPlayers.length} ATLETAS</span>
                    </h3>
                    <div className="h-[1px] flex-1 bg-white/10"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);
                      
                      const nameParts = (player.name || "Atleta").trim().split(" ");
                      const firstName = nameParts[0];
                      const lastName = nameParts.slice(1).join(" ") || firstName;

                      return (
                        <div 
                          key={player.id} 
                          className="group relative flex flex-col bg-[#011429] rounded-[2.5rem] border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_60px_90px_-20px_rgba(0,0,0,1)] aspect-[10/14]"
                        >
                          {/* GRID BG */}
                          <div className="absolute inset-0 z-0 opacity-[0.25]" style={{ 
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                            backgroundSize: '30px 30px'
                          }}></div>
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#011429] via-[#011429]/60 to-transparent z-10" />

                          {/* PHOTO */}
                          <div className="absolute inset-0 z-0 flex items-end justify-center">
                            {player.photo ? (
                              <img src={player.photo} className="w-[98%] h-[98%] object-contain object-bottom transition-all duration-1000 group-hover:scale-105" />
                            ) : (
                              <User className="w-56 h-56 text-white/5" />
                            )}
                          </div>

                          {/* INFO */}
                          <div className="relative z-20 h-full flex flex-col p-8">
                            <div className="flex justify-between items-start">
                              <span className="text-[12px] font-display font-black text-white/30 uppercase tracking-[0.4em] pt-2">
                                {player.category || "---"}
                              </span>

                              <div className="flex flex-col items-center">
                                <span className="font-display font-black text-7xl leading-none italic tracking-tighter text-white drop-shadow-2xl">
                                  {player.number}
                                </span>
                                {team?.logo && (
                                  <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 border-2 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                                    <img src={team.logo} className="w-full h-full object-contain" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* NAME BLOCK - FIXED AT BASE */}
                            <div className="mt-auto flex flex-col items-center pb-2">
                              <div className="flex flex-col items-center text-center -mb-2">
                                <span className="text-white font-display font-black text-sm uppercase tracking-[0.5em] mb-[-6px] opacity-70">
                                  {firstName}
                                </span>
                                <h3 className="relative font-display font-black italic text-5xl text-white uppercase leading-none tracking-tighter">
                                   <span className="absolute -top-[1.5px] -left-[1.5px] text-primary/40 blur-[1px]">{lastName}</span>
                                   <span className="relative z-10 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]">{lastName}</span>
                                </h3>
                              </div>

                              <div className="w-12 h-1.5 rounded-full bg-primary mt-6 mb-10 shadow-[0_0_20px_rgba(204,255,0,0.8)]" />

                              <div className="w-full flex items-center justify-center gap-8 bg-black/50 backdrop-blur-2xl p-4 rounded-3xl border border-white/5">
                                <div className="flex items-center gap-3">
                                  <Goal className="w-5 h-5 text-primary" />
                                  <span className="text-[10px] font-display font-black text-gray-400 uppercase tracking-widest leading-none">Gols</span>
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

          <div className="space-y-10">
             <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl sticky top-24">
               <h2 className="text-xl font-display font-black text-white border-b border-white/5 pb-4 mb-8 uppercase tracking-widest">Informação</h2>
               <div className="space-y-8">
                 <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/20">
                   <span className="text-[10px] text-primary uppercase font-display font-black">Cidade Sede</span>
                   <p className="text-2xl font-display font-black text-white mt-1">{team.city || "LFE"}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
