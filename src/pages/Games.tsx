import { useState } from "react";
import { Calendar, MapPin, Clock, ChevronRight, Filter, Search, Trophy } from "lucide-react";
import { Link } from "react-router";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Games() {
  const { data: allGames } = useSupaData('lfe_games', [], true);
  const { data: teams } = useSupaData('lfe_teams', []);
  
  const [activeStatus, setActiveStatus] = useState("TODOS");
  const [activeRound, setActiveRound] = useState("TODOS");
  const [searchDate, setSearchDate] = useState("");

  const filteredGames = allGames.filter((game: any) => {
    const matchesStatus = activeStatus === "TODOS" || 
      (activeStatus === "FINALIZADO" && String(game.status).toLowerCase() === "finalizado") ||
      (activeStatus === "PROGRAMADO" && String(game.status).toLowerCase() !== "finalizado");
    
    const matchesRound = activeRound === "TODOS" || String(game.round) === activeRound;
    const matchesDate = !searchDate || String(game.date).includes(searchDate);
    
    return matchesStatus && matchesRound && matchesDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rounds = Array.from(new Set(allGames.map((g: any) => String(g.round)))).sort();

  return (
    <div className="min-h-screen bg-[#020617] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter">
              CENTRAL DE <span className="text-primary italic">JOGOS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-sans">
              Acompanhe resultados, próximos confrontos e a agenda completa da Liga.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {["TODOS", "PROGRAMADO", "FINALIZADO"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={cn(
                  "px-6 py-2 rounded-xl font-display text-xs uppercase tracking-widest transition-all",
                  activeStatus === status 
                    ? "bg-primary text-black shadow-lg" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <select 
              value={activeRound}
              onChange={(e) => setActiveRound(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-display text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="TODOS" className="bg-[#020617]">TODAS AS RODADAS</option>
              {rounds.map(r => (
                <option key={r} value={r} className="bg-[#020617]">{r}ª RODADA</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input 
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-display text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl flex items-center px-6 py-4">
            <Trophy className="w-5 h-5 text-primary mr-3" />
            <span className="text-[10px] font-display font-bold text-primary uppercase tracking-[0.2em]">
              Temporada 2026 • LFE Agreste
            </span>
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game: any) => {
              const hTeam = teams.find((t: any) => String(t.id) === String(game.homeTeamId));
              const aTeam = teams.find((t: any) => String(t.id) === String(game.awayTeamId));
              const isFinal = String(game.status).toLowerCase() === "finalizado";

              return (
                <Link 
                  to={`/jogos/${game.id}`}
                  key={game.id}
                  className="group block bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-6 md:p-10 transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.03] overflow-hidden relative"
                >
                  {/* Glass Background effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Time Casa */}
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-1/3">
                      <div className="w-20 h-20 bg-white rounded-3xl p-4 shadow-2xl border border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <img src={hTeam?.logo} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter line-clamp-1">{hTeam?.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{hTeam?.city || "Sede"}</p>
                      </div>
                    </div>

                    {/* Placar / Status */}
                    <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                      <div className="flex items-center gap-6 md:gap-10">
                        <span className={cn(
                          "text-6xl md:text-8xl font-display font-black tracking-tighter shadow-primary/20 drop-shadow-xl",
                          isFinal ? "text-white" : "text-gray-800"
                        )}>
                          {isFinal ? (game.homeScore ?? 0) : "--"}
                        </span>
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-display font-black text-primary italic mb-2 uppercase tracking-widest opacity-50">vs</span>
                          <div className={cn(
                            "px-5 py-2 rounded-xl text-[10px] font-display font-black uppercase tracking-[0.2em] border shadow-lg",
                            isFinal ? "bg-white/5 border-white/10 text-gray-400" : "bg-primary text-black border-primary animate-pulse"
                          )}>
                            {isFinal ? "Encerrado" : "Em Breve"}
                          </div>
                        </div>
                        <span className={cn(
                          "text-6xl md:text-8xl font-display font-black tracking-tighter shadow-primary/20 drop-shadow-xl",
                          isFinal ? "text-white" : "text-gray-800"
                        )}>
                          {isFinal ? (game.awayScore ?? 0) : "--"}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-4 text-gray-500 text-xs font-display font-medium uppercase tracking-widest">
                          <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {game.date}</div>
                          <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {game.time || "--:--"}</div>
                        </div>
                        <div className="flex items-center gap-2 text-primary text-[10px] font-display font-bold uppercase tracking-[0.2em] mt-2">
                           <MapPin className="w-3 h-3" /> {game.location}
                        </div>
                      </div>
                    </div>

                    {/* Time Fora */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-6 w-full md:w-1/3">
                      <div className="w-20 h-20 bg-white rounded-3xl p-4 shadow-2xl border border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <img src={aTeam?.logo} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="text-center md:text-right">
                        <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tighter line-clamp-1">{aTeam?.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{aTeam?.city || "Sede"}</p>
                      </div>
                    </div>

                  </div>
                  
                  {/* Rodada Badge */}
                  <div className="absolute left-6 top-6 bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                    <span className="text-[9px] font-display font-black text-primary uppercase tracking-widest">{game.round}ª RODADA</span>
                  </div>
                  
                  {/* Link Hint */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    <ChevronRight className="w-8 h-8 text-primary" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <Calendar className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
               <p className="text-gray-500 font-display text-xl uppercase tracking-widest">Nenhum jogo encontrado para estes filtros</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
