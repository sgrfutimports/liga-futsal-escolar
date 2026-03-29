import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Play, Trophy, Calendar, Star, Shield, Goal, ChevronLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

const carouselItems = [
  {
    id: 1,
    title: "INSCRIÇÕES ABERTAS 2026",
    subtitle: "A MAIOR LIGA DE FUTSAL ESCOLAR DO AGRESTE",
    description: "Garanta a vaga da sua escola na competição que revela os futuros craques da nossa região.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbb1925713?q=80&w=2000&auto=format&fit=crop",
    ctaText: "INSCREVA SUA ESCOLA",
    ctaLink: "/inscricao",
    accent: "primary"
  },
  {
    id: 2,
    title: "CLASSIFICAÇÃO ATUALIZADA",
    subtitle: "CONFIRA QUEM LIDERA A TABELA",
    description: "Acompanhe o desempenho das equipes em todas as categorias. Resultados em tempo real.",
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=2000&auto=format&fit=crop",
    ctaText: "VER TABELA",
    ctaLink: "/classificacao",
    accent: "secondary"
  },
  {
    id: 3,
    title: "GALERIA DE CRAQUES",
    subtitle: "OS MELHORES MOMENTOS DA LIGA",
    description: "Fotos e vídeos exclusivos das partidas mais emocionantes da temporada.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop",
    ctaText: "VER ATLETAS",
    ctaLink: "/atletas",
    accent: "accent"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="w-full">
      {/* Premium Hero Carousel */}
      <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns effect */}
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
              {/* Premium Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl backdrop-blur-xl bg-dark/40 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group"
              >
                {/* Glow effect behind text */}
                <div className={cn(
                  "absolute -inset-20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000",
                  carouselItems[currentIndex].accent === "primary" ? "bg-primary" : 
                  carouselItems[currentIndex].accent === "secondary" ? "bg-secondary" : "bg-accent"
                )} />

                <div className="relative z-10">
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
                  
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
                    {carouselItems[currentIndex].title.split(' ').map((word, i) => (
                      <span key={i} className={i === 1 ? (
                        carouselItems[currentIndex].accent === "primary" ? "text-primary drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" : 
                        carouselItems[currentIndex].accent === "secondary" ? "text-secondary drop-shadow-[0_0_15px_rgba(255,136,0,0.5)]" : "text-accent drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]"
                      ) : "text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"}>
                        {word}{' '}
                        {i === 1 && <br />}
                      </span>
                    ))}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl font-sans leading-relaxed drop-shadow-md">
                    {carouselItems[currentIndex].description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Link
                      to={carouselItems[currentIndex].ctaLink}
                      className={cn(
                        "group relative w-full sm:w-auto px-8 py-4 font-display text-xl rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden",
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
                    
                    {/* Secondary CTA/Info */}
                    <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-full border border-dark-border bg-dark/50 flex items-center justify-center group-hover:border-white/50 transition-colors">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                      <span className="font-display text-sm tracking-wider uppercase">Ver Vídeo</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute right-6 bottom-10 md:right-10 md:bottom-1/2 md:translate-y-1/2 z-20 flex flex-row md:flex-col gap-4">
          <button 
            onClick={prevSlide}
            className="group w-14 h-14 flex items-center justify-center rounded-full border border-white/10 bg-dark/30 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="group w-14 h-14 flex items-center justify-center rounded-full border border-white/10 bg-dark/30 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-20 flex gap-3 bg-dark/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="relative group py-2"
            >
              <div className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                currentIndex === i 
                  ? "w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                  : "w-4 bg-white/30 group-hover:bg-white/60"
              )} />
              {/* Progress filling effect for active slide */}
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
      </section>

      {/* Live / Next Games & Results */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Next Games */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-center mb-4 text-xs font-display text-gray-400">
                      <span>SÁB, 14 MAI - 09:00</span>
                      <span className="bg-dark px-2 py-1 rounded">SUB-15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center border border-dark-border group-hover:border-primary transition-colors">
                          <span className="font-display text-lg">ESC</span>
                        </div>
                        <span className="font-display text-sm text-center">Colégio Diocesano</span>
                      </div>
                      <div className="w-1/3 flex flex-col items-center justify-center">
                        <span className="text-2xl font-display text-gray-600">VS</span>
                        <span className="text-xs text-gray-500 mt-1">Ginásio Principal</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-1/3">
                        <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center border border-dark-border group-hover:border-primary transition-colors">
                          <span className="font-display text-lg">SSO</span>
                        </div>
                        <span className="font-display text-sm text-center">Santa Sofia</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Ranking Summary */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-dark-border pb-4">
                <h2 className="text-3xl font-display text-white flex items-center gap-3">
                  <Trophy className="text-primary w-8 h-8" />
                  TOP 5 - SUB-17
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
                    {[
                      { pos: 1, name: "Colégio Diocesano", pts: 15 },
                      { pos: 2, name: "Colégio Santa Sofia", pts: 12 },
                      { pos: 3, name: "Colégio XV de Novembro", pts: 10 },
                      { pos: 4, name: "CMA Garanhuns", pts: 9 },
                      { pos: 5, name: "EREM Garanhuns", pts: 7 },
                    ].map((team, idx) => (
                      <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark transition-colors">
                        <td className="p-3 font-display">
                          <span className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-xs",
                            team.pos === 1 ? "bg-primary text-dark" : "text-gray-400"
                          )}>
                            {team.pos}
                          </span>
                        </td>
                        <td className="p-3 font-display text-sm">{team.name}</td>
                        <td className="p-3 font-display text-primary text-center">{team.pts}</td>
                      </tr>
                    ))}
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
      <section className="py-20 bg-dark-card border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-display text-sm">
                <Trophy className="w-4 h-4" />
                VÍDEO INSTITUCIONAL
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white leading-tight">
                MAIS QUE UM JOGO, <br/>UMA FORMAÇÃO
              </h2>
              <p className="text-gray-400 text-lg">
                Conheça a história e o impacto da maior liga de futsal escolar do Agreste Meridional. Unindo educação, esporte e cidadania em Garanhuns e região.
              </p>
              <button className="px-6 py-3 bg-accent text-white font-display text-lg rounded hover:bg-accent/80 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                CONHEÇA NOSSA HISTÓRIA
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-dark-border group shadow-2xl shadow-primary/5">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder, user can update
                  title="Vídeo Institucional - Liga de Futsal Escolar"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Sponsors Section */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-display text-xs mb-4">
            <Star className="w-3 h-3 fill-current" />
            COTA MASTER
          </div>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            PATROCINADORES <span className="text-secondary">PREMIUM</span>
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg">
            As marcas gigantes que tornam o espetáculo possível e investem no futuro do esporte nacional.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-dark-card border border-dark-border rounded-2xl p-12 flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-secondary/50 hover:shadow-[0_0_40px_rgba(255,136,0,0.15)] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center gap-4 transform group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-20 h-20 text-secondary" />
                <span className="font-display text-3xl text-white tracking-widest text-center">FERREIRA COSTA</span>
              </div>
            </div>
            <div className="group relative bg-dark-card border border-dark-border rounded-2xl p-12 flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-secondary/50 hover:shadow-[0_0_40_rgba(255,136,0,0.15)] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center gap-4 transform group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-20 h-20 text-secondary" />
                <span className="font-display text-3xl text-white tracking-widest text-center">UNICOMPRA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Sponsors Section */}
      <section className="py-24 bg-dark-card border-t border-dark-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            PATROCINADORES <span className="text-primary">OFICIAIS</span>
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto">
            Marcas que acreditam no esporte e ajudam a construir o futuro dos nossos jovens atletas.
          </p>
        </div>

        {/* Infinite Marquee Banner */}
        <div className="relative w-full flex overflow-x-hidden border-y border-dark-border bg-dark py-10">
          {/* Gradient Masks for smooth fade on edges */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {/* Duplicate the list to create a seamless infinite loop */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                {[
                  { name: "BÔNUS", icon: Trophy },
                  { name: "SESC PE", icon: Star },
                  { name: "PREFEITURA", icon: Shield },
                  { name: "O BOTICÁRIO", icon: Goal },
                  { name: "GARANHUNS", icon: Trophy },
                ].map((sponsor, i) => (
                  <a 
                    key={i} 
                    href="#"
                    className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer group"
                  >
                    <sponsor.icon className="w-10 h-10 md:w-12 md:h-12 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-3xl md:text-4xl font-display font-bold text-white tracking-wider">{sponsor.name}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Star className="w-64 h-64 text-primary" />
            </div>
            
            <div className="relative z-10 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-display text-xs mb-4">
                OPORTUNIDADE DE NEGÓCIO
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-white mb-3">SEJA UM PATROCINADOR</h3>
              <p className="text-gray-300 font-sans text-lg max-w-2xl">
                Associe sua marca à maior liga de futsal escolar. Espaços premium, visibilidade em transmissões ao vivo e impacto social direto na formação de jovens.
              </p>
            </div>
            
            <button className="relative z-10 shrink-0 w-full md:w-auto px-8 py-4 bg-primary text-dark font-display text-lg rounded hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              BAIXAR MÍDIA KIT
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
