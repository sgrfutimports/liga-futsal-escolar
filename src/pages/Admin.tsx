import { useState, useMemo } from "react";
import { Lock, Settings, Users, Trophy, Calendar, Database, Search, Filter, Check, X, Eye, Plus, Edit, Trash, Activity } from "lucide-react";
import { cn } from "@/src/lib/utils";

// --- Mock Data ---
const initialRegistrations = [
  { id: 1, date: "2026-03-27", school: "Colégio Santa Cruz", resp: "Carlos Silva", status: "Pendente" },
  { id: 2, date: "2026-03-26", school: "Colégio Diocesano", resp: "Marcos Paulo", status: "Aprovado" },
  { id: 3, date: "2026-03-25", school: "Colégio Santa Sofia", resp: "Ana Souza", status: "Aprovado" },
  { id: 4, date: "2026-03-24", school: "Escola Simoa Gomes", resp: "Paulo Freire", status: "Rejeitado" },
];

const initialTeams = [
  { id: 1, name: "Colégio Diocesano", city: "Garanhuns", founded: 1915, categories: "SUB-15, SUB-17" },
  { id: 2, name: "Colégio Santa Sofia", city: "Garanhuns", founded: 1940, categories: "SUB-15, SUB-17" },
];

const initialAthletes = [
  { id: 1, name: "João Silva", teamId: 1, number: 10, category: "SUB-17", goals: 5 },
  { id: 2, name: "Pedro Santos", teamId: 2, number: 9, category: "SUB-15", goals: 3 },
];

const initialGames = [
  { id: 1, date: "2026-04-10", time: "14:00", location: "Ginásio do SESC", homeTeamId: 1, awayTeamId: 2, homeScore: 0, awayScore: 0, status: "Agendado" },
];

// --- Sub-components ---

