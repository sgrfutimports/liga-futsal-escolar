import React, { useState } from "react";
import { Search, User, Star, Users } from "lucide-react";
import { getStoredData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("TODOS");
  
  const allAthletes = getStoredData('athletes') || [];
  const allTeams = getStoredData('teams') || [];

  const filteredAthletes = allAthletes.filter((athlete: any) => {
    const matchesSearch = athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || athlete.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["TODOS", "SUB-10", "SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

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
              <div key={athlete.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer flex flex-col">
                
                <div className="relative aspect-[3/4] overflow-hidden bg-dark flex flex-col items-center justify-center">
                  {athlete.photo ? (
                    <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <Users className="w-24 h-24 text-gray-700 opacity-20" />
                  )}
                  {athlete.photo && <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />}
                  
                  {athlete.goals > 10 && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-dark fill-current" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2 py-1 bg-dark/80 backdrop-blur-sm text-primary font-display text-xs rounded mb-2 border border-dark-border">
                      {athlete.category || "SUB-XX"}
                    </span>
                    <h3 className="font-display text-2xl text-white leading-none">{athlete.name}</h3>
                  </div>
                </div>
                
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <p className="text-sm text-gray-400 font-sans mb-4">{team?.name || "Sem Equipe"}</p>
                  
                  <div className="grid grid-cols-2 gap-2 border-t border-dark-border pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Número</span>
                      <span className="font-display text-sm text-white">#{athlete.number || "-"}</span>
                    </div>
                    <div className="flex flex-col border-l border-dark-border pl-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gols</span>
                      <span className="font-display text-sm text-primary">{athlete.goals || 0}</span>
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
