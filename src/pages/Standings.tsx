import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Trophy, Shield, Goal, Star, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";

const TeamLogoSmall = ({ teamId, teamName, className }: { teamId: number, teamName: string, className?: string }) => {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem(`team_logo_${teamId}`);
    if (savedLogo) setLogo(savedLogo);
  }, [teamId]);

  return (
    <div className={cn("bg-dark rounded-full border border-dark-border flex items-center justify-center overflow-hidden shrink-0", className)}>
      {logo ? (
        <img src={logo} alt={teamName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span className="text-[10px] text-gray-500 font-display">
          {teamName.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const categories = ["SUB-11", "SUB-13", "SUB-15", "SUB-17"];

const mockGames = [
  { id: 1, category: "SUB-17", date: "SÁB, 14 MAI", time: "09:00", homeTeam: "Colégio Diocesano", homeAbbr: "DIO", homeTeamId: 1, awayTeam: "Colégio Santa Sofia", awayAbbr: "SSO", awayTeamId: 2, homeScore: 3, awayScore: 1, location: "Ginásio Principal", status: "FINALIZADO" },
  { id: 2, category: "SUB-17", date: "SÁB, 14 MAI", time: "10:00", homeTeam: "Colégio XV de Novembro", homeAbbr: "XVN", homeTeamId: 3, awayTeam: "CMA Garanhuns", awayAbbr: "CMA", awayTeamId: 4, homeScore: null, awayScore: null, location: "Quadra 2", status: "EM BREVE" },
  { id: 3, category: "SUB-15", date: "DOM, 15 MAI", time: "08:00", homeTeam: "EREM Garanhuns", homeAbbr: "ERE", homeTeamId: 5, awayTeam: "Escola Padre Agobar Valença", awayAbbr: "PAV", awayTeamId: 6, homeScore: 2, awayScore: 2, location: "Ginásio Principal", status: "FINALIZADO" },
  { id: 4, category: "SUB-13", date: "DOM, 15 MAI", time: "09:30", homeTeam: "Escola Simoa Gomes", homeAbbr: "SGO", homeTeamId: 7, awayTeam: "Colégio Santa Joana D'Arc", awayAbbr: "SJD", awayTeamId: 8, homeScore: null, awayScore: null, location: "Quadra 1", status: "EM BREVE" },
  { id: 5, category: "SUB-11", date: "SÁB, 21 MAI", time: "08:00", homeTeam: "Colégio Diocesano", homeAbbr: "DIO", homeTeamId: 1, awayTeam: "Colégio XV de Novembro", awayAbbr: "XVN", awayTeamId: 3, homeScore: null, awayScore: null, location: "Ginásio Principal", status: "EM BREVE" },
  { id: 6, category: "SUB-17", date: "SÁB, 21 MAI", time: "11:00", homeTeam: "EREM Garanhuns", homeAbbr: "ERE", homeTeamId: 5, awayTeam: "Escola Simoa Gomes", awayAbbr: "SGO", awayTeamId: 7, homeScore: null, awayScore: null, location: "Quadra 2", status: "EM BREVE" },
  { id: 7, category: "SUB-15", date: "SÁB, 21 MAI", time: "13:00", homeTeam: "CMA Garanhuns", homeAbbr: "CMA", homeTeamId: 4, awayTeam: "Colégio XV de Novembro", awayAbbr: "XVN", awayTeamId: 3, homeScore: null, awayScore: null, location: "Ginásio Principal", status: "EM BREVE" },
];

export default function Standings() {
  const [activeCategory, setActiveCategory] = useState("SUB-17");
  const [activeTab, setActiveTab] = useState("CLASSIFICACAO");

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            TABELA E <span className="text-primary">ESTATÍSTICAS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Acompanhe o desempenho das equipes, artilharia e resultados atualizados em tempo real.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 font-display text-lg rounded transition-all",
                activeCategory === cat
                  ? "bg-primary text-dark"
                  : "bg-dark-card text-gray-400 border border-dark-border hover:border-primary/50 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-border mb-8 overflow-x-auto hide-scrollbar">
          {["CLASSIFICACAO", "JOGOS", "ARTILHARIA", "MVP"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-4 font-display text-lg whitespace-nowrap transition-colors relative",
                activeTab === tab ? "text-primary" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-1 md:p-6">
          
          {activeTab === "CLASSIFICACAO" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-dark text-gray-400 font-display text-sm border-b border-dark-border">
                    <th className="p-4 font-normal w-16 text-center">POS</th>
                    <th className="p-4 font-normal">EQUIPE</th>
                    <th className="p-4 font-normal text-center" title="Pontos">PTS</th>
                    <th className="p-4 font-normal text-center" title="Jogos">J</th>
                    <th className="p-4 font-normal text-center" title="Vitórias">V</th>
                    <th className="p-4 font-normal text-center" title="Empates">E</th>
                    <th className="p-4 font-normal text-center" title="Derrotas">D</th>
                    <th className="p-4 font-normal text-center" title="Gols Pró">GP</th>
                    <th className="p-4 font-normal text-center" title="Gols Contra">GC</th>
                    <th className="p-4 font-normal text-center" title="Saldo de Gols">SG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, pos: 1, name: "Colégio Diocesano", pts: 15, j: 5, v: 5, e: 0, d: 0, gp: 25, gc: 5, sg: 20 },
                    { id: 2, pos: 2, name: "Colégio Santa Sofia", pts: 12, j: 5, v: 4, e: 0, d: 1, gp: 18, gc: 8, sg: 10 },
                    { id: 3, pos: 3, name: "Colégio XV de Novembro", pts: 10, j: 5, v: 3, e: 1, d: 1, gp: 15, gc: 10, sg: 5 },
                    { id: 4, pos: 4, name: "CMA Garanhuns", pts: 9, j: 5, v: 3, e: 0, d: 2, gp: 12, gc: 12, sg: 0 },
                    { id: 5, pos: 5, name: "EREM Garanhuns", pts: 7, j: 5, v: 2, e: 1, d: 2, gp: 10, gc: 15, sg: -5 },
                    { id: 6, pos: 6, name: "Escola Padre Agobar Valença", pts: 4, j: 5, v: 1, e: 1, d: 3, gp: 8, gc: 20, sg: -12 },
                    { id: 7, pos: 7, name: "Escola Simoa Gomes", pts: 1, j: 5, v: 0, e: 1, d: 4, gp: 5, gc: 25, sg: -20 },
                  ].map((team, idx) => (
                    <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark transition-colors">
                      <td className="p-4 font-display text-center">
                        <span className={cn(
                          "w-8 h-8 rounded flex items-center justify-center text-sm mx-auto",
                          team.pos <= 4 ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-400"
                        )}>
                          {team.pos}
                        </span>
                      </td>
                      <td className="p-4 font-display text-lg">
                        <Link to={`/equipes/${team.id}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                          <TeamLogoSmall teamId={team.id} teamName={team.name} className="w-8 h-8 group-hover:border-primary transition-colors" />
                          {team.name}
                        </Link>
                      </td>
                      <td className="p-4 font-display text-xl text-primary text-center font-bold">{team.pts}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.j}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.v}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.e}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.d}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.gp}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.gc}</td>
                      <td className="p-4 font-display text-gray-400 text-center">{team.sg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex gap-4 text-xs font-sans text-gray-500 border-t border-dark-border mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded" />
                  <span>Classificados para as Quartas de Final</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ARTILHARIA" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {[
                { pos: 1, name: "João Pedro", team: "Colégio Diocesano", teamId: 1, goals: 12, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop" },
                { pos: 2, name: "Lucas Silva", team: "Colégio Santa Sofia", teamId: 2, goals: 9, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
                { pos: 3, name: "Mateus Santos", team: "Colégio XV de Novembro", teamId: 3, goals: 8, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
                { pos: 4, name: "Gabriel Costa", team: "CMA Garanhuns", teamId: 4, goals: 7, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
                { pos: 5, name: "Pedro Henrique", team: "EREM Garanhuns", teamId: 5, goals: 6, img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop" },
              ].map((player) => (
                <div key={player.pos} className="flex items-center gap-4 bg-dark p-4 rounded-lg border border-dark-border relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Goal className="w-32 h-32" />
                  </div>
                  <div className="font-display text-3xl text-gray-600 w-8 text-center">
                    {player.pos}
                  </div>
                  <img src={player.img} alt={player.name} className="w-16 h-16 rounded-full object-cover border-2 border-dark-border group-hover:border-primary transition-colors" referrerPolicy="no-referrer" />
                  <div className="flex-grow z-10">
                    <h4 className="font-display text-lg text-white">{player.name}</h4>
                    <Link to={`/equipes/${player.teamId}`} className="text-xs text-gray-400 font-sans hover:text-primary transition-colors flex items-center gap-1.5">
                      <TeamLogoSmall teamId={player.teamId} teamName={player.team} className="w-4 h-4" />
                      {player.team}
                    </Link>
                  </div>
                  <div className="text-right z-10">
                    <span className="block font-display text-3xl text-primary leading-none">{player.goals}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gols</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "JOGOS" && (
            <div className="p-4 space-y-4">
              {mockGames.filter(g => g.category === activeCategory).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockGames.filter(g => g.category === activeCategory).map(game => (
                    <div key={game.id} className="bg-dark border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-center mb-4 text-xs font-display text-gray-400">
                        <span>{game.date} - {game.time}</span>
                        <span className={cn(
                          "px-2 py-1 rounded",
                          game.status === "FINALIZADO" ? "bg-dark-card text-gray-500 border border-dark-border" : "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {game.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link to={`/equipes/${game.homeTeamId}`} className="flex flex-col items-center gap-2 w-1/3 group/team">
                          <TeamLogoSmall teamId={game.homeTeamId} teamName={game.homeTeam} className="w-12 h-12 border border-dark-border group-hover/team:border-primary transition-colors" />
                          <span className="font-display text-sm text-center group-hover/team:text-primary transition-colors">{game.homeTeam}</span>
                        </Link>
                        
                        <div className="w-1/3 flex flex-col items-center justify-center">
                          {game.status === "FINALIZADO" ? (
                            <div className="flex items-center gap-3 font-display text-3xl text-white">
                              <span>{game.homeScore}</span>
                              <span className="text-gray-600 text-xl">X</span>
                              <span>{game.awayScore}</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-display text-gray-600">VS</span>
                          )}
                          <span className="text-xs text-gray-500 mt-2 text-center">{game.location}</span>
                        </div>

                        <Link to={`/equipes/${game.awayTeamId}`} className="flex flex-col items-center gap-2 w-1/3 group/team">
                          <TeamLogoSmall teamId={game.awayTeamId} teamName={game.awayTeam} className="w-12 h-12 border border-dark-border group-hover/team:border-primary transition-colors" />
                          <span className="font-display text-sm text-center group-hover/team:text-primary transition-colors">{game.awayTeam}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                  <Calendar className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-display text-xl">NENHUM JOGO ENCONTRADO PARA ESTA CATEGORIA</p>
                </div>
              )}
            </div>
          )}

          {/* Placeholder for MVP tab */}
          {activeTab === "MVP" && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <Trophy className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-display text-xl">CONTEÚDO EM ATUALIZAÇÃO</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
