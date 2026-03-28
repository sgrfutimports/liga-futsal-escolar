import React, { useState } from "react";
import { Search, User, Star } from "lucide-react";

export default function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");

  const athletes = [
    { id: 1, name: "João Pedro", team: "Colégio Diocesano", category: "SUB-17", position: "Pivô", goals: 12, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Lucas Silva", team: "Colégio Santa Sofia", category: "SUB-17", position: "Fixo", goals: 9, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Mateus Santos", team: "Colégio XV de Novembro", category: "SUB-15", position: "Ala", goals: 8, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "Gabriel Costa", team: "CMA Garanhuns", category: "SUB-13", position: "Goleiro", goals: 0, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "Pedro Henrique", team: "EREM Garanhuns", category: "SUB-17", position: "Ala", goals: 6, img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop" },
    { id: 6, name: "Rafael Souza", team: "Escola Padre Agobar Valença", category: "SUB-15", position: "Pivô", goals: 5, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
    { id: 7, name: "Thiago Almeida", team: "Escola Simoa Gomes", category: "SUB-11", position: "Fixo", goals: 2, img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop" },
    { id: 8, name: "Bruno Lima", team: "Colégio Santa Joana D'Arc", category: "SUB-17", position: "Ala", goals: 4, img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop" },
  ];

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
              NOSSOS <span className="text-primary">ATLETAS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Os talentos que fazem a Liga de Futsal Escolar acontecer.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-dark-border rounded-md leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm font-sans transition-colors"
              placeholder="Buscar atleta..."
            />
          </div>
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAthletes.map((athlete) => (
            <div key={athlete.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer flex flex-col">
              
              <div className="relative aspect-[3/4] overflow-hidden bg-dark">
                <img 
                  src={athlete.img} 
                  alt={athlete.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                
                {athlete.goals > 10 && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 text-dark fill-current" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-2 py-1 bg-dark/80 backdrop-blur-sm text-primary font-display text-xs rounded mb-2 border border-dark-border">
                    {athlete.category}
                  </span>
                  <h3 className="font-display text-2xl text-white leading-none">{athlete.name}</h3>
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col justify-between">
                <p className="text-sm text-gray-400 font-sans mb-4">{athlete.team}</p>
                
                <div className="grid grid-cols-2 gap-2 border-t border-dark-border pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Posição</span>
                    <span className="font-display text-sm text-white">{athlete.position}</span>
                  </div>
                  <div className="flex flex-col border-l border-dark-border pl-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gols</span>
                    <span className="font-display text-sm text-primary">{athlete.goals}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
