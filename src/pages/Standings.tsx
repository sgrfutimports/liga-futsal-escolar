import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Shield, Goal, Star, Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSupaData } from "@/src/lib/store";

const TeamLogoSmall = ({ teamId, teamName, logo, className }: { teamId: any, teamName: string, logo?: string, className?: string }) => {
  const safeName = String(teamName || "").trim();
  const initials = safeName.length >= 2 
    ? safeName.substring(0, 2).toUpperCase() 
    : safeName.length === 1 
      ? safeName.toUpperCase() 
      : "??";

  return (
    <div className={cn("bg-dark-card rounded-full border border-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg", className)}>
      {logo ? (
        <img src={logo} alt={safeName} className="w-full h-full object-contain p-1 bg-white" referrerPolicy="no-referrer" />
      ) : (
        <span className="text-[10px] text-gray-500 font-display">
          {initials}
        </span>
      )}
    </div>
  );
};

export default function Standings() {
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};
  
  const categories = settings.categories 
    ? settings.categories.split(',').map((c: string) => c.trim())
    : ["SUB-11", "SUB-13", "SUB-15", "SUB-17"];

  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("CLASSIFICACAO");

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const { data: teams } = useSupaData('lfe_teams', [], true);
  const { data: games } = useSupaData('lfe_games', [], true);
  const { data: athletes } = useSupaData('lfe_athletes', []);

  const categoryGames = games.filter((g: any) => (g.category || "") === activeCategory);
  const categoryTeams = teams.filter((t: any) => String(t.categories || "").includes(activeCategory));

  const standings = categoryTeams.map((t: any) => {
    let pts = 0, j = 0, v = 0, e = 0, d = 0, gp = 0, gc = 0;
    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado') {
        const homeScore = Number(g.homeScore ?? g.home_score ?? 0);
        const awayScore = Number(g.awayScore ?? g.away_score ?? 0);
        const homeId = String(g.homeTeamId || g.home_team_id || '').toLowerCase().trim();
        const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
        const currentId = String(t.id || '').toLowerCase().trim();

        if (homeId === currentId) {
          j++; gp += homeScore; gc += awayScore;
          if (homeScore > awayScore) v++;
          else if (homeScore === awayScore) e++;
          else d++;
        } else if (awayId === currentId) {
          j++; gp += awayScore; gc += homeScore;
          if (awayScore > homeScore) v++;
          else if (awayScore === homeScore) e++;
          else d++;
        }
      }
    });
    pts = (v * 3) + (e * 1);
    const sg = gp - gc;
    return { ...t, pts, j, v, e, d, gp, gc, sg };
  }).sort((a: any, b: any) => b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp)
    .map((t: any, idx: number) => ({ ...t, pos: idx + 1 }));

  const playerStats = athletes.map((a: any) => {
    let goals = 0, yellows = 0, reds = 0;
    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado' && g.events) {
        g.events.forEach((ev: any) => {
          if (String(ev.playerId || ev.player_id) === String(a.id)) {
            if (ev.type === 'goal') goals++;
            if (ev.type === 'yellow') yellows++;
            if (ev.type === 'red') reds++;
          }
        });
      }
    });
    return { ...a, computedGoals: goals, yellows, reds };
  });

  const topScorers = playerStats
    .filter((p: any) => p.computedGoals > 0 && p.category === activeCategory)
    .sort((a: any, b: any) => b.computedGoals - a.computedGoals)
    .slice(0, 10);

  const teamStats = categoryTeams.map((t: any) => {
    let teamYellows = 0, teamReds = 0;
    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado' && g.events) {
        g.events.forEach((ev: any) => {
          if (String(ev.teamId || ev.team_id) === String(t.id)) {
            if (ev.type === 'yellow') teamYellows++;
            if (ev.type === 'red') teamReds++;
          }
        });
      }
    });
    return { ...t, teamYellows, teamReds };
  }).sort((a: any, b: any) => a.teamReds - b.teamReds || a.teamYellows - b.teamYellows);

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-dark">
      {/* Dynamic Header with glass effect */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(118,169,17,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] tracking-[0.2em] font-display mb-6">
             <Trophy className="w-3 h-3" /> ESTATÍSTICAS OFICIAIS
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 leading-none uppercase">
            TABELA E <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">ESTATÍSTICAS</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl font-sans leading-relaxed">
            Acompanhe o desempenho das equipes, artilharia, resultados e cartões de forma totalmente automatizada e em tempo real.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Modern Pill Category Switcher */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12">
          <div className="bg-dark-card/50 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-display text-sm transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-primary text-dark font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}>
                {cat}
              </button>
            ))}
          </div>
          
          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
            {[
              { id: "CLASSIFICACAO", label: "CLASSIFICAÇÃO" },
              { id: "JOGOS", label: "JOGOS" },
              { id: "ARTILHARIA", label: "ARTILHARIA" },
              { id: "ESTATISTICAS", label: "ESTATÍSTICAS" }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={cn(
                  "font-display text-sm tracking-widest relative pb-2 transition-all duration-300 whitespace-nowrap", 
                  activeTab === tab.id ? "text-primary" : "text-gray-500 hover:text-gray-300"
                )}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - No more heavy inner borders */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "CLASSIFICACAO" && (
                <div className="bg-dark-card/30 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-white/[0.02] text-gray-500 font-display text-[10px] tracking-[0.2em] uppercase">
                          <th className="p-6 font-normal w-24 text-center">POS</th>
                          <th className="p-6 font-normal">EQUIPE</th>
                          <th className="p-6 font-semibold text-center text-primary-dark">PTS</th>
                          <th className="p-6 font-normal text-center">J</th>
                          <th className="p-6 font-normal text-center">V</th>
                          <th className="p-6 font-normal text-center">E</th>
                          <th className="p-6 font-normal text-center">D</th>
                          <th className="p-6 font-normal text-center">GP</th>
                          <th className="p-6 font-normal text-center">GC</th>
                          <th className="p-6 font-normal text-center">SG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {standings.map((team: any) => (
                          <tr key={team.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                            <td className="p-6">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold mx-auto transition-all duration-500", 
                                team.pos <= 4 
                                  ? "bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover:bg-primary group-hover:text-dark group-hover:scale-110" 
                                  : "bg-white/5 text-gray-500 border border-white/5 group-hover:text-white"
                              )}>
                                {String(team.pos).padStart(2, '0')}
                              </div>
                            </td>
                            <td className="p-6">
                              <Link to={`/equipes/${team.id}`} className="flex items-center gap-4 group/team">
                                <TeamLogoSmall teamId={team.id} teamName={team.name} logo={team.logo} className="w-10 h-10 group-hover/team:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                  <span className="font-display text-lg text-white group-hover/team:text-primary transition-colors">{team.name}</span>
                                  <span className="text-[10px] text-gray-500 font-sans tracking-wider">{team.city || "REPRESENTANTE"}</span>
                                </div>
                              </Link>
                            </td>
                            <td className="p-6 text-center font-display text-2xl text-primary font-black drop-shadow-sm">{team.pts}</td>
                            <td className="p-6 text-center font-display text-gray-300">{team.j}</td>
                            <td className="p-6 text-center font-display text-gray-300">{team.v}</td>
                            <td className="p-6 text-center font-display text-gray-300">{team.e}</td>
                            <td className="p-6 text-center font-display text-gray-300">{team.d}</td>
                            <td className="p-6 text-center font-display text-gray-400 text-sm">{team.gp}</td>
                            <td className="p-6 text-center font-display text-gray-400 text-sm">{team.gc}</td>
                            <td className="p-6 text-center font-display text-gray-200 font-semibold">{team.sg > 0 ? `+${team.sg}` : team.sg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {standings.length === 0 && (
                    <div className="py-24 text-center">
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <Shield className="w-10 h-10 text-gray-600" />
                       </div>
                       <p className="font-display text-gray-500 tracking-widest uppercase">Nenhuma equipe nesta categoria</p>
                    </div>
                  )}
                  
                  <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-[10px] font-display text-gray-500 tracking-widest uppercase">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-primary rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.4)]" />
                        <span>ZONA DE CLASSIFICAÇÃO</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-600">ATUALIZADO EM TEMPO REAL</span>
                  </div>
                </div>
              )}

              {activeTab === "JOGOS" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {categoryGames.length > 0 ? categoryGames.map((game: any) => {
                    const home = teams.find((t: any) => String(t.id) === String(game.homeTeamId || game.home_team_id));
                    const away = teams.find((t: any) => String(t.id) === String(game.awayTeamId || game.away_team_id));
                    const isFinished = String(game.status || '').toLowerCase() === 'finalizado';
                    
                    return (
                      <div key={game.id} className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group shadow-lg">
                        <div className="flex justify-between items-center mb-8">
                           <div className="flex flex-col gap-1">
                              <span className="text-primary font-display text-[10px] tracking-[0.2em] uppercase">{game.category}</span>
                              <span className="text-gray-500 font-sans text-xs flex items-center gap-2">
                                 <Calendar className="w-3 h-3" /> {game.date} • {game.time}
                              </span>
                           </div>
                           <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-display tracking-widest uppercase border transition-all duration-500",
                            isFinished ? "bg-white/5 text-gray-500 border-white/10" : "bg-primary/20 text-primary border-primary/30 animate-pulse"
                           )}>
                             {game.status}
                           </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <Link to={`/equipes/${home?.id}`} className="flex flex-col items-center gap-3 flex-1 group/home">
                            <TeamLogoSmall teamId={home?.id} teamName={home?.name || "-"} logo={home?.logo} className="w-16 h-16 group-hover/home:scale-110 group-hover:shadow-primary/10 transition-all duration-500" />
                            <span className="font-display text-sm text-center font-bold tracking-tight text-white group-hover/home:text-primary transition-colors line-clamp-1">{home?.name || "-"}</span>
                          </Link>

                          <div className="flex flex-col items-center px-4">
                            {isFinished ? (
                              <div className="flex items-center gap-4">
                                <span className="text-4xl md:text-5xl font-display font-black text-white">{game.homeScore ?? game.home_score ?? 0}</span>
                                <span className="text-gray-700 text-xs font-display">X</span>
                                <span className="text-4xl md:text-5xl font-display font-black text-white">{game.awayScore ?? game.away_score ?? 0}</span>
                              </div>
                            ) : (
                              <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center justify-center font-display text-gray-500 text-lg border border-white/5">
                                VS
                              </div>
                            )}
                            <span className="text-[10px] text-gray-600 mt-4 font-sans uppercase tracking-[0.2em]">{game.location || "SESC"}</span>
                          </div>

                          <Link to={`/equipes/${away?.id}`} className="flex flex-col items-center gap-3 flex-1 group/away">
                            <TeamLogoSmall teamId={away?.id} teamName={away?.name || "-"} logo={away?.logo} className="w-16 h-16 group-hover/away:scale-110 group-hover:shadow-primary/10 transition-all duration-500" />
                            <span className="font-display text-sm text-center font-bold tracking-tight text-white group-hover/away:text-primary transition-colors line-clamp-1">{away?.name || "-"}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-span-2 py-32 text-center bg-dark-card/20 rounded-3xl border border-dashed border-white/5">
                       <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                       <h3 className="font-display text-gray-500 tracking-widest uppercase">Nenhum jogo nesta categoria</h3>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ARTILHARIA" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topScorers.map((player: any, idx: number) => {
                    const teamId = player.team_id || player.teamId;
                    const team = teams.find((t: any) => String(t.id) === String(teamId));
                    return (
                      <div key={player.id} className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden group shadow-xl">
                        <div className="absolute top-0 right-0 p-8 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                           <Goal className="w-32 h-32 opacity-[0.02] text-white" />
                        </div>
                        
                        <div className="flex items-center gap-1.5 mb-6">
                           <div className="w-6 h-1 bg-primary rounded-full" />
                           <span className="font-display text-[10px] tracking-widest text-gray-500 uppercase">POSIÇÃO {idx + 1}</span>
                        </div>

                        <div className="flex items-center gap-5 relative z-10">
                          <div className="relative">
                            {player.photo ? (
                              <img src={player.photo} alt={player.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg" />
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-700"><Goal className="w-8 h-8" /></div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark rounded-lg flex items-center justify-center border border-white/10 shadow-lg">
                               <TeamLogoSmall teamId={team?.id} teamName={team?.name || ""} logo={team?.logo} className="w-6 h-6 border-none p-0.5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-xl text-white tracking-tight uppercase line-clamp-1">{player.name}</h4>
                            <p className="text-xs text-primary font-display tracking-widest uppercase opacity-70 mb-2">{team?.name || "Sem equipe"}</p>
                            <div className="flex items-center gap-1">
                               {[...Array(Math.min(5, player.computedGoals))].map((_, i) => (
                                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_4px_rgba(204,255,0,0.5)]" />
                               ))}
                               {player.computedGoals > 5 && <span className="text-[10px] text-gray-600 font-display ml-1">+{player.computedGoals - 5}</span>}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="block font-display text-4xl text-primary font-black leading-none group-hover:scale-110 transition-transform duration-500">{player.computedGoals || 0}</span>
                            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-display">Gols</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {topScorers.length === 0 && (
                     <div className="col-span-3 py-32 text-center bg-dark-card/20 rounded-3xl border border-dashed border-white/5">
                        <Star className="w-20 h-20 text-gray-700 mx-auto mb-4 opacity-10" />
                        <p className="font-display text-gray-500 tracking-widest uppercase">Nenhum gol registrado</p>
                     </div>
                  )}
                </div>
              )}

              {activeTab === "ESTATISTICAS" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex flex-col gap-1">
                          <span className="text-yellow-500 font-display text-[10px] tracking-[0.2em] uppercase">Comportamento</span>
                          <h3 className="font-display text-3xl text-white tracking-tight flex items-center gap-2 uppercase">
                            Disciplina das <span className="text-primary">Equipes</span>
                          </h3>
                       </div>
                       <AlertTriangle className="w-10 h-10 text-yellow-500/20" />
                    </div>

                    <div className="space-y-3">
                      {teamStats.map((t: any, idx: number) => (
                        <div key={t.id} className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-display text-lg w-6 font-black">{String(idx + 1).padStart(2, '0')}</span>
                            <TeamLogoSmall teamId={t.id} teamName={t.name} logo={t.logo} className="w-10 h-10 group-hover:scale-110 transition-transform" />
                            <span className="font-display text-white text-lg tracking-tight">{t.name}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2">
                                 <div className="w-2.5 h-3.5 bg-yellow-500 rounded-sm shadow-[0_0_8px_rgba(234,179,8,0.3)] shadow-yellow-500/40" />
                                 <span className="font-display text-xl text-white font-bold">{t.teamYellows}</span>
                              </div>
                              <span className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">Amarelos</span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/5" />
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2">
                                 <div className="w-2.5 h-3.5 bg-red-600 rounded-sm shadow-[0_0_8px_rgba(220,38,38,0.3)] shadow-red-600/40" />
                                 <span className="font-display text-xl text-white font-bold">{t.teamReds}</span>
                              </div>
                              <span className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">Vermelhos</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000"><Trophy className="w-48 h-48" /></div>
                      <h3 className="font-display text-xl text-white mb-10 flex items-center gap-2 uppercase tracking-tight">
                        <Star className="w-5 h-5 text-primary" /> Panorama Geral <span className="text-gray-500 ml-2">[{activeCategory}]</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-6 relative z-10">
                        {[
                          { 
                            label: "Jogos Realizados", 
                            val: categoryGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado').length,
                            color: "text-primary",
                            icon: Calendar
                          },
                          { 
                            label: "Gols Marcados", 
                            val: categoryGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado').reduce((acc: number, g: any) => acc + (Number(g.homeScore ?? g.home_score ?? 0) + Number(g.awayScore ?? g.away_score ?? 0)), 0),
                            color: "text-primary",
                            icon: Goal
                          },
                          { 
                            label: "Amarelos GLOBAIS", 
                            val: teamStats.reduce((acc: number, t: any) => acc + t.teamYellows, 0),
                            color: "text-yellow-500",
                            icon: AlertTriangle
                          },
                          { 
                            label: "Vermelhos GLOBAIS", 
                            val: teamStats.reduce((acc: number, t: any) => acc + t.teamReds, 0),
                            color: "text-red-500",
                            icon: Shield
                          }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/[0.03] border border-white/5 hover:border-white/10 p-6 rounded-3xl transition-all duration-300">
                            <div className={cn("text-3xl md:text-5xl font-display font-black mb-1", stat.color)}>{stat.val}</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-display font-medium line-clamp-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
