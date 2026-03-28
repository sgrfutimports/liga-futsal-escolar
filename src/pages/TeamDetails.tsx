import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { Shield, MapPin, Calendar, Trophy, Users, ChevronLeft, ChevronRight, Activity, Loader2, Image as ImageIcon, Camera, Instagram, Facebook, Twitter, Youtube, Globe, Goal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

// Mock data for the team
const teamsData: Record<string, any> = {
  "1": { 
    id: 1, name: "Colégio Diocesano", abbr: "DIO", categories: ["SUB-13", "SUB-15", "SUB-17"], city: "Garanhuns", founded: 1915, coach: "Prof. Marcos Silva", points: 15, wins: 5, draws: 0, losses: 0, goalsFor: 25, goalsAgainst: 5,
    socials: { instagram: "diocesanogaranhuns", facebook: "diocesanogaranhuns", twitter: "diocesano_ga", website: "www.diocesanogaranhuns.com.br" }
  },
  "2": { 
    id: 2, name: "Colégio Santa Sofia", abbr: "SSO", categories: ["SUB-15", "SUB-17"], city: "Garanhuns", founded: 1940, coach: "Prof. Ana Souza", points: 12, wins: 4, draws: 0, losses: 1, goalsFor: 18, goalsAgainst: 8,
    socials: { instagram: "santasofiaoficial", facebook: "colegiosantasofia", website: "www.santasofia.com.br" }
  },
  "3": { 
    id: 3, name: "Colégio XV de Novembro", abbr: "XVN", categories: ["SUB-11", "SUB-13", "SUB-15"], city: "Garanhuns", founded: 1900, coach: "Prof. Roberto Carlos", points: 10, wins: 3, draws: 1, losses: 1, goalsFor: 15, goalsAgainst: 10,
    socials: { instagram: "xvnovembro", youtube: "TVXVNovembro" }
  },
  "4": { id: 4, name: "CMA Garanhuns", abbr: "CMA", categories: ["SUB-13", "SUB-15"], city: "Garanhuns", founded: 1970, coach: "Prof. Juliana Dias", points: 9, wins: 3, draws: 0, losses: 2, goalsFor: 12, goalsAgainst: 12 },
  "5": { id: 5, name: "EREM Garanhuns", abbr: "ERE", categories: ["SUB-15", "SUB-17"], city: "Garanhuns", founded: 1950, coach: "Prof. Fernando Lima", points: 7, wins: 2, draws: 1, losses: 2, goalsFor: 10, goalsAgainst: 15 },
  "6": { id: 6, name: "Escola Padre Agobar Valença", abbr: "PAV", categories: ["SUB-13", "SUB-15"], city: "Garanhuns", founded: 1985, coach: "Prof. Carlos Alberto", points: 4, wins: 1, draws: 1, losses: 3, goalsFor: 8, goalsAgainst: 20 },
  "7": { id: 7, name: "Escola Simoa Gomes", abbr: "SGO", categories: ["SUB-11", "SUB-13"], city: "Garanhuns", founded: 1960, coach: "Prof. Thiago Neves", points: 1, wins: 0, draws: 1, losses: 4, goalsFor: 5, goalsAgainst: 25 },
  "8": { id: 8, name: "Colégio Santa Joana D'Arc", abbr: "SJD", categories: ["SUB-17"], city: "Garanhuns", founded: 1990, coach: "Prof. Ricardo Gomes", points: 0, wins: 0, draws: 0, losses: 5, goalsFor: 2, goalsAgainst: 18 },
};

const initialMockPlayers = [
  { id: 1, name: "João Pedro", number: 10, position: "Pivô", goals: 12 },
  { id: 2, name: "Lucas Silva", number: 5, position: "Fixo", goals: 2 },
  { id: 3, name: "Mateus Santos", number: 7, position: "Ala", goals: 5 },
  { id: 4, name: "Gabriel Costa", number: 1, position: "Goleiro", goals: 0 },
  { id: 5, name: "Pedro Henrique", number: 11, position: "Ala", goals: 6 },
  { id: 6, name: "Rafael Souza", number: 8, position: "Fixo", goals: 0 },
  { id: 7, name: "Thiago Almeida", number: 9, position: "Pivô", goals: 3 },
  { id: 8, name: "Bruno Lima", number: 4, position: "Ala", goals: 1 },
];

const mockMatches = [
  { id: 1, date: "14 MAI", opponent: "Colégio Santa Sofia", result: "V", score: "3 - 1" },
  { id: 2, date: "07 MAI", opponent: "Colégio XV de Novembro", result: "V", score: "5 - 2" },
  { id: 3, date: "30 ABR", opponent: "CMA Garanhuns", result: "V", score: "4 - 0" },
  { id: 4, date: "23 ABR", opponent: "EREM Garanhuns", result: "V", score: "6 - 1" },
  { id: 5, date: "16 ABR", opponent: "Escola Padre Agobar Valença", result: "V", score: "7 - 1" },
];

const mockGallery = [
  { id: 1, url: "https://picsum.photos/seed/futsal1/800/600", title: "Aquecimento pré-jogo" },
  { id: 2, url: "https://picsum.photos/seed/futsal2/800/600", title: "Comemoração do gol" },
  { id: 3, url: "https://picsum.photos/seed/futsal3/800/600", title: "Instruções do treinador" },
  { id: 4, url: "https://picsum.photos/seed/futsal4/800/600", title: "Defesa espetacular" },
  { id: 5, url: "https://picsum.photos/seed/futsal5/800/600", title: "Torcida organizada" },
  { id: 6, url: "https://picsum.photos/seed/futsal6/800/600", title: "Premiação regional" },
];

export default function TeamDetails() {
  const { id } = useParams();
  const team = teamsData[id || "1"] || teamsData["1"];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [players, setPlayers] = useState<typeof initialMockPlayers>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamLogo, setTeamLogo] = useState<string | null>(null);

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem(`team_logo_${id}`);
    if (savedLogo) {
      setTeamLogo(savedLogo);
    }
  }, [id]);

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTeamLogo(base64String);
        localStorage.setItem(`team_logo_${id}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPlayers(initialMockPlayers);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

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
            <Shield className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-dark rounded-full border-4 border-dark-border flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                {teamLogo ? (
                  <img src={teamLogo} alt="Logo da Equipe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="font-display text-5xl md:text-7xl text-gray-600">
                    {team.abbr}
                  </span>
                )}
              </div>
              <button 
                onClick={triggerLogoUpload}
                className="absolute bottom-2 right-2 p-3 bg-primary text-dark rounded-full shadow-lg hover:bg-primary-dark transition-all transform scale-0 group-hover:scale-100 focus:scale-100 z-20"
                title="Alterar Escudo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {team.categories?.map((cat: string) => (
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
                  {team.city}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Fundado em {team.founded}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {team.coach}
                </div>
              </div>

              {/* Social Media Links */}
              {team.socials && (
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {team.socials.instagram && (
                    <a href={`https://instagram.com/${team.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                       className="p-2 bg-dark rounded-lg border border-dark-border text-gray-400 hover:text-primary hover:border-primary transition-all group" title="Instagram">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {team.socials.facebook && (
                    <a href={`https://facebook.com/${team.socials.facebook}`} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-dark rounded-lg border border-dark-border text-gray-400 hover:text-primary hover:border-primary transition-all group" title="Facebook">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {team.socials.twitter && (
                    <a href={`https://twitter.com/${team.socials.twitter}`} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-dark rounded-lg border border-dark-border text-gray-400 hover:text-primary hover:border-primary transition-all group" title="Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {team.socials.youtube && (
                    <a href={`https://youtube.com/@${team.socials.youtube}`} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-dark rounded-lg border border-dark-border text-gray-400 hover:text-primary hover:border-primary transition-all group" title="YouTube">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {team.socials.website && (
                    <a href={`https://${team.socials.website}`} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-dark rounded-lg border border-dark-border text-gray-400 hover:text-primary hover:border-primary transition-all group" title="Website">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          {[
            { label: "PONTOS", value: team.points, highlight: true },
            { label: "VITÓRIAS", value: team.wins },
            { label: "EMPATES", value: team.draws },
            { label: "DERROTAS", value: team.losses },
            { label: "GOLS PRÓ", value: team.goalsFor },
            { label: "GOLS CONTRA", value: team.goalsAgainst },
          ].map((stat, idx) => (
            <div key={idx} className={cn(
              "bg-dark-card border rounded-xl p-4 text-center",
              stat.highlight ? "border-primary/50 bg-primary/5" : "border-dark-border"
            )}>
              <span className="text-[10px] text-gray-500 font-display tracking-wider block mb-1">{stat.label}</span>
              <span className={cn(
                "text-3xl font-display",
                stat.highlight ? "text-primary" : "text-white"
              )}>{stat.value}</span>
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
              {isLoading ? (
                <div className="col-span-full p-12 bg-dark-card border border-dark-border rounded-xl text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 font-sans text-lg">Carregando elenco...</p>
                </div>
              ) : players.length === 0 ? (
                <div className="col-span-full p-12 bg-dark-card border border-dark-border rounded-xl text-center text-gray-400 font-sans">
                  Nenhum atleta cadastrado nesta equipe.
                </div>
              ) : (
                players.map((player) => (
                  <div 
                    key={player.id} 
                    className="bg-dark-card border border-dark-border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-5 hover:border-primary/60 hover:bg-dark/60 hover:scale-[1.01] md:hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(153,204,0,0.1)] transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Background Number Accent */}
                    <div className="absolute -right-4 -bottom-6 text-7xl md:text-9xl font-display font-black text-white/[0.02] group-hover:text-secondary/[0.08] transition-all duration-500 pointer-events-none italic select-none">
                      {player.number}
                    </div>

                    {/* Jersey Number Circle */}
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-dark border-2 border-dark-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(153,204,0,0.3)] transition-all duration-300 z-10 relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-display text-2xl md:text-3xl font-bold text-primary italic z-10 drop-shadow-sm">
                        {player.number}
                      </span>
                    </div>

                    <div className="flex-1 z-10 min-w-0">
                      <h3 className="font-display text-lg md:text-2xl font-bold text-white group-hover:text-primary transition-colors leading-none mb-1 md:mb-1.5 uppercase tracking-tighter truncate">
                        {player.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs font-display font-semibold text-accent uppercase tracking-widest whitespace-nowrap">
                          {player.position}
                        </span>
                        {player.goals > 0 && (
                          <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 bg-secondary/10 rounded text-[9px] md:text-[10px] text-secondary border border-secondary/20 font-bold uppercase whitespace-nowrap">
                            <Goal className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            {player.goals} {player.goals === 1 ? 'GOL' : 'GOLS'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:group-hover:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary transition-all transform translate-x-4 group-hover:translate-x-0">
                      <ChevronRight className="w-6 h-6" />
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
              {mockMatches.map((match) => (
                <div key={match.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-display tracking-wider mb-1">{match.date}</span>
                    <span className="font-display text-white text-sm">vs {match.opponent}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-display text-xl text-white tracking-widest">{match.score}</span>
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center font-display text-sm",
                      match.result === "V" ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                      match.result === "E" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                      "bg-red-500/20 text-red-500 border border-red-500/30"
                    )}>
                      {match.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-dark border border-dark-border rounded-xl p-6 text-center mt-6">
              <Trophy className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="font-display text-gray-400 text-sm">Aproveitamento da equipe na temporada atual.</p>
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
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="font-display text-white text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.title}
                  </p>
                  <p className="text-primary text-xs font-sans uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    Temporada 2026
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
