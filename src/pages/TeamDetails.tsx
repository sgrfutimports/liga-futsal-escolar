import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Shield, MapPin, Calendar, Trophy, Users, ChevronLeft, ChevronRight, Activity, Loader2, Image as ImageIcon, Camera, Goal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useSupaData } from "@/src/lib/store";

const mockGallery = [
  { id: 1, url: "https://images.unsplash.com/photo-1574629810360-7efbb1925713?q=80&w=800&auto=format&fit=crop", title: "Aquecimento pré-jogo" },
  { id: 2, url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop", title: "Comemoração" },
  { id: 3, url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop", title: "Instruções do treinador" },
];

export default function TeamDetails() {
  const { id } = useParams();
  
  const { data: allTeams, loading: loadingTeams } = useSupaData('lfe_teams', []);
  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allGames } = useSupaData('lfe_games', []);
  
  if (loadingTeams) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-primary gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-display">Carregando dados da equipe...</p>
      </div>
    );
  }

  const team = allTeams.find((t: any) => t.id === Number(id));
  const players = allAthletes.filter((a: any) => Number(a.teamId) === Number(id) || Number(a.team_id) === Number(id));
  
  // Calculate specific team stats based on games
  const allTeamGames = allGames.filter((g: any) => (Number(g.home_team_id || g.homeTeamId) === Number(id) || Number(g.away_team_id || g.awayTeamId) === Number(id)));
  const pastGames = allTeamGames.filter((g: any) => g.status === 'Finalizado');
  const upcomingGames = allTeamGames.filter((g: any) => g.status === 'Agendado');
  
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
  
  pastGames.forEach((g: any) => {
    const homeScore = Number(g.home_score || g.homeScore || 0);
    const awayScore = Number(g.away_score || g.awayScore || 0);
    if (Number(g.home_team_id || g.homeTeamId) === Number(id)) {
      goalsFor += homeScore; goalsAgainst += awayScore;
      if (homeScore > awayScore) wins++;
      else if (homeScore === awayScore) draws++;
      else losses++;
    } else {
      goalsFor += awayScore; goalsAgainst += homeScore;
      if (awayScore > homeScore) wins++;
      else if (awayScore === homeScore) draws++;
      else losses++;
    }
  });

  const points = (wins * 3) + draws;

  if (!team) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white font-display text-2xl">
        Equipe não encontrada.
      </div>
    );
  }

  const categoryArray = team.categories ? team.categories.split(',').map((c: string) => c.trim()) : [];

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/equipes" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-display text-sm mb-8">
          <ChevronLeft className="w-4 h-4" /> VOLTAR PARA EQUIPES
        </Link>

        {/* Hero Section */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
             {team.logo ? <img src={team.logo} className="w-96 h-96 opacity-10 blur-xl" /> : <Shield className="w-96 h-96" />}
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-dark rounded-full border-4 border-dark-border flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
              {team.logo ? (
                <img src={team.logo} alt="Logo da Equipe" className="w-full h-full object-contain p-2 bg-white" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-display text-5xl md:text-7xl text-gray-600">
                  {team.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <span className="text-[10px] text-gray-400 font-display uppercase tracking-[0.3em]">Categorias Participantes</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {categoryArray.map((cat: string) => (
                    <div key={cat} className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-dark font-display text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                      {cat}
                    </div>
                  ))}
                  {categoryArray.length === 0 && <span className="text-gray-500 italic">Nenhuma informada</span>}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-none tracking-tighter uppercase drop-shadow-xl">
                {team.name}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 font-sans bg-dark/50 inline-flex px-6 py-2 rounded-full border border-dark-border backdrop-blur-sm">
                <div className="flex items-center gap-2 font-display uppercase tracking-widest">
                  <MapPin className="w-5 h-5 text-primary" />
                  Cidade: {team.city || "Sede Principal"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          {[
            { label: "PONTOS", value: points, highlight: true },
            { label: "VITÓRIAS", value: wins },
            { label: "EMPATES", value: draws },
            { label: "DERROTAS", value: losses },
            { label: "GOLS PRÓ", value: goalsFor },
            { label: "GOLS CONTRA", value: goalsAgainst },
          ].map((stat, idx) => (
            <div key={idx} className={cn("bg-dark-card border rounded-xl p-4 text-center", stat.highlight ? "border-primary/50 bg-primary/5" : "border-dark-border")}>
              <span className="text-[10px] text-gray-500 font-display tracking-wider block mb-1">{stat.label}</span>
              <span className={cn("text-3xl font-display", stat.highlight ? "text-primary" : "text-white")}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Main Content: Roster & Matches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Roster */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display text-white">ELENCO</h2>
              </div>
            </div>
            
            <div className="space-y-8">
              {players.length === 0 ? (
                <div className="p-12 bg-dark-card border border-dark-border rounded-xl text-center text-gray-400 font-sans">
                  Nenhum atleta cadastrado nesta equipe.
                </div>
              ) : (
                Object.entries(
                  players.reduce((acc: any, player: any) => {
                    const cat = player.category || "Sem Categoria";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(player);
                    return acc;
                  }, {})
                ).sort().map(([category, catPlayers]: [string, any]) => (
                  <div key={category}>
                    <h3 className="text-sm font-display text-primary uppercase tracking-widest mb-4 inline-flex items-center px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                      {category} ({catPlayers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catPlayers.map((player: any) => (
                        <div key={player.id} className="bg-dark-card border border-dark-border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-5 hover:border-primary/60 hover:bg-dark/60 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden">
                          <div className="absolute -right-4 -bottom-6 text-7xl md:text-9xl font-display font-black text-white/[0.02] group-hover:text-secondary/[0.08] transition-all duration-500 pointer-events-none italic select-none">
                            {player.number}
                          </div>

                          <div 
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-dark border-2 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 z-10 relative overflow-hidden"
                            style={{ 
                              borderColor: team.color || 'var(--color-dark-border)',
                              boxShadow: `inset 0 0 10px ${team.color ? team.color + '40' : 'transparent'}, 0 0 0 ${team.color ? team.color + '20' : 'transparent'}`
                            }}
                          >
                            {player.photo ? <img src={player.photo} className="w-full h-full object-cover" /> : <span className="font-display text-2xl md:text-3xl font-bold text-primary italic z-10 drop-shadow-sm" style={{ color: team.color }}>{player.number}</span>}
                          </div>

                          <div className="flex-1 z-10 min-w-0">
                            <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors leading-none mb-1 md:mb-1.5 uppercase tracking-tighter truncate">
                              {player.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                              {player.position && (
                                <span className="text-[10px] md:text-xs font-display font-semibold text-accent uppercase tracking-widest whitespace-nowrap">
                                  {player.position}
                                </span>
                              )}
                              {player.goals > 0 && (
                                <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 bg-secondary/10 rounded text-[9px] md:text-[10px] text-secondary border border-secondary/20 font-bold uppercase whitespace-nowrap">
                                  <Goal className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  {player.goals} GOLS
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Match History */}
          <div className="space-y-10">
            
            {/* PRÓXIMOS JOGOS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-dark-border pb-4 mb-6">
                <Calendar className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display text-white">PRÓXIMOS JOGOS</h2>
              </div>
              <div className="space-y-6">
                {upcomingGames.length === 0 ? (
                  <div className="p-8 bg-dark-card border border-dark-border border-dashed rounded-xl text-center text-gray-500 font-sans text-sm">
                    Nenhum jogo agendado.
                  </div>
                ) : (
                  Object.entries(
                    upcomingGames.reduce((acc: any, match: any) => {
                      const cat = match.category || "Geral";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(match);
                      return acc;
                    }, {})
                  ).sort().map(([category, catGames]: [string, any]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-xs font-display text-secondary/70 uppercase tracking-widest border-b border-dark-border pb-2">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {catGames.slice(0, 2).map((match: any) => {
                           let opponent = "";
                           const isHome = Number(match.home_team_id || match.homeTeamId) === Number(id);
                           if (isHome) {
                             opponent = allTeams.find((t:any) => t.id === Number(match.away_team_id || match.awayTeamId))?.name || "Desconhecido";
                           } else {
                             opponent = allTeams.find((t:any) => t.id === Number(match.home_team_id || match.homeTeamId))?.name || "Desconhecido";
                           }
  
                           return (
                            <div key={match.id} className="bg-dark-card border border-secondary/20 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 hover:border-secondary/50 transition-colors shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-2 h-full bg-secondary"></div>
                              <div className="flex flex-col w-full md:w-auto">
                                <span className="text-[10px] text-secondary font-display tracking-wider mb-1 uppercase bg-secondary/10 px-2 py-0.5 rounded self-start">{match.date} {match.time ? `• ${match.time}` : ''}</span>
                                <span className="font-sans text-white font-semibold text-sm truncate max-w-full md:max-w-[220px]">vs {opponent}</span>
                              </div>
                              <div className="mt-2 md:mt-0 text-gray-400 text-xs flex items-center pr-4">
                                <MapPin className="w-3 h-3 mr-1" />
                                {match.location || "Sede Principal"}
                              </div>
                            </div>
                           );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ÚLTIMOS JOGOS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-dark-border pb-4 mb-6">
                <Activity className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display text-white">ÚLTIMOS JOGOS</h2>
              </div>
  
              <div className="space-y-6">
                {pastGames.length === 0 ? (
                  <div className="p-8 bg-dark-card border border-dark-border border-dashed rounded-xl text-center text-gray-500 font-sans text-sm">
                    Nenhum jogo registrado.
                  </div>
                ) : (
                  Object.entries(
                    pastGames.reduce((acc: any, match: any) => {
                      const cat = match.category || "Geral";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(match);
                      return acc;
                    }, {})
                  ).sort().map(([category, catGames]: [string, any]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-xs font-display text-primary/70 uppercase tracking-widest border-b border-dark-border pb-2">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {catGames.slice(0, 2).map((match: any) => {
                           let opponent = "", result = "E", score = "";
                           const homeScore = Number(match.home_score ?? match.homeScore ?? 0);
                           const awayScore = Number(match.away_score ?? match.awayScore ?? 0);
                           const isHome = Number(match.home_team_id || match.homeTeamId) === Number(id);
                           
                           if (isHome) {
                             opponent = allTeams.find((t:any) => t.id === Number(match.away_team_id || match.awayTeamId))?.name || "Desconhecido";
                             if (homeScore > awayScore) result = "V";
                             else if (homeScore < awayScore) result = "D";
                             score = `${homeScore} - ${awayScore}`;
                           } else {
                             opponent = allTeams.find((t:any) => t.id === Number(match.home_team_id || match.homeTeamId))?.name || "Desconhecido";
                             if (awayScore > homeScore) result = "V";
                             else if (awayScore < homeScore) result = "D";
                             score = `${awayScore} - ${homeScore}`;
                           }
  
                           return (
                            <div key={match.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 hover:border-primary/30 transition-colors shadow-sm">
                              <div className="flex flex-col w-full md:w-auto mt-1 md:mt-0">
                                <span className="text-[10px] text-gray-400 font-display tracking-wider mb-1 uppercase">{match.date} {match.time ? `• ${match.time}` : ''}</span>
                                <span className="font-sans text-white font-semibold text-sm truncate max-w-full md:max-w-[190px]">vs {opponent}</span>
                              </div>
                              
                              <div className="flex items-center justify-between md:justify-end gap-3 md:gap-5 w-full md:w-auto pt-2 md:pt-0 border-t border-dark-border md:border-none mt-2 md:mt-0">
                                <span className="font-display font-black text-xl md:text-2xl text-white tracking-widest mt-1">{score}</span>
                                <div className={cn(
                                  "w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center font-display font-bold text-sm md:text-base shrink-0",
                                  result === "V" ? "bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]" :
                                  result === "E" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]" :
                                  "bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                )}>
                                  {result}
                                </div>
                              </div>
                            </div>
                           );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Photo Gallery Section */}
        <div className="mt-16 space-y-8">
          <div className="flex items-center gap-3 border-b border-dark-border pb-4">
            <ImageIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-display text-white uppercase tracking-tight">Galeria de Fotos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGallery.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-dark-border bg-dark-card cursor-pointer"
              >
                <img src={photo.url} alt={photo.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="font-display text-white text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{photo.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
