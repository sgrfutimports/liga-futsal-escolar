import { Search, Shield } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
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
    <div className="w-24 h-24 bg-white rounded-2xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-2xl relative z-10 overflow-hidden shrink-0">
      {logo ? (
        <img src={logo} alt={safeName} className="w-full h-full object-contain p-3" referrerPolicy="no-referrer" />
      ) : (
        <span className="font-display text-4xl text-gray-300 group-hover:text-primary transition-all duration-300">
          {initials}
        </span>
      )}
    </div>
  );
};

export default function Teams() {
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: athletes } = useSupaData('lfe_athletes', []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const teams = allTeams.filter((t: any) => {
    const name = String(t.name || "");
    const categories = String(t.categories || "");
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const categoriesSet = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-[#020617] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-[2px] bg-primary"></div>
               <span className="text-primary font-display font-black tracking-[0.3em] text-xs uppercase opacity-80">Edição 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
              NOSSAS <span className="text-primary">EQUIPES</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl font-medium">
              A elite do futsal escolar reunida em uma única competição.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-16 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-6 py-5 border border-white/5 rounded-2xl bg-[#0f172a] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-display transition-all shadow-2xl"
              placeholder="PESQUISAR EQUIPE..."
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-16 pb-10 border-b border-white/5">
          {categoriesSet.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 font-display text-sm font-black rounded-xl transition-all border uppercase tracking-[0.1em]",
                activeCategory === cat 
                  ? "bg-primary text-black border-primary shadow-[0_0_30px_rgba(204,255,0,0.3)]" 
                  : "bg-[#0f172a] text-gray-500 border-white/5 hover:border-white/20 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {teams.map((team: any) => {
             const teamAthletesCount = athletes.filter((a: any) => 
               String(a.teamId || a.team_id) === String(team.id)
             ).length;
             const categoryArray = String(team.categories || "").split(',').filter(c => c.trim()).map((c: string) => c.trim());

             return (
              <Link 
                to={`/equipes/${team.id}`} 
                key={team.id} 
                className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-10 hover:border-primary/30 transition-all duration-500 group cursor-pointer flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              >
                {/* Background Pattern */}
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Shield className="w-56 h-56" />
                </div>
                
                <TeamLogo teamName={team.name} logo={team.logo} />
                
                <h3 className="font-display text-3xl font-black text-white mb-2 z-10 group-hover:text-primary transition-colors tracking-tighter">
                  {team.name}
                </h3>
                <p className="text-xs text-gray-500 font-display font-medium uppercase tracking-[0.2em] mb-8 z-10">{team.city || "Sede LFE"}</p>
                
                <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-8 mt-auto z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Categorias</span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {categoryArray.slice(0, 2).map((cat: string) => (
                        <span key={cat} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[9px] font-display font-bold">
                          {cat}
                        </span>
                      ))}
                      {categoryArray.length > 2 && <span className="text-[9px] text-gray-600 font-bold">+{categoryArray.length - 2}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-center border-l border-white/5">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Atletas</span>
                    <span className="font-display text-2xl font-black text-white group-hover:text-primary transition-colors">{teamAthletesCount}</span>
                  </div>
                </div>
              </Link>
             )
          })}
        </div>

        {teams.length === 0 && (
          <div className="py-40 text-center">
             <Shield className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
             <p className="text-gray-600 font-display font-black text-2xl uppercase tracking-widest">Nenhuma equipe encontrada</p>
          </div>
        )}

      </div>
    </div>
  );
}
