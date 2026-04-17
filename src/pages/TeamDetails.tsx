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

  // Cálculo de Gols em Tempo Real via Súmulas
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

  const pastGames = allTeamGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado');
  const upcomingGames = allTeamGames.filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado').sort((a: any, b: any) => new Date(a.date || a.game_date).getTime() - new Date(b.date || b.game_date).getTime());

  const catStats = pastGames.reduce((acc: any, game: any) => {
    const cat = game.category || "Geral";
    if (!acc[cat]) acc[cat] = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, category: cat };
    
    const isHome = String(game.home_team_id || game.homeTeamId) === String(id);
    const homeScore = Number(game.home_score ?? 0);
    const awayScore = Number(game.away_score ?? 0);
    
    if (isHome) {
      acc[cat].goalsFor += homeScore;
      acc[cat].goalsAgainst += awayScore;
      if (homeScore > awayScore) { acc[cat].wins++; acc[cat].points += 3; }
      else if (homeScore === awayScore) { acc[cat].draws++; acc[cat].points += 1; }
      else acc[cat].losses++;
    } else {
      acc[cat].goalsFor += awayScore;
      acc[cat].goalsAgainst += homeScore;
      if (awayScore > homeScore) { acc[cat].wins++; acc[cat].points += 3; }
      else if (awayScore === homeScore) { acc[cat].draws++; acc[cat].points += 1; }
      else acc[cat].losses++;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark">
      {/* Header Section */}
      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden border-b border-dark-border">
        <div className="absolute inset-0 z-0">
          <img src={team.logo} className="w-full h-full object-cover opacity-10 blur-xl scale-110" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl p-4 md:p-6 shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-500 border-4 border-white/10">
            {team.logo ? <img src={team.logo} className="w-full h-full object-contain" /> : <Trophy className="w-full h-full text-gray-400" />}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl">
            {team.name}
          </h1>
          <p className="text-primary font-display font-bold tracking-[0.3em] mt-2 uppercase opacity-80">{team.city || "Sede não informada"}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Roster */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between border-b-2 border-primary/20 pb-4">
              <h2 className="text-3xl font-display font-black text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" /> ELENCO OFICIAL
              </h2>
            </div>

            <div className="space-y-12">
              {Object.entries(
                players.reduce((acc: any, player: any) => {
                  const cat = player.category || "Sem Categoria";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(player);
                  return acc;
                }, {})
              ).sort().map(([category, catPlayers]: [string, any]) => (
                <div key={category} className="space-y-6">
                  <h3 className="text-lg font-display text-primary uppercase tracking-[4px] border-l-4 border-primary pl-4 bg-primary/5 py-2">
                    {category} <span className="text-white/40 ml-2">[{catPlayers.length}]</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {catPlayers.map((player: any) => {
                      const goals = getAthleteGoals(player.id);
                      const nameParts = (player.name || "Uniformado").split(' ');
                      const firstName = nameParts[0];
                      const lastName = nameParts.slice(1).join(' ') || firstName;

                      return (
                        <div 
                          key={player.id} 
                          className="relative bg-[#020617] border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500 group cursor-pointer flex flex-col shadow-2xl hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(204,255,0,0.25)] aspect-[10/14]"
                          style={{ borderColor: team?.color ? `${team.color}40` : 'rgba(255,255,255,0.05)' }}
                        >
                          <div className="absolute inset-x-0 top-0 h-[80%] z-10 overflow-hidden">
                            {player.photo ? (
                              <img src={player.photo} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-dark-card/50"><User className="w-32 h-32 text-gray-900 opacity-30" /></div>
                            )}
                          </div>
                          
                          <div className="absolute top-6 right-8 z-30 flex flex-col items-end">
                            <span className="font-display font-black text-6xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] italic leading-none">{player.number}</span>
                            <span className="bg-primary px-3 py-1 rounded-md text-dark font-display font-black text-[10px] uppercase tracking-widest mt-1 transform skew-x-[-10deg]">{player.position || "JOG"}</span>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/95 to-transparent z-20 flex flex-col justify-end p-8 pt-0">
                            <div className="flex flex-col items-center text-center">
                              <span className="text-primary font-display font-black italic text-lg uppercase tracking-[0.25em] opacity-90 mb-[-8px]">{firstName}</span>
                              <h3 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase leading-none tracking-tighter drop-shadow-2xl">{lastName}</h3>
                            </div>
                            <div className="w-full h-1 mt-6 mb-4 rounded-full" style={{ backgroundColor: team?.color || 'var(--color-primary)', boxShadow: `0 0 15px ${team?.color || 'rgba(204,255,0,0.6)'}` }} />
                            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                              <Goal className="w-4 h-4 text-primary" />
                              <span className="font-display text-[10px] text-white uppercase font-bold tracking-widest leading-none">Total Gols <span className="text-primary text-sm ml-1">{goals}</span></span>
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

          {/* Right Column: Sidebar Match Stats */}
          <div className="space-y-12">
            <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-8">
               <h2 className="text-2xl font-display font-black text-white flex items-center gap-3 border-b border-dark-border pb-4">
                 <Trophy className="w-6 h-6 text-primary" /> DESEMPENHO
               </h2>
               {Object.values(catStats).length > 0 ? Object.values(catStats).map((stat: any) => (
                 <div key={stat.category} className="space-y-4">
                    <span className="text-[10px] font-display text-primary tracking-[4px] uppercase">{stat.category}</span>
                    <div className="grid grid-cols-3 gap-3">
                       <div className="bg-dark/50 border border-dark-border p-3 rounded-2xl text-center">
                          <span className="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">PTS</span>
                          <span className="text-2xl font-display font-black text-white">{stat.points}</span>
                       </div>
                       <div className="bg-dark/50 border border-dark-border p-3 rounded-2xl text-center">
                          <span className="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">VITS</span>
                          <span className="text-2xl font-display font-black text-white">{stat.wins}</span>
                       </div>
                       <div className="bg-dark/50 border border-dark-border p-3 rounded-2xl text-center">
                          <span className="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">GOLS</span>
                          <span className="text-2xl font-display font-black text-white">{stat.goalsFor}</span>
                       </div>
                    </div>
                 </div>
               )) : <p className="text-gray-500 font-sans italic">Sem estatísticas para esta temporada.</p>}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-display font-black text-white flex items-center gap-3 border-b border-dark-border pb-4">
                <Calendar className="w-6 h-6 text-primary" /> PRÓXIMOS JOGOS
              </h2>
              {upcomingGames.length > 0 ? upcomingGames.slice(0, 3).map((match: any) => (
                <div key={match.id} className="bg-dark-card border border-primary/20 rounded-2xl p-6 hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-display text-primary-dark font-black tracking-widest bg-primary px-2 py-1 rounded uppercase">{match.date}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 font-display flex items-center gap-1 uppercase"><Clock className="w-3 h-3" /> {match.time || "À Confirmar"}</span>
                    </div>
                  </div>
                  <p className="text-white font-display font-bold text-sm line-clamp-1 mb-2">vs {String(match.home_team_id || match.homeTeamId) === String(id) ? (match.away_team_name || "Oponente") : (match.home_team_name || "Oponente")}</p>
                  <p className="text-[10px] text-gray-400 font-sans uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.location || "Campo Oficial"}</p>
                </div>
              )) : <p className="text-gray-500 italic p-4 border border-dashed border-dark-border rounded-xl">Sem confrontos agendados.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