function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark">
          <h3 className="text-xl font-display text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Global State
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [teams, setTeams] = useState(initialTeams);
  const [athletes, setAthletes] = useState(initialAthletes);
  const [games, setGames] = useState(initialGames);

  // Modal States
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<any>(null);

  const [isAthleteModalOpen, setAthleteModalOpen] = useState(false);
  const [currentAthlete, setCurrentAthlete] = useState<any>(null);

  const [isGameModalOpen, setGameModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<any>(null);

  // Common styles
  const inputClass = "w-full px-4 py-2 bg-dark border border-dark-border rounded focus:outline-none focus:border-primary text-white transition-colors text-sm mb-4";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider";

  // Handlers
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeam.id) {
      setTeams(teams.map(t => t.id === currentTeam.id ? currentTeam : t));
    } else {
      setTeams([...teams, { ...currentTeam, id: Date.now() }]);
    }
    setTeamModalOpen(false);
  };

  const handleSaveAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAthlete.id) {
      setAthletes(athletes.map(a => a.id === currentAthlete.id ? currentAthlete : a));
    } else {
      setAthletes([...athletes, { ...currentAthlete, id: Date.now(), goals: currentAthlete.goals || 0 }]);
    }
    setAthleteModalOpen(false);
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGame.id) {
      setGames(games.map(g => g.id === currentGame.id ? currentGame : g));
    } else {
      setGames([...games, { ...currentGame, id: Date.now() }]);
    }
    setGameModalOpen(false);
  };

  // Render Functions for Tabs
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "EQUIPES ATIVAS", value: teams.length },
          { label: "ATLETAS INSCRITOS", value: athletes.length },
          { label: "JOGOS AGENDADOS", value: games.length },
          { label: "INSCRIÇÕES PENDENTES", value: registrations.filter(r => r.status === 'Pendente').length },
        ].map((stat, idx) => (
          <div key={idx} className="bg-dark-card border border-dark-border rounded-xl p-6">
            <span className="text-xs text-gray-500 font-display tracking-wider">{stat.label}</span>
            <div className="text-4xl font-display text-primary mt-2">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="font-display text-xl text-white mb-6">AÇÕES RÁPIDAS</h3>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => { setCurrentTeam({}); setTeamModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Nova Equipe
          </button>
          <button onClick={() => { setCurrentAthlete({}); setAthleteModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Novo Atleta
          </button>
          <button onClick={() => { setCurrentGame({}); setGameModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Novo Jogo
          </button>
        </div>
      </div>
    </>
  );

  const renderTeams = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-white">GERENCIAR EQUIPES</h3>
        <button onClick={() => { setCurrentTeam({}); setTeamModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded hover:bg-primary-dark transition-all text-sm font-semibold">
          <Plus className="w-4 h-4" /> Adicionar Equipe
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-display text-xs border-b border-dark-border">
              <th className="pb-4">ID</th>
              <th className="pb-4">NOME DA EQUIPE</th>
              <th className="pb-4">CIDADE</th>
              <th className="pb-4">CATEGORIAS</th>
              <th className="pb-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id} className="border-b border-dark-border/50 hover:bg-dark">
                <td className="py-4 text-sm text-gray-400">#{team.id}</td>
                <td className="py-4 font-display text-white">{team.name}</td>
                <td className="py-4 text-sm text-gray-400">{team.city}</td>
                <td className="py-4 text-sm text-gray-400">{team.categories}</td>
                <td className="py-4 text-right">
                  <button onClick={() => { setCurrentTeam(team); setTeamModalOpen(true); }} className="p-2 text-primary hover:bg-primary/10 rounded mr-2"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setTeams(teams.filter(t => t.id !== team.id))} className="p-2 text-danger hover:bg-danger/10 rounded"><Trash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAthletes = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-white">GERENCIAR ATLETAS</h3>
        <button onClick={() => { setCurrentAthlete({}); setAthleteModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded hover:bg-primary-dark transition-all text-sm font-semibold">
          <Plus className="w-4 h-4" /> Adicionar Atleta
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-display text-xs border-b border-dark-border">
              <th className="pb-4">NOME</th>
              <th className="pb-4">EQUIPE</th>
              <th className="pb-4">NÚMERO</th>
              <th className="pb-4">CATEGORIA</th>
              <th className="pb-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map(athlete => {
              const team = teams.find(t => t.id === Number(athlete.teamId));
              return (
                <tr key={athlete.id} className="border-b border-dark-border/50 hover:bg-dark">
                  <td className="py-4 font-display text-white">{athlete.name}</td>
                  <td className="py-4 text-sm text-gray-400">{team ? team.name : "Desconhecida"}</td>
                  <td className="py-4 text-sm text-gray-400">{athlete.number}</td>
                  <td className="py-4 text-sm text-gray-400">{athlete.category}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => { setCurrentAthlete({ ...athlete, teamId: Number(athlete.teamId) }); setAthleteModalOpen(true); }} className="p-2 text-primary hover:bg-primary/10 rounded mr-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setAthletes(athletes.filter(a => a.id !== athlete.id))} className="p-2 text-danger hover:bg-danger/10 rounded"><Trash className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-white">GERENCIAR JOGOS & PLACARES</h3>
        <button onClick={() => { setCurrentGame({}); setGameModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded hover:bg-primary-dark transition-all text-sm font-semibold">
          <Plus className="w-4 h-4" /> Agendar Jogo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-display text-xs border-b border-dark-border">
              <th className="pb-4">DATA / HORA</th>
              <th className="pb-4">CONFRONTO</th>
              <th className="pb-4">PLACAR</th>
              <th className="pb-4">STATUS</th>
              <th className="pb-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => {
              const home = teams.find(t => t.id === Number(game.homeTeamId))?.name || "Time A";
              const away = teams.find(t => t.id === Number(game.awayTeamId))?.name || "Time B";
              return (
                <tr key={game.id} className="border-b border-dark-border/50 hover:bg-dark">
                  <td className="py-4 text-sm text-gray-400">{game.date} às {game.time}</td>
                  <td className="py-4 font-display text-white">{home} vs {away}</td>
                  <td className="py-4 font-display text-primary">{game.status === 'Finalizado' ? `${game.homeScore} - ${game.awayScore}` : '-'}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-display rounded uppercase tracking-wider border",
                      game.status === "Finalizado" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"
                    )}>{game.status}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => { setCurrentGame({ ...game, homeTeamId: Number(game.homeTeamId), awayTeamId: Number(game.awayTeamId) }); setGameModalOpen(true); }} className="p-2 text-primary hover:bg-primary/10 rounded mr-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setGames(games.filter(g => g.id !== game.id))} className="p-2 text-danger hover:bg-danger/10 rounded"><Trash className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRegistrations = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <h3 className="font-display text-xl text-white mb-6">INSCRIÇÕES</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-display text-xs border-b border-dark-border">
              <th className="pb-4">DATA</th>
              <th className="pb-4">ESCOLA</th>
              <th className="pb-4">STATUS</th>
              <th className="pb-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} className="border-b border-dark-border/50 hover:bg-dark">
                <td className="py-4 text-sm text-gray-400">{reg.date}</td>
                <td className="py-4 font-display text-white">{reg.school}</td>
                <td className="py-4">
                  <span className={cn(
                    "px-2 py-1 text-[10px] font-display rounded uppercase tracking-wider border",
                    reg.status === "Aprovado" ? "bg-primary/10 text-primary border-primary/20" : 
                    reg.status === "Rejeitado" ? "bg-danger/10 text-danger border-danger/20" :
                    "bg-secondary/10 text-secondary border-secondary/20"
                  )}>{reg.status}</span>
                </td>
                <td className="py-4 text-right">
                  {reg.status === 'Pendente' && (
                    <>
                      <button onClick={() => setRegistrations(registrations.map(r => r.id === reg.id ? { ...r, status: 'Aprovado' } : r))} className="p-2 text-primary hover:bg-primary/10 rounded mr-2"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setRegistrations(registrations.map(r => r.id === reg.id ? { ...r, status: 'Rejeitado' } : r))} className="p-2 text-danger hover:bg-danger/10 rounded"><X className="w-4 h-4" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-2xl">
      <h3 className="font-display text-xl text-white mb-6">CONFIGURAÇÕES GERAIS</h3>
      <form onSubmit={(e) => { e.preventDefault(); alert("Configurações salvas (Mock)!"); }}>
        <label className={labelClass}>Nome do Evento</label>
        <input type="text" className={inputClass} defaultValue="Liga de Futsal Escolar" />
        
        <label className={labelClass}>Ano / Edição</label>
        <input type="text" className={inputClass} defaultValue="2026" />
        
        <label className={labelClass}>Período de Inscrições</label>
        <select className={inputClass}>
          <option value="aberto">Aberto</option>
          <option value="fechado">Fechado</option>
        </select>
        
        <button type="submit" className="mt-4 px-6 py-2 bg-primary text-dark font-display rounded hover:bg-primary-dark transition-all">Salvar Configurações</button>
      </form>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-border">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-white mb-8 text-center">ÁREA RESTRITA</h2>
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-6">
            <div>
              <label className={labelClass}>E-mail</label>
              <input type="email" required className={inputClass} placeholder="admin@lfe.com" defaultValue="admin@lfe.com" />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input type="password" required className={inputClass} placeholder="••••••••" defaultValue="123456" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-dark font-display text-lg rounded hover:bg-primary-dark transition-colors">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-card border-r border-dark-border flex-shrink-0">
        <div className="p-6 border-b border-dark-border">
          <h2 className="font-display text-2xl text-white">PAINEL ADMIN</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: "Dashboard", icon: Activity },
            { id: "Equipes", icon: Shield },
            { id: "Atletas", icon: Users },
            { id: "Jogos", icon: Calendar },
            { id: "Inscrições", icon: Database },
            { id: "Configurações", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded font-display text-sm transition-colors uppercase tracking-wider",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-400 hover:bg-dark hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-display text-white uppercase">{activeTab}</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-dark-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors font-display text-sm"
          >
            SAIR
          </button>
        </div>

        {activeTab === "Dashboard" && renderDashboard()}
        {activeTab === "Equipes" && renderTeams()}
        {activeTab === "Atletas" && renderAthletes()}
        {activeTab === "Jogos" && renderGames()}
        {activeTab === "Inscrições" && renderRegistrations()}
        {activeTab === "Configurações" && renderSettings()}
      </main>

      {/* Team Modal */}
      <Modal isOpen={isTeamModalOpen} onClose={() => setTeamModalOpen(false)} title={currentTeam?.id ? "Editar Equipe" : "Nova Equipe"}>
        <form onSubmit={handleSaveTeam}>
          <label className={labelClass}>Nome da Equipe</label>
          <input required type="text" className={inputClass} value={currentTeam?.name || ''} onChange={e => setCurrentTeam({...currentTeam, name: e.target.value})} />
          
          <label className={labelClass}>Cidade</label>
          <input required type="text" className={inputClass} value={currentTeam?.city || ''} onChange={e => setCurrentTeam({...currentTeam, city: e.target.value})} />
          
          <label className={labelClass}>Categorias (Ex: SUB-15, SUB-17)</label>
          <input required type="text" className={inputClass} value={currentTeam?.categories || ''} onChange={e => setCurrentTeam({...currentTeam, categories: e.target.value})} />
          
          <button type="submit" className="w-full py-2 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      {/* Athlete Modal */}
      <Modal isOpen={isAthleteModalOpen} onClose={() => setAthleteModalOpen(false)} title={currentAthlete?.id ? "Editar Atleta" : "Novo Atleta"}>
        <form onSubmit={handleSaveAthlete}>
          <label className={labelClass}>Nome</label>
          <input required type="text" className={inputClass} value={currentAthlete?.name || ''} onChange={e => setCurrentAthlete({...currentAthlete, name: e.target.value})} />
          
          <label className={labelClass}>Equipe</label>
          <select required className={inputClass} value={currentAthlete?.teamId || ''} onChange={e => setCurrentAthlete({...currentAthlete, teamId: e.target.value})}>
            <option value="">Selecione uma equipe</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <label className={labelClass}>Número da Camisa</label>
          <input required type="number" className={inputClass} value={currentAthlete?.number || ''} onChange={e => setCurrentAthlete({...currentAthlete, number: e.target.value})} />
          
          <label className={labelClass}>Categoria</label>
          <select required className={inputClass} value={currentAthlete?.category || ''} onChange={e => setCurrentAthlete({...currentAthlete, category: e.target.value})}>
             <option value="">Selecione a categoria</option>
             <option value="SUB-11">SUB-11</option>
             <option value="SUB-13">SUB-13</option>
             <option value="SUB-15">SUB-15</option>
             <option value="SUB-17">SUB-17</option>
          </select>

          <button type="submit" className="w-full py-2 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      {/* Game Modal */}
      <Modal isOpen={isGameModalOpen} onClose={() => setGameModalOpen(false)} title={currentGame?.id ? "Editar Jogo" : "Agendar Jogo"}>
        <form onSubmit={handleSaveGame}>
          <label className={labelClass}>Equipe Casa</label>
          <select required className={inputClass} value={currentGame?.homeTeamId || ''} onChange={e => setCurrentGame({...currentGame, homeTeamId: e.target.value})}>
            <option value="">Selecione</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <label className={labelClass}>Equipe Fora</label>
          <select required className={inputClass} value={currentGame?.awayTeamId || ''} onChange={e => setCurrentGame({...currentGame, awayTeamId: e.target.value})}>
            <option value="">Selecione</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Data</label>
              <input required type="date" className={inputClass} value={currentGame?.date || ''} onChange={e => setCurrentGame({...currentGame, date: e.target.value})} />
            </div>
            <div className="flex-1">
               <label className={labelClass}>Hora</label>
               <input required type="time" className={inputClass} value={currentGame?.time || ''} onChange={e => setCurrentGame({...currentGame, time: e.target.value})} />
            </div>
          </div>

          <label className={labelClass}>Local</label>
          <input required type="text" className={inputClass} value={currentGame?.location || ''} onChange={e => setCurrentGame({...currentGame, location: e.target.value})} />

          <label className={labelClass}>Status</label>
          <select required className={inputClass} value={currentGame?.status || ''} onChange={e => setCurrentGame({...currentGame, status: e.target.value})}>
             <option value="Agendado">Agendado</option>
             <option value="Em Andamento">Em Andamento</option>
             <option value="Finalizado">Finalizado</option>
          </select>

          {currentGame?.status === 'Finalizado' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Gols (Casa)</label>
                <input type="number" className={inputClass} value={currentGame?.homeScore || 0} onChange={e => setCurrentGame({...currentGame, homeScore: e.target.value})} />
              </div>
              <div className="flex-1">
                 <label className={labelClass}>Gols (Fora)</label>
                 <input type="number" className={inputClass} value={currentGame?.awayScore || 0} onChange={e => setCurrentGame({...currentGame, awayScore: e.target.value})} />
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

    </div>
  );
}

