import { useState } from "react";
import { Link } from "react-router";
import { Trophy, Shield, Goal, Star, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSupaData } from "@/src/lib/store";

const TeamLogoSmall = ({ teamId, teamName, logo, className }: { teamId: number, teamName: string, logo?: string, className?: string }) => {
  return (
    <div className={cn("bg-dark rounded-full border border-dark-border flex items-center justify-center overflow-hidden shrink-0", className)}>
      {logo ? (
        <img src={logo} alt={teamName} className="w-full h-full object-contain p-0.5 bg-white" referrerPolicy="no-referrer" />
      ) : (
        <span className="text-[10px] text-gray-500 font-display">
          {teamName ? String(teamName).substring(0, 2).toUpperCase() : "??"}
        </span>
      )}
    </div>
  );
};

const categories = ["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"];

export default function Standings() {
  const [activeCategory, setActiveCategory] = useState("SUB-17");
  const [activeTab, setActiveTab] = useState("CLASSIFICACAO");

  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);
  const { data: athletes } = useSupaData('lfe_athletes', []);

  // Filter games by active category
  const categoryGames = games.filter((g: any) => g.category === activeCategory);

  // Filter teams that have this category
  const categoryTeams = teams.filter((t: any) => String(t.categories || "").includes(activeCategory));

  // 1. Standings calculation
  const standings = categoryTeams.map((t: any) => {
    let pts = 0, j = 0, v = 0, e = 0, d = 0, gp = 0, gc = 0;
    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado') {
        const homeScore = Number(g.home_score ?? g.homeScore ?? 0);
        const awayScore = Number(g.away_score ?? g.awayScore ?? 0);
        const homeId = String(g.home_team_id || g.homeTeamId || '').toLowerCase().trim();
        const awayId = String(g.away_team_id || g.awayTeamId || '').toLowerCase().trim();
        const currentId = String(t.id || '').toLowerCase().trim();

        if (homeId === currentId) {
          j++; gp += homeScore; gc += awayScore;
          if (homeScore > awayScore) v++;
          else if (homeScore === awayScore) e++;
          else d++;
        } else if (awayId === currentId) {
          j++; gp += awayScore; gc += homeScore;
          if (awayScore > homeScore) v++;
          else if (awayScore === homeScore) e++;
          else d++;
        }
      }
    });
    pts = (v * 3) + (e * 1);
    const sg = gp - gc;
    return { ...t, pts, j, v, e, d, gp, gc, sg };
  }).sort((a: any, b: any) => b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp)
    .map((t: any, idx: number) => ({ ...t, pos: idx + 1 }));

  // 2. Artilharia calculation
  // Computes goals strictly from Game Events for this category
  const playerStats = athletes.map((a: any) => {
    let goals = 0;
    let yellows = 0;
    let reds = 0;

    // Add baseline goals if defined manually in Athlete modal
    if (a.goals && !isNaN(a.goals)) goals += Number(a.goals);

    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado' && g.events) {
        g.events.forEach((ev: any) => {
          if (String(ev.playerId || ev.player_id) === String(a.id)) {
            if (ev.type === 'goal') goals++;
            if (ev.type === 'yellow') yellows++;
            if (ev.type === 'red') reds++;
          }
        });
      }
    });
    return { ...a, computedGoals: goals, yellows, reds };
  });

  const topScorers = playerStats
    .filter((p: any) => p.computedGoals > 0 && p.category === activeCategory)
    .sort((a: any, b: any) => b.computedGoals - a.computedGoals)
    .slice(0, 10);

  // 3. Team Statistics (Cards / Disciplina)
  const teamStats = categoryTeams.map((t: any) => {
    let teamYellows = 0, teamReds = 0;
    categoryGames.forEach((g: any) => {
      if (String(g.status || '').toLowerCase() === 'finalizado' && g.events) {
        g.events.forEach((ev: any) => {
          if (String(ev.teamId || ev.team_id) === String(t.id)) {
            if (ev.type === 'yellow') teamYellows++;
            if (ev.type === 'red') teamReds++;
          }
        });
      }
    });
    return { ...t, teamYellows, teamReds };
  }).sort((a: any, b: any) => a.teamReds - b.teamReds || a.teamYellows - b.teamYellows);

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            TABELA E <span className="text-primary">ESTATÍSTICAS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Acompanhe o desempenho das equipes, artilharia, resultados e cartões de forma automatizada.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 font-display text-lg rounded transition-all",
                activeCategory === cat ? "bg-primary text-dark" : "bg-dark-card text-gray-400 border border-dark-border hover:border-primary/50 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex border-b border-dark-border mb-8 overflow-x-auto hide-scrollbar">
          {["CLASSIFICACAO", "JOGOS", "ARTILHARIA", "ESTATISTICAS"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-6 py-4 font-display text-lg whitespace-nowrap transition-colors relative", activeTab === tab ? "text-primary" : "text-gray-500 hover:text-gray-300")}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

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
                  {standings.map((team: any, idx: number) => (
                    <tr key={team.id} className="border-b border-dark-border/50 hover:bg-dark transition-colors">
                      <td className="p-4 font-display text-center">
                        <span className={cn("w-8 h-8 rounded flex items-center justify-center text-sm mx-auto", team.pos <= 4 ? "bg-primary/20 text-primary border border-primary/30" : "text-gray-400")}>
                          {team.pos}
                        </span>
                      </td>
                      <td className="p-4 font-display text-lg">
                        <Link to={`/equipes/${team.id}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                          <TeamLogoSmall teamId={team.id} teamName={team.name} logo={team.logo} className="w-8 h-8 group-hover:border-primary transition-colors" />
                          <span className="truncate max-w-[200px]">{team.name}</span>
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
                  {standings.length === 0 && <tr><td colSpan={10} className="p-8 text-center text-gray-500 font-display">NENHUMA EQUIPE NESTA CATEGORIA</td></tr>}
                </tbody>
              </table>
              <div className="p-4 flex gap-4 text-xs font-sans text-gray-500 border-t border-dark-border mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded" />
                  <span>Classificados para a próxima fase</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ARTILHARIA" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {topScorers.map((player: any, idx: number) => {
                const team = teams.find((t: any) => String(t.id) === String(player.teamId || player.team_id));
                return (
                  <div key={player.id} className="flex items-center gap-4 bg-dark p-4 rounded-lg border border-dark-border relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Goal className="w-32 h-32" /></div>
                    <div className="font-display text-3xl text-gray-600 w-8 text-center">{idx + 1}</div>
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-16 h-16 rounded-full object-cover border-2 border-dark-border group-hover:border-primary transition-colors" />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-dark-border bg-dark flex items-center justify-center text-gray-600"><Goal /></div>
                    )}
                    <div className="flex-grow z-10">
                      <h4 className="font-display text-lg text-white">{player.name}</h4>
                      <Link to={`/equipes/${team?.id}`} className="text-xs text-gray-400 font-sans hover:text-primary transition-colors flex items-center gap-1.5">
                        <TeamLogoSmall teamId={team?.id} teamName={team?.name || ""} logo={team?.logo} className="w-4 h-4" />{team?.name || "Sem equipe"}
                      </Link>
                    </div>
                    <div className="text-right z-10 w-16">
                      <span className="block font-display text-3xl text-primary leading-none">{player.computedGoals || 0}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gols</span>
                    </div>
                  </div>
                );
              })}
              {topScorers.length === 0 && <div className="col-span-3 p-12 text-center flex flex-col items-center justify-center text-gray-500 font-display"><Goal className="w-16 h-16 opacity-20 mb-4" /> NENHUM GOL REGISTRADO NESTA CATEGORIA</div>}
            </div>
          )}

          {activeTab === "JOGOS" && (
            <div className="p-4 space-y-4">
              {categoryGames.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryGames.map((game: any) => {
                    const home = teams.find((t: any) => String(t.id) === String(game.homeTeamId || game.home_team_id));
                    const away = teams.find((t: any) => String(t.id) === String(game.awayTeamId || game.away_team_id));
                    return (
                      <div key={game.id} className="bg-dark border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-center mb-4 text-xs font-display text-gray-400">
                          <span>{game.date} - {game.time} • Categoria {game.category}</span>
                          <span className={cn("px-2 py-1 rounded", game.status === "Finalizado" ? "bg-dark-card text-gray-500 border border-dark-border" : "bg-primary/10 text-primary border border-primary/20")}>
                            {game.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Link to={`/equipes/${home?.id}`} className="flex flex-col items-center gap-2 w-1/3 group/team">
                            <TeamLogoSmall teamId={home?.id} teamName={home?.name || "-"} logo={home?.logo} className="w-12 h-12 border border-dark-border group-hover/team:border-primary transition-colors" />
                            <span className="font-display text-sm text-center group-hover/team:text-primary transition-colors truncate max-w-full">{home?.name || "-"}</span>
                          </Link>

                          <div className="w-1/3 flex flex-col items-center justify-center">
                            {String(game.status || '').toLowerCase() === 'finalizado' ? (
                              <div className="flex items-center gap-3 font-display text-3xl text-white">
                                <span>{game.homeScore ?? game.home_score}</span><span className="text-gray-600 text-xl">X</span><span>{game.awayScore ?? game.away_score}</span>
                              </div>
                            ) : (<span className="text-2xl font-display text-gray-600">VS</span>)}
                            <span className="text-xs text-gray-500 mt-2 text-center truncate w-full px-2">{game.location}</span>
                          </div>

                          <Link to={`/equipes/${away?.id}`} className="flex flex-col items-center gap-2 w-1/3 group/team">
                            <TeamLogoSmall teamId={away?.id} teamName={away?.name || "-"} logo={away?.logo} className="w-12 h-12 border border-dark-border group-hover/team:border-primary transition-colors" />
                            <span className="font-display text-sm text-center group-hover/team:text-primary transition-colors truncate max-w-full">{away?.name || "-"}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                  <Calendar className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-display text-xl">NENHUM JOGO AGENDADO PARA A CATEGORIA {activeCategory}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "ESTATISTICAS" && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark border border-dark-border rounded-xl p-6">
                  <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" /> DISCIPLINA DAS EQUIPES
                  </h3>
                  <div className="space-y-4">
                    {teamStats.map((t: any, idx: number) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-dark-card border border-dark-border rounded hover:border-gray-500 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-display text-lg w-6 text-center">{idx + 1}</span>
                          <TeamLogoSmall teamId={t.id} teamName={t.name} logo={t.logo} className="w-8 h-8" />
                          <span className="font-display text-white text-sm lg:text-base">{t.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-display pr-2">
                          <div className="flex items-center gap-1.5" title="Cartões Amarelos">
                            <div className="w-3 h-4 bg-yellow-500 rounded-sm"></div>
                            <span className="text-white w-4 text-center">{t.teamYellows}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Cartões Vermelhos">
                            <div className="w-3 h-4 bg-red-600 rounded-sm"></div>
                            <span className="text-white w-4 text-center">{t.teamReds}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {teamStats.length === 0 && <p className="text-gray-500 text-sm text-center h-full flex items-center justify-center py-10">Nenhuma equipe para avaliar.</p>}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-dark border border-dark-border rounded-xl p-6">
                    <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" /> RESUMO {activeCategory}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-card p-4 rounded border border-dark-border text-center">
                        <div className="text-4xl font-display text-primary mb-1">{categoryGames.filter((g: any) => g.status === 'Finalizado').length}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Jogos Realizados</div>
                      </div>
                      <div className="bg-dark-card p-4 rounded border border-dark-border text-center">
                        <div className="text-4xl font-display text-primary mb-1">
                          {categoryGames.filter((g: any) => g.status === 'Finalizado').reduce((acc: number, g: any) => acc + (Number(g.homeScore || 0) + Number(g.awayScore || 0)), 0)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Gols Marcados</div>
                      </div>
                      <div className="bg-dark-card p-4 rounded border border-dark-border text-center">
                        <div className="text-4xl font-display text-yellow-500 mb-1">
                          {teamStats.reduce((acc: number, t: any) => acc + t.teamYellows, 0)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Cartões Amarelos</div>
                      </div>
                      <div className="bg-dark-card p-4 rounded border border-dark-border text-center">
                        <div className="text-4xl font-display text-red-500 mb-1">
                          {teamStats.reduce((acc: number, t: any) => acc + t.teamReds, 0)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Cartões Vermelhos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
