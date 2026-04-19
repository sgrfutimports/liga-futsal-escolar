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
  const { data: registrations, refresh: refreshRegistrations } = useSupaData('lfe_registrations', []);
  const { data: gallery, refresh: refreshGallery } = useSupaData('lfe_gallery', []);
  const { data: sponsors, refresh: refreshSponsors } = useSupaData('lfe_sponsors', []);
  const { data: settingsArr, refresh: refreshSettings } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};

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

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
             { id: 'times', label: 'Times', icon: Trophy },
             { id: 'atletas', label: 'Atletas', icon: Users },
             { id: 'inscricoes', label: 'Inscrições', icon: UserCheck },
             { id: 'jogos', label: 'Jogos', icon: Clock },
             { id: 'noticias', label: 'Notícias', icon: Newspaper },
             { id: 'galeria', label: 'Galeria', icon: Home },
             { id: 'sponsors', label: 'Patrocinadores', icon: Shield },
             { id: 'push', label: 'Notificações', icon: Bell },
             { id: 'config', label: 'Configurações', icon: Settings },
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
                      {activeTab === 'inscricoes' && "Novas Inscrições"}
                      {activeTab === 'jogos' && "Calendário & Resultados"}
                      {activeTab === 'noticias' && "Editor de Conteúdo"}
                      {activeTab === 'galeria' && "Galeria de Fotos"}
                      {activeTab === 'sponsors' && "Patrocinadores"}
                      {activeTab === 'push' && "Central de Alertas"}
                      {activeTab === 'config' && "Configurações da Liga"}
                    </h2>
                    <p className="text-gray-500 mt-2 font-sans">
                      {activeTab === 'config' ? "Personalize a identidade visual e regras da competição." : "Gerencie as informações da Liga de Futsal Escolar."}
                    </p>
                 </div>
                 {['times', 'atletas', 'jogos', 'noticias', 'galeria', 'sponsors'].includes(activeTab) && (
                   <button className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-display text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-transform hover:scale-105">
                     <Plus className="w-4 h-4" /> Novo Registro
                   </button>
                 )}
              </div>

              {/* RENDER CONTENT BY TAB */}
              {activeTab === 'dashboard' && <AdminDashboard stats={{ teams, athletes, games, news }} />}
              {activeTab === 'times' && <AdminListTable data={teams} type="teams" />}
              {activeTab === 'atletas' && <AdminListTable data={athletes} type="athletes" />}
              {activeTab === 'inscricoes' && <AdminListTable data={registrations} type="registrations" />}
              {activeTab === 'jogos' && <AdminListTable data={games} type="games" />}
              {activeTab === 'noticias' && <AdminListTable data={news} type="news" />}
              {activeTab === 'galeria' && <AdminListTable data={gallery} type="gallery" />}
              {activeTab === 'sponsors' && <AdminListTable data={sponsors} type="sponsors" />}
              {activeTab === 'push' && <AdminPushPanel />}
              {activeTab === 'config' && <AdminSettingsPanel settings={settings} />}

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

function AdminSettingsPanel({ settings }: { settings: any }) {
  const [formData, setFormData] = useState(settings);

  const handleSave = async () => {
    const { error } = await supabase.from('lfe_settings').upsert({
      id: settings.id || undefined,
      ...formData
    });
    
    if (error) alert("Erro ao salvar: " + error.message);
    else alert("Configurações atualizadas!");
  };

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-300">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          <div className="space-y-2">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-2">Ano da Edição</label>
             <input type="text" value={formData.year || ""} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-2">Vídeo Institucional (URL)</label>
             <input type="text" value={formData.video_url || ""} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors" />
          </div>
          <div className="md:col-span-2 space-y-2">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-2">Categorias Ativas (Separadas por vírgula)</label>
             <input type="text" value={formData.categories || ""} onChange={e => setFormData({...formData, categories: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors" />
             <p className="text-[9px] text-gray-600 mt-2 ml-2 italic">Ex: SUB-11, SUB-12, SUB-13... Isso altera os filtros em todo o site.</p>
          </div>
       </div>
       <button onClick={handleSave} className="bg-primary text-black px-10 py-5 rounded-2xl font-display font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform">
          <Save className="w-5 h-5" /> Salvar Alterações
       </button>
    </div>
  );
}

function AdminPushPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    setLoading(true);
    // Aqui no futuro você integraria com um serviço de push (Firebase ou Edge Function)
    alert("Simulação: Notificação '" + title + "' pronta para envio via Supabase Edge Function.");
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-primary/5 border border-white/5 rounded-[2.5rem] p-12 space-y-8 animate-in slide-in-from-right-4 duration-500">
       <div className="max-w-xl space-y-6">
          <div className="space-y-4">
             <h3 className="text-2xl font-display font-black text-white uppercase italic">Comunicado Geral</h3>
             <p className="text-gray-500 text-sm leading-relaxed">
               As mensagens enviadas aqui aparecerão instantaneamente nos celulares e computadores de todos que ativaram o sininho no portal.
             </p>
          </div>
          
          <div className="space-y-4">
             <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da Notificação (ex: GOL!)" className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-white" />
             <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Mensagem curta e clara..." rows={4} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors text-white" />
          </div>
          
          <button onClick={sendNotification} disabled={loading} className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-2xl font-display font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-colors">
             <Bell className="w-5 h-5" /> {loading ? "Enviando..." : "Disparar Alerta"}
          </button>
       </div>
    </div>
  );
}
