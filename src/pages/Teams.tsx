import { Search, Shield } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

const TeamLogo = ({ teamId, teamName }: { teamId: number, teamName: string }) => {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem(`team_logo_${teamId}`);
    if (savedLogo) setLogo(savedLogo);
  }, [teamId]);

  return (
    <div className="w-24 h-24 bg-dark rounded-full border-2 border-dark-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-lg group-hover:shadow-primary/20 z-10 overflow-hidden">
      {logo ? (
        <img src={logo} alt={teamName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span className="font-display text-3xl text-gray-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300 inline-block">
          {teamName.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default function Teams() {
  const teams = [
    { id: 1, name: "Colégio Diocesano", categories: ["SUB-13", "SUB-15", "SUB-17"], city: "Garanhuns", players: 45, founded: 1915 },
    { id: 2, name: "Colégio Santa Sofia", categories: ["SUB-15", "SUB-17"], city: "Garanhuns", players: 32, founded: 1940 },
    { id: 3, name: "Colégio XV de Novembro", categories: ["SUB-11", "SUB-13", "SUB-15"], city: "Garanhuns", players: 38, founded: 1900 },
    { id: 4, name: "CMA Garanhuns", categories: ["SUB-13", "SUB-15"], city: "Garanhuns", players: 42, founded: 1970 },
    { id: 5, name: "EREM Garanhuns", categories: ["SUB-15", "SUB-17"], city: "Garanhuns", players: 30, founded: 1950 },
    { id: 6, name: "Escola Padre Agobar Valença", categories: ["SUB-13", "SUB-15"], city: "Garanhuns", players: 26, founded: 1985 },
    { id: 7, name: "Escola Simoa Gomes", categories: ["SUB-11", "SUB-13"], city: "Garanhuns", players: 35, founded: 1960 },
    { id: 8, name: "Colégio Santa Joana D'Arc", categories: ["SUB-17"], city: "Garanhuns", players: 20, founded: 1990 },
  ];

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
              NOSSAS <span className="text-primary">EQUIPES</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Conheça as escolas e projetos que fazem parte da Liga de Futsal Escolar.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-dark-border rounded-md leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm font-sans transition-colors"
              placeholder="Buscar equipe..."
            />
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <Link 
              to={`/equipes/${team.id}`} 
              key={team.id} 
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-all group cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-40 h-40" />
              </div>
              
              <TeamLogo teamId={team.id} teamName={team.name} />
              
              <h3 className="font-display text-xl text-white mb-1 z-10">{team.name}</h3>
              <p className="text-sm text-gray-400 font-sans mb-4 z-10">{team.city}</p>
              
              <div className="w-full grid grid-cols-2 gap-2 border-t border-dark-border pt-4 mt-auto z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Categorias</span>
                  <div className="flex flex-wrap gap-1">
                    {team.categories.map(cat => (
                      <span key={cat} className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-display">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col border-l border-dark-border pl-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Atletas</span>
                  <span className="font-display text-sm text-white">{team.players}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
