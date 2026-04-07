import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Play, Trophy, Calendar, Star, Shield, Goal, ChevronLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSupaData } from "@/src/lib/store";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load data from Supabase
  const { data: banners } = useSupaData('lfe_banners', []);
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] ?? {};

  // Safety fallbacks
  const carouselItems = banners?.length > 0 ? banners : [
    {
      id: "default-1",
      image: "/banner-principal.png",
      title: "LIGA DE FUTSAL ESCOLAR",
      subtitle: "A Maior Competição Regional",
      description: "Jovens talentos em quadra disputando a glória máxima do esporte estudantil.",
      ctaText: "VER EQUIPES",
      ctaLink: "/equipes",
      accent: "primary"
    },
    {
      id: "default-2",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1920&auto=format&fit=crop",
      title: "INSCRIÇÕES ABERTAS",
      subtitle: "Temporada 2026",
      description: "Garanta a vaga da sua escola na maior competição do ano. Vagas limitadas por categoria.",
      ctaText: "INSCREVA-SE",
      ctaLink: "/inscricoes",
      accent: "secondary"
    }
  ];
  const loadedTeams = teams || [];
  const nextGames = (games || []).filter((g: any) => g.status !== 'Finalizado').slice(0, 4);

  // Calculate simple standings from games
  const standings = loadedTeams.map((t: any) => {
    let pts = 0;
    (games || []).forEach((g: any) => {
      if (g.status === 'Finalizado') {
        const homeScore = Number(g.homeScore || 0);
        const awayScore = Number(g.awayScore || 0);
        if (g.homeTeamId === t.id) {
          if (homeScore > awayScore) pts += 3;
          else if (homeScore === awayScore) pts += 1;
        } else if (g.awayTeamId === t.id) {
          if (awayScore > homeScore) pts += 3;
          else if (homeScore === awayScore) pts += 1;
        }
      }
    });
    return { ...t, pts };
  }).sort((a: any, b: any) => b.pts - a.pts).slice(0, 5);

  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="w-full">
      {/* Premium Hero Carousel */}
      <section className="relative h-[45vh] min-h-[400px] lg:min-h-[450px] w-full overflow-hidden bg-dark">
        {carouselItems.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 z-0">
                <motion.div 
                  className="w-full h-full transform-origin-center"
                  initial={{ scale: 1.15, rotate: 1 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 10, ease: "easeOut" }}
                >
                  <img
                    src={carouselItems[currentIndex].image}
                    alt={carouselItems[currentIndex].title}
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
              </div>

              <div className="relative z-10 h-full w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="max-w-2xl backdrop-blur-xl bg-dark/40 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group w-full md:w-auto mt-10 md:mt-0"
                >
                  <div className={cn(
                    "absolute -inset-20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000",
                    carouselItems[currentIndex].accent === "primary" ? "bg-primary" : 
                    carouselItems[currentIndex].accent === "secondary" ? "bg-secondary" : "bg-accent"
                  )} />

                  <div className="relative z-10">
                    {carouselItems[currentIndex].subtitle && (
                      <span className={cn(
                        "inline-flex items-center gap-2 py-1.5 px-4 rounded-full font-display text-xs tracking-[0.2em] mb-6 border uppercase shadow-lg",
                        carouselItems[currentIndex].accent === "primary" 
                          ? "bg-primary/20 text-primary border-primary/40 shadow-primary/20" 
                          : carouselItems[currentIndex].accent === "secondary"
                          ? "bg-secondary/20 text-secondary border-secondary/40 shadow-secondary/20"
                          : "bg-accent/20 text-accent border-accent/40 shadow-accent/20"
                      )}>
                        <Trophy className="w-3 h-3" />
                        {carouselItems[currentIndex].subtitle}
                      </span>
                    )}
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-3 md:mb-4 leading-[1.1] tracking-tighter uppercase drop-shadow-2xl">
                      {carouselItems[currentIndex].title?.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i === 1 ? (
                          carouselItems[currentIndex].accent === "primary" ? "text-primary drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" : 
                          carouselItems[currentIndex].accent === "secondary" ? "text-secondary drop-shadow-[0_0_15px_rgba(255,136,0,0.5)]" : "text-accent drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]"
                        ) : "text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"}>
                          {word}{' '}
                          {i === 1 && <br className="hidden sm:block" />}
                        </span>
                      ))}
                    </h1>
                    
                    <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 max-w-xl font-sans leading-relaxed drop-shadow-md">
                      {carouselItems[currentIndex].description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {carouselItems[currentIndex].ctaText && (
                        <Link
                          to={carouselItems[currentIndex].ctaLink || "#"}
                          className={cn(
                            "group relative w-full sm:w-auto px-6 py-3 font-display text-lg md:text-xl rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden",
                            carouselItems[currentIndex].accent === "primary"
                              ? "bg-primary text-dark hover:bg-white hover:text-dark shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                              : carouselItems[currentIndex].accent === "secondary"
                              ? "bg-secondary text-dark hover:bg-white hover:text-dark shadow-[0_0_30px_rgba(255,136,0,0.3)]"
                              : "bg-accent text-white hover:bg-white hover:text-dark shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {carouselItems[currentIndex].ctaText}
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark text-gray-500 font-display text-2xl">
            Nenhum banner configurado
          </div>
        )}

        {carouselItems.length > 1 && (
          <>
            <div className="absolute right-4 bottom-4 md:right-8 md:bottom-1/2 md:translate-y-1/2 z-20 flex flex-row md:flex-col gap-2 md:gap-4">
              <button onClick={prevSlide} className="group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/10 bg-dark/30 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md shadow-lg">
                <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={nextSlide} className="group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/10 bg-dark/30 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md shadow-lg">
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-20 flex gap-2 bg-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              {carouselItems.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrentIndex(i)} className="relative group py-1.5 focus:outline-none">
                  <div className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    currentIndex === i ? "w-8 md:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-3 md:w-4 bg-white/30 group-hover:bg-white/60"
                  )} />
                  {currentIndex === i && (
                    <motion.div 
                      className={cn(
                        "absolute top-2 left-0 h-1.5 rounded-full",
                        carouselItems[currentIndex].accent === "primary" ? "bg-primary" :
                        carouselItems[currentIndex].accent === "secondary" ? "bg-secondary" : "bg-accent"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Live / Next Games & Results */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-dark-border pb-4">
                <h2 className="text-3xl font-display text-white flex items-center gap-3">
                  <Calendar className="text-primary w-8 h-8" />
                  PRÓXIMOS JOGOS
                </h2>
                <Link to="/classificacao" className="text-primary hover:text-white transition-colors font-display text-sm flex items-center gap-1">
                  VER TODOS <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {nextGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nextGames.map((game: any) => {
                    const home = loadedTeams.find((t: any) => t.id === Number(game.homeTeamId));
                    const away = loadedTeams.find((t: any) => t.id === Number(game.awayTeamId));
                    return (
                      <div key={game.id} className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-center mb-4 text-xs font-display text-gray-400">
                          <span>{game.date} - {game.time}</span>
                          <span className="bg-dark px-2 py-1 rounded">AGENDADO</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col items-center gap-2 w-1/3">
                            <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center border border-dark-border group-hover:border-primary transition-colors overflow-hidden p-1">
                               {home?.logo ? <img src={home.logo} className="w-full h-full object-contain rounded-full bg-white"/> : <span className="font-display text-lg tracking-tighter">{home?.name?.substring(0,3).toUpperCase()}</span>}
                            </div>
                            <span className="font-display text-sm text-center line-clamp-1">{home?.name || "-"}</span>
                          </div>
                          <div className="w-1/3 flex flex-col items-center justify-center">
                            <span className="text-2xl font-display text-gray-600">VS</span>
                            <span className="text-xs text-gray-500 mt-1 line-clamp-1 text-center">{game.location}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 w-1/3">
                            <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center border border-dark-border group-hover:border-primary transition-colors overflow-hidden p-1">
                               {away?.logo ? <img src={away.logo} className="w-full h-full object-contain rounded-full bg-white"/> : <span className="font-display text-lg tracking-tighter">{away?.name?.substring(0,3).toUpperCase()}</span>}
                            </div>
                            <span className="font-display text-sm text-center line-clamp-1">{away?.name || "-"}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-gray-500 font-display py-8 text-center border border-dark-border rounded-lg border-dashed">
                  Nenhum jogo agendado no momento.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-dark-border pb-4">
                <h2 className="text-3xl font-display text-white flex items-center gap-3">
                  <Trophy className="text-primary w-8 h-8" />
                  TOP 5 - GERAL
                </h2>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark text-gray-400 font-display text-sm border-b border-dark-border">
                      <th className="p-3 font-normal">POS</th>
                      <th className="p-3 font-normal">EQUIPE</th>
                      <th className="p-3 font-normal text-center">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team: any, idx: number) => (
                      <tr key={team.id} className="border-b border-dark-border/50 hover:bg-dark transition-colors">
                        <td className="p-3 font-display">
                          <span className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-xs",
                            idx === 0 ? "bg-primary text-dark" : "text-gray-400"
                          )}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="p-3 font-display text-sm">{team.name}</td>
                        <td className="p-3 font-display text-primary text-center">{team.pts}</td>
                      </tr>
                    ))}
                    {standings.length === 0 && (
                      <tr><td colSpan={3} className="p-4 text-center text-gray-500">Nenhum dado</td></tr>
                    )}
                  </tbody>
                </table>
                <Link to="/classificacao" className="block w-full text-center p-3 font-display text-sm text-gray-400 hover:text-primary hover:bg-dark transition-colors">
                  VER TABELA COMPLETA
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Institutional Video */}
      {settings?.institutionalVideoUrl && (
      <section className="py-20 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-display text-sm">
                <Trophy className="w-4 h-4" /> VÍDEO INSTITUCIONAL
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white leading-tight">
                MAIS QUE UM JOGO, <br/>UMA FORMAÇÃO
              </h2>
              <p className="text-gray-400 text-lg">
                Conheça a história e o impacto da {settings.eventName || "Liga Escolar"}. Unindo educação, esporte e cidadania em Garanhuns e região.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-dark-border group shadow-2xl shadow-primary/5">
                <iframe 
                  className="w-full h-full"
                  src={settings.institutionalVideoUrl}
                  title={`Vídeo Institucional - ${settings.eventName || "Liga"}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
