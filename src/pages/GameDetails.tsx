import { useState } from "react";
import { useParams, Link } from "react-router";
import { 
  Users, Trophy, Goal, Calendar, Clock, MapPin, 
  ChevronLeft, BarChart3, List, Activity, 
  ShieldAlert, ShieldCheck, User
} from "lucide-react";
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
        <div className="text-center animate-pulse">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 font-display uppercase tracking-widest">Carregando partida...</p>
        </div>
      </div>
    );
  }

  const hTeam = teams.find((t: any) => String(t.id) === String(game.home_team_id || game.homeTeamId));
  const aTeam = teams.find((t: any) => String(t.id) === String(game.away_team_id || game.awayTeamId));
  const isFinal = String(game.status).toLowerCase() === "finalizado";

  const events = Array.isArray(game.events) ? game.events : [];
  
  // Stats calculation
  const getStats = (teamId: string) => {
    return {
      goals: events.filter(e => e.type === 'goal' && String(e.teamId || e.team_id) === String(teamId)).length,
      yellowCards: events.filter(e => (e.type === 'yellow_card' || e.type === 'yellow') && String(e.teamId || e.team_id) === String(teamId)).length,
      redCards: events.filter(e => (e.type === 'red_card' || e.type === 'red') && String(e.teamId || e.team_id) === String(teamId)).length,
    };
  };

  const hStats = getStats(hTeam?.id);
  const aStats = getStats(aTeam?.id);

  // Lineups
  const hLineup = athletes.filter(a => String(a.team_id || a.teamId) === String(hTeam?.id));
  const aLineup = athletes.filter(a => String(a.team_id || a.teamId) === String(aTeam?.id));

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* 1. Scoreboard Header */}
      <div className="relative pt-12 pb-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/jogos" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 font-display text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <ChevronLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex items-center justify-center transform hover:scale-105 transition-transform">
                <img src={hTeam?.logo} className="w-full h-full object-contain" alt="" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-center uppercase tracking-tighter leading-none">{hTeam?.name}</h2>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{hTeam?.city}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
               <div className="flex items-center gap-8 md:gap-12">
                  <span className={cn("text-7xl md:text-9xl font-display font-black tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]", isFinal ? "text-white" : "text-gray-900")}>
                    {isFinal ? (game.homeScore ?? 0) : "--"}
                  </span>
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-16 bg-primary/20 rounded-full mb-4 shadow-[0_0_15px_rgba(204,255,0,0.1)]" />
                    <span className="text-3xl font-display font-black text-primary italic uppercase tracking-widest opacity-40">VS</span>
                    <div className="w-1.5 h-16 bg-primary/20 rounded-full mt-4 shadow-[0_0_15px_rgba(204,255,0,0.1)]" />
                  </div>
                  <span className={cn("text-7xl md:text-9xl font-display font-black tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]", isFinal ? "text-white" : "text-gray-900")}>
                    {isFinal ? (game.awayScore ?? 0) : "--"}
                  </span>
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "px-6 py-2 rounded-full text-xs font-display font-bold uppercase tracking-widest border mb-6",
                    isFinal ? "bg-white/5 border-white/10 text-gray-400" : "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                  )}>
                    {isFinal ? "Jogo Encerrado" : "PROGRAMADO"}
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center justify-center gap-2 text-gray-500 font-display text-xs uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-primary" /> {game.date} • {game.time || "--:--"}
                    </p>
                    <p className="flex items-center justify-center gap-2 text-primary font-display text-xs font-bold uppercase tracking-[0.2em]">
                      <MapPin className="w-4 h-4" /> {game.location}
                    </p>
                  </div>
               </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex items-center justify-center transform hover:scale-105 transition-transform">
                <img src={aTeam?.logo} className="w-full h-full object-contain" alt="" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-center uppercase tracking-tighter leading-none">{aTeam?.name}</h2>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{aTeam?.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-around md:justify-start md:gap-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'eventos', label: 'Eventos', icon: Activity },
              { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
              { id: 'escalacoes', label: 'Escalações', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-6 border-b-2 transition-all font-display text-xs uppercase tracking-widest whitespace-nowrap",
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

      {/* 3. Tab Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* TAB: EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {events.length > 0 ? (
              <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-white/5">
                {events.map((event: any, idx: number) => {
                  const athlete = athletes.find(a => String(a.id) === String(event.athleteId || event.atleta_id));
                  const isHome = String(event.teamId || event.team_id) === String(hTeam?.id);

                  return (
                    <div key={idx} className={cn(
                      "flex items-center w-full",
                      isHome ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn("w-[45%]", isHome ? "text-right" : "text-left")}>
                         <div className={cn(
                           "bg-white/5 border border-white/5 rounded-2xl p-4 inline-block max-w-full hover:border-primary/30 transition-all",
                           isHome ? "rounded-tr-none" : "rounded-tl-none"
                         )}>
                            <div className="flex items-center gap-3">
                               {event.type === 'goal' && <Goal className="w-5 h-5 text-primary shrink-0" />}
                               {event.type === 'yellow' && <div className="w-4 h-6 bg-yellow-400 rounded-sm shrink-0" />}
                               {event.type === 'red' && <div className="w-4 h-6 bg-red-500 rounded-sm shrink-0" />}
                               <div className="text-left">
                                  <p className="font-display font-black text-sm uppercase text-white line-clamp-1">{athlete?.name || "Atleta"}</p>
                                  <p className="text-[10px] text-gray-500 uppercase font-black">{event.type === 'goal' ? 'GOL!' : 'CARTÃO'}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="w-[10%] flex justify-center relative z-10">
                         <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-display font-black text-xs shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                           {event.minute}'
                         </div>
                      </div>
                      <div className="w-[45%]" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem]">
                 <Activity className="w-16 h-16 text-gray-800 mx-auto mb-4 opacity-20" />
                 <p className="text-gray-500 font-display uppercase tracking-widest italic">Nenhum evento registrado</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: ESTATÍSTICAS */}
        {activeTab === 'estatisticas' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {[
               { label: "Gols", h: hStats.goals, a: aStats.goals },
               { label: "Cartões Amarelos", h: hStats.yellowCards, a: aStats.yellowCards },
               { label: "Cartões Vermelhos", h: hStats.redCards, a: aStats.redCards }
             ].map((stat, i) => (
               <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-2xl font-display font-black text-white">{stat.h}</span>
                     <span className="text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                     <span className="text-2xl font-display font-black text-white">{stat.a}</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                     <div 
                       className="h-full bg-primary transition-all duration-1000" 
                       style={{ width: `${(stat.h / (stat.h + stat.a || 1)) * 100}%` }} 
                     />
                     <div 
                       className="h-full bg-gray-700 transition-all duration-1000" 
                       style={{ width: `${(stat.a / (stat.h + stat.a || 1)) * 100}%` }} 
                     />
                  </div>
               </div>
             ))}
             
             {/* General Box */}
             <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center">
                   <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-4" />
                   <span className="text-[10px] font-display font-bold text-gray-500 uppercase block mb-1">Status Partida</span>
                   <span className="text-lg font-display font-black text-white uppercase">{game.status}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center">
                   <ShieldAlert className="w-8 h-8 text-primary mx-auto mb-4" />
                   <span className="text-[10px] font-display font-bold text-gray-500 uppercase block mb-1">Categoria</span>
                   <span className="text-lg font-display font-black text-white uppercase">{game.category}</span>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ESCALAÇÕES */}
        {activeTab === 'escalacoes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Home Roster */}
            <div className="space-y-8">
               <div className="flex items-center gap-4 pb-4 border-b border-primary/20">
                  <div className="w-10 h-10 bg-white rounded-lg p-2"><img src={hTeam?.logo} className="w-full h-full object-contain" /></div>
                  <h3 className="font-display font-black text-xl uppercase italic text-primary">{hTeam?.name}</h3>
               </div>
               <div className="space-y-3">
                  {hLineup.length > 0 ? hLineup.map(player => (
                    <div key={player.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                       <span className="w-8 text-center font-display font-black text-lg text-gray-700 group-hover:text-primary leading-none">
                         {player.number}
                       </span>
                       <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0">
                         {player.photo && <img src={player.photo} className="w-full h-full object-cover" />}
                       </div>
                       <div>
                          <p className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors leading-tight uppercase">{player.name}</p>
                          <p className="text-[9px] text-gray-600 uppercase font-black">{player.position || "Atleta"}</p>
                       </div>
                    </div>
                  )) : <p className="text-gray-600 italic text-sm">Escalação indisponível</p>}
               </div>
            </div>

            {/* Away Roster */}
            <div className="space-y-8">
               <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
                  <div className="w-10 h-10 bg-white rounded-lg p-2"><img src={aTeam?.logo} className="w-full h-full object-contain" /></div>
                  <h3 className="font-display font-black text-xl uppercase italic text-white">{aTeam?.name}</h3>
               </div>
               <div className="space-y-3">
                  {aLineup.length > 0 ? aLineup.map(player => (
                    <div key={player.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all flex-row-reverse">
                       <span className="w-8 text-center font-display font-black text-lg text-gray-700 group-hover:text-primary leading-none">
                         {player.number}
                       </span>
                       <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0">
                         {player.photo && <img src={player.photo} className="w-full h-full object-cover" />}
                       </div>
                       <div className="text-right">
                          <p className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors leading-tight uppercase">{player.name}</p>
                          <p className="text-[9px] text-gray-600 uppercase font-black">{player.position || "Atleta"}</p>
                       </div>
                    </div>
                  )) : <p className="text-gray-600 italic text-sm">Escalação indisponível</p>}
               </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
