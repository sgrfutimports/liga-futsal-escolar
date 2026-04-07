import React, { useState } from "react";
import { Search, User, Star, Users, Trophy } from "lucide-react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const { data: allAthletes } = useSupaData('lfe_athletes', []);
  const { data: allTeams } = useSupaData('lfe_teams', []);
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] ?? {};

  const filteredAthletes = allAthletes.filter((athlete: any) => {
    const matchesSearch = athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || athlete.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["TODOS", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase">
              NOSSOS <span className="text-primary">ATLETAS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Os talentos que fazem a Liga de Futsal Escolar acontecer.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-dark-border rounded-xl leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm font-sans transition-all shadow-lg"
              placeholder="Buscar atleta por nome..."
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-dark-border/30">
          {categories.map((cat) => (
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

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAthletes.map((athlete: any) => {
            const team = allTeams.find((t: any) => t.id === Number(athlete.teamId));
            return (
              <div key={athlete.id} className="relative bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 group cursor-pointer flex flex-col shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(204,255,0,0.1)]">
                
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#050505] flex flex-col items-center justify-center">
                  
                  {/* Marca d'água da Liga ao fundo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-[0.03] flex items-center justify-center pointer-events-none z-0 transform group-hover:scale-110 transition-transform duration-1000 rotate-[-15deg]">
                     {settings.leagueLogo ? <img src={settings.leagueLogo} className="max-w-full max-h-full grayscale" /> : <Trophy className="w-full h-full text-white" />}
                  </div>

                  {/* Gigante Número do Atleta ao Fundo */}
                  <div className="absolute top-2 -right-4 z-0 opacity-10 pointer-events-none group-hover:text-primary transition-colors duration-700">
                     <span className="font-display font-black text-9xl tracking-tighter">{athlete.number || ""}</span>
                  </div>

                  {/* Imagem do Jogador */}
                  {athlete.photo ? (
                    <img src={athlete.photo} alt={athlete.name} className="relative z-10 w-full h-[105%] object-cover object-top filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="relative z-10 w-32 h-32 text-gray-700 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                  )}
                  
                  {/* Filtro Escuro na Base para Leitura */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
                  
                  {/* Estrela de Artilheiro */}
                  {athlete.goals > 10 && (
                    <div className="absolute top-4 left-4 z-20 w-10 h-10 bg-gradient-to-br from-[#ffd700] to-[#b8860b] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)] border border-[#ffd700]/50 transform -rotate-12">
                      <Star className="w-5 h-5 text-dark fill-current" />
                    </div>
                  )}
                  
                  {/* Informações Frontais */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-primary/10 backdrop-blur-md text-primary font-display text-[10px] font-black uppercase tracking-[0.2em] rounded border border-primary/20 mb-3 shadow-[0_0_10px_rgba(204,255,0,0.1)]">
                      {athlete.category || "SUB-XX"}
                    </span>
                    <h3 className="font-display font-black text-2xl md:text-3xl text-white leading-[1.1] uppercase tracking-tighter drop-shadow-lg mb-1">{athlete.name}</h3>
                    <div className="flex items-center gap-2">
                       {team?.logo && <img src={team.logo} className="w-4 h-4 object-contain rounded-full bg-white opacity-80" />}
                       <p className="text-xs text-gray-400 font-sans uppercase tracking-widest">{team?.name || "Sem Equipe"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Rodapé de Estatísticas */}
                <div className="px-5 pb-5 pt-4 bg-[#050505] relative z-20 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center py-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Número</span>
                      <span className="font-display font-black text-xl text-white">#{athlete.number || "-"}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-2.5 bg-primary/5 rounded-xl border border-primary/20 shadow-[inset_0_0_15px_rgba(204,255,0,0.05)]">
                      <span className="text-[9px] text-primary/70 font-bold uppercase tracking-[0.2em] mb-0.5">Gols Pró</span>
                      <span className="font-display font-black text-xl text-primary">{athlete.goals || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredAthletes.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-sans text-lg">
                Nenhum atleta encontrado com o nome "<span className="text-white">{searchQuery}</span>".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
