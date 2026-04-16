import { Search, Shield } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const TeamLogo = ({ teamName, logo }: { teamName: string, logo?: string }) => {
  return (
    <div className="w-24 h-24 bg-dark rounded-full border-2 border-dark-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-lg group-hover:shadow-primary/20 z-10 overflow-hidden shrink-0">
      {logo ? (
        <img src={logo} alt={teamName} className="w-full h-full object-contain p-2 bg-white" referrerPolicy="no-referrer" />
      ) : (
        <span className="font-display text-3xl text-gray-600 group-hover:text-primary transition-all duration-300 inline-block">
          {teamName?.substring(0, 2).toUpperCase()}
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
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || t.categories?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const categoriesSet = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase">
              NOSSAS <span className="text-primary">EQUIPES</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Conheça as escolas e projetos que fazem parte da Liga de Futsal Escolar.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-dark-border rounded-xl leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm font-sans transition-all shadow-lg"
              placeholder="Buscar equipe por nome..."
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-dark-border/30">
          {categoriesSet.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 font-display text-sm rounded-full transition-all border uppercase tracking-wider",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-dark-card text-gray-500 border-dark-border hover:border-gray-600 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team: any) => {
             const teamAthletesCount = athletes.filter((a: any) => a.teamId === team.id).length;
             const categoryArray = team.categories ? team.categories.split(',').map((c: string) => c.trim()) : [];

             return (
              <Link 
                to={`/equipes/${team.id}`} 
                key={team.id} 
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-all group cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-40 h-40" />
                </div>
                
                <TeamLogo teamName={team.name} logo={team.logo} />
                
                <h3 className="font-display text-xl text-white mb-1 z-10">{team.name}</h3>
                <p className="text-sm text-gray-400 font-sans mb-4 z-10">{team.city || "-"}</p>
                
                <div className="w-full grid grid-cols-2 gap-2 border-t border-dark-border pt-4 mt-auto z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Categorias</span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {categoryArray.map((cat: string) => (
                        <span key={cat} className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-display">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-dark-border pl-2 justify-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Atletas</span>
                    <span className="font-display text-sm text-white">{teamAthletesCount}</span>
                  </div>
                </div>
              </Link>
             )
          })}
          {teams.length === 0 && <div className="col-span-1 sm:col-span-2 lg:col-span-4 p-12 text-center text-gray-500 font-display">NENHUMA EQUIPE ENCONTRADA</div>}
        </div>

      </div>
    </div>
  );
}
