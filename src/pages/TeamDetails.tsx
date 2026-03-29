import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Shield, MapPin, Calendar, Trophy, Users, ChevronLeft, ChevronRight, Activity, Loader2, Image as ImageIcon, Camera, Goal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { getStoredData } from "@/src/lib/store";

const mockGallery = [
  { id: 1, url: "https://images.unsplash.com/photo-1574629810360-7efbb1925713?q=80&w=800&auto=format&fit=crop", title: "Aquecimento pré-jogo" },
  { id: 2, url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop", title: "Comemoração" },
  { id: 3, url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop", title: "Instruções do treinador" },
];

export default function TeamDetails() {
  const { id } = useParams();
  
  const allTeams = getStoredData('teams') || [];
  const allAthletes = getStoredData('athletes') || [];
  const allGames = getStoredData('games') || [];
  
  const team = allTeams.find((t: any) => t.id === Number(id)) || allTeams[0];
  const players = allAthletes.filter((a: any) => a.teamId === Number(id));
  
  // Calculate specific team stats based on games
  const teamGames = allGames.filter((g: any) => g.status === 'Finalizado' && (g.homeTeamId === Number(id) || g.awayTeamId === Number(id)));
  
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
  
  teamGames.forEach((g: any) => {
    const homeScore = Number(g.homeScore || 0);
    const awayScore = Number(g.awayScore || 0);
    if (g.homeTeamId === Number(id)) {
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
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {categoryArray.map((cat: string) => (
                  <div key={cat} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-display text-xs">
                    {cat}
                  </div>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-none">
                {team.name}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-sans">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {team.city || "Agreste Meridional"}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.length === 0 ? (
                <div className="col-span-full p-12 bg-dark-card border border-dark-border rounded-xl text-center text-gray-400 font-sans">
                  Nenhum atleta cadastrado nesta equipe.
                </div>
              ) : (
                players.map((player: any) => (
                  <div key={player.id} className="bg-dark-card border border-dark-border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-5 hover:border-primary/60 hover:bg-dark/60 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-6 text-7xl md:text-9xl font-display font-black text-white/[0.02] group-hover:text-secondary/[0.08] transition-all duration-500 pointer-events-none italic select-none">
                      {player.number}
                    </div>

                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-dark border-2 border-dark-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(153,204,0,0.3)] transition-all duration-300 z-10 relative overflow-hidden">
                      {player.photo ? <img src={player.photo} className="w-full h-full object-cover" /> : <span className="font-display text-2xl md:text-3xl font-bold text-primary italic z-10 drop-shadow-sm">{player.number}</span>}
                    </div>

                    <div className="flex-1 z-10 min-w-0">
                      <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors leading-none mb-1 md:mb-1.5 uppercase tracking-tighter truncate">
                        {player.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs font-display font-semibold text-accent uppercase tracking-widest whitespace-nowrap">
                          {player.category}
                        </span>
                        {player.goals > 0 && (
                          <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 bg-secondary/10 rounded text-[9px] md:text-[10px] text-secondary border border-secondary/20 font-bold uppercase whitespace-nowrap">
                            <Goal className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            {player.goals} GOLS
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Match History */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-dark-border pb-4">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display text-white">ÚLTIMOS JOGOS</h2>
            </div>

            <div className="space-y-4">
              {teamGames.map((match: any) => {
                 let opponent = "", result = "E", score = "";
                 if (match.homeTeamId === Number(id)) {
                   opponent = allTeams.find((t:any) => t.id === Number(match.awayTeamId))?.name || "Desconhecido";
                   if (match.homeScore > match.awayScore) result = "V";
                   else if (match.homeScore < match.awayScore) result = "D";
                   score = `${match.homeScore} - ${match.awayScore}`;
                 } else {
                   opponent = allTeams.find((t:any) => t.id === Number(match.homeTeamId))?.name || "Desconhecido";
                   if (match.awayScore > match.homeScore) result = "V";
                   else if (match.awayScore < match.homeScore) result = "D";
                   score = `${match.awayScore} - ${match.homeScore}`;
                 }

                 return (
                  <div key={match.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-display tracking-wider mb-1">{match.date}</span>
                      <span className="font-display text-white text-sm truncate max-w-[150px]">vs {opponent}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-display text-xl text-white tracking-widest">{score}</span>
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center font-display text-sm",
                        result === "V" ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                        result === "E" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                        "bg-red-500/20 text-red-500 border border-red-500/30"
                      )}>
                        {result}
                      </div>
                    </div>
                  </div>
                 )
              })}
              {teamGames.length === 0 && <div className="text-gray-500 text-center py-4 border border-dark-border border-dashed rounded-lg">Nenhum jogo finalizado</div>}
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
