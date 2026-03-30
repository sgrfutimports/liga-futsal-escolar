import React, { useState, useEffect } from "react";
import { Lock, Settings, Users, Trophy, Calendar, Database, Search, Filter, Check, X, Eye, Plus, Edit, Trash, Activity, Shield, Upload, Image, Video, Star, Camera } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getStoredData, setStoredData, resizeImage, defaultData } from "@/src/lib/store";

// --- Sub-components ---
function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark">
          <h3 className="text-xl font-display text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
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
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [sponsorsPremium, setSponsorsPremium] = useState<any[]>([]);
  const [sponsorsOfficial, setSponsorsOfficial] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(defaultData.settings);

  // Load Initial Data
  useEffect(() => {
    setRegistrations(getStoredData('registrations') || []);
    setTeams(getStoredData('teams') || []);
    setAthletes(getStoredData('athletes') || []);
    setGames(getStoredData('games') || []);
    setBanners(getStoredData('banners') || []);
    setSponsorsPremium(getStoredData('sponsorsPremium') || []);
    setSponsorsOfficial(getStoredData('sponsorsOfficial') || []);
    setGallery(getStoredData('gallery') || []);
    
    // Check old localstorage for backward compat on league_logo
    let savedSettings = getStoredData('settings');
    if (!savedSettings) savedSettings = defaultData.settings;
    if (!savedSettings.leagueLogo && localStorage.getItem('league_logo')) {
      savedSettings.leagueLogo = localStorage.getItem('league_logo');
    }
    setSettings(savedSettings);
  }, []);

  // Update localStorage when state changes
  useEffect(() => { setStoredData('registrations', registrations); }, [registrations]);
  useEffect(() => { setStoredData('teams', teams); }, [teams]);
  useEffect(() => { setStoredData('athletes', athletes); }, [athletes]);
  useEffect(() => { setStoredData('games', games); }, [games]);
  useEffect(() => { setStoredData('banners', banners); }, [banners]);
  useEffect(() => { setStoredData('sponsorsPremium', sponsorsPremium); }, [sponsorsPremium]);
  useEffect(() => { setStoredData('sponsorsOfficial', sponsorsOfficial); }, [sponsorsOfficial]);
  useEffect(() => { setStoredData('gallery', gallery); }, [gallery]);
  useEffect(() => { 
    setStoredData('settings', settings); 
    // Synchronize to the old key "league_logo" just in case other parts of the app use it directly
    if (settings.leagueLogo) {
      localStorage.setItem('league_logo', settings.leagueLogo);
    } else {
      localStorage.removeItem('league_logo');
    }
  }, [settings]);

  // Modals Data Setup
  const [modalType, setModalType] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<any>({});

  const closeModal = () => {
    setModalType(null);
    setCurrentData({});
  };

  const handleSave = (e: React.FormEvent, type: string, collection: any[], setCollection: any) => {
    e.preventDefault();
    if (currentData.id) {
      setCollection(collection.map((item: any) => item.id === currentData.id ? currentData : item));
    } else {
      setCollection([...collection, { ...currentData, id: Date.now() }]);
    }
    closeModal();
  };

  // Image Upload Handler setup for Forms
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      resizeImage(file, 800, 800).then(base64 => {
         setCurrentData((prev: any) => ({ ...prev, [fieldName]: base64 }));
      });
    }
  };

  // Common UI classes
  const inputClass = "w-full px-4 py-2 bg-dark border border-dark-border rounded focus:outline-none focus:border-primary text-white transition-colors text-sm mb-4";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider";

  // --- Render Functions ---

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
          <button onClick={() => { setCurrentData({}); setModalType('team'); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Nova Equipe
          </button>
          <button onClick={() => { setCurrentData({}); setModalType('athlete'); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Novo Atleta
          </button>
          <button onClick={() => { setCurrentData({}); setModalType('game'); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Novo Jogo
          </button>
          <button onClick={() => { setCurrentData({}); setModalType('banner'); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Novo Banner (Home)
          </button>
          <button onClick={() => { setCurrentData({}); setModalType('gallery'); }} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary hover:text-dark transition-all">
            <Plus className="w-4 h-4" /> Nova Foto (Galeria)
          </button>
        </div>
      </div>
    </>
  );

  const handleApproveRegistration = (reg: any) => {
    if(reg.status === 'Homologada') return;
    
    // Create new Team from Registration
    const newTeamId = Date.now();
    const newTeam = {
      id: newTeamId,
      name: reg.school,
      city: reg.city || "Garanhuns",
      categories: reg.categories,
      logo: reg.logo || ""
    };
    
    // Create Athletes
    const newAthletes = (reg.athletes || []).map((a: any) => ({
      ...a,
      id: Date.now() + Math.random(),
      teamId: newTeamId
    }));
    
    // Update Stores
    setTeams([...teams, newTeam]);
    if(newAthletes.length > 0) setAthletes([...athletes, ...newAthletes]);
    
    // Update Registration Status
    setRegistrations(registrations.map(r => r.id === reg.id ? { ...r, status: 'Homologada', teamId: newTeamId } : r));
    alert(`Inscrição da escola ${reg.school} homologada com sucesso!\nEquipe e atletas criados!`);
  };

  const DataTable = ({ title, data, columns, onAdd, onEdit, onDelete, onMoveUp, onMoveDown }: any) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-white">{title}</h3>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded hover:bg-primary-dark transition-all text-sm font-semibold">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-display text-xs border-b border-dark-border">
              {columns.map((col: any, idx: number) => <th key={idx} className="pb-4">{col.label}</th>)}
              <th className="pb-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} className="border-b border-dark-border/50 hover:bg-dark">
                {columns.map((col: any, idx: number) => (
                  <td key={idx} className="py-4 text-sm text-gray-300">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                <td className="py-4 text-right">
                  {onMoveUp && (
                    <button onClick={() => onMoveUp(item.id)} className="p-2 text-gray-400 hover:text-white rounded mr-1"><Plus className="w-4 h-4 rotate-180" style={{ transform: 'rotate(180deg)' }} /> 🔼</button>
                  )}
                  {onMoveDown && (
                    <button onClick={() => onMoveDown(item.id)} className="p-2 text-gray-400 hover:text-white rounded mr-2">🔽</button>
                  )}
                  <button onClick={() => onEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded mr-2"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(item.id)} className="p-2 text-danger hover:bg-danger/10 rounded"><Trash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <div className="text-center py-8 text-gray-500">Nenhum registro encontrado.</div>}
      </div>
    </div>
  );

  const renderTeams = () => (
    <DataTable 
      title="GERENCIAR EQUIPES" data={teams}
      columns={[
        { label: "LOGO", render: (t: any) => t.logo ? <img src={t.logo} className="w-10 h-10 object-contain bg-white rounded-full p-1" /> : <Shield className="w-8 h-8 text-gray-500" /> },
        { label: "NOME", key: "name", render: (t: any) => <span className="font-display text-white">{t.name}</span> },
        { label: "CIDADE", key: "city" },
        { label: "CATEGORIAS", key: "categories" }
      ]}
      onAdd={() => { setCurrentData({}); setModalType('team'); }}
      onEdit={(team: any) => { setCurrentData(team); setModalType('team'); }}
      onDelete={(id: number) => setTeams(teams.filter(t => t.id !== id))}
    />
  );

  const renderAthletes = () => (
    <DataTable 
      title="GERENCIAR ATLETAS" data={athletes}
      columns={[
        { label: "FOTO", render: (a: any) => a.photo ? <img src={a.photo} className="w-10 h-10 object-cover rounded-full" /> : <Users className="w-8 h-8 text-gray-500" /> },
        { label: "NOME", key: "name", render: (a: any) => <span className="font-display text-white">{a.name}</span> },
        { label: "EQUIPE", render: (a: any) => teams.find(t => t.id === Number(a.teamId))?.name || "Desconhecida" },
        { label: "NÚMERO", key: "number" },
        { label: "CATEGORIA", key: "category" }
      ]}
      onAdd={() => { setCurrentData({}); setModalType('athlete'); }}
      onEdit={(athlete: any) => { setCurrentData(athlete); setModalType('athlete'); }}
      onDelete={(id: number) => setAthletes(athletes.filter(a => a.id !== id))}
    />
  );

  const renderBanners = () => (
    <>
      <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded mb-6 flex gap-3 text-sm">
        <Image className="w-5 h-5 flex-shrink-0" />
        <p>Estes banners são exibidos no carrossel principal da página inicial. Use imagens de alta qualidade (1920x1080) recomendadas e links do Unsplash para não pesar no armazenamento local. Para a logo e patrocinadores, faça upload.</p>
      </div>
      <DataTable 
        title="BANNERS DA HOME (CARROSSEL)" data={banners}
        columns={[
          { label: "IMAGEM", render: (b: any) => <img src={b.image} className="w-24 h-12 object-cover rounded" /> },
          { label: "TÍTULO", key: "title", render: (b: any) => <span className="font-display text-white">{b.title}</span> },
          { label: "COR TEMA", key: "accent" }
        ]}
        onAdd={() => { setCurrentData({ accent: 'primary' }); setModalType('banner'); }}
        onEdit={(banner: any) => { setCurrentData(banner); setModalType('banner'); }}
        onDelete={(id: number) => setBanners(banners.filter(b => b.id !== id))}
      />
    </>
  );

  const renderGallery = () => (
    <>
      <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded mb-6 flex gap-3 text-sm">
        <Camera className="w-5 h-5 flex-shrink-0" />
        <p>Adicione fotos marcantes do evento para aparecerem na aba de Galeria pública. Preencha o título e faça o upload ou insira a URL da imagem (Unsplash recomendado).</p>
      </div>
      <DataTable 
        title="GERENCIAR GALERIA DE FOTOS" data={gallery}
        columns={[
          { label: "IMAGEM", render: (g: any) => <img src={g.url} className="w-24 h-16 object-cover rounded border border-dark-border" /> },
          { label: "TÍTULO", key: "title", render: (g: any) => <span className="font-display text-white">{g.title}</span> }
        ]}
        onAdd={() => { setCurrentData({}); setModalType('gallery'); }}
        onEdit={(g: any) => { setCurrentData(g); setModalType('gallery'); }}
        onDelete={(id: number) => setGallery(gallery.filter(g => g.id !== id))}
      />
    </>
  );

  const renderSponsors = () => {
    const moveSponsor = (id: number, direction: 'up' | 'down', type: 'premium' | 'official') => {
      const collection = type === 'premium' ? [...sponsorsPremium] : [...sponsorsOfficial];
      const setCollection = type === 'premium' ? setSponsorsPremium : setSponsorsOfficial;
      const index = collection.findIndex(s => s.id === id);
      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === collection.length - 1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = collection[index];
      collection[index] = collection[newIndex];
      collection[newIndex] = temp;
      setCollection(collection);
    };

    return (
      <>
        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded mb-6 flex gap-3 text-sm">
          <Star className="w-5 h-5 flex-shrink-0" />
          <p>Use as setas 🔼 e 🔽 para reordenar os patrocinadores. A ordem definida aqui será exatamente a exibida na página inicial.</p>
        </div>
        
        <DataTable 
          title="PATROCINADORES MASTER (Premium) - Exibidos em cards grandes" data={sponsorsPremium}
          columns={[
            { label: "LOGO", render: (s: any) => s.logo ? <img src={s.logo} className="w-12 h-12 object-contain bg-white p-1 rounded" /> : <Star className="w-8 h-8 text-gray-500" /> },
            { label: "NOME", key: "name", render: (s: any) => <span className="font-display text-white">{s.name}</span> }
          ]}
          onAdd={() => { setCurrentData({ type: 'premium' }); setModalType('sponsor'); }}
          onEdit={(sponsor: any) => { setCurrentData({ ...sponsor, type: 'premium' }); setModalType('sponsor'); }}
          onDelete={(id: number) => setSponsorsPremium(sponsorsPremium.filter(s => s.id !== id))}
          onMoveUp={(id: number) => moveSponsor(id, 'up', 'premium')}
          onMoveDown={(id: number) => moveSponsor(id, 'down', 'premium')}
        />

        <DataTable 
          title="PATROCINADORES OFICIAIS - Exibidos no letreiro rotativo (Marquee)" data={sponsorsOfficial}
          columns={[
            { label: "LOGO", render: (s: any) => s.logo ? <img src={s.logo} className="w-12 h-12 object-contain bg-white p-1 rounded" /> : <Shield className="w-8 h-8 text-gray-500" /> },
            { label: "NOME", key: "name", render: (s: any) => <span className="font-display text-white">{s.name}</span> }
          ]}
          onAdd={() => { setCurrentData({ type: 'official' }); setModalType('sponsor'); }}
          onEdit={(sponsor: any) => { setCurrentData({ ...sponsor, type: 'official' }); setModalType('sponsor'); }}
          onDelete={(id: number) => setSponsorsOfficial(sponsorsOfficial.filter(s => s.id !== id))}
          onMoveUp={(id: number) => moveSponsor(id, 'up', 'official')}
          onMoveDown={(id: number) => moveSponsor(id, 'down', 'official')}
        />
      </>
    );
  };

  const renderSettings = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-2xl">
      <h3 className="font-display text-xl text-white mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" /> CONFIGURAÇÕES GERAIS
      </h3>
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        setStoredData('settings', settings); 
        alert("Configurações salvas com sucesso!"); 
      }}>
        <div className="mb-6 flex flex-col items-start gap-4">
          <label className={labelClass}>Logo do Campeonato</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border border-dark-border bg-dark flex items-center justify-center overflow-hidden">
              {settings.leagueLogo ? <img src={settings.leagueLogo} alt="Logo" className="w-full h-full object-cover" /> : <Trophy className="w-8 h-8 text-gray-500" />}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-dark border border-dark-border text-gray-300 rounded hover:text-white hover:border-primary transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Escolher Imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  resizeImage(file, 400, 400).then(base64 => setSettings({...settings, leagueLogo: base64}));
                }
              }} />
            </label>
            {settings.leagueLogo && (
               <button type="button" onClick={() => setSettings({...settings, leagueLogo: ""})} className="text-danger hover:underline text-sm ml-2">Remover</button>
            )}
          </div>
        </div>

        <label className={labelClass}>Nome do Evento</label>
        <input type="text" className={inputClass} value={settings.eventName || ''} onChange={e => setSettings({...settings, eventName: e.target.value})} />
        
        <label className={labelClass}>Ano / Edição</label>
        <input type="text" className={inputClass} value={settings.yearEdition || ''} onChange={e => setSettings({...settings, yearEdition: e.target.value})} />
        
        <label className={labelClass}>Período de Inscrições</label>
        <select className={inputClass} value={settings.registrationPeriod || 'aberto'} onChange={e => setSettings({...settings, registrationPeriod: e.target.value})}>
          <option value="aberto">Aberto</option>
          <option value="fechado">Fechado</option>
        </select>

        <h3 className="font-display text-xl text-white mt-10 mb-6 flex flex-row items-center gap-2 border-t border-dark-border pt-6">
          <Video className="w-6 h-6 text-primary" /> VÍDEO INSTITUCIONAL DA HOME
        </h3>
        
        <label className={labelClass}>URL de Embed do Youtube (SRC do iframe)</label>
        <input type="text" className={inputClass} placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ" value={settings.institutionalVideoUrl || ''} onChange={e => setSettings({...settings, institutionalVideoUrl: e.target.value})} />
        <p className="text-xs text-gray-500 mb-6 -mt-2">Exemplo: https://www.youtube.com/embed/SuaIdeVideoAQUI</p>

        <h3 className="font-display text-xl text-white mt-10 mb-6 flex flex-row items-center gap-2 border-t border-dark-border pt-6">
          <Database className="w-6 h-6 text-primary" /> REGULAMENTO OFICIAL
        </h3>
        
        <label className={labelClass}>Upload do Regulamento (Formato PDF)</label>
        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-dark border border-dark-border text-gray-300 rounded hover:text-white hover:border-primary transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{settings.rulesUrl ? "Substituir Regulamento" : "Anexar PDF"}</span>
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 2.5 * 1024 * 1024) {
                  alert("Atenção: Para garantir a performance do site, o PDF deve ter no máximo 2.5 MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                   setSettings((prev: any) => ({...prev, rulesUrl: reader.result as string, rulesName: file.name}));
                };
                reader.readAsDataURL(file);
              }
            }} />
          </label>
          
          {settings.rulesUrl && (
            <div className="flex items-center gap-4">
              <span className="text-primary text-sm font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> {settings.rulesName || "Regulamento Anexado"}
              </span>
              <button type="button" onClick={() => setSettings((prev:any) => ({...prev, rulesUrl: "", rulesName: ""}))} className="text-danger hover:text-red-400 font-bold text-xs uppercase underline">Remover Arquivo</button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-6 -mt-2">Nota: Uma vez anexado, o público geral poderá acessar e baixar esse regulamento ao visitar a área de inscrições.</p>

        {settings.institutionalVideoUrl && (
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border border-dark-border">
            <iframe 
              className="w-full h-full"
              src={settings.institutionalVideoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
          </div>
        )}
        
        <button type="submit" className="mt-4 px-6 py-2 bg-primary text-dark font-display rounded hover:bg-primary-dark transition-all">Salvar Configurações</button>
      </form>
    </div>
  );

  // Authentication Mock
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
        <div className="p-6 border-b border-dark-border flex items-center gap-3">
          {settings.leagueLogo ? (
            <img src={settings.leagueLogo} alt="Liga" className="w-10 h-10 rounded-full border border-dark-border object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-dark border border-dark-border flex items-center justify-center"><Trophy className="w-5 h-5 text-primary" /></div>
          )}
          <h2 className="font-display text-2xl text-white">ADMIN</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: "Dashboard", icon: Activity },
            { id: "Inscrições", icon: Database },
            { id: "Banners", icon: Image },
            { id: "Galeria", icon: Camera },
            { id: "Equipes", icon: Shield },
            { id: "Atletas", icon: Users },
            { id: "Jogos", icon: Calendar },
            { id: "Patrocinadores", icon: Star },
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
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-dark-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors font-display text-sm">SAIR</button>
        </div>

        {activeTab === "Dashboard" && renderDashboard()}
        {activeTab === "Inscrições" && (
          <DataTable 
            title="GERENCIAR INSCRIÇÕES" data={registrations}
            columns={[
              { label: "DATA", key: "date" },
              { label: "ESCOLA", key: "school" },
              { label: "RESPONSÁVEL", key: "resp" },
              { label: "ELENCO", render: (r: any) => r.athleteSubmissionType === 'later' ? 'Pendente de envio' : `${r.athletes?.length || 0} inscritos` },
              { label: "STATUS", render: (r: any) => <span className={cn("px-2 py-1 rounded text-xs", r.status === 'Pendente' ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500")}>{r.status}</span>}
            ]}
            onAdd={() => alert("As inscrições são feitas pelo portal público.")}
            onEdit={(r: any) => handleApproveRegistration(r)}
            onDelete={(id: number) => setRegistrations(registrations.filter(r => r.id !== id))}
          />
        )}
        {activeTab === "Banners" && renderBanners()}
        {activeTab === "Galeria" && renderGallery()}
        {activeTab === "Equipes" && renderTeams()}
        {activeTab === "Atletas" && renderAthletes()}
        {activeTab === "Jogos" && (
          <DataTable 
            title="GERENCIAR JOGOS" data={games}
            columns={[
              { label: "CATEGORIA", key: "category" },
              { label: "DATA/HORA", render: (g: any) => `${g.date} às ${g.time}` },
              { label: "CONFRONTO", render: (g: any) => `${teams.find(t=>t.id===Number(g.homeTeamId))?.name || "A"} vs ${teams.find(t=>t.id===Number(g.awayTeamId))?.name || "B"}` },
              { label: "STATUS", key: "status" }
            ]}
            onAdd={() => { setCurrentData({ events: [] }); setModalType('game'); }}
            onEdit={(g: any) => { setCurrentData(g); setModalType('game'); }}
            onDelete={(id: number) => setGames(games.filter(g => g.id !== id))}
          />
        )}
        {activeTab === "Patrocinadores" && renderSponsors()}
        {activeTab === "Configurações" && renderSettings()}
      </main>

      {/* MODALS */}
      <Modal isOpen={modalType === 'team'} onClose={closeModal} title={currentData?.id ? "Editar Equipe" : "Nova Equipe"}>
        <form onSubmit={(e) => handleSave(e, 'team', teams, setTeams)}>
          <div className="mb-4">
            <label className={labelClass}>Upload de Logo</label>
            <div className="flex items-center gap-4">
              {currentData.logo ? <img src={currentData.logo} className="w-16 h-16 bg-white p-1 rounded-full object-contain" /> : <div className="w-16 h-16 bg-dark border border-dark-border rounded-full flex items-center justify-center"><Shield className="text-gray-500" /></div>}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-dark" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Ou digite uma URL da imagem abaixo:</p>
            <input type="text" className={inputClass} placeholder="https://..." value={currentData.logo || ''} onChange={e => setCurrentData({...currentData, logo: e.target.value})} />
          </div>

          <label className={labelClass}>Nome da Equipe</label>
          <input required type="text" className={inputClass} value={currentData.name || ''} onChange={e => setCurrentData({...currentData, name: e.target.value})} />
          
          <label className={labelClass}>Cidade</label>
          <input required type="text" className={inputClass} value={currentData.city || ''} onChange={e => setCurrentData({...currentData, city: e.target.value})} />
          
          <label className={labelClass}>Categorias (Ex: SUB-15, SUB-17)</label>
          <input required type="text" className={inputClass} value={currentData.categories || ''} onChange={e => setCurrentData({...currentData, categories: e.target.value})} />
          
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'athlete'} onClose={closeModal} title={currentData?.id ? "Editar Atleta" : "Novo Atleta"}>
        <form onSubmit={(e) => handleSave(e, 'athlete', athletes, setAthletes)}>
          <div className="mb-4">
            <label className={labelClass}>Foto do Jogador</label>
            <div className="flex items-center gap-4">
              {currentData.photo ? <img src={currentData.photo} className="w-16 h-16 object-cover rounded-full" /> : <div className="w-16 h-16 bg-dark border border-dark-border rounded-full flex items-center justify-center"><Users className="text-gray-500" /></div>}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'photo')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary file:text-dark" />
            </div>
          </div>

          <label className={labelClass}>Nome</label>
          <input required type="text" className={inputClass} value={currentData.name || ''} onChange={e => setCurrentData({...currentData, name: e.target.value})} />
          <label className={labelClass}>Equipe</label>
          <select required className={inputClass} value={currentData.teamId || ''} onChange={e => setCurrentData({...currentData, teamId: Number(e.target.value)})}>
            <option value="">Selecione a equipe</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <label className={labelClass}>Número</label>
          <input required type="number" className={inputClass} value={currentData.number || ''} onChange={e => setCurrentData({...currentData, number: e.target.value})} />
          <label className={labelClass}>Categoria</label>
          <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
             <option value="">Selecione</option>
             <option value="SUB-11">SUB-11</option>
             <option value="SUB-15">SUB-15</option>
             <option value="SUB-17">SUB-17</option>
          </select>
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'game'} onClose={closeModal} title={currentData?.id ? "Editar Jogo" : "Agendar Jogo"}>
        <form onSubmit={(e) => handleSave(e, 'game', games, setGames)}>
          <label className={labelClass}>Data / Hora</label>
          <div className="flex gap-4 mb-4">
            <input required type="date" className={inputClass} value={currentData.date || ''} onChange={e => setCurrentData({...currentData, date: e.target.value})} />
            <input required type="time" className={inputClass} value={currentData.time || ''} onChange={e => setCurrentData({...currentData, time: e.target.value})} />
          </div>
          <label className={labelClass}>Categoria do Jogo</label>
          <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
             <option value="">Selecione</option>
             <option value="SUB-11">SUB-11</option>
             <option value="SUB-13">SUB-13</option>
             <option value="SUB-15">SUB-15</option>
             <option value="SUB-17">SUB-17</option>
          </select>
          <label className={labelClass}>Equipes</label>
          <div className="flex gap-4">
            <select required className={inputClass} value={currentData.homeTeamId || ''} onChange={e => setCurrentData({...currentData, homeTeamId: e.target.value})}>
              <option value="">CASA</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select required className={inputClass} value={currentData.awayTeamId || ''} onChange={e => setCurrentData({...currentData, awayTeamId: e.target.value})}>
              <option value="">FORA</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <label className={labelClass}>Local</label>
          <input required type="text" className={inputClass} value={currentData.location || ''} onChange={e => setCurrentData({...currentData, location: e.target.value})} />
          <label className={labelClass}>Status</label>
          <select required className={inputClass} value={currentData.status || ''} onChange={e => setCurrentData({...currentData, status: e.target.value})}>
             <option value="Agendado">Agendado</option>
             <option value="Finalizado">Finalizado</option>
          </select>
          {currentData.status === 'Finalizado' && (
            <div className="border border-dark-border p-4 rounded-lg bg-dark mb-4">
               <h4 className="text-white font-display text-sm mb-4 border-b border-dark-border pb-2">PLACAR E SÚMULA</h4>
               <div className="flex gap-4 mb-4">
                 <div className="flex-1">
                   <label className={labelClass}>Gols Casa</label>
                   <input type="number" className={inputClass} value={currentData.homeScore || 0} onChange={e => setCurrentData({...currentData, homeScore: e.target.value})} />
                 </div>
                 <div className="flex-1">
                   <label className={labelClass}>Gols Fora</label>
                   <input type="number" className={inputClass} value={currentData.awayScore || 0} onChange={e => setCurrentData({...currentData, awayScore: e.target.value})} />
                 </div>
               </div>
               
               <label className={labelClass}>Adicionar Evento (Gol, Cartão) - Afeta as estatísticas automaticamente</label>
               <div className="flex gap-2 mb-2">
                 <select className="px-2 py-2 bg-dark-card border border-dark-border text-white text-xs rounded flex-1" id="eventPlayer">
                   <option value="">Selecione Jogador</option>
                   {athletes.filter(a => a.teamId === Number(currentData.homeTeamId) || a.teamId === Number(currentData.awayTeamId)).map(a => (
                     <option key={a.id} value={a.id}>{a.name} ({a.teamId === Number(currentData.homeTeamId) ? 'Casa' : 'Fora'})</option>
                   ))}
                 </select>
                 <select className="px-2 py-2 bg-dark-card border border-dark-border text-white text-xs rounded w-[100px]" id="eventType">
                   <option value="goal">Gol ⚽</option>
                   <option value="yellow">Amarelo 🟨</option>
                   <option value="red">Vermelho 🟥</option>
                 </select>
                 <button type="button" onClick={() => {
                   const pid = (document.getElementById('eventPlayer') as HTMLSelectElement).value;
                   const type = (document.getElementById('eventType') as HTMLSelectElement).value;
                   if(!pid) return;
                   const athlete = athletes.find(a => a.id === Number(pid));
                   const events = currentData.events || [];
                   setCurrentData({...currentData, events: [...events, { id: Date.now(), playerId: Number(pid), type, teamId: athlete.teamId }]});
                 }} className="px-3 py-1 bg-primary text-dark font-bold text-xs rounded">Add</button>
               </div>
               
               <div className="space-y-1 mt-4 max-h-32 overflow-y-auto pr-2">
                 {(currentData.events || []).map((ev: any) => (
                   <div key={ev.id} className="flex justify-between items-center text-xs text-gray-300 bg-dark-card p-2 rounded border border-dark-border">
                     <span>{athletes.find((a: any) => a.id === ev.playerId)?.name || "Desconhecido"} - {ev.type === 'goal' ? 'GOL ⚽' : ev.type === 'yellow' ? 'AMARELO 🟨' : 'VERMELHO 🟥'}</span>
                     <button type="button" onClick={() => setCurrentData({...currentData, events: currentData.events.filter((e:any)=>e.id !== ev.id)})} className="text-danger hover:text-red-400 font-bold">X</button>
                   </div>
                 ))}
                 {(currentData.events || []).length === 0 && <div className="text-xs text-gray-500 italic">Nenhum evento registrado.</div>}
               </div>
            </div>
          )}
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'banner'} onClose={closeModal} title={currentData?.id ? "Editar Banner" : "Novo Banner"}>
        <form onSubmit={(e) => handleSave(e, 'banner', banners, setBanners)}>
          <label className={labelClass}>URL da Imagem (Fundo)</label>
          <input required type="text" className={inputClass} value={currentData.image || ''} onChange={e => setCurrentData({...currentData, image: e.target.value})} placeholder="https://images.unsplash..." />
          <label className={labelClass}>Título</label>
          <input required type="text" className={inputClass} value={currentData.title || ''} onChange={e => setCurrentData({...currentData, title: e.target.value})} />
          <label className={labelClass}>Subtítulo</label>
          <input type="text" className={inputClass} value={currentData.subtitle || ''} onChange={e => setCurrentData({...currentData, subtitle: e.target.value})} />
          <label className={labelClass}>Descrição</label>
          <textarea rows={3} className={inputClass} value={currentData.description || ''} onChange={e => setCurrentData({...currentData, description: e.target.value})} />
          
          <div className="flex gap-4">
             <div className="flex-1">
               <label className={labelClass}>Botão (Texto)</label>
               <input type="text" className={inputClass} value={currentData.ctaText || ''} onChange={e => setCurrentData({...currentData, ctaText: e.target.value})} />
             </div>
             <div className="flex-1">
               <label className={labelClass}>Link</label>
               <input type="text" className={inputClass} value={currentData.ctaLink || ''} onChange={e => setCurrentData({...currentData, ctaLink: e.target.value})} />
             </div>
          </div>
          
          <label className={labelClass}>Cor Tema (Accent)</label>
          <select className={inputClass} value={currentData.accent || 'primary'} onChange={e => setCurrentData({...currentData, accent: e.target.value})}>
             <option value="primary">Primária (Verde/Amarelo)</option>
             <option value="secondary">Secundária (Laranja/Amarelo)</option>
             <option value="accent">Destaque (Ciano)</option>
          </select>
          
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'gallery'} onClose={closeModal} title={currentData?.id ? "Editar Foto" : "Nova Foto da Galeria"}>
        <form onSubmit={(e) => handleSave(e, 'gallery', gallery, setGallery)}>
          <label className={labelClass}>Título da Foto / Momento</label>
          <input required type="text" className={inputClass} value={currentData.title || ''} onChange={e => setCurrentData({...currentData, title: e.target.value})} placeholder="Ex: Comemoração de título" />
          
          <label className={labelClass}>Imagem (Opcional - base64 upload ou URL)</label>
          <div className="flex items-center gap-4 mb-4">
            {currentData.url ? <img src={currentData.url} className="w-24 h-16 object-cover rounded shadow" /> : <div className="w-24 h-16 bg-white rounded border border-gray-300 flex items-center justify-center flex-shrink-0"><Camera className="text-gray-400" /></div>}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'url')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-dark" />
          </div>
          <input type="text" className={inputClass} placeholder="Ou inserir URL do Unsplash/Imagens..." value={currentData.url || ''} onChange={e => setCurrentData({...currentData, url: e.target.value})} />
          
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar Foto</button>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'sponsor'} onClose={closeModal} title={currentData?.id ? "Editar Patrocinador" : "Novo Patrocinador"}>
        <form onSubmit={(e) => {
          if (currentData.type === 'premium') handleSave(e, 'sponsor', sponsorsPremium, setSponsorsPremium);
          else handleSave(e, 'sponsor', sponsorsOfficial, setSponsorsOfficial);
        }}>
          <label className={labelClass}>Nome</label>
          <input required type="text" className={inputClass} value={currentData.name || ''} onChange={e => setCurrentData({...currentData, name: e.target.value})} />
          
          <label className={labelClass}>Logo (Opcional - base64 upload ou URL)</label>
          <div className="flex items-center gap-4 mb-4">
            {currentData.logo ? <img src={currentData.logo} className="w-16 h-16 bg-white p-1 rounded object-contain" /> : <div className="w-16 h-16 bg-white rounded border border-gray-300 flex items-center justify-center flex-shrink-0"><Star className="text-gray-400" /></div>}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-dark" />
          </div>
          <input type="text" className={inputClass} placeholder="Ou URL direto..." value={currentData.logo || ''} onChange={e => setCurrentData({...currentData, logo: e.target.value})} />
          
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark">Salvar</button>
        </form>
      </Modal>

    </div>
  );
}
