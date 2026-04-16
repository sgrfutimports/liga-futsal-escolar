import React, { useState } from "react";
import { Search, User, Star, Users, Trophy, Goal } from "lucide-react";
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
              <div 
                key={athlete.id} 
                className="relative bg-[#001736] border rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer flex flex-col shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(204,255,0,0.15)] aspect-[5/7]"
                style={{
                  borderColor: team?.color || 'rgba(255,255,255,0.05)',
                  boxShadow: team?.color ? `0 10px 30px ${team.color}15` : undefined
                }}
              >
                
                {/* Fundo quadriculado (Blueprint) */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none z-0"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center center'
                  }}
                />

                {/* Distintivo de Categoria (Top Left) - Renderizado apenas na visão "TODOS" */}
                {activeCategory === "TODOS" && (
                  <div className="absolute top-5 left-5 z-20">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-white/10 backdrop-blur-md text-white font-display text-[10px] md:text-xs font-black uppercase tracking-widest rounded border border-white/20 shadow-lg">
                      {athlete.category || "SUB-XX"}
                    </span>
                  </div>
                )}

                {/* Número e Posição do Jogador no Canto Superior Direito */}
                <div className="absolute top-5 right-6 text-white z-20 flex flex-col items-center">
                  <span className="font-display font-black text-6xl md:text-7xl leading-none drop-shadow-md">{athlete.number || "-"}</span>
                  <span className="font-display font-bold text-sm md:text-base text-gray-300 drop-shadow-md tracking-widest uppercase mt-1">
                    {athlete.position || "JOG"}
                  </span>
                </div>

                {/* Logo do Time logo abaixo da Posição */}
                <div className="absolute top-[6.5rem] md:top-[7.5rem] right-7 w-12 h-12 bg-white rounded-full overflow-hidden border border-white/20 shadow-lg z-20 flex items-center justify-center p-1">
                  {team?.logo ? (
                    <img src={team.logo} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Trophy className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Imagem do Jogador */}
                {athlete.photo ? (
                  <img src={athlete.photo} alt={athlete.name} className="absolute inset-0 w-full h-[100%] object-cover object-top z-10 transition-transform duration-700 group-hover:scale-[1.03]" referrerPolicy="no-referrer" />
                ) : (
                  <User className="absolute inset-x-0 bottom-10 mx-auto w-3/4 h-3/4 object-contain text-gray-700 opacity-20 z-10 transition-transform duration-700 group-hover:scale-105" />
                )}
                
                {/* Fade Escuro na Base para Contraste do Nome */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#000b1a] via-[#000e24]/70 to-transparent z-10" />
                
                {/* Sobreposição de Informações de Texto (Nome e Linha) */}
                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end pb-8 px-4 h-full">
                  
                  {/* Divisão do nome para emular o estilo do modelo bruto */}
                  {(() => {
                    const nameParts = athlete.name.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.slice(1).join(' ') || firstName;
                    return (
                      <>
                        <span className="text-white font-display font-bold italic text-lg md:text-xl uppercase leading-none mb-1 tracking-wider drop-shadow-md">
                          {firstName}
                        </span>
                        <h3 className="font-display font-black italic text-[2.5rem] md:text-5xl text-white uppercase leading-none tracking-tighter drop-shadow-xl text-center">
                          {lastName}
                        </h3>
                      </>
                    )
                  })()}

                  {/* Linha Inferior com a Cor do Time */}
                  <div 
                    className="w-16 h-1 mt-4 mb-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                    style={{ backgroundColor: team?.color || 'var(--color-primary)' }}
                  />

                  {/* Informações de Gols Rodapé */}
                  <div className="flex items-center gap-2 text-center bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <Goal className="w-3 h-3 text-white/70" />
                    <span className="font-display text-[10px] md:text-xs text-white/70 uppercase tracking-widest">
                       Gols <strong className="text-white text-sm ml-1">{athlete.goals || 0}</strong>
                    </span>
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
