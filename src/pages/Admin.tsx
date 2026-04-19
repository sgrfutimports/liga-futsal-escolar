import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Trophy, Newspaper, 
  Settings, LogOut, Search, Plus, Trash2, 
  Edit3, CheckCircle, Clock, AlertCircle,
  Menu, X, Home, Save, UserCheck, Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSupaData, supaFetch } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  
  // Data State
  const { data: teams, refresh: refreshTeams } = useSupaData('lfe_teams', []);
  const { data: athletes, refresh: refreshAthletes } = useSupaData('lfe_athletes', []);
  const { data: games, refresh: refreshGames } = useSupaData('lfe_games', []);
  const { data: news, refresh: refreshNews } = useSupaData('lfe_news', []);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      } else {
        setIsLogged(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin/login");
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('lfe_admin_authenticated');
    navigate("/admin/login");
  };

  if (!isLogged) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      
      {/* 1. SIDEBAR */}
      <aside className={cn(
        "bg-[#0f172a] border-r border-white/5 transition-all duration-300 flex flex-col z-50",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
             <Shield className="w-6 h-6 text-black" />
           </div>
           {sidebarOpen && <span className="font-display font-black text-xl uppercase tracking-tighter">Admin <span className="text-primary">LFE</span></span>}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
             { id: 'times', label: 'Times', icon: Trophy },
             { id: 'atletas', label: 'Atletas', icon: Users },
             { id: 'jogos', label: 'Jogos', icon: Clock },
             { id: 'noticias', label: 'Notícias', icon: Newspaper },
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={cn(
                 "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-display text-xs uppercase tracking-widest",
                 activeTab === item.id 
                   ? "bg-primary text-black shadow-lg shadow-primary/20" 
                   : "text-gray-500 hover:bg-white/5 hover:text-white"
               )}
             >
               <item.icon className="w-5 h-5 shrink-0" />
               {sidebarOpen && <span>{item.label}</span>}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
           <Link to="/" className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-white transition-all font-display text-xs uppercase tracking-widest">
             <Home className="w-5 h-5" />
             {sidebarOpen && <span>Voltar ao Site</span>}
           </Link>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-display text-xs uppercase tracking-widest"
           >
             <LogOut className="w-5 h-5" />
             {sidebarOpen && <span>Sair</span>}
           </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-[#020617]/80 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-4 font-display text-xs uppercase tracking-widest text-gray-500">
               <span>Ambiente de Produção</span>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
           <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* PAGE TITLES */}
              <div className="flex justify-between items-end">
                 <div>
                    <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">
                      {activeTab === 'dashboard' && "Visão Geral"}
                      {activeTab === 'times' && "Gestão de Equipes"}
                      {activeTab === 'atletas' && "Banco de Atletas"}
                      {activeTab === 'jogos' && "Calendário & Resultados"}
                      {activeTab === 'noticias' && "Editor de Conteúdo"}
                    </h2>
                    <p className="text-gray-500 mt-2 font-sans">
                      Gerencie as informações da Liga de Futsal Escolar do Agreste Meridional.
                    </p>
                 </div>
                 {activeTab !== 'dashboard' && (
                   <button className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-display text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-transform hover:scale-105">
                     <Plus className="w-4 h-4" /> Novo Registro
                   </button>
                 )}
              </div>

              {/* RENDER CONTENT BY TAB */}
              {activeTab === 'dashboard' && <AdminDashboard stats={{ teams, athletes, games, news }} />}
              {activeTab === 'times' && <AdminListTable data={teams} type="teams" />}
              {activeTab === 'atletas' && <AdminListTable data={athletes} type="athletes" />}
              {activeTab === 'jogos' && <AdminListTable data={games} type="games" />}
              {activeTab === 'noticias' && <AdminListTable data={news} type="news" />}

           </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function AdminDashboard({ stats }: { stats: any }) {
  const cards = [
    { label: "Total de Times", value: stats.teams.length, icon: Trophy, color: "text-primary" },
    { label: "Atletas Inscritos", value: stats.athletes.length, icon: Users, color: "text-blue-400" },
    { label: "Jogos Cadastrados", value: stats.games.length, icon: Clock, color: "text-green-400" },
    { label: "Notícias Publicadas", value: stats.news.length, icon: Newspaper, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 p-8 rounded-[2rem] hover:border-primary/20 transition-all group">
             <card.icon className={cn("w-10 h-10 mb-6 transition-transform group-hover:scale-110", card.color)} />
             <p className="text-gray-500 font-display text-[10px] uppercase tracking-widest mb-1">{card.label}</p>
             <h4 className="text-5xl font-display font-black text-white">{card.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3">
               <UserCheck className="w-5 h-5 text-primary" /> Últimas Atividades
            </h3>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-[#020617] rounded-2xl border border-white/5">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <p className="text-sm text-gray-400">Novo atleta cadastrado na equipe <span className="text-white">Escola Técnica Superior</span></p>
                    <span className="text-[10px] text-gray-600 ml-auto uppercase font-bold tracking-tighter">Há 2 horas</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function AdminListTable({ data, type }: { data: any[], type: string }) {
  const [search, setSearch] = useState("");
  
  const filteredData = data.filter(item => {
    const name = item.name || item.title || item.date || "";
    return String(name).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="flex bg-[#0f172a] rounded-2xl p-4 border border-white/5">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent pl-12 pr-4 outline-none font-display text-sm text-white"
            />
         </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
         <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5">
               <tr>
                  <th className="px-8 py-6 font-display text-[10px] uppercase tracking-[0.2em] text-gray-500">ID / Info</th>
                  <th className="px-8 py-6 font-display text-[10px] uppercase tracking-[0.2em] text-gray-500">Nome / Título</th>
                  <th className="px-8 py-6 font-display text-[10px] uppercase tracking-[0.2em] text-gray-500">Status / Data</th>
                  <th className="px-8 py-6 font-display text-[10px] uppercase tracking-[0.2em] text-gray-500 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {filteredData.map((item) => (
                 <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-mono p-1 bg-white/5 text-gray-400 rounded">
                         {String(item.id).substring(0, 8)}...
                       </span>
                    </td>
                    <td className="px-8 py-6 font-display text-sm font-bold text-white uppercase group-hover:text-primary transition-colors">
                       {item.name || item.title || "---"}
                    </td>
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[9px] font-display font-black uppercase tracking-widest",
                         item.status === 'finalizado' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                       )}>
                         {item.status || item.date || "Ativo"}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-3 bg-white/5 rounded-xl hover:bg-primary hover:text-black transition-all">
                             <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         {filteredData.length === 0 && (
           <div className="py-20 text-center text-gray-600 font-display uppercase tracking-widest text-sm italic">
             Nenhum registro encontrado
           </div>
         )}
      </div>
    </div>
  );
}
