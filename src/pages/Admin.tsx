import React, { useState, useEffect } from "react";
import { Lock, Settings, Users, Trophy, Calendar, Database, Search, Filter, Check, X, Eye, Plus, Edit, Trash, Activity, Shield, Upload, Image, Video, Star, Camera, FileText, Download, Folder, LogOut, ClipboardList, ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { cn } from "@/src/lib/utils";
import { resizeImage, defaultData, supaFetch, supaUpsert, supaInsert, supaUpdate, supaDelete } from "@/src/lib/store";
import { supabase, TableName } from "@/src/lib/supabase";

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
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('lfe_admin_authenticated') === 'true');
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  const handleAdminLogout = () => {
    localStorage.removeItem('lfe_admin_authenticated');
    setIsAuthenticated(false);
  };

  // Global State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [sponsorsPremium, setSponsorsPremium] = useState<any[]>([]);
  const [sponsorsOfficial, setSponsorsOfficial] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [technicalDocs, setTechnicalDocs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(defaultData.settings);

  // Load Initial Data from Supabase
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [reg, t, a, g, b, sp, sf, gl, td, st] = await Promise.all([
          supaFetch('lfe_registrations'),
          supaFetch('lfe_teams'),
          supaFetch('lfe_athletes'),
          supaFetch('lfe_games'),
          supaFetch('lfe_banners'),
          supaFetch('lfe_sponsors'), // Handle premium vs official locally or in query
          supaFetch('lfe_sponsors'),
          supaFetch('lfe_gallery'),
          supaFetch('lfe_technical_documents'),
          supaFetch('lfe_settings')
        ]);
        
        if (reg) setRegistrations(reg);
        if (t) setTeams(t);
        if (a) setAthletes(a);
        if (g) setGames(g);
        if (b) setBanners(b);
        if (gl) setGallery(gl);
        if (td) setTechnicalDocs(td);
        if (st && st.length > 0) setSettings(st[0]);

        // Separate sponsors if unified table
        if (sp) {
          setSponsorsPremium(sp.filter((s:any) => s.type === 'premium'));
          setSponsorsOfficial(sp.filter((s:any) => s.type === 'official'));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) loadAllData();
  }, [isAuthenticated]);

  // Modals Data Setup
  const [modalType, setModalType] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<any>({});

  const closeModal = () => {
    setModalType(null);
    setCurrentData({});
  };

  const typeToTable: Record<string, TableName> = {
    'team': 'lfe_teams',
    'athlete': 'lfe_athletes',
    'game': 'lfe_games',
    'banner': 'lfe_banners',
    'sponsor': 'lfe_sponsors',
    'gallery': 'lfe_gallery',
    'tech_doc': 'lfe_technical_documents'
  };

  const handleSave = async (e: React.FormEvent, type: string, collection: any[], setCollection: any) => {
    e.preventDefault();
    const table = typeToTable[type];
    if (!table) return;

    try {
      const payload = { ...currentData };
      
      // Correção de Types e Nomes de Colunas pro Postgres
      if (payload.id === '') delete payload.id;
      
      if (type === 'team' && typeof payload.categories === 'string') {
        payload.categories = payload.categories.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (type === 'athlete') {
        if (payload.teamId) { payload.team_id = String(payload.teamId); delete payload.teamId; }
        if (payload.number) { payload.number = String(payload.number); }
      }
      if (type === 'game') {
        if (payload.homeTeamId) { payload.home_team_id = String(payload.homeTeamId); delete payload.homeTeamId; }
        else if (payload.home_team_id === '') payload.home_team_id = null;

        if (payload.awayTeamId) { payload.away_team_id = String(payload.awayTeamId); delete payload.awayTeamId; }
        else if (payload.away_team_id === '') payload.away_team_id = null;

        // Populate redundant names for stability
        if (payload.home_team_id) {
          payload.home_team_name = teams.find(t => String(t.id) === String(payload.home_team_id))?.name;
        }
        if (payload.away_team_id) {
          payload.away_team_name = teams.find(t => String(t.id) === String(payload.away_team_id))?.name;
        }

        if (payload.homeScore !== undefined) { payload.home_score = Number(payload.homeScore); delete payload.homeScore; }
        if (payload.awayScore !== undefined) { payload.away_score = Number(payload.awayScore); delete payload.awayScore; }
      }
      if (type === 'banner') {
        if (payload.ctaText) { payload.cta_text = payload.ctaText; delete payload.ctaText; }
        if (payload.ctaLink) { payload.cta_link = payload.ctaLink; delete payload.ctaLink; }
      }

      // Sync to Supabase
      await supaUpsert(table, payload);
      
      // Update local state
      if (currentData.id) {
        setCollection(collection.map((item: any) => String(item.id) === String(currentData.id) ? payload : item));
      } else {
        // Refresh after insert to get proper UUID/ID from DB
        const refreshed = await supaFetch(table);
        if (refreshed) setCollection(refreshed);
      }
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const handleDelete = async (id: any, table: TableName, collection: any[], setCollection: Function) => {
    if(!window.confirm("Excluir item?")) return;
    try {
      await supaDelete(table, id);
      setCollection(collection.filter(item => String(item.id) !== String(id)));
    } catch (err) {
      alert("Erro ao excluir do banco de dados.");
    }
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

  const handleApproveRegistration = async (reg: any) => {
    if (reg.status === 'Homologada') return;

    try {
      // 1. Create Team in Supabase
      const newTeamData = {
        name: reg.school,
        city: reg.city || 'Garanhuns',
        categories: Array.isArray(reg.categories) ? reg.categories.join(', ') : (reg.categories || ''),
        logo: reg.logo || '',
      };
      const newTeam = await supaInsert('lfe_teams', newTeamData);
      const newTeamId = newTeam?.id ?? Date.now();

      // 2. Create Athletes in Supabase (if any)
      const regAthletes = reg.athletes || [];
      if (regAthletes.length > 0) {
        const athleteRows = regAthletes.map((a: any) => ({
          name: a.name,
          number: a.number || '',
          category: a.category || reg.categories || '',
          team_id: newTeamId,
          goals: 0,
        }));
        await supaUpsert('lfe_athletes', athleteRows);
      }

      // 3. Update Registration status in Supabase
      await supaUpdate('lfe_registrations', reg.id, { status: 'Homologada', team_id: newTeamId });

      // 4. Refresh local state
      setTeams(prev => [...prev, { ...newTeamData, id: newTeamId }]);
      setRegistrations(prev => prev.map(r => String(r.id) === String(reg.id)
        ? { ...r, status: 'Homologada', team_id: newTeamId }
        : r
      ));
      alert(`Inscrição da escola ${reg.school} homologada com sucesso!\nEquipe e atletas criados!`);
    } catch (err: any) {
      console.error('Erro ao homologar inscrição:', err);
      alert('Erro ao homologar: ' + (err.message || 'Verifique o console.'));
    }
  };

  const exportToExcel = (data: any[], title: string) => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => {
      // Basic cleaning for excel export
      const cleaned: any = {};
      Object.keys(item).forEach(key => {
        if (typeof item[key] !== 'object' && !key.toLowerCase().includes('logo') && !key.toLowerCase().includes('photo') && !key.toLowerCase().includes('image')) {
          cleaned[key.toUpperCase()] = item[key];
        }
      });
      return cleaned;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_').toLowerCase()}.xlsx`);
  };

  const exportToPDF = (data: any[], title: string, columns: any[]) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    const tableRows = data.map(item => columns.map(col => {
      if (col.key === 'logo' || col.key === 'photo' || col.key === 'image') return "[IMAGEM]";
      if (col.renderText) return col.renderText(item);
      return String(item[col.key] || "");
    }));
    const tableHeaders = columns.map(col => col.label);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [204, 255, 0], textColor: [0, 0, 0] }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  // =====================================================================
  // GERADOR DE SUMULAS - COMPLETO
  // =====================================================================
  const [sumulaState, setSumulaState] = useState<any>({
    selectedGameId: null,
    referee: '',
    assistant1: '',
    assistant2: '',
    homeScore: '',
    awayScore: '',
    homeEvents: [], // { type: 'gol'|'amarelo'|'vermelho', playerId, minute }
    awayEvents: [],
    observations: '',
    saved: false,
  });

  const selectedGame = games.find((g: any) => String(g.id) === String(sumulaState.selectedGameId));
  const sumulaHomeTeam = selectedGame ? teams.find((t: any) => String(t.id) === String(selectedGame.homeTeamId || selectedGame.home_team_id)) : null;
  const sumulaAwayTeam = selectedGame ? teams.find((t: any) => String(t.id) === String(selectedGame.awayTeamId || selectedGame.away_team_id)) : null;
  const sumulaHomeAthletes = sumulaHomeTeam ? athletes.filter((a: any) => String(a.teamId || a.team_id) === String(sumulaHomeTeam.id) && (!selectedGame.category || a.category === selectedGame.category)) : [];
  const sumulaAwayAthletes = sumulaAwayTeam ? athletes.filter((a: any) => String(a.teamId || a.team_id) === String(sumulaAwayTeam.id) && (!selectedGame.category || a.category === selectedGame.category)) : [];

  const addEvent = (side: 'home' | 'away', type: string, playerId: string, minute: string) => {
    const key = side === 'home' ? 'homeEvents' : 'awayEvents';
    setSumulaState((prev: any) => ({ ...prev, [key]: [...prev[key], { type, playerId, minute }] }));
  };

  const removeEvent = (side: 'home' | 'away', idx: number) => {
    const key = side === 'home' ? 'homeEvents' : 'awayEvents';
    setSumulaState((prev: any) => ({ ...prev, [key]: prev[key].filter((_: any, i: number) => i !== idx) }));
  };

  const generateSumulaPDF = async (sumulaData?: any) => {
    try {
      const data = sumulaData || sumulaState;
      const gameId = sumulaData ? sumulaData.selectedGameId : sumulaState.selectedGameId;
      const game = games.find((g: any) => String(g.id) === String(gameId)) || selectedGame;
      
      if (!game) {
        alert("Erro: Jogo não encontrado no sistema. Selecione novamente.");
        return;
      }

      const hId = game.homeTeamId || game.home_team_id;
      const aId = game.awayTeamId || game.away_team_id;

      const homeTeam: any = teams.find((t: any) => String(t.id) === String(hId)) || { name: 'Equipe A' };
      const awayTeam: any = teams.find((t: any) => String(t.id) === String(aId)) || { name: 'Equipe B' };
      
      const homeAths = athletes.filter((a: any) => String(a.teamId || a.team_id) === String(hId) && (!game.category || a.category === game.category));
      const awayAths = athletes.filter((a: any) => String(a.teamId || a.team_id) === String(aId) && (!game.category || a.category === game.category));
      
      const evH: any[] = data.homeEvents || [];
      const evA: any[] = data.awayEvents || [];

      let doc: any;
      try {
        doc = new (window as any).jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
      } catch (e) {
        doc = new jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
      }

      const loadImg = (url: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          if (!url) { resolve(null); return; }
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          let resolved = false;
          img.onload = () => { if(!resolved){ resolved=true; resolve(img); } };
          img.onerror = () => { if(!resolved){ resolved=true; resolve(null); } };
          setTimeout(() => { if(!resolved){ resolved=true; resolve(null); } }, 4000);
          img.src = url;
        });
      };

      const leagueLogo = await loadImg('/logos/logo.jpg') || (settings.leagueLogo ? await loadImg(settings.leagueLogo) : null);
      const homeLogoImg = homeTeam.logo ? await loadImg(homeTeam.logo) : null;
      const awayLogoImg = awayTeam.logo ? await loadImg(awayTeam.logo) : null;
      const sponsorLogoImg = await loadImg('/logos/logo-sesc.png');

      const PW = 297, PH = 210, ML = 5, MR = 5, MT = 5, MB = 5;
      const wD = PW - ML - MR;
      const half = PW / 2;
      
      const B = (x: number, y: number, w: number, h: number) => doc.rect(x, y, w, h, 'S');
      const F = (x: number, y: number, w: number, h: number, c: [number,number,number]) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'F'); };
      const FB = (x: number, y: number, w: number, h: number, c: [number,number,number]) => { doc.setFillColor(...c); doc.rect(x, y, w, h, 'FD'); };
      const T = (s: string, x: number, y: number, size = 6, bold = false, align: 'left'|'center'|'right' = 'left', c: [number,number,number] = [0,0,0]) => {
        doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setTextColor(...c); doc.text(String(s || ''), x, y, { align });
      };
      const VL = (x: number, y: number, h: number) => doc.line(x, y, x, y + h);

      doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);

      // Main Outer Border
      B(ML, MT, wD, PH - MT - MB);

      let Y = MT, hH = 14;
      let w1 = wD * 0.55, w2 = wD * 0.25, w3 = wD * 0.20;

      // ROW 1
      B(ML, Y, wD, hH); VL(ML + w1, Y, hH); VL(ML + w1 + w2, Y, hH);
      T('LIGA DE FUTSAL ESCOLAR', ML + w1/2, Y + 9, 14, true, 'center');
      T('Súmula de FUTSAL', ML + w1 + w2/2, Y + 9, 11, true, 'center');
      if (leagueLogo) {
        try { doc.addImage(leagueLogo, "AUTO", ML + w1 + w2 + w3/2 - 5, Y + 1, 10, hH - 2); } catch(e){}
      } else {
        T('LOGO', ML + w1 + w2 + w3/2, Y + 9, 9, true, 'center');
      }
      Y += hH; hH = 5;

      // ROW 2
      B(ML, Y, wD, hH); VL(ML + w1, Y, hH); VL(ML + w1 + w2, Y, hH);
      T('CAMPEONATO:', ML + 1, Y + 3.5, 6, true);
      T('Jogo Nº: ' + (game.id||'____'), ML + w1 + 1, Y + 3.5, 6, true);
      T('Horário: ' + (game.time||'__:__'), ML + w1 + w2 + 1, Y + 3.5, 6, true);
      Y += hH;

      // ROW 3
      B(ML, Y, wD, hH);
      let cw = w1 / 4;
      VL(ML + cw, Y, hH); VL(ML + cw*3, Y, hH); VL(ML + w1, Y, hH);
      T('Etapa:', ML + 1, Y + 3.5, 5); T('LOCAL: ' + (game.location||''), ML + cw + 1, Y + 3.5, 5, true);
      T('Divisão:', ML + cw*3 + 1, Y + 3.5, 5); T('Fase: ' + (game.category||''), ML + w1 - 20, Y + 3.5, 5, true);
      VL(ML + w1 + w2, Y, hH); T('Data: ' + (game.date||'__/__/__'), ML + w1 + 1, Y + 3.5, 5, true);
      T('Naipe: Futsal Escolar', ML + w1 + w2 + 1, Y + 3.5, 5, true);
      Y += hH;

      // ROW 4
      B(ML, Y, wD, hH); VL(ML + cw, Y, hH); VL(ML + cw*3, Y, hH); VL(ML + w1, Y, hH);
      T('Futsal', ML + 1, Y + 3.5, 5, true); T('CHAVE: ' + (game.category||''), ML + cw*3 + 1, Y + 3.5, 5, true);
      T('Estado:', ML + w1 + 1, Y + 3.5, 5, true); T('PERNAMBUCO', ML + w1 + w2 + w3/2, Y + 3.5, 6, true, 'center');
      Y += hH;

      // ROW 5 Teams
      hH = 8; B(ML, Y, wD, hH);
      let midW = 15; let tW = (wD - midW) / 2;
      VL(ML + tW, Y, hH); VL(PW - MR - tW, Y, hH);
      T('Equipe [A]', ML + 1, Y + 3, 5, true);
      if (homeLogoImg) try { doc.addImage(homeLogoImg, "AUTO", ML + 20, Y + 1, 6, 6); } catch(e){}
      T(homeTeam.name, ML + 30, Y + 5.5, 8, true);
      T('Saída O', ML + 1, Y + 7, 5);
      
      doc.setFillColor(255,255,255); doc.ellipse(ML + tW + midW/2, Y + 4, 6, 3, 'F');
      T('X', ML + tW + midW/2, Y + 6, 12, true, 'center');
      
      T('Equipe [B]', PW - MR - tW + 1, Y + 3, 5, true);
      if (awayLogoImg) try { doc.addImage(awayLogoImg, "AUTO", PW - MR - tW + 20, Y + 1, 6, 6); } catch(e){}
      T(awayTeam.name, PW - MR - tW + 30, Y + 5.5, 8, true);
      T('Saída O', PW - MR - tW + 1, Y + 7, 5);
      Y += hH;

      // ROW 6 Timeouts
      hH = 10;
      const drawTO = (sx: number, lbl: string) => {
        B(sx, Y, tW * 0.35, hH); B(sx, Y, tW * 0.35, 4);
        T('Pedidos de Tempo Equipe ' + lbl, sx + 1, Y + 3, 4, true);
        T('1º Período', sx + 1, Y + 6, 4); B(sx + 15, Y + 4.5, 12, 2.5);
        T('2º Período', sx + 1, Y + 9, 4); B(sx + 15, Y + 7.5, 12, 2.5);
        
        B(sx + tW * 0.35, Y, tW * 0.25, hH);
        if (sponsorLogoImg) try { doc.addImage(sponsorLogoImg, "AUTO", sx + tW*0.35 + 2, Y + 1, tW*0.25 - 4, hH - 2); } catch(e){}
        
        B(sx + tW * 0.6, Y, tW * 0.4 + midW/2, hH); B(sx + tW * 0.6, Y, tW * 0.4 + midW/2, 4);
        T('Faltas Acumulativas', sx + tW * 0.6 + (tW*0.4+midW/2)/2, Y + 3, 4, true, 'center');
        T('1º Período', sx + tW * 0.6 + 1, Y + 6, 4);
        for(let i=0; i<5; i++) B(sx + tW * 0.6 + 15 + i*5.5, Y + 4.5, 5, 2.5);
        T('2º Período', sx + tW * 0.6 + 1, Y + 9, 4);
        for(let i=0; i<5; i++) B(sx + tW * 0.6 + 15 + i*5.5, Y + 7.5, 5, 2.5);
      };
      drawTO(ML, '[A]'); drawTO(PW - MR - tW - midW/2, '[B]');
      Y += hH;

      // ROW 7 Capitão
      hH = 5;
      B(ML, Y, tW + midW/2, hH); B(PW - MR - tW - midW/2, Y, tW + midW/2, hH);
      T('Técnico:________________________ Capitão:___________________', ML + 1, Y + 3.5, 5, true);
      T('Técnico:________________________ Capitão:___________________', PW - MR - tW - midW/2 + 1, Y + 3.5, 5, true);
      Y += hH;

      // Tables
      let thH = 6;
      let offLeft = ML, offRight = PW - MR - tW - midW/2;
      let wT = tW + midW/2; // width of each table side = 135
      // Columns: registro (15), ATLETAS (60), n (8), Am (5), Vm (5), GOLS (12), SUBST (30) => total 135
      let cwCol = { r: 15, a: 52, n: 8, am: 5, vm: 5, g: 12, s: 38 }; // Sum = 135
      
      const drawTh = (sx: number) => {
        let x = sx;
        B(x, Y, cwCol.r, thH); T('registro', x + cwCol.r/2, Y + 4, 5, false, 'center'); x += cwCol.r;
        B(x, Y, cwCol.a, thH); T('ATLETAS', x + cwCol.a/2, Y + 4, 5, true, 'center'); x += cwCol.a;
        B(x, Y, cwCol.n, thH); T('nº', x + cwCol.n/2, Y + 4, 5, true, 'center'); x += cwCol.n;
        B(x, Y, cwCol.am, thH); T('Am', x + cwCol.am/2, Y + 4, 4, false, 'center'); x += cwCol.am;
        B(x, Y, cwCol.vm, thH); T('Vm', x + cwCol.vm/2, Y + 4, 4, false, 'center'); x += cwCol.vm;
        B(x, Y, cwCol.g, thH/2); T('GOLS', x + cwCol.g/2, Y + 2.5, 4, true, 'center'); 
        VL(x + cwCol.g/2, Y + thH/2, thH/2); x += cwCol.g;
        B(x, Y, cwCol.s, thH/2); T('SUBSTITUIÇÕES', x + cwCol.s/2, Y + 2.5, 4, true, 'center');
        let nSub = Math.floor(cwCol.s / 3.8); // about 10 sub cols
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y + thH/2, thH/2);
      };
      drawTh(offLeft); drawTh(offRight);
      Y += thH;

      let rH = 6.4;
      let goalIndex = 0;
      
      const drawRow = (sx: number, ath: any, evts: any[]) => {
        let x = sx;
        B(x, Y, cwCol.r, rH); x += cwCol.r;
        B(x, Y, cwCol.a, rH); if(ath) T(String(ath.name || "N/A").substring(0, 30), x + 1, Y + 4, 5); x += cwCol.a;
        B(x, Y, cwCol.n, rH); if(ath) T(String(ath.number||''), x + cwCol.n/2, Y + 4, 6, true, 'center'); x += cwCol.n;
        
        let amC = ath ? evts.filter(e=>e.type==='amarelo'&&String(e.playerId)===String(ath.id)).length : 0;
        let vmC = ath ? evts.filter(e=>e.type==='vermelho'&&String(e.playerId)===String(ath.id)).length : 0;
        B(x, Y, cwCol.am, rH); if(amC>0) { FB(x,Y,cwCol.am,rH,[255,200,0]); T(String(amC), x+cwCol.am/2, Y+4, 5, true, 'center'); } x += cwCol.am;
        B(x, Y, cwCol.vm, rH); if(vmC>0) { FB(x,Y,cwCol.vm,rH,[230,0,0]); T('V', x+cwCol.vm/2, Y+4, 5, true, 'center',[255,255,255]); } x += cwCol.vm;
        
        B(x, Y, cwCol.g, rH); VL(x + cwCol.g/2, Y, rH); doc.line(x, Y + rH/2, x + cwCol.g, Y + rH/2);
        T(String(goalIndex+1), x + cwCol.g/4, Y + 2.5, 4, false, 'center');
        T(String(goalIndex+2), x + cwCol.g*0.75, Y + 2.5, 4, false, 'center');
        T(':', x + cwCol.g/4, Y + rH - 1, 4, false, 'center'); T(':', x + cwCol.g*0.75, Y + rH - 1, 4, false, 'center');
        x += cwCol.g;
        
        B(x, Y, cwCol.s, rH); doc.line(x, Y + rH/2, x + cwCol.s, Y + rH/2);
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y, rH);
      };

      for(let r=0; r<14; r++) {
        let sY = Y, giOrig = goalIndex;
        drawRow(offLeft, homeAths[r]||null, evH);
        goalIndex = giOrig; // Left and Right share the same numbered layout (1 to x down both sides)
        drawRow(offRight, awayAths[r]||null, evA);
        goalIndex += 2;
        Y += rH;
      }

      // Staff rows (6)
      rH = 5.2;
      const drawStaffRow = (sx: number, label: string) => {
        let x = sx;
        B(x, Y, cwCol.r, rH); x += cwCol.r;
        B(x, Y, cwCol.a, rH); T(label, x + 1, Y + 3.5, 4.5); x += cwCol.a;
        B(x, Y, cwCol.n, rH); x += cwCol.n;
        B(x, Y, cwCol.am, rH); x += cwCol.am;
        B(x, Y, cwCol.vm, rH); x += cwCol.vm;
        B(x, Y, cwCol.g, rH); VL(x + cwCol.g/2, Y, rH); doc.line(x, Y + rH/2, x + cwCol.g, Y + rH/2);
        T(String(goalIndex+1), x + cwCol.g/4, Y + 2, 4, false, 'center');
        T(String(goalIndex+2), x + cwCol.g*0.75, Y + 2, 4, false, 'center');
        T(':', x + cwCol.g/4, Y + rH - 0.5, 4, false, 'center'); T(':', x + cwCol.g*0.75, Y + rH - 0.5, 4, false, 'center');
        x += cwCol.g;
        B(x, Y, cwCol.s, rH); doc.line(x, Y + rH/2, x + cwCol.s, Y + rH/2);
        for(let i=0; i<10; i++) VL(x + (cwCol.s/10)*i, Y, rH);
      };

      const staffs = ['Técnico:', 'Aux. Técnico:', 'Prep. Físico:', 'Atendente:', 'Fisioterapeuta:', 'SUPERVISOR:'];
      for(let r=0; r<6; r++) {
        let sY = Y, giOrig = goalIndex;
        drawStaffRow(offLeft, staffs[r]);
        goalIndex = giOrig;
        drawStaffRow(offRight, staffs[r]);
        goalIndex += 2;
        Y += rH;
      }

      // Arbitragem
      B(ML, Y, wD, PH - MB - Y);
      let fH = (PH - MB - Y) / 6;
      T('Equipe de Arbitragem:', ML + 20, Y + 3, 5, true, 'center');
      let arbW = 80;
      VL(ML + arbW, Y, PH - MB - Y);
      const arb = [['ÁRBITRO 1:', data.referee], ['ÁRBITRO 2:', data.assistant1], ['ANOTADOR:', data.assistant2], ['CRONOMETRISTA:', ''], ['REPRESENTANTE:', '']];
      let aY = Y + fH;
      arb.forEach(([l, v], i) => {
        B(ML, aY, arbW, fH); T(l, ML + 1, aY + 3.5, 4.5, true); T(v||'______________________________', ML + 28, aY + 3.5, 5);
        aY += fH;
      });

      let hW = 100;
      VL(ML + arbW + hW, Y, PH - MB - Y);
      
      let cy = Y;
      B(ML + arbW, cy, hW, fH);
      let s2 = hW / 3;
      VL(ML + arbW + s2, cy, fH); VL(ML + arbW + s2*2, cy, fH);
      T('HORÁRIO', ML + arbW + s2/2, cy + 3.5, 4.5, true, 'center'); T('INÍCIO', ML + arbW + s2 + s2/2, cy + 3.5, 4.5, true, 'center'); T('TÉRMINO', ML + arbW + s2*2 + s2/2, cy + 3.5, 4.5, true, 'center');
      cy += fH;
      ['1º Período', '2º Período', 'Período Extra', '', 'VENCEDOR:'].forEach((p, i) => {
        B(ML + arbW, cy, hW, fH);
        if (i < 3) {
          VL(ML + arbW + s2, cy, fH); VL(ML + arbW + s2*2, cy, fH);
        }
        if (p) T(p, ML + arbW + 1, cy + 3.5, 4.5, true);
        if (p === 'VENCEDOR:') {
          let wn = (data.homeScore!==''&&data.awayScore!=='') ? (Number(data.homeScore)>Number(data.awayScore)?homeTeam.name:Number(data.awayScore)>Number(data.homeScore)?awayTeam.name:'EMPATE') : '';
          T(wn, ML + arbW + 20, cy + 3.5, 6, true);
        }
        cy += fH;
      });

      let cW = wD - arbW - hW;
      let oC = ML + arbW + hW;
      cy = Y;
      B(oC, cy, cW, fH);
      T('CONTAGENS', oC + cW/2, cy + 3.5, 4.5, true, 'center');
      cy += fH;
      ['1º Período', '2º Período', 'Período Extra', 'Penalidades', 'FINAL'].forEach((p, i) => {
        B(oC, cy, cW, fH);
        let s2c = cW * 0.7;
        VL(oC + s2c, cy, fH);
        T(p, oC + 1, cy + 3.5, 4.5, true);
        if (i === 4) {
          let fs = (data.homeScore!==''&&data.awayScore!=='') ? data.homeScore + ' X ' + data.awayScore : 'X';
          T(fs, oC + s2c + (cW-s2c)/2, cy + 4, 6, true, 'center');
        } else {
          T('X', oC + s2c + (cW-s2c)/2, cy + 3.5, 4.5, true, 'center');
        }
        cy += fH;
      });

      doc.setFontSize(4); doc.setTextColor(160,160,160);
      doc.text('Liga de Futsal Escolar — ' + new Date().toLocaleDateString('pt-BR'), half, PH-1, {align:'center'});
      const fileName = `sumula_${(game.category||'jogo').replace(/\s+/g,'_')}_${(homeTeam.name||'A').split(' ')[0]}_vs_${(awayTeam.name||'B').split(' ')[0]}.pdf`;
      doc.save(fileName);
      console.log("PDF finalizado!");
    } catch (err: any) {
      console.error("ERRO GERAL:", err);
      alert("ERRO CRÍTICO AO GERAR: " + (err.message || 'Desconhecido') + "\nVeja o console (F12).");
    }
  };

  const DataTable = ({ title, data, columns, onAdd, onEdit, onDelete, onMoveUp, onMoveDown, extraActions }: any) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="font-display text-xl text-white">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{data.length} registros encontrados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportToPDF(data, title, columns)} className="flex items-center gap-2 px-3 py-1.5 bg-dark border border-dark-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-all text-xs">
            <Download className="w-3 h-3" /> PDF
          </button>
          <button onClick={() => exportToExcel(data, title)} className="flex items-center gap-2 px-3 py-1.5 bg-dark border border-dark-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-all text-xs">
            <Download className="w-3 h-3" /> EXCEL
          </button>
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded hover:bg-primary-dark transition-all text-sm font-semibold ml-2">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
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
                  {extraActions && extraActions(item)}
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
        { label: "NOME", key: "name", render: (t: any) => <span className="font-display text-white">{t.name}</span>, renderText: (t: any) => t.name },
        { label: "CIDADE", key: "city", renderText: (t: any) => t.city },
        { label: "CATEGORIAS", key: "categories", renderText: (t: any) => t.categories }
      ]}
      onAdd={() => { setCurrentData({}); setModalType('team'); }}
      onEdit={(team: any) => { setCurrentData(team); setModalType('team'); }}
      onDelete={(id: any) => handleDelete(id, 'lfe_teams', teams, setTeams)}
    />
  );

  const renderAthletes = () => (
    <DataTable 
      title="GERENCIAR ATLETAS" data={athletes}
      columns={[
        { label: "FOTO", render: (a: any) => a.photo ? <img src={a.photo} className="w-10 h-10 object-cover rounded-full" /> : <Users className="w-8 h-8 text-gray-500" /> },
        { label: "NOME", key: "name", render: (a: any) => <span className="font-display text-white">{a.name}</span>, renderText: (a: any) => a.name },
        { label: "EQUIPE", render: (a: any) => teams.find(t => String(t.id) === String(a.teamId || a.team_id))?.name || "Desconhecida", renderText: (a: any) => teams.find(t => String(t.id) === String(a.teamId || a.team_id))?.name || "Desconhecida" },
        { label: "NÚMERO", key: "number", renderText: (a: any) => a.number },
        { label: "CATEGORIA", key: "category", renderText: (a: any) => a.category }
      ]}
      onAdd={() => { setCurrentData({}); setModalType('athlete'); }}
      onEdit={(athlete: any) => { setCurrentData(athlete); setModalType('athlete'); }}
      onDelete={(id: any) => handleDelete(id, 'lfe_athletes', athletes, setAthletes)}
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
        onDelete={(id: number) => handleDelete(id, 'lfe_banners', banners, setBanners)}
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
        onDelete={(id: number) => handleDelete(id, 'lfe_gallery', gallery, setGallery)}
      />
    </>
  );

  const renderSponsors = () => {
    const moveSponsor = (id: number, direction: 'up' | 'down', type: 'premium' | 'official') => {
      const collection = type === 'premium' ? [...sponsorsPremium] : [...sponsorsOfficial];
      const setCollection = type === 'premium' ? setSponsorsPremium : setSponsorsOfficial;
    const index = collection.findIndex(s => String(s.id) === String(id));
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
          onDelete={(id: number) => handleDelete(id, 'lfe_sponsors', sponsorsPremium, setSponsorsPremium)}
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
          onDelete={(id: number) => handleDelete(id, 'lfe_sponsors', sponsorsOfficial, setSponsorsOfficial)}
          onMoveUp={(id: number) => moveSponsor(id, 'up', 'official')}
          onMoveDown={(id: number) => moveSponsor(id, 'down', 'official')}
        />
      </>
    );
  };

  const renderTechnicalDocs = () => (
    <>
      <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded mb-6 flex gap-3 text-sm">
        <Folder className="w-5 h-5 flex-shrink-0" />
        <p>Gerencie os comunicados e documentos do Dep. Técnico. Estes arquivos aparecerão na página pública de Dep. Técnico para os chefes de equipe. Formatos recomendados: PDF.</p>
      </div>
      <DataTable 
        title="DOCUMENTOS TÉCNICOS E ATOS OFICIAIS" data={technicalDocs}
        columns={[
          { label: "CATEGORIA", key: "category", renderText: (d: any) => d.category },
          { label: "TÍTULO", key: "title", render: (d: any) => <span className="font-display text-white">{d.title}</span>, renderText: (d: any) => d.title },
          { label: "DATA", key: "date", renderText: (d: any) => d.date }
        ]}
        onAdd={() => { setCurrentData({ category: 'NOTAS OFICIAIS', date: new Date().toLocaleDateString('pt-BR') }); setModalType('tech_doc'); }}
        onEdit={(d: any) => { setCurrentData(d); setModalType('tech_doc'); }}
        onDelete={(id: number) => handleDelete(id, 'lfe_technical_documents', technicalDocs, setTechnicalDocs)}
      />
    </>
  );

  const renderSettings = () => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-2xl">
      <h3 className="font-display text-xl text-white mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" /> CONFIGURAÇÕES GERAIS
      </h3>
      <form onSubmit={async (e) => { 
        e.preventDefault();
        try {
          const payload = {
            event_name: settings.eventName || settings.event_name,
            year_edition: settings.yearEdition || settings.year_edition,
            registration_period: settings.registrationPeriod || settings.registration_period || 'aberto',
            institutional_video_url: settings.institutionalVideoUrl || settings.institutional_video_url,
            league_logo: settings.leagueLogo || settings.league_logo,
            rules_url: settings.rulesUrl || settings.rules_url,
            rules_name: settings.rulesName || settings.rules_name,
            ...(settings.id ? { id: settings.id } : {})
          };
          await supaUpsert('lfe_settings', payload);
          alert('Configurações salvas com sucesso!');
        } catch (err: any) {
          alert('Erro ao salvar configurações: ' + (err.message || 'Verifique o console.'));
        }
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

  // Authentication Supabase
  const [email, setEmail] = useState('admin@lfe.com');
  const [password, setPassword] = useState('123456');
  const [authError, setAuthError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoginLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message === 'Invalid login credentials' 
          ? 'E-mail ou senha inválidos.' 
          : 'Erro ao autenticar: ' + error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
        localStorage.setItem('lfe_admin_authenticated', 'true');
      } else if (data.user) {
        setAuthError('E-mail ainda pendente de confirmação. Verifique sua caixa de entrada.');
      } else {
        setAuthError('Falha ao obter sessão do servidor.');
      }
    } catch (err) {
      setAuthError('Erro de conexão ao servidor Supabase.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-border">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-white mb-8 text-center">ÁREA RESTRITA</h2>
          
          {authError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={labelClass}>E-mail</label>
              <input 
                type="email" 
                required 
                className={inputClass} 
                placeholder="admin@lfe.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input 
                type="password" 
                required 
                className={inputClass} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-dark font-display text-lg rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>
          <div className="mt-6 p-4 bg-dark border border-dark-border rounded text-xs text-gray-400">
            <p className="font-bold text-gray-300 mb-1">Acesso via Supabase Auth</p>
            <p>Para criar o login, vá no Dashboard do Supabase → Authentication → Add User → Create New User. Cadastre o e-mail e senha desejados.</p>
          </div>
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
        <div className="px-6 py-4 border-b border-dark-border bg-dark/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)]">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Administrador LFE</p>
              <p className="text-xs text-gray-400">Acesso Master</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest mt-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: "Dashboard", icon: Activity },
            { id: "Inscrições", icon: Database },
            { id: "Súmulas", icon: ClipboardList },
            { id: "Banners", icon: Image },
            { id: "Galeria", icon: Camera },
            { id: "Dep. Técnico", icon: Folder },
            { id: "Equipes", icon: Shield },
            { id: "Atletas", icon: Users },
            { id: "Jogos", icon: Calendar },
            { id: "Patrocinadores", icon: Star },
            { id: "Configurações", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
          <button onClick={handleAdminLogout} className="flex items-center gap-2 px-4 py-2 border border-dark-border text-gray-400 rounded hover:text-white hover:border-gray-500 transition-colors font-display text-sm uppercase">
            <LogOut className="w-4 h-4" /> SAIR
          </button>
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
              { label: "STATUS", render: (r: any) => <span className={cn("px-2 py-1 rounded text-xs uppercase font-bold", r.status === 'Pendente' ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500")}>{r.status}</span>}
            ]}
            onAdd={() => alert("As inscrições são feitas pelo portal público.")}
            onEdit={(r: any) => handleApproveRegistration(r)}
            onDelete={(id: any) => handleDelete(id, 'lfe_registrations', registrations, setRegistrations)}
            extraActions={(r: any) => r.status === 'Pendente' && (
              <button 
                onClick={() => handleApproveRegistration(r)} 
                className="ml-2 px-3 py-1 bg-green-600 text-white border border-green-700/30 rounded text-[10px] font-bold uppercase hover:bg-green-700 transition-all shadow-sm"
                title="Ativar Acesso do Chefe de Equipe"
              >
                Homologar
              </button>
            )}
          />
        )}
        {activeTab === "Banners" && renderBanners()}
        {activeTab === "Galeria" && renderGallery()}
        {activeTab === "Dep. Técnico" && renderTechnicalDocs()}
        {activeTab === "Equipes" && renderTeams()}
        {activeTab === "Atletas" && renderAthletes()}
        {activeTab === "Jogos" && (
          <DataTable 
            title="GERENCIAR JOGOS" data={games}
            columns={[
              { label: "CATEGORIA", key: "category", renderText: (g: any) => g.category },
              { label: "DATA/HORA", render: (g: any) => `${g.date} às ${g.time}`, renderText: (g: any) => `${g.date} às ${g.time}` },
              { label: "CONFRONTO", render: (g: any) => `${teams.find(t=>String(t.id)===String(g.homeTeamId || g.home_team_id))?.name || "A"} vs ${teams.find(t=>String(t.id)===String(g.awayTeamId || g.away_team_id))?.name || "B"}`, renderText: (g: any) => `${teams.find(t=>String(t.id)===String(g.homeTeamId || g.home_team_id))?.name || "A"} vs ${teams.find(t=>String(t.id)===String(g.awayTeamId || g.away_team_id))?.name || "B"}` },
              { label: "STATUS", key: "status", renderText: (g: any) => g.status }
            ]}
            onAdd={() => { setCurrentData({ events: [] }); setModalType('game'); }}
            onEdit={(g: any) => { setCurrentData(g); setModalType('game'); }}
            onDelete={(id: any) => handleDelete(id, 'lfe_games', games, setGames)}
            extraActions={(g: any) => (
              <button onClick={() => { setSumulaState((p: any) => ({...p, selectedGameId: g.id})); setActiveTab('Súmulas'); }} className="p-2 text-primary hover:bg-primary/10 rounded" title="Abrir Súmula">
                <FileText className="w-4 h-4" />
              </button>
            )}
          />
        )}
        {activeTab === "Patrocinadores" && renderSponsors()}
        {activeTab === "Configurações" && renderSettings()}
        {activeTab === "Súmulas" && (
          <SumulasTab
            games={games}
            teams={teams}
            athletes={athletes}
            sumulaState={sumulaState}
            setSumulaState={setSumulaState}
            selectedGame={selectedGame}
            homeTeam={sumulaHomeTeam}
            awayTeam={sumulaAwayTeam}
            homeAthletes={sumulaHomeAthletes}
            awayAthletes={sumulaAwayAthletes}
            addEvent={addEvent}
            removeEvent={removeEvent}
            generateSumulaPDF={generateSumulaPDF}
          />
        )}
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
          <select required className={inputClass} value={String(currentData.teamId || currentData.team_id || '')} onChange={e => setCurrentData({...currentData, teamId: e.target.value})}>
            <option value="">Selecione a equipe</option>
            {teams.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
          </select>
          <label className={labelClass}>Número</label>
          <input required type="number" className={inputClass} value={currentData.number || ''} onChange={e => setCurrentData({...currentData, number: e.target.value})} />
          <label className={labelClass}>Categoria</label>
          <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
             <option value="">Selecione</option>
             {["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"].map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fase / Grupo</label>
              <select className={inputClass} value={currentData.phase || 'Classificatória'} onChange={e => setCurrentData({...currentData, phase: e.target.value})}>
                <option value="Classificatória">Classificatória</option>
                <option value="Grupo A">Grupo A</option>
                <option value="Grupo B">Grupo B</option>
                <option value="Grupo C">Grupo C</option>
                <option value="Quartas">Quartas de Final</option>
                <option value="Semifinal">Semifinal</option>
                <option value="Final">Final</option>
                <option value="Amistoso">Amistoso</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Categoria do Jogo</label>
              <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
                <option value="">Selecione</option>
                {["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <label className={labelClass}>Equipes</label>
          <div className="flex gap-4">
            <select required className={inputClass} value={String(currentData.homeTeamId || currentData.home_team_id || '')} onChange={e => setCurrentData({...currentData, homeTeamId: e.target.value})}>
              <option value="">CASA</option>{teams.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
            </select>
            <select required className={inputClass} value={String(currentData.awayTeamId || currentData.away_team_id || '')} onChange={e => setCurrentData({...currentData, awayTeamId: e.target.value})}>
              <option value="">FORA</option>{teams.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
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
                   {athletes.filter(a => String(a.teamId || a.team_id) === String(currentData.homeTeamId || currentData.home_team_id) || String(a.teamId || a.team_id) === String(currentData.awayTeamId || currentData.away_team_id)).map(a => (
                     <option key={a.id} value={a.id}>{a.name} ({String(a.teamId || a.team_id) === String(currentData.homeTeamId || currentData.home_team_id) ? 'Casa' : 'Fora'})</option>
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
                   const athlete = athletes.find(a => a.id === pid);
                   const events = currentData.events || [];
                   setCurrentData({...currentData, events: [...events, { id: Date.now(), playerId: pid, type, teamId: athlete.teamId || athlete.team_id }]});
                 }} className="px-3 py-1 bg-primary text-dark font-bold text-xs rounded">Add</button>
               </div>
               
               <div className="space-y-1 mt-4 max-h-32 overflow-y-auto pr-2">
                 {(currentData.events || []).map((ev: any) => (
                   <div key={ev.id} className="flex justify-between items-center text-xs text-gray-300 bg-dark-card p-2 rounded border border-dark-border">
                     <span>{athletes.find((a: any) => String(a.id) === String(ev.playerId))?.name || "Desconhecido"} - {ev.type === 'goal' ? 'GOL ⚽' : ev.type === 'yellow' ? 'AMARELO 🟨' : 'VERMELHO 🟥'}</span>
                     <button type="button" onClick={() => setCurrentData({...currentData, events: currentData.events.filter((e:any)=> String(e.id) !== String(ev.id))})} className="text-danger hover:text-red-400 font-bold">X</button>
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
          <label className={labelClass}>Upload de Imagem (ou URL direta)</label>
          <div className="flex items-center gap-4 mb-2">
            {currentData.image ? <img src={currentData.image} className="w-24 h-12 object-cover rounded shadow border border-dark-border" /> : <div className="w-24 h-12 bg-dark rounded border border-dark-border flex items-center justify-center flex-shrink-0"><Image className="w-5 h-5 text-gray-500" /></div>}
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                 const img = new window.Image();
                 img.onload = () => {
                   resizeImage(file, 1920, 1080).then(base64 => {
                     setCurrentData((prev: any) => ({ ...prev, image: base64, dimensions: `${img.width}x${img.height}` }));
                   });
                 };
                 img.src = URL.createObjectURL(file);
              }
            }} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark hover:file:bg-primary-dark" />
          </div>
          {currentData.dimensions && <p className="text-xs text-primary font-bold mb-4">Dimensões da Imagem: {currentData.dimensions}px</p>}
          <input required type="text" className={inputClass} value={currentData.image || ''} onChange={e => setCurrentData({...currentData, image: e.target.value})} placeholder="https://images.unsplash... ou faça upload" />
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

      <Modal isOpen={modalType === 'tech_doc'} onClose={closeModal} title={currentData?.id ? "Editar Documento" : "Novo Documento Técnico"}>
        <form onSubmit={(e) => handleSave(e, 'tech_doc', technicalDocs, setTechnicalDocs)}>
          <label className={labelClass}>Título do Documento</label>
          <input required type="text" className={inputClass} value={currentData.title || ''} onChange={e => setCurrentData({...currentData, title: e.target.value})} placeholder="Ex: NOTA OFICIAL 001/2026 - ABERTURA" />
          
          <label className={labelClass}>Categoria</label>
          <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
             <option value="NOTAS OFICIAIS">NOTAS OFICIAIS</option>
             <option value="REGULAMENTOS">REGULAMENTOS</option>
             <option value="NORMAS">NORMAS</option>
             <option value="SÚMULAS">SÚMULAS</option>
             <option value="COMUNICADOS">COMUNICADOS</option>
             <option value="BOLETIM">BOLETIM</option>
             <option value="FORMULÁRIOS">FORMULÁRIOS</option>
          </select>

          <label className={labelClass}>Data (Exibição)</label>
          <input required type="text" className={inputClass} value={currentData.date || ''} onChange={e => setCurrentData({...currentData, date: e.target.value})} />
          
          <label className={labelClass}>Upload do PDF ou URL</label>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-dark border border-dark-border text-gray-300 rounded hover:text-white hover:border-primary transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{currentData.url ? "Substituir PDF" : "Anexar PDF"}</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                     setCurrentData((prev: any) => ({...prev, url: reader.result as string, size: (file.size / 1024).toFixed(0) + " KB"}));
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
            {currentData.url && (
               <div className="flex items-center gap-2 text-primary text-xs">
                 <Check className="w-4 h-4" /> Arquivo anexado ({currentData.size})
               </div>
            )}
          </div>
          <input type="text" className={inputClass} placeholder="Ou inserir URL do PDF..." value={currentData.url || ''} onChange={e => setCurrentData({...currentData, url: e.target.value})} />
          
          <button type="submit" className="w-full py-2 mt-4 bg-primary text-dark font-display rounded hover:bg-primary-dark uppercase">Salvar Documento</button>
        </form>
      </Modal>

    </div>
  );
}
function SumulasTab({ games, teams, athletes, sumulaState, setSumulaState, selectedGame, homeTeam, awayTeam, homeAthletes, awayAthletes, addEvent, removeEvent, generateSumulaPDF }: any) {
  const [newEvent, setNewEvent] = useState({ side: 'home', type: 'gol', playerId: '', minute: '' });
  const inputCls = "w-full px-3 py-2 bg-dark border border-dark-border rounded text-white text-sm focus:outline-none focus:border-primary transition-colors";

  const eventTypeLabel = (t: string) => t === 'gol' ? '⚽ Gol' : t === 'amarelo' ? '🟨 Cartão Amarelo' : '🟥 Cartão Vermelho';
  const athleteOptions = (side: string) => side === 'home' ? homeAthletes : awayAthletes;

  return (
    <div className="space-y-6">
      {/* Game Selector */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" /> SELECIONAR JOGO</h3>
        <select
          value={sumulaState.selectedGameId || ''}
          onChange={e => setSumulaState((p: any) => ({ ...p, selectedGameId: e.target.value, homeEvents: [], awayEvents: [] }))}
          className={inputCls}
        >
          <option value="">-- Selecione um jogo para gerar a súmula --</option>
          {games.map((g: any) => {
            const ht = teams.find((t: any) => String(t.id) === String(g.homeTeamId || g.home_team_id));
            const at = teams.find((t: any) => String(t.id) === String(g.awayTeamId || g.away_team_id));
            return (
              <option key={g.id} value={g.id}>
                [{g.category}] {ht?.name || 'Casa'} vs {at?.name || 'Fora'} — {g.date} {g.time}
              </option>
            );
          })}
        </select>
      </div>

      {selectedGame && (
        <>
          {/* Match Preview */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="font-display text-xl text-white">{homeTeam?.name || 'Mandante'}</div>
                <div className="text-xs text-gray-500 mt-1">MANDANTE</div>
              </div>
              <div className="text-4xl font-display text-primary">VS</div>
              <div className="text-center">
                <div className="font-display text-xl text-white">{awayTeam?.name || 'Visitante'}</div>
                <div className="text-xs text-gray-500 mt-1">VISITANTE</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 justify-center">
              <span>📅 {selectedGame.date}</span>
              <span>⏰ {selectedGame.time}</span>
              <span>📍 {selectedGame.location}</span>
              <span>🏆 {selectedGame.category}</span>
            </div>
          </div>

          {/* Referee & Scores */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg text-white border-b border-dark-border pb-3">DADOS DA PARTIDA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Árbitro Principal</label>
                <input className={inputCls} value={sumulaState.referee} onChange={e => setSumulaState((p: any) => ({...p, referee: e.target.value}))} placeholder="Nome do árbitro" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Assistente 1</label>
                <input className={inputCls} value={sumulaState.assistant1} onChange={e => setSumulaState((p: any) => ({...p, assistant1: e.target.value}))} placeholder="Nome do assistente" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Assistente 2</label>
                <input className={inputCls} value={sumulaState.assistant2} onChange={e => setSumulaState((p: any) => ({...p, assistant2: e.target.value}))} placeholder="Nome do assistente" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Gols {homeTeam?.name}</label>
                <input type="number" min="0" className={inputCls} value={sumulaState.homeScore} onChange={e => setSumulaState((p: any) => ({...p, homeScore: e.target.value}))} placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Gols {awayTeam?.name}</label>
                <input type="number" min="0" className={inputCls} value={sumulaState.awayScore} onChange={e => setSumulaState((p: any) => ({...p, awayScore: e.target.value}))} placeholder="0" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-display uppercase block mb-1">Observações</label>
              <textarea className={inputCls + ' min-h-[70px] resize-y'} value={sumulaState.observations} onChange={e => setSumulaState((p: any) => ({...p, observations: e.target.value}))} placeholder="Observações do árbitro..." />
            </div>
          </div>

          {/* Events Input */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg text-white border-b border-dark-border pb-3">REGISTRAR EVENTOS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Equipe</label>
                <select className={inputCls} value={newEvent.side} onChange={e => setNewEvent(p => ({...p, side: e.target.value, playerId: ''}))}
                >
                  <option value="home">{homeTeam?.name || 'Mandante'}</option>
                  <option value="away">{awayTeam?.name || 'Visitante'}</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Tipo</label>
                <select className={inputCls} value={newEvent.type} onChange={e => setNewEvent(p => ({...p, type: e.target.value}))}>
                  <option value="gol">⚽ Gol</option>
                  <option value="amarelo">🟨 Amarelo</option>
                  <option value="vermelho">🟥 Vermelho</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Atleta</label>
                <select className={inputCls} value={newEvent.playerId} onChange={e => setNewEvent(p => ({...p, playerId: e.target.value}))}>
                  <option value="">-- Atleta --</option>
                  {athleteOptions(newEvent.side).map((a: any) => (
                    <option key={a.id} value={a.id}>#{a.number} {a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-display uppercase block mb-1">Minuto</label>
                <div className="flex gap-2">
                  <input type="number" min="1" max="40" className={inputCls} value={newEvent.minute} onChange={e => setNewEvent(p => ({...p, minute: e.target.value}))} placeholder="Ex: 12" />
                  <button
                    onClick={() => {
                      if (!newEvent.playerId) return;
                      addEvent(newEvent.side as any, newEvent.type, newEvent.playerId, newEvent.minute);
                      setNewEvent(p => ({...p, playerId: '', minute: ''}));
                    }}
                    className="px-3 py-2 bg-primary text-dark rounded font-display text-sm font-bold hover:bg-white transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            {(sumulaState.homeEvents.length > 0 || sumulaState.awayEvents.length > 0) && (
              <div className="space-y-2 mt-4">
                <div className="text-xs font-display text-gray-400 uppercase tracking-widest mb-2">Eventos Registrados:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[...sumulaState.homeEvents.map((e: any, i: number) => ({...e, side: 'home', idx: i})),
                    ...sumulaState.awayEvents.map((e: any, i: number) => ({...e, side: 'away', idx: i}))]
                    .sort((a, b) => Number(a.minute) - Number(b.minute))
                    .map((e: any, i: number) => {
                      const team = e.side === 'home' ? homeTeam : awayTeam;
                      const athlete = athletes.find((a: any) => String(a.id) === String(e.playerId));
                      return (
                        <div key={i} className="flex items-center justify-between bg-dark px-3 py-2 rounded border border-dark-border">
                          <span className="text-sm">
                            {e.minute && <span className="text-primary font-display mr-2">{e.minute}'</span>}
                            {eventTypeLabel(e.type)} — {athlete?.name || '?'}
                            <span className="text-gray-500 text-xs ml-2">({team?.name})</span>
                          </span>
                          <button onClick={() => removeEvent(e.side, e.idx)} className="text-red-500 hover:text-red-400 ml-2 text-xs">✕</button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Rosters Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{team: homeTeam, players: homeAthletes, label: 'MANDANTE'}, {team: awayTeam, players: awayAthletes, label: 'VISITANTE'}].map(({team, players, label}) => (
              <div key={label} className="bg-dark-card border border-dark-border rounded-xl p-4">
                <h4 className="font-display text-sm text-primary uppercase tracking-widest mb-3">{label} — {team?.name}</h4>
                {players.length === 0 ? (
                  <div className="text-gray-500 text-xs py-4 text-center border border-dashed border-dark-border rounded">
                    Nenhum atleta cadastrado nesta categoria para esta equipe.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {players.map((a: any) => (
                      <div key={a.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-dark-border/50">
                        <span className="w-7 h-7 bg-dark rounded flex items-center justify-center text-xs font-display text-primary border border-dark-border shrink-0">{a.number || '-'}</span>
                        <span className="text-gray-200 flex-1">{a.name}</span>
                        <span className="text-gray-500 text-xs">{a.position}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end pt-4">
            <button
              onClick={() => generateSumulaPDF({...sumulaState, homeScore: '', awayScore: '', homeEvents: [], awayEvents: [], referee: '', assistant1: '', assistant2: '', observations: ''})}
              className="flex items-center gap-2 px-6 py-3 bg-dark border border-dark-border text-gray-300 rounded-xl hover:border-primary hover:text-primary transition-all font-display text-sm"
            >
              <FileText className="w-4 h-4" /> SúM. EM BRANCO (IMPRESSÃO)
            </button>
            <button
              onClick={() => generateSumulaPDF()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-dark rounded-xl hover:bg-white transition-all font-display text-sm font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              <Download className="w-4 h-4" /> SÚM. PREENCHIDA (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
