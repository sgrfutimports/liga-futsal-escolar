import { Search, Shield, Trophy, Filter, MapPin, Users } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const TeamLogo = ({ teamName, logo }: { teamName: string, logo?: string }) => {
  const safeName = String(teamName || "").trim();
  const initials = safeName.length >= 2 
    ? safeName.substring(0, 2).toUpperCase() 
    : safeName.length === 1 
      ? safeName.toUpperCase() 
      : "??";

  return (
    <div className="w-28 h-28 bg-white rounded-[2rem] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-2xl z-10 overflow-hidden shrink-0 p-4">
      {logo ? (
        <img src={logo} alt={safeName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
      ) : (
        <span className="font-display text-4xl text-gray-400 font-black">
          {initials}
        </span>
      )}
    </div>
  );
};

export default function Teams() {
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: athletes } = useSupaData('lfe_athletes', []);
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const teams = allTeams.filter((t: any) => {
    const name = String(t.name || "");
    const categories = String(t.categories || "");
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => a.name.localeCompare(b.name));

  const categoriesSet = ["TODOS", ...(settings.categories ? String(settings.categories).split(',').map((c: string) => c.trim()) : ["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"])];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden">
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
            <Shield className="w-4 h-4 text-primary" /> Instituições Filiadas
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Nossas <span className="text-primary italic">Equipes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60"
          >
            Conheça as escolas e projetos que fazem o futsal escolar acontecer.
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
                  placeholder="Buscar equipe pelo nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-display font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                />
             </div>

             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
                <Filter className="w-5 h-5 text-gray-700 shrink-0" />
                {categoriesSet.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-display text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                      activeCategory === cat 
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

      {/* Teams Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teams.map((team: any) => {
             const teamAthletesCount = athletes.filter((a: any) => 
               String(a.teamId || a.team_id) === String(team.id)
             ).length;
             const categoryArray = String(team.categories || "").split(',').filter(c => c.trim()).map((c: string) => c.trim());

             return (
              <Link 
                to={`/equipes/${team.id}`} 
                key={team.id} 
                className="bg-white/5 border border-white/5 rounded-[3rem] p-8 hover:bg-white/10 hover:border-primary/30 transition-all group flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl shadow-2xl"
              >
                <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Shield className="w-48 h-48" />
                </div>
                
                <TeamLogo teamName={team.name} logo={team.logo} />
                
                <h3 className="font-display text-2xl text-white font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors leading-none">{team.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 font-display font-black text-[10px] uppercase tracking-widest mb-8 opacity-60">
                   <MapPin className="w-3 h-3 text-primary" />
                   {team.city || "REPRESENTANTE"}
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-auto z-10">
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-3">Categorias</span>
                    <div className="flex flex-wrap gap-1 justify-center max-h-12 overflow-hidden">
                      {categoryArray.slice(0, 3).map((cat: string) => (
                        <span key={cat} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[8px] font-display font-black uppercase">
                          {cat}
                        </span>
                      ))}
                      {categoryArray.length > 3 && <span className="text-gray-600 font-black text-[8px]">+{categoryArray.length - 3}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-white/5 pl-4 justify-center items-center">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Efetivo</span>
                    <div className="flex items-center gap-2">
                       <Users className="w-3 h-3 text-primary" />
                       <span className="font-display text-lg text-white font-black italic">{teamAthletesCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
             )
          })}
          {teams.length === 0 && (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                 <Shield className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                 <h3 className="text-2xl font-display font-black text-gray-600 uppercase tracking-widest">Nenhuma equipe encontrada</h3>
                 <p className="text-gray-700 mt-2 font-display uppercase text-xs tracking-widest">Tente ajustar sua busca ou categoria.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
