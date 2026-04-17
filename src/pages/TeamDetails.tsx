import { useState, useEffect } from "react";
import { Users, Trophy, Goal, Calendar, Clock, User, MapPin } from "lucide-react";
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
          <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter text-center px-4 drop-shadow-lg">
            {team.name}
          </h1>
          <span className="text-primary font-display text-[10px] tracking-[0.5em] mt-2 uppercase opacity-60 font-bold">{team.city || "Sede Oficial LFE"}</span>
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
                    <h3 className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-display font-black uppercase tracking-widest text-xs">
                      {category} <span className="text-white/40 ml-2 font-bold">{catPlayers.length} ATLETAS</span>
                    </h3>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);
                      const safePlayerName = String(player.name || "Uniformado").trim();

                      return (
                        <div 
                          key={player.id} 
                          className="group relative flex flex-col bg-white rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,1)] aspect-[10/14]"
                        >
                          {/* 1. IMAGEM TOTAL */}
                          <div className="absolute inset-0 z-0">
                            {player.photo ? (
                              <img src={player.photo} className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <User className="w-32 h-32 text-slate-300" />
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
                          <div className="relative z-10 p-8 flex justify-between items-start">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg text-[10px] font-display font-black text-slate-900 uppercase tracking-widest shadow-sm">
                              {String(player.category || "---").toUpperCase()}
                            </span>

                            <div className="flex flex-col items-center">
                              <span className="font-display font-black text-7xl italic leading-none tracking-tighter text-slate-900 drop-shadow-sm">
                                {player.number}
                              </span>
                              {team?.logo && (
                                <div className="w-12 h-12 bg-white rounded-full p-2 mt-2 shadow-lg border border-slate-100 overflow-hidden flex items-center justify-center transform rotate-2">
                                  <img src={team.logo} alt={safePlayerName} className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. NOME NA BASE */}
                          <div className="relative z-10 mt-auto p-10 flex flex-col items-center bg-gradient-to-t from-white via-white/80 to-transparent">
                            <h3 className="font-display font-black text-3xl text-slate-900 text-center uppercase leading-none tracking-tighter group-hover:text-primary transition-colors">
                              {safePlayerName}
                            </h3>
                            <div className="w-12 h-1.5 bg-slate-900 rounded-full mt-4 group-hover:bg-primary transition-colors" />
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
               <h2 className="text-2xl font-display font-black text-white border-b border-white/5 pb-6 mb-8 uppercase tracking-widest flex items-center gap-3">
                 <Calendar className="w-6 h-6 text-primary" /> Agenda
               </h2>
               
               <div className="space-y-12">
                 {/* PRÓXIMOS JOGOS */}
                 <div>
                   <h4 className="text-[10px] font-display font-black text-primary uppercase tracking-[0.3em] mb-6">Próximos Jogos</h4>
                   {upcomingGames.length > 0 ? (
                     <div className="space-y-8">
                       {upcomingGames.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3).map((match: any) => {
                         const opponentName = String(match.home_team_name).toLowerCase().includes(String(team.name).toLowerCase()) 
                           ? match.away_team_name 
                           : match.home_team_name;
                         
                         return (
                           <div key={match.id} className="group border-l-2 border-primary/20 pl-4 hover:border-primary transition-colors">
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-primary font-display font-black text-sm uppercase tracking-wider">{match.date}</span>
                               <span className="text-gray-500 text-[10px] uppercase flex items-center gap-1 font-bold">
                                 <Clock className="w-3 h-3" /> {match.time || "--:--"}
                               </span>
                             </div>
                             <p className="text-white font-display font-bold text-lg group-hover:text-primary transition-colors">
                               <span className="text-gray-600 text-xs mr-2 italic">vs</span> {opponentName || "Adversário"}
                             </p>
                             <p className="text-[9px] text-gray-600 uppercase mt-1 tracking-widest">{match.location || "Local a definir"}</p>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <p className="text-gray-600 italic text-xs font-bold uppercase tracking-widest">Sem jogos agendados</p>
                   )}
                 </div>

                 {/* ÚLTIMOS RESULTADOS */}
                 <div className="pt-8 border-t border-white/5">
                   <h4 className="text-[10px] font-display font-black text-gray-400 uppercase tracking-[0.3em] mb-6 opacity-50">Últimos Resultados</h4>
                   {allGames
                     .filter((g: any) => {
                       const hId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
                       const aId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
                       const tid = String(id || '').toLowerCase().trim();
                       return (hId === tid || aId === tid) && String(g.status || '').toLowerCase() === 'finalizado';
                     })
                     .sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                     .slice(0, 2)
                     .map((match: any) => {
                        const isHome = String(match.home_team_id || match.homeTeamId).toLowerCase() === String(id).toLowerCase();
                        const myScore = isHome ? (match.home_score ?? 0) : (match.away_score ?? 0);
                        const oppScore = isHome ? (match.away_score ?? 0) : (match.home_score ?? 0);
                        const resultColor = myScore > oppScore ? "text-green-500" : myScore < oppScore ? "text-red-500" : "text-yellow-500";
                        const opponentName = isHome ? match.away_team_name : match.home_team_name;

                        return (
                          <div key={match.id} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider">{match.date}</span>
                              <span className={cn("font-display font-black text-sm", resultColor)}>
                                {myScore} - {oppScore}
                              </span>
                            </div>
                            <p className="text-gray-300 font-display font-bold text-sm truncate">
                               <span className="text-gray-600 text-[10px] mr-1 italic">vs</span> {opponentName}
                            </p>
                          </div>
                        );
                     })}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
