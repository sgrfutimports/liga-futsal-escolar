import { useState, useMemo } from "react";
import { Users, Trophy, Goal, Calendar, Clock, User, MapPin, ChevronRight, BarChart3, Info, Award } from "lucide-react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import PlayerCard from "@/src/components/PlayerCard";

export default function TeamDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("elenco");
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allGames } = useSupaData('lfe_games', []);

  const team = allTeams.find((t: any) => String(t.id) === String(id)) || {};
  const players = allAthletes.filter((a: any) => String(a.teamId || a.team_id) === String(id));

  const getAthleteStats = (athleteId: string, playerTeamId: string) => {
    let goals = 0;
    let assists = 0;
    let totalGamesCount = 0;

    allGames.forEach((game: any) => {
      if (String(game.status || '').toLowerCase() === 'finalizado') {
        const isHome = String(game.home_team_id || game.homeTeamId) === String(playerTeamId);
        const isAway = String(game.away_team_id || game.awayTeamId) === String(playerTeamId);
        
        if (isHome || isAway) {
          totalGamesCount++;
          const events = Array.isArray(game.events) ? game.events : [];
          events.forEach((event: any) => {
            if (String(event.athleteId || event.atleta_id) === String(athleteId)) {
              if (event.type === 'goal') goals++;
              if (event.type === 'assist') assists++;
            }
          });
        }
      }
    });
    return { goals, assists, games: totalGamesCount };
  };

  const teamGames = allGames.filter((g: any) => {
    const homeId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
    const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
    const currentId = String(id || '').toLowerCase().trim();
    return homeId === currentId || awayId === currentId;
  });

  const upcomingGames = teamGames.filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado');
  const pastGames = teamGames.filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado');

  const stats = {
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    totalGames: pastGames.length
  };

  pastGames.forEach((g: any) => {
    const isHome = String(g.home_team_id || g.homeTeamId).toLowerCase() === String(id).toLowerCase();
    const homeScore = Number(g.home_score ?? g.homeScore ?? 0);
    const awayScore = Number(g.away_score ?? g.awayScore ?? 0);
    
    const myScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    
    stats.goalsFor += myScore;
    stats.goalsAgainst += oppScore;
    
    if (myScore > oppScore) stats.wins++;
    else if (myScore === oppScore) stats.draws++;
    else stats.losses++;
  });

  const topScorers = players
    .map(p => ({ ...p, goals: getAthleteStats(p.id, p.team_id || p.teamId).goals }))
    .filter(p => p.goals > 0)
    .sort((a: any, b: any) => b.goals - a.goals)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary selection:text-dark">
      {/* 1. Header Premium Section */}
      <header className="relative pt-32 pb-24 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.2),transparent_70%)]" />
          {team.logo && <img src={team.logo} className="w-full h-full object-cover blur-3xl scale-150 rotate-12" alt="" />}
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 md:w-52 md:h-52 bg-white rounded-[2.5rem] p-4 md:p-8 shadow-3xl mb-12 border border-white/10 group transition-all"
          >
             <img 
               src={team.logo || "/logos/logo.jpg"} 
               alt={team.name} 
               className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
             />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-9xl font-display font-black uppercase tracking-tighter leading-none mb-4">
              <span className="text-primary italic block text-xl md:text-2xl tracking-[0.4em] mb-4 opacity-50">Equipe Oficial</span>
              {team.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-500 font-display font-bold uppercase tracking-widest text-xs">
               <MapPin className="w-4 h-4 text-primary" />
               {team.city || "Representante Oficial"}
               <span className="mx-2 text-white/10">|</span>
               <Calendar className="w-4 h-4 text-primary" />
               Temporada 2026
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. Content & Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
        <div className="flex flex-col md:flex-row gap-20">
          
          {/* Left Sidebar: Stats & Info */}
          <aside className="w-full md:w-80 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl space-y-8">
              <h3 className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.4em]">Performance</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-3xl font-display font-black text-white leading-none mb-2">{stats.wins}</p>
                    <p className="text-[9px] font-display font-black text-gray-700 uppercase tracking-widest">Vitórias</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-3xl font-display font-black text-white leading-none mb-2">{stats.losses}</p>
                    <p className="text-[9px] font-display font-black text-gray-700 uppercase tracking-widest">Derrotas</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-dark/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest">Gols Pró</span>
                    <span className="text-xl font-display font-black text-primary italic">{stats.goalsFor}</span>
                 </div>
                 <div className="flex justify-between items-center bg-dark/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest">Jogos totais</span>
                    <span className="text-xl font-display font-black text-white">{stats.totalGames}</span>
                 </div>
              </div>
            </div>

            {topScorers.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
                <h3 className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.4em] mb-8">Destaques</h3>
                <div className="space-y-6">
                   {topScorers.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-4 group">
                         <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary transition-colors">
                            {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-800" />}
                         </div>
                         <div>
                            <p className="font-display font-black text-xs uppercase text-white truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] font-display font-bold text-primary italic uppercase">{p.goals} GOLS</p>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Content Area */}
          <div className="flex-grow space-y-12">
             <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit mx-auto md:mx-0">
               {["elenco", "jogos", "sobre"].map((t) => (
                 <button 
                   key={t}
                   onClick={() => setActiveTab(t)}
                   className={cn(
                     "px-8 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                     activeTab === t ? "bg-primary text-dark shadow-xl" : "text-gray-500 hover:text-white"
                   )}
                 >
                   {t}
                 </button>
               ))}
             </div>

             <div className="relative">
               <AnimatePresence mode="wait">
                 {activeTab === "elenco" && (
                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                   >
                     {players.map((p) => (
                       <PlayerCard key={p.id} athlete={p} showStats={true} />
                     ))}
                   </motion.div>
                 )}

                 {activeTab === "jogos" && (
                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     {teamGames.length > 0 ? (
                       teamGames.map((game: any) => (
                         <Link 
                           to={`/jogos/${game.id}`} 
                           key={game.id}
                           className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
                         >
                           <div className="flex items-center gap-4 mb-4 md:mb-0">
                             <div className="w-12 h-12 bg-white rounded-xl p-1.5"><img src={allTeams.find(t => String(t.id) === String(game.home_team_id || game.homeTeamId))?.logo} className="w-full h-full object-contain" /></div>
                             <span className="font-display font-black text-xl italic uppercase text-gray-700">VS</span>
                             <div className="w-12 h-12 bg-white rounded-xl p-1.5"><img src={allTeams.find(t => String(t.id) === String(game.away_team_id || game.awayTeamId))?.logo} className="w-full h-full object-contain" /></div>
                           </div>
                           <div className="text-center md:text-right space-y-1">
                              <p className="font-display font-black text-lg text-white uppercase italic">{game.date}</p>
                              <p className="text-[10px] font-display font-bold text-gray-600 uppercase tracking-widest">{game.location}</p>
                           </div>
                         </Link>
                       ))
                     ) : (
                       <div className="py-20 text-center text-gray-500 uppercase font-display font-bold tracking-widest">Nenhum jogo encontrado</div>
                     )}
                   </motion.div>
                 )}

                 {activeTab === "sobre" && (
                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-white/5 p-12 rounded-[3rem] border border-white/10"
                   >
                     <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-8 leading-none">Sobre a <span className="text-primary italic">Equipe</span></h2>
                     <p className="text-gray-400 text-lg leading-relaxed mb-8 uppercase font-bold tracking-tight opacity-80">
                        {team.description || "Uma das grandes representantes do futsal estudantil, focada no desenvolvimento técnico e humano de seus atletas. Participante ativa da Liga de Futsal Escolar 2026."}
                     </p>
                     <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                           <Award className="w-6 h-6 text-primary" />
                           <span className="font-display font-black text-xs uppercase tracking-widest">Inscrita • 2026</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                           <Shield className="w-6 h-6 text-primary" />
                           <span className="font-display font-black text-xs uppercase tracking-widest">Categoria: {team.categories || "Base"}</span>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
