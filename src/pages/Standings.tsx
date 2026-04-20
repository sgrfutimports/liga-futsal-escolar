import { useState, useEffect } from "react";
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
        <span className="text-[10px] text-gray-400 font-display font-bold">
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
      <header className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#76A911]/5 via-transparent to-transparent opacity-30" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#76A911]/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 font-display text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Trophy className="w-4 h-4 text-primary" /> Estatísticas Oficiais
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Elite em <span className="text-primary italic">Alta Performance</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60 mb-16"
          >
            Acompanhe o desempenho das equipes e atletas em tempo real.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl inline-flex mx-auto"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  activeCategory === cat 
                    ? "bg-primary text-dark shadow-[0_10px_30px_rgba(204,255,0,0.3)]" 
                    : "text-gray-500 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          
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
                  "font-display text-base tracking-[0.1em] relative pb-2 transition-all duration-300 whitespace-nowrap font-black", 
                  activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-white"
                )}>
                {tab.label}
              </button>
            ))}
          </div>

        {/* Content Area */}
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
                        <tr className="bg-white/[0.02] text-gray-300 font-display text-xs tracking-[0.15em] uppercase font-black">
                          <th className="p-6 w-24 text-center">POS</th>
                          <th className="p-6">EQUIPE</th>
                          <th className="p-6 text-center text-primary font-black">PTS</th>
                          <th className="p-6 text-center">J</th>
                          <th className="p-6 text-center">V</th>
                          <th className="p-6 text-center">E</th>
                          <th className="p-6 text-center">D</th>
                          <th className="p-6 text-center">GP</th>
                          <th className="p-6 text-center">GC</th>
                          <th className="p-6 text-center">SG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {standings.map((team: any) => (
                          <tr key={team.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                            <td className="p-6">
                              <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center text-base font-display font-black mx-auto transition-all duration-500", 
                                team.pos <= 4 
                                  ? "bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover:bg-primary group-hover:text-dark group-hover:scale-110" 
                                  : "bg-white/5 text-gray-500 border border-white/5 group-hover:text-white"
                              )}>
                                {String(team.pos).padStart(2, '0')}
                              </div>
                            </td>
                            <td className="p-6">
                              <Link to={`/equipes/${team.id}`} className="flex items-center gap-5 group/team">
                                <TeamLogoSmall teamId={team.id} teamName={team.name} logo={team.logo} className="w-12 h-12 group-hover/team:scale-110 transition-transform shadow-xl border-white/10" />
                                <div className="flex flex-col">
                                  <span className="font-display text-xl text-white font-black group-hover/team:text-primary transition-colors tracking-tight leading-tight uppercase">{team.name}</span>
                                  <span className="text-[11px] text-gray-400 font-sans tracking-[0.1em] uppercase font-bold">{team.city || "REPRESENTANTE"}</span>
                                </div>
                              </Link>
                            </td>
                            <td className="p-6 text-center font-display text-3xl text-primary font-black drop-shadow-[0_0_15px_rgba(204,255,0,0.25)]">{team.pts}</td>
                            <td className="p-6 text-center font-display text-xl text-gray-200 font-bold">{team.j}</td>
                            <td className="p-6 text-center font-display text-xl text-green-500/90 font-black">{team.v}</td>
                            <td className="p-6 text-center font-display text-xl text-yellow-500/90 font-black">{team.e}</td>
                            <td className="p-6 text-center font-display text-xl text-red-500/90 font-black">{team.d}</td>
                            <td className="p-6 text-center font-display text-gray-300 font-medium">{team.gp}</td>
                            <td className="p-6 text-center font-display text-gray-300 font-medium">{team.gc}</td>
                            <td className="p-6 text-center font-display text-2xl text-white font-black">{team.sg > 0 ? `+${team.sg}` : team.sg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {standings.length === 0 && (
                    <div className="py-24 text-center">
                       <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-20" />
                       <p className="font-display text-gray-500 tracking-widest uppercase font-black">Nenhuma equipe nesta categoria</p>
                    </div>
                  )}
                  
                  <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs font-display text-gray-400 tracking-widest uppercase font-black">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-sm shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                        <span>ZONA DE CLASSIFICAÇÃO</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold tracking-tighter">ATUALIZADO EM TEMPO REAL</span>
                  </div>
                </div>
              )}

              {activeTab === "JOGOS" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {categoryGames.length > 0 ? categoryGames.map((game: any) => {
                    const home = teams.find((t: any) => String(t.id) === String(game.homeTeamId || game.home_team_id));
                    const away = teams.find((t: any) => String(t.id) === String(game.awayTeamId || game.away_team_id));
                    const isFinished = String(game.status || '').toLowerCase() === 'finalizado';
                    
                    return (
                      <div key={game.id} className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-300 group shadow-lg">
                        <div className="flex justify-between items-center mb-8">
                           <div className="flex flex-col gap-1">
                              <span className="text-primary font-display text-xs tracking-[0.2em] uppercase font-black">{game.category}</span>
                              <span className="text-gray-300 font-sans text-sm flex items-center gap-2 font-semibold">
                                 <Calendar className="w-4 h-4" /> {game.date} • {game.time}
                              </span>
                           </div>
                           <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-display tracking-[0.2em] uppercase border font-black transition-all duration-500",
                            isFinished ? "bg-white/5 text-gray-500 border-white/10" : "bg-primary/20 text-primary border-primary/40 animate-pulse shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                           )}>
                             {game.status}
                           </div>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                          <Link to={`/equipes/${home?.id}`} className="flex flex-col items-center gap-4 flex-1 group/home">
                            <TeamLogoSmall teamId={home?.id} teamName={home?.name || "-"} logo={home?.logo} className="w-20 h-20 group-hover/home:scale-110 group-hover:shadow-primary/20 transition-all duration-500 border-white/10" />
                            <span className="font-display text-lg text-center font-black tracking-tight text-white group-hover/home:text-primary transition-colors line-clamp-2 uppercase leading-tight h-10">{home?.name || "-"}</span>
                          </Link>

                          <div className="flex flex-col items-center px-4">
                            {isFinished ? (
                              <div className="flex items-center gap-5">
                                <span className="text-5xl md:text-7xl font-display font-black text-white drop-shadow-lg">{game.homeScore ?? game.home_score ?? 0}</span>
                                <span className="text-gray-700 text-sm font-display font-black">X</span>
                                <span className="text-5xl md:text-7xl font-display font-black text-white drop-shadow-lg">{game.awayScore ?? game.away_score ?? 0}</span>
                              </div>
                            ) : (
                              <div className="bg-white/5 px-6 py-3 rounded-2xl flex items-center justify-center font-display text-gray-500 text-2xl border border-white/10 font-black">
                                VS
                              </div>
                            )}
                            <span className="text-xs text-gray-400 mt-6 font-sans uppercase tracking-[0.25em] font-black">{game.location || "SESC"}</span>
                          </div>

                          <Link to={`/equipes/${away?.id}`} className="flex flex-col items-center gap-4 flex-1 group/away">
                            <TeamLogoSmall teamId={away?.id} teamName={away?.name || "-"} logo={away?.logo} className="w-20 h-20 group-hover/away:scale-110 group-hover:shadow-primary/20 transition-all duration-500 border-white/10" />
                            <span className="font-display text-lg text-center font-black tracking-tight text-white group-hover/away:text-primary transition-colors line-clamp-2 uppercase leading-tight h-10">{away?.name || "-"}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-span-2 py-32 text-center bg-dark-card/20 rounded-3xl border border-dashed border-white/10">
                       <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-20" />
                       <h3 className="font-display text-gray-500 tracking-widest uppercase font-black">Nenhum jogo nesta categoria</h3>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ARTILHARIA" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topScorers.map((player: any, idx: number) => {
                    const teamId = player.team_id || player.teamId;
                    const team = teams.find((t: any) => String(t.id) === String(teamId));
                    return (
                      <div key={player.id} className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-500 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                           <Goal className="w-32 h-32 opacity-[0.03] text-white" />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-8 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.4)]" />
                           <span className="font-display text-xs tracking-[0.2em] text-gray-400 uppercase font-black">POSIÇÃO {idx + 1}</span>
                        </div>

                        <div className="flex items-center gap-6 relative z-10">
                          <div className="relative">
                            {player.photo ? (
                              <img src={player.photo} alt={player.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-gray-700"><Goal className="w-10 h-10" /></div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-dark rounded-xl flex items-center justify-center border-2 border-white/10 shadow-2xl">
                               <TeamLogoSmall teamId={team?.id} teamName={team?.name || ""} logo={team?.logo} className="w-7 h-7 border-none p-0.5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-2xl text-white tracking-tight uppercase line-clamp-1 font-black leading-tight mb-1">{player.name}</h4>
                            <p className="text-sm text-primary font-display tracking-widest uppercase font-black opacity-90 mb-3">{team?.name || "Sem equipe"}</p>
                            <div className="flex items-center gap-1.5">
                               {[...Array(Math.min(5, player.computedGoals))].map((_, i) => (
                                 <div key={i} className="w-2 h-2 rounded-full bg-primary/50 shadow-[0_0_6px_rgba(204,255,0,0.6)]" />
                               ))}
                               {player.computedGoals > 5 && <span className="text-xs text-gray-500 font-display font-black ml-1">+{player.computedGoals - 5}</span>}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="block font-display text-6xl text-primary font-black leading-none group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">{player.computedGoals || 0}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-display font-black mt-1">Gols</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "ESTATISTICAS" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                       <div className="flex flex-col gap-1">
                          <span className="text-yellow-500 font-display text-xs tracking-[0.25em] uppercase font-black">Comportamento</span>
                          <h3 className="font-display text-4xl text-white tracking-tighter flex items-center gap-3 uppercase font-black">
                            Disciplina das <span className="text-primary">Equipes</span>
                          </h3>
                       </div>
                       <AlertTriangle className="w-12 h-12 text-yellow-500/20" />
                    </div>

                    <div className="space-y-4">
                      {teamStats.map((t: any, idx: number) => (
                        <div key={t.id} className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 shadow-lg">
                          <div className="flex items-center gap-5">
                            <span className="text-gray-500 font-display text-2xl w-8 font-black">{String(idx + 1).padStart(2, '0')}</span>
                            <TeamLogoSmall teamId={t.id} teamName={t.name} logo={t.logo} className="w-14 h-14 group-hover:scale-110 transition-transform shadow-2xl border-white/15" />
                            <span className="font-display text-white text-2xl tracking-tighter font-black uppercase line-clamp-1 max-w-[180px] lg:max-w-none">{t.name}</span>
                          </div>
                          <div className="flex items-center gap-10">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-3.5 h-4.5 bg-yellow-500 rounded-sm shadow-[0_0_12px_rgba(234,179,8,0.5)] shadow-yellow-500/50" />
                                 <span className="font-display text-3xl text-white font-black">{t.teamYellows}</span>
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-black">Amarelos</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-3.5 h-4.5 bg-red-600 rounded-sm shadow-[0_0_12px_rgba(220,38,38,0.5)] shadow-red-600/50" />
                                 <span className="font-display text-3xl text-white font-black">{t.teamReds}</span>
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-black">Vermelhos</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="bg-dark-card/40 backdrop-blur-md rounded-3xl p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:scale-125 transition-transform duration-1000"><Trophy className="w-64 h-64" /></div>
                      <h3 className="font-display text-2xl text-white mb-12 flex items-center gap-3 uppercase tracking-tighter font-black">
                        <Star className="w-7 h-7 text-primary animate-pulse" /> Panorama Geral <span className="text-gray-500 ml-3 text-lg">[{activeCategory}]</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-8 relative z-10">
                        {[
                          { 
                            label: "Jogos Realizados", 
                            val: categoryGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado').length,
                            color: "text-primary",
                          },
                          { 
                            label: "Gols Marcados", 
                            val: categoryGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado').reduce((acc: number, g: any) => acc + (Number(g.homeScore ?? g.home_score ?? 0) + Number(g.awayScore ?? g.away_score ?? 0)), 0),
                            color: "text-primary",
                          },
                          { 
                            label: "Amarelos GLOBAIS", 
                            val: teamStats.reduce((acc: number, t: any) => acc + t.teamYellows, 0),
                            color: "text-yellow-500",
                          },
                          { 
                            label: "Vermelhos GLOBAIS", 
                            val: teamStats.reduce((acc: number, t: any) => acc + t.teamReds, 0),
                            color: "text-red-500",
                          }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/[0.03] border border-white/5 hover:border-primary/20 p-8 rounded-[2rem] transition-all duration-300 group/stat shadow-xl">
                            <div className={cn("text-5xl md:text-7xl font-display font-black mb-2 drop-shadow-2xl group-hover/stat:scale-110 transition-transform duration-500", stat.color)}>{stat.val}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest font-display font-black line-clamp-2 leading-tight">{stat.label}</div>
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
