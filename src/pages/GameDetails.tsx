import { useState } from "react";
import { useParams, Link } from "react-router";
import { 
  Users, Trophy, Goal, Calendar, Clock, MapPin, 
  ChevronLeft, BarChart3, List, Activity, 
  ShieldAlert, ShieldCheck, User, Info, Timer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function GameDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("eventos");
  
  const { data: allGames } = useSupaData('lfe_games', []);
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: athletes } = useSupaData('lfe_athletes', []);

  const game = allGames.find((g: any) => String(g.id) === String(id));
  
  if (!game) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-6 animate-bounce" />
          <p className="text-gray-500 font-display font-black uppercase tracking-widest text-[10px]">Carregando partida de elite...</p>
        </div>
      </div>
    );
  }

  const hTeam = teams.find((t: any) => String(t.id) === String(game.home_team_id || game.homeTeamId));
  const aTeam = teams.find((t: any) => String(t.id) === String(game.away_team_id || game.awayTeamId));
  const isFinal = String(game.status).toLowerCase() === "finalizado";

  const events = Array.isArray(game.events) ? game.events : [];
  
  const getStats = (teamId: string) => {
    return {
      goals: events.filter(e => e.type === 'goal' && String(e.teamId || e.team_id) === String(teamId)).length,
      yellowCards: events.filter(e => (e.type === 'yellow_card' || e.type === 'yellow') && String(e.teamId || e.team_id) === String(teamId)).length,
      redCards: events.filter(e => (e.type === 'red_card' || e.type === 'red') && String(e.teamId || e.team_id) === String(teamId)).length,
    };
  };

  const hStats = getStats(hTeam?.id);
  const aStats = getStats(aTeam?.id);

  const hLineup = athletes.filter(a => String(a.team_id || a.teamId) === String(hTeam?.id));
  const aLineup = athletes.filter(a => String(a.team_id || a.teamId) === String(aTeam?.id));

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Scoreboard Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <Link to="/jogos" className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all group mb-12">
                <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-display font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">Central de Jogos</span>
             </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Home Team */}
            <motion.div 
               initial={{ opacity: 0, x: -40 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex flex-col items-center gap-8 w-full lg:w-1/3"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white rounded-[3.5rem] p-8 shadow-3xl border border-white/10 flex items-center justify-center transform group-hover:scale-105 transition-all duration-500">
                  <img src={hTeam?.logo} className="w-full h-full object-contain" alt={hTeam?.name} />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none mb-2">{hTeam?.name}</h2>
                <span className="text-[11px] text-gray-600 font-black uppercase tracking-[0.3em] opacity-40">{hTeam?.city}</span>
              </div>
            </motion.div>

            {/* Score */}
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center gap-10 w-full lg:w-1/3"
            >
               <div className="flex items-center gap-10 md:gap-16">
                  <span className={cn("text-8xl md:text-[10rem] font-display font-black tracking-tighter", isFinal ? "text-white" : "text-white/10")}>
                    {isFinal ? (game.homeScore ?? 0) : "--"}
                  </span>
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-20 bg-primary/20 rounded-full mb-6" />
                    <span className="text-4xl font-display font-black text-primary italic uppercase tracking-widest opacity-20">VS</span>
                    <div className="w-2 h-20 bg-primary/20 rounded-full mt-6" />
                  </div>
                  <span className={cn("text-8xl md:text-[10rem] font-display font-black tracking-tighter", isFinal ? "text-white" : "text-white/10")}>
                    {isFinal ? (game.awayScore ?? 0) : "--"}
                  </span>
               </div>
               
               <div className="text-center space-y-6">
                  <div className={cn(
                    "inline-flex px-10 py-3 rounded-2xl text-[10px] font-display font-black uppercase tracking-[0.3em] border",
                    isFinal ? "bg-white/5 border-white/10 text-gray-500" : "bg-primary text-dark border-primary shadow-2xl shadow-primary/20"
                  )}>
                    {isFinal ? "Partida Encerrada" : "Em Breve"}
                  </div>
                  <div className="space-y-3">
                    <p className="flex items-center justify-center gap-3 text-gray-400 font-display font-black text-xs uppercase tracking-widest opacity-60">
                      <Calendar className="w-4 h-4 text-primary" /> {game.date} • {game.time || "--:--"}
                    </p>
                    <p className="flex items-center justify-center gap-3 text-white font-display font-black text-xs uppercase tracking-[0.2em]">
                      <MapPin className="w-4 h-4 text-primary" /> {game.location}
                    </p>
                  </div>
               </div>
            </motion.div>

            {/* Away Team */}
            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex flex-col items-center gap-8 w-full lg:w-1/3"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white rounded-[3.5rem] p-8 shadow-3xl border border-white/10 flex items-center justify-center transform group-hover:scale-105 transition-all duration-500">
                  <img src={aTeam?.logo} className="w-full h-full object-contain" alt={aTeam?.name} />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none mb-2">{aTeam?.name}</h2>
                <span className="text-[11px] text-gray-600 font-black uppercase tracking-[0.3em] opacity-40">{aTeam?.city}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="sticky top-20 z-50 bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 py-2">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-center md:justify-start gap-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'eventos', label: 'Timeline', icon: Timer },
              { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
              { id: 'escalacoes', label: 'Plantéis', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 py-6 border-b-4 transition-all font-display text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap",
                  activeTab === tab.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-700 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-5xl px-4 py-24">
        
        <AnimatePresence mode="wait">
          {/* TAB: TIMELINE / EVENTOS */}
          {activeTab === 'eventos' && (
            <motion.div 
               key="eventos"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-12"
            >
              {events.length > 0 ? (
                <div className="relative max-w-2xl mx-auto space-y-10 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-white/5">
                  {events.map((event: any, idx: number) => {
                    const athlete = athletes.find(a => String(a.id) === String(event.athleteId || event.atleta_id));
                    const isHome = String(event.teamId || event.team_id) === String(hTeam?.id);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        key={idx} 
                        className={cn("flex items-center w-full", isHome ? "flex-row-reverse" : "flex-row")}
                      >
                        <div className={cn("w-[45%]", isHome ? "text-right" : "text-left")}>
                           <div className={cn(
                             "bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 inline-block max-w-[90%] hover:border-primary/30 transition-all shadow-2xl backdrop-blur-xl",
                             isHome ? "rounded-tr-none" : "rounded-tl-none"
                           )}>
                              <div className={cn("flex items-center gap-4", isHome ? "flex-row-reverse" : "flex-row")}>
                                 <div className="w-12 h-12 rounded-2xl bg-dark/50 border border-white/5 flex items-center justify-center shrink-0">
                                    {event.type === 'goal' && <Goal className="w-6 h-6 text-primary" />}
                                    {event.type === 'yellow' && <div className="w-4 h-6 bg-yellow-400 rounded-sm" />}
                                    {event.type === 'red' && <div className="w-4 h-6 bg-red-500 rounded-sm" />}
                                 </div>
                                 <div className={isHome ? "text-right" : "text-left"}>
                                    <p className="font-display font-black text-lg uppercase text-white leading-none mb-1">{athlete?.name || "Atleta Oficial"}</p>
                                    <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest">{event.type === 'goal' ? 'GOL MARCADO' : 'NOTIFICAÇÃO'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="w-[10%] flex justify-center relative z-10">
                           <div className="w-10 h-10 rounded-full bg-primary text-dark flex items-center justify-center font-display font-black text-xs shadow-[0_0_20px_rgba(204,255,0,0.3)] border-4 border-[#020617]">
                             {event.minute}'
                           </div>
                        </div>
                        <div className="w-[45%]" />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
                   <Timer className="w-20 h-20 text-gray-800 mx-auto mb-8 opacity-20" />
                   <h3 className="text-2xl font-display font-black text-gray-700 uppercase tracking-widest">Aguardando Lances</h3>
                   <p className="text-gray-800 mt-2 font-display uppercase text-[10px] tracking-widest font-black">Os eventos da partida aparecerão aqui em tempo real.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'estatisticas' && (
            <motion.div 
               key="estatisticas"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="max-w-3xl mx-auto space-y-16"
            >
               {[
                 { label: "Gols Convertidos", h: hStats.goals, a: aStats.goals },
                 { label: "Cartões Amarelos", h: hStats.yellowCards, a: aStats.yellowCards },
                 { label: "Expulsões", h: hStats.redCards, a: aStats.redCards }
               ].map((stat, i) => (
                 <div key={i} className="space-y-6">
                    <div className="flex justify-between items-end">
                       <span className="text-5xl font-display font-black text-white italic">{stat.h}</span>
                       <span className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.4em] pb-2">{stat.label}</span>
                       <span className="text-5xl font-display font-black text-white italic">{stat.a}</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(stat.h / (stat.h + stat.a || 1)) * 100}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         className="h-full bg-primary" 
                       />
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(stat.a / (stat.h + stat.a || 1)) * 100}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         className="h-full bg-white/10" 
                       />
                    </div>
                 </div>
               ))}
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                  <div className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-2xl group hover:border-primary/30 transition-all">
                     <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                     <span className="text-[9px] font-display font-black text-gray-700 uppercase block mb-3 tracking-[0.3em]">VALIDAÇÃO TÉCNICA</span>
                     <span className="text-2xl font-display font-black text-white uppercase italic">{game.status}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-2xl group hover:border-primary/30 transition-all">
                     <Info className="w-12 h-12 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                     <span className="text-[9px] font-display font-black text-gray-700 uppercase block mb-3 tracking-[0.3em]">MODALIDADE ATUAL</span>
                     <span className="text-2xl font-display font-black text-white uppercase italic">{game.category}</span>
                  </div>
               </div>
            </motion.div>
          )}

          {/* TAB: PLANTÉIS */}
          {activeTab === 'escalacoes' && (
            <motion.div 
               key="escalacoes"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            >
              {/* Home Roster */}
              <div className="space-y-10">
                 <div className="flex items-center gap-6 pb-6 border-b-2 border-primary/20">
                    <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl"><img src={hTeam?.logo} className="w-full h-full object-contain" /></div>
                    <div>
                      <h3 className="font-display font-black text-3xl uppercase italic text-primary leading-none">{hTeam?.name}</h3>
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2 block">ELENCO OFICIAL</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {hLineup.length > 0 ? hLineup.map((player, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={player.id} 
                        className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 rounded-[2rem] group hover:bg-white/10 transition-all shadow-xl"
                      >
                         <span className="w-10 text-center font-display font-black text-2xl text-gray-800 group-hover:text-primary transition-colors italic leading-none">
                           {player.number}
                         </span>
                         <div className="w-12 h-12 rounded-2xl bg-dark/50 border border-white/5 overflow-hidden shrink-0">
                           <img src={player.photo || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="font-display font-black text-lg text-white group-hover:text-primary transition-colors leading-none mb-1 uppercase italic tracking-tighter">{player.name}</p>
                            <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest">{player.position || "Atleta"}</p>
                         </div>
                      </motion.div>
                    )) : <div className="p-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-800 font-display font-black uppercase text-xs tracking-widest">Plantel não disponível</div>}
                 </div>
              </div>

              {/* Away Roster */}
              <div className="space-y-10">
                 <div className="flex items-center gap-6 pb-6 border-b-2 border-white/10 flex-row-reverse text-right">
                    <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl"><img src={aTeam?.logo} className="w-full h-full object-contain" /></div>
                    <div>
                      <h3 className="font-display font-black text-3xl uppercase italic text-white leading-none">{aTeam?.name}</h3>
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2 block">ELENCO OFICIAL</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {aLineup.length > 0 ? aLineup.map((player, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={player.id} 
                        className="flex items-center gap-6 p-5 bg-white/5 border border-white/5 rounded-[2rem] group hover:bg-white/10 transition-all shadow-xl flex-row-reverse text-right"
                      >
                         <span className="w-10 text-center font-display font-black text-2xl text-gray-800 group-hover:text-primary transition-colors italic leading-none">
                           {player.number}
                         </span>
                         <div className="w-12 h-12 rounded-2xl bg-dark/50 border border-white/5 overflow-hidden shrink-0">
                           <img src={player.photo || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="font-display font-black text-lg text-white group-hover:text-primary transition-colors leading-none mb-1 uppercase italic tracking-tighter">{player.name}</p>
                            <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest">{player.position || "Atleta"}</p>
                         </div>
                      </motion.div>
                    )) : <div className="p-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-800 font-display font-black uppercase text-xs tracking-widest">Plantel não disponível</div>}
                 </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
}
