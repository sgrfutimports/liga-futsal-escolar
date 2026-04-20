import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { 
  Users, Search, Filter, Trophy, 
  ChevronRight, Award, Shield, User,
  Mail, Calendar, Briefcase, Goal
} from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Athletes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  
  const { data: athletes, loading: loadingAthletes } = useSupaData('lfe_athletes', []);
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);

  const categories = useMemo(() => {
    const cats = new Set((athletes || []).map((a: any) => a.category).filter(Boolean));
    return ["Todas", ...Array.from(cats)].sort();
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    return (athletes || []).filter((athlete: any) => {
      const matchesSearch = athlete.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todas" || athlete.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [athletes, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-30" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 font-display text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Users className="w-4 h-4 text-primary" /> Galeria de Talentos
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Nossos <span className="text-primary italic">Atletas</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60"
          >
            Conheça as promessas do futsal escolar que brilham em nossas quadras.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-20 z-40 bg-[#020617]/80 backdrop-blur-3xl border-y border-white/5 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
             <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar atleta pelo nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-display font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                />
             </div>

             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
                <Filter className="w-5 h-5 text-gray-700 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-display text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                      selectedCategory === cat 
                        ? "bg-primary border-primary text-dark shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                        : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Athletes Grid */}
      <section className="py-20 container mx-auto px-4">
        {loadingAthletes ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {filteredAthletes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredAthletes.map((athlete: any) => {
                  const team = teams.find((t: any) => String(t.id) === String(athlete.teamId || athlete.team_id));
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={athlete.id}
                      className="group relative"
                    >
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl transition-all group-hover:border-primary/30">
                        {/* Player Photo */}
                        <div className="absolute inset-0">
                          {athlete.photo ? (
                            <img src={athlete.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={athlete.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                               <User className="w-20 h-20 text-gray-800" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
                        </div>

                        {/* Player Content Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
                           <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-2xl mb-4 transform -translate-y-2 group-hover:-translate-y-4 transition-transform border border-white/10">
                              <img src={team?.logo || "/logos/placeholder.png"} className="w-full h-full object-contain" alt="" />
                           </div>
                           <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">{athlete.name}</h3>
                           <p className="text-[10px] font-display font-bold text-gray-500 uppercase tracking-widest">{athlete.position || "Atleta"}</p>
                           
                           {/* Quick Stats Hover Info */}
                           <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500 flex items-center justify-center gap-4 border-t border-white/10 mt-4 pt-4 w-full opacity-0 group-hover:opacity-100">
                              <div className="flex items-center gap-1.5">
                                 <Goal className="w-3.5 h-3.5 text-primary" />
                                 <span className="text-xs font-display font-black">{athlete.goals || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <Award className="w-3.5 h-3.5 text-yellow-500" />
                                 <span className="text-xs font-display font-black">{athlete.cards_yellow || 0}</span>
                              </div>
                           </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-6 right-6">
                           <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-display font-black uppercase text-gray-400">
                             {athlete.category}
                           </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                 <Users className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                 <h3 className="text-2xl font-display font-black text-gray-600 uppercase tracking-widest">Nenhum atleta encontrado</h3>
                 <p className="text-gray-700 mt-2 font-display uppercase text-xs tracking-widest">Tente ajustar sua busca ou categoria.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Stats Section / CTA */}
      <section className="py-40 bg-white/5 border-t border-white/5">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div>
                 <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-8 leading-none">Formando o <br/><span className="text-primary italic">Futuro</span></h2>
                 <p className="text-gray-400 text-lg mb-8 uppercase font-bold tracking-widest opacity-60">A LFE orgulhosamente apresenta os talentos de amanhã. Disciplina, técnica e paixão em cada jogo.</p>
                 <div className="flex gap-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex-1">
                       <p className="text-4xl font-display font-black text-white mb-1">{athletes?.length || 0}</p>
                       <p className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.2em]">Inscritos</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex-1">
                       <p className="text-4xl font-display font-black text-white mb-1">2026</p>
                       <p className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.2em]">Temporada</p>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-2 relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 group shadow-3xl">
                 <img src="https://images.unsplash.com/photo-1543326131-de94b150c18d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40" />
                 <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-dark to-transparent">
                    <p className="font-display font-black text-3xl uppercase tracking-tighter text-white mb-2">Compromisso com o Esporte</p>
                    <p className="text-primary font-display font-bold text-sm uppercase tracking-widest">Educação e Cidadania através do Futsal.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}
