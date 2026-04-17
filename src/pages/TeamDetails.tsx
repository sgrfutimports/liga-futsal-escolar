import { useState, useEffect } from "react";
import { Users, Trophy, Goal, Calendar, Clock, User } from "lucide-react";
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
    return homeId === String(id).toLowerCase().trim() || awayId === String(id).toLowerCase().trim();
  }).filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Light Header */}
      <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          {team.logo && <img src={team.logo} className="w-full h-full object-cover opacity-5 blur-2xl scale-125" alt="" />}
          <div className="absolute inset-0 bg-white/60" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl p-4 shadow-2xl mb-4 border border-slate-100">
            {team.logo ? <img src={team.logo} className="w-full h-full object-contain" /> : <Trophy className="w-full h-full text-slate-200" />}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 uppercase tracking-tighter text-center">
            {team.name}
          </h1>
          <span className="text-primary font-display text-[11px] tracking-[0.5em] mt-2 uppercase font-bold">{team.city || "Sede Oficial LFE"}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-3 space-y-24">
            <h2 className="text-3xl font-display font-black text-slate-900 flex items-center gap-4">
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
                    <h3 className="px-5 py-1.5 bg-slate-900 text-white rounded-full font-display font-bold uppercase tracking-widest text-[11px]">
                      {category} <span className="text-white/40 ml-2">{catPlayers.length} ATLETAS</span>
                    </h3>
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);

                      return (
                        <div 
                          key={player.id} 
                          className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] aspect-[10/14] shadow-sm"
                        >
                          {/* 1. IMAGEM TOTAL */}
                          <div className="absolute inset-0 z-0">
                            {player.photo ? (
                              <img src={player.photo} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                <User className="w-32 h-32 text-slate-100" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent" />
                          </div>

                          {/* 2. GOLS MEIO ESQUERDA */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                             <div className="bg-slate-900/90 backdrop-blur-md px-3 py-4 rounded-r-2xl border-y border-r border-white/20 shadow-xl flex flex-col items-center gap-1 group-hover:bg-primary transition-colors group-hover:border-primary">
                                <Goal className="w-4 h-4 text-primary group-hover:text-black" />
                                <span className="text-[9px] font-display font-black text-white/40 uppercase tracking-widest group-hover:text-black/40">Gols</span>
                                <span className="text-xl font-display font-black text-white group-hover:text-black leading-none">{goals}</span>
                             </div>
                          </div>

                          {/* 3. CABEÇALHO */}
                          <div className="relative z-10 p-6 flex justify-between items-start">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg text-[9px] font-display font-black text-slate-900 uppercase tracking-widest shadow-sm">
                              {player.category || "LFE"}
                            </span>

                            <div className="flex flex-col items-center">
                              <span className="font-display font-black text-7xl italic leading-none tracking-tighter text-slate-900 drop-shadow-sm">
                                {player.number}
                              </span>
                              {team?.logo && (
                                <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 shadow-lg border border-slate-100 overflow-hidden flex items-center justify-center transform rotate-2">
                                  <img src={team.logo} className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. NOME NA BASE */}
                          <div className="relative z-10 mt-auto p-8 flex flex-col items-center bg-gradient-to-t from-white via-white/80 to-transparent">
                            <h3 className="font-display font-black text-3xl text-slate-900 text-center uppercase leading-none tracking-tighter group-hover:text-primary transition-colors">
                              {player.name}
                            </h3>
                            <div className="w-10 h-1 bg-slate-900 rounded-full mt-4 group-hover:bg-primary transition-colors" />
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
             <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm sticky top-24">
               <h2 className="text-xl font-display font-black text-slate-900 border-b border-slate-100 pb-4 mb-8 uppercase tracking-widest">Agenda</h2>
               {upcomingGames.length > 0 ? upcomingGames.slice(0, 3).map((match: any) => (
                  <div key={match.id} className="text-xs group mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-primary font-black uppercase tracking-widest">{match.date}</span>
                      <span className="text-slate-400 uppercase flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> {match.time || "--:--"}</span>
                    </div>
                    <p className="text-slate-900 font-display font-bold group-hover:text-primary transition-colors">vs {match.home_team_name?.includes(team.name) ? match.away_team_name : match.home_team_name}</p>
                  </div>
               )) : <p className="text-slate-400 italic text-sm font-bold uppercase">Sem jogos agendados.</p>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
