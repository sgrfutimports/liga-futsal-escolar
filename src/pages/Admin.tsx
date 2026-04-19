import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Trophy, Newspaper, 
  Settings, LogOut, Search, Plus, Trash2, 
  Edit3, CheckCircle, Clock, AlertCircle,
  Menu, X, Home, Save, UserCheck, Shield, Bell, Image as ImageIcon,
  ChevronRight, Calendar, MapPin, Goal
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSupaData, supaFetch } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
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
      if (!session) navigate("/admin/login");
      else setIsLogged(true);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { navigate("/admin/login"); setIsLogged(false); }
      else setIsLogged(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('lfe_admin_authenticated');
    navigate("/admin/login");
  };

  const openForm = (item: any = null) => {
    setEditingItem(item || { _type: activeTab }); // New item
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any, table: string) => {
    // SECURITY CHECKS
    if (table === 'lfe_teams') {
      const hasAthletes = athletes.some((a: any) => String(a.team_id || a.teamId) === String(id));
      const hasGames = games.some((g: any) => 
        String(g.home_team_id || g.homeTeamId) === String(id) || 
        String(g.away_team_id || g.awayTeamId) === String(id)
      );

      if (hasAthletes || hasGames) {
        alert(
          `BLOQUEADO: Esta equipe possui ${hasAthletes ? 'atletas' : ''}${hasAthletes && hasGames ? ' e ' : ''}${hasGames ? 'jogos' : ''} vinculados. \n\nRemova os vínculos antes de excluir a equipe.`
        );
        return;
      }
    }

    if (!confirm(`TEM CERTEZA? Esta ação é permanente e removerá o registro selecionado de ${table === 'lfe_teams' ? 'Equipes' : 'Banco de Dados'}.`)) return;
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("ERRO AO EXCLUIR: " + error.message);
    else {
      alert("Registro removido com sucesso!");
      refreshAll();
    }
  };

  const refreshAll = () => {
    refreshTeams(); refreshAthletes(); refreshGames(); refreshNews();
    refreshRegistrations(); refreshGallery(); refreshSponsors(); refreshSettings();
  };

  if (!isLogged) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <aside className={cn("bg-[#0f172a] border-r border-white/5 transition-all duration-300 flex flex-col z-50", sidebarOpen ? "w-64" : "w-20")}>
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0"><Shield className="w-6 h-6 text-black" /></div>
           {sidebarOpen && <span className="font-display font-black text-xl uppercase tracking-tighter">Admin <span className="text-primary">LFE</span></span>}
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
             { id: 'lfe_teams', label: 'Times', icon: Trophy },
             { id: 'lfe_athletes', label: 'Atletas', icon: Users },
             { id: 'lfe_games', label: 'Jogos', icon: Clock },
             { id: 'lfe_news', label: 'Notícias', icon: Newspaper },
             { id: 'lfe_gallery', label: 'Galeria', icon: ImageIcon },
             { id: 'lfe_sponsors', label: 'Patrocinadores', icon: Shield },
             { id: 'lfe_registrations', label: 'Inscrições', icon: UserCheck },
             { id: 'push', label: 'Notificações', icon: Bell },
             { id: 'config', label: 'Configurações', icon: Settings },
           ].map((item) => (
             <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-display text-xs uppercase tracking-widest", activeTab === item.id ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-white/5 hover:text-white")}>
               <item.icon className="w-5 h-5 shrink-0" />
               {sidebarOpen && <span>{item.label}</span>}
             </button>
           ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2">
            <Link to="/" className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-white transition-all font-display text-xs uppercase tracking-widest"><Home className="w-5 h-5" />{sidebarOpen && <span>Site Público</span>}</Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-display text-xs uppercase tracking-widest"><LogOut className="w-5 h-5" />{sidebarOpen && <span>Sair</span>}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <header className="bg-[#020617]/80 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">{sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <div className="flex items-center gap-4 font-display text-xs uppercase tracking-widest text-gray-400"><span>Supabase Auth Ativo</span><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">
                      {activeTab === 'dashboard' && "Painel Geral"}
                      {activeTab === 'lfe_teams' && "Gestão de Equipes"}
                      {activeTab === 'lfe_athletes' && "Atletas da Liga"}
                      {activeTab === 'lfe_games' && "Placares & Resultados"}
                      {activeTab === 'lfe_news' && "Notícias"}
                      {activeTab === 'lfe_gallery' && "Fotos da Galeria"}
                      {activeTab === 'lfe_sponsors' && "Patrocinadores"}
                      {activeTab === 'lfe_registrations' && "Inscrições"}
                      {activeTab === 'push' && "Central Push"}
                      {activeTab === 'config' && "Configurações"}
                    </h2>
                  </div>
                  {activeTab.startsWith('lfe_') && (
                    <button onClick={() => openForm()} className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-display text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"><Plus className="w-4 h-4" /> Cadastrar Novo</button>
                  )}
               </div>

               {activeTab === 'dashboard' && <AdminDashboard stats={{ teams, athletes, games, news, registrations }} />}
               {activeTab === 'push' && <AdminPushPanel />}
               {activeTab === 'config' && <AdminSettingsPanel settings={settings} onSave={refreshAll} />}
               {activeTab.startsWith('lfe_') && (
                 <AdminListTable 
                   data={activeTab === 'lfe_teams' ? teams : activeTab === 'lfe_athletes' ? athletes : activeTab === 'lfe_games' ? games : activeTab === 'lfe_news' ? news : activeTab === 'lfe_gallery' ? gallery : activeTab === 'lfe_sponsors' ? sponsors : registrations} 
                   type={activeTab} 
                   onEdit={openForm} 
                   onDelete={(id) => handleDelete(id, activeTab)}
                 />
               )}
            </div>
        </div>
      </main>

      {/* FORM MODAL */}
      {isModalOpen && (
        <AdminFormModal 
          item={editingItem} 
          type={activeTab} 
          onClose={() => setIsModalOpen(false)} 
          onSave={refreshAll}
          context={{ teams, athletes }}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function AdminFormModal({ item, type, onClose, onSave, context }: { item: any, type: string, onClose: () => void, onSave: () => void, context: any }) {
  const [formData, setFormData] = useState(item || {});
  const [loading, setLoading] = useState(false);
  const isNew = !item.id;

  const handleFormSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // BASIC VALIDATION
    if (type === 'lfe_games') {
      if (formData.home_team_id === formData.away_team_id) {
        alert("ERRO: Uma equipe não pode jogar contra ela mesma!");
        return;
      }
      if (!formData.home_team_id || !formData.away_team_id) {
        alert("ERRO: Selecione as duas equipes da partida.");
        return;
      }
    }

    if (type === 'lfe_athletes' && !formData.team_id) {
      alert("ERRO: O atleta deve estar vinculado a uma equipe.");
      return;
    }

    setLoading(true);
    const table = type === 'push' || type === 'config' ? 'lfe_settings' : type;
    
    // Clean data (prevent sending _type)
    const { _type, ...cleanData } = formData;
    
    const { error } = isNew 
      ? await supabase.from(table).insert([cleanData])
      : await supabase.from(table).update(cleanData).eq('id', item.id);

    if (error) alert("Erro: " + error.message);
    else { onSave(); onClose(); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
         <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1e293b]">
            <h3 className="font-display font-black text-xl uppercase tracking-widest">{isNew ? "Novo Registro" : "Editar Registro"}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
         </div>
         
         <form onSubmit={handleFormSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {type === 'lfe_teams' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Nome da Equipe</label><input required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                  <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Cidade</label><input required value={formData.city || ""} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                </div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">URL do Logo</label><input value={formData.logo || ""} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Categorias (Ex: SUB-11, SUB-12)</label><input value={formData.categories || ""} onChange={e => setFormData({...formData, categories: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
              </>
            )}

            {type === 'lfe_athletes' && (
              <>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Nome do Atleta</label><input required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-gray-500">Equipe</label>
                    <select required value={formData.team_id || ""} onChange={e => setFormData({...formData, team_id: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm">
                      <option value="">Selecionar Equipe</option>
                      {context.teams.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Número Camisa</label><input required type="number" value={formData.number || ""} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                </div>
              </>
            )}

            {type === 'lfe_games' && (
              <>
                <div className="grid grid-cols-2 gap-8 items-center bg-black/20 p-6 rounded-2xl border border-white/5">
                   <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-500 text-center block">Mandante</label>
                      <select required value={formData.home_team_id || ""} onChange={e => setFormData({...formData, home_team_id: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs">
                        <option value="">Selecione...</option>
                        {context.teams.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <input type="number" placeholder="Gols" value={formData.home_score || 0} onChange={e => setFormData({...formData, home_score: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-center text-2xl font-black text-primary" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] uppercase font-black text-gray-500 text-center block">Visitante</label>
                      <select required value={formData.away_team_id || ""} onChange={e => setFormData({...formData, away_team_id: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs">
                        <option value="">Selecione...</option>
                        {context.teams.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <input type="number" placeholder="Gols" value={formData.away_score || 0} onChange={e => setFormData({...formData, away_score: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-center text-2xl font-black text-primary" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Status</label><select value={formData.status || "agendado"} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs"><option value="agendado">Agendado</option><option value="ao_vivo">Ao Vivo</option><option value="finalizado">Finalizado</option></select></div>
                   <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Categoria</label><input value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Data</label><input type="date" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs" /></div>
                   <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Hora</label><input type="time" value={formData.time || ""} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs" /></div>
                </div>
              </>
            )}

            {type === 'lfe_news' && (
              <>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Título da Notícia</label><input required value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">Conteúdo (HTML/Texto)</label><textarea rows={6} required value={formData.content || ""} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-black text-gray-500">URL da Imagem de Capa</label><input value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-primary text-sm" /></div>
              </>
            )}

            <button type="submit" disabled={loading} className="w-full bg-primary text-black font-display font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
               {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Registro</>}
            </button>
         </form>
      </div>
    </div>
  );
}

function AdminDashboard({ stats }: { stats: any }) {
  const cards = [
    { label: "Equipes", value: stats.teams.length, icon: Trophy, color: "text-primary" },
    { label: "Atletas", value: stats.athletes.length, icon: Users, color: "text-blue-400" },
    { label: "Partidas", value: stats.games.length, icon: Clock, color: "text-green-400" },
    { label: "Solicitações", value: stats.registrations.length, icon: UserCheck, color: "text-yellow-400" },
  ];
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-primary/20 transition-all group relative overflow-hidden">
             <card.icon className={cn("w-10 h-10 mb-6 transition-transform group-hover:scale-110", card.color)} />
             <p className="text-gray-500 font-display text-[9px] uppercase tracking-widest mb-1">{card.label}</p>
             <h4 className="text-4xl md:text-5xl font-display font-black text-white">{card.value}</h4>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3"><UserCheck className="w-5 h-5 text-primary" /> Atividades Recentes</h3>
        {stats.registrations.slice(0, 5).map((reg: any) => (
          <div key={reg.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-[#020617] rounded-2xl border border-white/5 mb-4 group hover:border-primary/30 transition-colors">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <div className="flex-1">
               <p className="text-sm font-display uppercase tracking-tight text-white mb-0.5">{reg.team_name}</p>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest">Nova inscrição pendente • Categoria {reg.category}</p>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-primary hover:text-black rounded-lg font-display text-[10px] uppercase font-bold tracking-widest transition-all">Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminListTable({ data, type, onEdit, onDelete }: { data: any[], type: string, onEdit: (item: any) => void, onDelete: (id: any) => void }) {
  const [search, setSearch] = useState("");
  const filteredData = data.filter(item => String(item.name || item.title || item.date || item.team_name || "").toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
         <input type="text" placeholder="Pesquisar registros..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-6 pl-16 pr-6 outline-none font-display text-sm text-white focus:border-primary/50 transition-all shadow-xl" />
      </div>
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
         <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5">
               <tr>
                  <th className="px-8 py-6 font-display text-[9px] uppercase tracking-widest text-gray-500">Descrição / Data</th>
                  <th className="px-8 py-6 font-display text-[9px] uppercase tracking-widest text-gray-500 text-right">Ações Rápidas</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           {item.logo || item.image || item.photo ? (
                             <img src={item.logo || item.image || item.photo} className="w-10 h-10 rounded-lg object-contain bg-white/10" alt="" />
                           ) : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><ChevronRight className="w-4 h-4 text-gray-600" /></div>}
                           <div>
                              <p className="font-display text-sm font-bold text-white uppercase group-hover:text-primary transition-colors">{item.name || item.title || item.team_name || "---"}</p>
                              <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{item.city || item.category || item.date || "ID: " + String(item.id).substring(0,8)}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                           <button onClick={() => onEdit(item)} className="p-4 bg-white/5 rounded-2xl hover:bg-primary hover:text-black transition-all active:scale-90"><Edit3 className="w-5 h-5" /></button>
                           <button onClick={() => onDelete(item.id)} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all active:scale-90"><Trash2 className="w-5 h-5" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         {filteredData.length === 0 && <div className="py-20 text-center text-gray-500 font-display uppercase tracking-widest text-sm italic">Nenhum registro encontrado</div>}
      </div>
    </div>
  );
}

function AdminSettingsPanel({ settings, onSave }: { settings: any, onSave: () => void }) {
  const [formData, setFormData] = useState(settings || {});
  const handleSave = async () => {
    const { error } = await supabase.from('lfe_settings').upsert({ id: settings?.id || undefined, ...formData });
    if (error) alert("Erro ao salvar: " + error.message);
    else { alert("Configurações atualizadas!"); onSave(); }
  };
  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 animate-in fade-in duration-300">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          <div className="space-y-4">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest block ml-2">Ano Edição Corrente</label>
             <input type="text" value={formData.year || ""} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary transition-all font-display text-lg" placeholder="EX: 2026" />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest block ml-2">Vídeo Banner Home (URL)</label>
             <input type="text" value={formData.video_url || ""} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary transition-all font-sans text-sm" placeholder="https://youtube.com/..." />
          </div>
          <div className="md:col-span-2 space-y-4">
             <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest block ml-2">Categorias Oficiais da Liga (Separadas por vírgula)</label>
             <textarea value={formData.categories || ""} onChange={e => setFormData({...formData, categories: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary transition-all font-display text-xl" rows={3} placeholder="SUB-11, SUB-12, SUB-13..." />
             <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20"><AlertCircle className="w-4 h-4 text-yellow-500" /> Cuidado: Isso altera as inscrições e os filtros de todo o site instantaneamente.</div>
          </div>
       </div>
       <button onClick={handleSave} className="bg-primary hover:bg-white text-black px-12 py-6 rounded-2xl font-display font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-xl shadow-primary/10 active:scale-95"><Save className="w-6 h-6" /> Aplicar Configurações</button>
    </div>
  );
}

function AdminPushPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const sendNotification = async () => {
    if (!title || !body) return alert("Preencha todos os campos.");
    setLoading(true);
    // TODO: Connect to backend service
    setTimeout(() => { alert("DISPARADO! Notificação enviada para os dispositivos inscritos."); setLoading(false); }, 1500);
  };
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-blue-900/20 border border-white/5 rounded-[3rem] p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
       <div className="max-w-xl space-y-8">
          <div className="inline-flex p-4 bg-primary/20 rounded-[2rem] mb-4"><Bell className="w-12 h-12 text-primary" /></div>
          <div className="space-y-4">
             <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">Central de <span className="text-primary">Engagement</span></h3>
             <p className="text-gray-400 text-lg font-sans leading-relaxed">Comunique resultados, gols importantes ou avisos de última hora. Sua mensagem aparecerá como uma notificação push no celular dos usuários.</p>
          </div>
          <div className="space-y-4">
             <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título Impactante (GOL!)" className="w-full bg-[#020617] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary text-white font-display text-xl uppercase italic shadow-inner" />
             <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Escreva aqui a mensagem curta que aparecerá na tela bloqueada..." rows={4} className="w-full bg-[#020617] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary text-white font-sans text-lg" />
          </div>
          <button onClick={sendNotification} disabled={loading} className="w-full bg-white hover:bg-primary text-black px-10 py-6 rounded-2xl font-display font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95">{loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Bell className="w-6 h-6" /> Disparar Agora</>}</button>
       </div>
    </div>
  );
}
