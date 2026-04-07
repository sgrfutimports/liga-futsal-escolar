import React, { useState, useEffect } from "react";
import { Lock, Settings, Users, Trophy, Calendar, Database, Search, Filter, Check, X, Eye, Plus, Edit, Trash, Activity, Shield, Upload, Image, Video, Star, Camera, FileText, Download, Folder, LogOut, ClipboardList, ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { cn } from "@/src/lib/utils";
import { resizeImage, defaultData, supaFetch, supaUpsert, supaInsert, supaUpdate, supaDelete } from "@/src/lib/store";

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

  const typeToTable: any = {
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
      // Sync to Supabase
      await supaUpsert(table, currentData);
      
      // Update local state
      if (currentData.id) {
        setCollection(collection.map((item: any) => item.id === currentData.id ? currentData : item));
      } else {
        // Refresh after insert to get proper UUID/ID from DB
        const refreshed = await supaFetch(table);
        if (refreshed) setCollection(refreshed);
      }
      closeModal();
    } catch (err) {
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const handleDelete = async (table: any, id: any, collection: any[], setCollection: any) => {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    try {
      await supaDelete(table, id);
      setCollection(collection.filter(item => item.id !== id));
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
        categories: reg.categories || '',
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
      setRegistrations(prev => prev.map(r => r.id === reg.id
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
  const [sumuiaState, setSumulaState] = useState<any>({
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

  const selectedGame = games.find((g: any) => g.id === sumuiaState.selectedGameId);
  const sumulaHomeTeam = selectedGame ? teams.find((t: any) => t.id === Number(selectedGame.homeTeamId || selectedGame.home_team_id)) : null;
  const sumulaAwayTeam = selectedGame ? teams.find((t: any) => t.id === Number(selectedGame.awayTeamId || selectedGame.away_team_id)) : null;
  const sumulaHomeAthletes = selectedGame ? athletes.filter((a: any) => {
    const sameTeam = Number(a.teamId || a.team_id) === Number(selectedGame.homeTeamId || selectedGame.home_team_id);
    const sameCategory = !selectedGame.category || a.category === selectedGame.category;
    return sameTeam && sameCategory;
  }) : [];
  const sumulaAwayAthletes = selectedGame ? athletes.filter((a: any) => {
    const sameTeam = Number(a.teamId || a.team_id) === Number(selectedGame.awayTeamId || selectedGame.away_team_id);
    const sameCategory = !selectedGame.category || a.category === selectedGame.category;
    return sameTeam && sameCategory;
  }) : [];

  const addEvent = (side: 'home' | 'away', type: string, playerId: string, minute: string) => {
    const key = side === 'home' ? 'homeEvents' : 'awayEvents';
    setSumulaState((prev: any) => ({ ...prev, [key]: [...prev[key], { type, playerId, minute }] }));
  };

  const removeEvent = (side: 'home' | 'away', idx: number) => {
    const key = side === 'home' ? 'homeEvents' : 'awayEvents';
    setSumulaState((prev: any) => ({ ...prev, [key]: prev[key].filter((_: any, i: number) => i !== idx) }));
  };

  const generateSumulaPDF = async (sumulaData?: any) => {
    const data = sumulaData || sumuiaState;
    const game = sumulaData ? games.find((g: any) => g.id === sumulaData.selectedGameId) : selectedGame;
    if (!game) return;

    const homeTeam: any = teams.find((t: any) => t.id === Number(game.homeTeamId || game.home_team_id)) || { name: 'Equipe A' };
    const awayTeam: any = teams.find((t: any) => t.id === Number(game.awayTeamId || game.away_team_id)) || { name: 'Equipe B' };
    const homeAths = athletes.filter((a: any) =>
      Number(a.teamId || a.team_id) === Number(game.homeTeamId || game.home_team_id) && (!game.category || a.category === game.category));
    const awayAths = athletes.filter((a: any) =>
      Number(a.teamId || a.team_id) === Number(game.awayTeamId || game.away_team_id) && (!game.category || a.category === game.category));
    const evH: any[] = data.homeEvents || [];
    const evA: any[] = data.awayEvents || [];

    const doc = new jsPDF({ orientation: 'landscape', format: 'a4', unit: 'mm' });
    const PW = 297, PH = 210, ML = 3, MR = 3, MT = 2;
    const half = PW / 2; // 148.5 – divides the two teams

    // Image helper
    const loadImg = (url: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    const leagueLogo = await loadImg('/logos/logo.jpg');
    const kagivaLogo = await loadImg('/logos/BC_ENERGIA_LOGO.jpg'); // Using available as placeholder for Kagiva
    const homeLogoImg = homeTeam.logo ? await loadImg(homeTeam.logo) : null;
    const awayLogoImg = awayTeam.logo ? await loadImg(awayTeam.logo) : null;

    // Column widths per team half
    const cReg = 6, cName = 37, cNum = 5, cAm = 4, cVm = 4;
    const cFixed = cReg + cName + cNum + cAm + cVm; // 56
    const cSubs = 4, cSubW = 3.8, cSubsTotal = cSubs * cSubW; // 15.2
    const teamW = half - ML; // ~145.5mm
    const cSepW = 1.2; // separator "|" column
    const numSeps = 2, numGols = 34;
    const cGolsArea = teamW - cFixed - cSubsTotal;
    const cGol = (cGolsArea - numSeps * cSepW) / numGols;

    const golNums: (number | '|')[] = [
      1,2,3,4,5,6,7,8,9,10,'|',
      11,12,13,14,15,16,17,18,19,20,'|',
      21,22,23,24,25,26,27,28,29,30,
      31,32,33,34
    ];

    // helpers
    const B = (x: number, y: number, w: number, h: number) => doc.rect(x, y, w, h, 'S');
    const F = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
      doc.setFillColor(r, g, b); doc.rect(x, y, w, h, 'F');
    };
    const FB = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
      doc.setFillColor(r, g, b); doc.rect(x, y, w, h, 'FD');
    };
    const T = (s: string, x: number, y: number, size = 6, bold = false,
               align: 'left'|'center'|'right' = 'left', col: [number,number,number] = [0,0,0]) => {
      doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...col); doc.text(s, x, y, { align });
    };
    const VL = (x: number, y: number, h: number) => doc.line(x, y, x, y + h);

    doc.setDrawColor(0,0,0); doc.setLineWidth(0.2);

    // ── HEADER ────────────────────────────────────────────────────────────
    let Y = MT;
    const hH = 10;
    FB(ML, Y, PW-ML-MR, hH, 15, 15, 15);
    T('LIGA DE FUTSAL ESCOLAR — GARANHUNS/PE', ML+25, Y+6.5, 14, true, 'left', [204,255,0]);
    T('Súmula de Futsal', half+45, Y+6.5, 14, true, 'left', [255,255,255]);
    
    // Liga Logo
    if (leagueLogo) {
      doc.addImage(leagueLogo, 'JPEG', ML+2, Y+1, 18, hH-2);
      doc.addImage(leagueLogo, 'JPEG', PW-MR-17, Y+1, 15, hH-2);
    } else {
      FB(PW-MR-17, Y+1, 15, hH-2, 180, 0, 0);
      T('LOGO', PW-MR-9.5, Y+6, 5, true, 'center', [255,255,255]);
    }
    Y += hH;

    // ── INFO ROWS (3 × 4mm) ────────────────────────────────────────────────
    const iH = 4.2;
    // Row 1
    B(ML, Y, PW-ML-MR, iH); VL(half, Y, iH); VL(PW-MR-55, Y, iH);
    T('CAMPEONATO: Liga de Futsal Escolar 2026', ML+1, Y+3, 5.5);
    T('Jogo Nº: '+(game.id||'___'), half+1, Y+3, 5.5);
    T('Horário: '+(game.time||'__:__'), PW-MR-54, Y+3, 5.5);
    Y += iH;
    // Row 2
    B(ML, Y, PW-ML-MR, iH);
    VL(ML+18, Y, iH); VL(ML+82, Y, iH); VL(ML+98, Y, iH); VL(ML+112, Y, iH);
    VL(half+1, Y, iH); VL(half+58, Y, iH);
    T('Etapa:', ML+1, Y+3, 5);
    T('LOCAL: '+(game.location||'______________________'), ML+19, Y+3, 5);
    T('Divisão', ML+83, Y+3, 5); T('Fase: '+(game.category||'__'), ML+99, Y+3, 5);
    T('Data: '+(game.date||'__/__/____'), half+2, Y+3, 5);
    T('Naipe: Futsal Escolar', half+59, Y+3, 5);
    Y += iH;
    // Row 3
    B(ML, Y, PW-ML-MR, iH);
    VL(ML+38, Y, iH); VL(half-10, Y, iH); VL(half+1, Y, iH);
    T('Futsal', ML+1, Y+3, 5);
    T('CHAVE: '+(game.category||'___'), ML+39, Y+3, 5);
    T('Estado: PE', half-9, Y+3, 5);
    T('Município: Garanhuns/PE    |   Santa Catarina 2026', half+2, Y+3, 5);
    Y += iH;

    // ── TEAM BLOCKS ────────────────────────────────────────────────────────
    const tbH = 16;
    FB(ML, Y, teamW, tbH, 245,245,245);
    FB(half, Y, teamW, tbH, 245,245,245);
    
    // VS oval - Fixed position and size to avoid overlap
    doc.setFillColor(255,255,255); 
    doc.ellipse(half, Y+8, 8, 5, 'FD');
    T('X', half, Y+10, 14, true, 'center', [0,0,0]);

    // Home
    T('Equipe [A]', ML+1, Y+4, 6, true);
    if (homeLogoImg) {
      doc.addImage(homeLogoImg, 'PNG', ML+2, Y+5, 10, 10);
      T(homeTeam.name, ML+13, Y+10, 9, true, 'left', [0,0,120]);
    } else {
      T(homeTeam.name, ML+2, Y+10, 9, true, 'left', [0,0,120]);
    }
    T('Saída', ML+1, Y+15, 4.5);
    doc.setDrawColor(80,80,80); doc.circle(ML+12, Y+14.2, 1.3, 'S'); doc.setDrawColor(0,0,0);

    // Away
    T('Equipe [B]', PW-MR-1, Y+4, 6, true, 'right');
    if (awayLogoImg) {
      doc.addImage(awayLogoImg, 'PNG', PW-MR-12, Y+5, 10, 10);
      T(awayTeam.name, PW-MR-14, Y+10, 9, true, 'right', [120,0,0]);
    } else {
      T(awayTeam.name, PW-MR-2, Y+10, 9, true, 'right', [120,0,0]);
    }
    T('Saída', PW-MR-14, Y+15, 4.5, false, 'right');
    doc.setDrawColor(80,80,80); doc.circle(PW-MR-16, Y+14.2, 1.3, 'S'); doc.setDrawColor(0,0,0);

    Y += tbH;

    // ── TIMEOUTS + FOULS ───────────────────────────────────────────────────
    const toH = 8;
    const drawTO = (sx: number, lbl: string) => {
      B(sx, Y, teamW, toH);
      T('Pedidos de Tempo '+lbl, sx+1, Y+2.5, 4.5, true);
      B(sx, Y+3, 22, 5); T('1º Período', sx+1, Y+6.5, 4);
      B(sx+22, Y+3, 22, 5); T('2º Período', sx+23, Y+6.5, 4);
      
      // Kagiva / Sponsor Logo area
      if (kagivaLogo) {
        doc.addImage(kagivaLogo, 'JPEG', sx+47, Y+0.5, 22, toH-1);
      } else {
        FB(sx+47, Y+0.5, 22, toH-1, 228,228,228);
        T('KAGIVA', sx+58, Y+5, 4.5, true, 'center', [100,100,100]);
      }

      T('Faltas Acumulativas', sx+73, Y+2, 4.5, true);
      T('1º Per.:', sx+73, Y+5, 4); for(let i=0;i<5;i++) B(sx+90+i*5, Y+3, 4.5, 2.5);
      T('2º Per.:', sx+73, Y+7.3, 4); for(let i=0;i<5;i++) B(sx+90+i*5, Y+5.8, 4.5, 2);
    };
    drawTO(ML, '[A]'); drawTO(half, '[B]');
    Y += toH;

    // ── TÉCNICO + CAPITÃO ──────────────────────────────────────────────────
    const tlH = 4;
    B(ML, Y, teamW, tlH); B(half, Y, teamW, tlH);
    T('Técnico:', ML+1, Y+3, 5, true); T('Capitão:', ML+cFixed+22, Y+3, 5, true);
    T('Técnico:', half+1, Y+3, 5, true); T('Capitão:', half+cFixed+22, Y+3, 5, true);
    Y += tlH;

    // ── COLUMN HEADERS ────────────────────────────────────────────────────
    const chH = 6;
    const DK: [number,number,number] = [30,30,30];

    const drawHdrs = (sx: number) => {
      let x = sx; const cy = Y;
      const hc = (w: number, tx: string, col: [number,number,number]=[255,255,255]) => {
        FB(x, cy, w, chH, ...DK); T(tx, x+0.5, cy+chH/2+1.5, 3.5, true, 'left', col); x += w;
      };
      hc(cReg,'Reg'); hc(cName,'ATLETAS'); hc(cNum,'nº');
      hc(cAm,'Am',[255,200,0]); hc(cVm,'Vm',[255,70,70]);
      // GOLS top banner
      const gX0 = x; const totGW = cGolsArea;
      FB(gX0, cy, totGW, chH/2, ...DK);
      T('GOLS', gX0+totGW/2, cy+chH/4+1, 4, true, 'center', [255,255,255]);
      // Goal number cells
      let gx = gX0; const ny = cy+chH/2; const nh = chH/2;
      for (const gn of golNums) {
        if (gn === '|') {
          FB(gx, ny, cSepW, nh, 50,50,50);
          T(':', gx+cSepW/2, ny+nh-0.5, 3, false, 'center', [200,200,200]);
          gx += cSepW;
        } else {
          const blue = gn === 11 || gn === 21;
          const bg: [number,number,number] = blue ? [0,60,160] : (Number(gn)%2===0?[230,230,230]:[255,255,255]);
          const ft: [number,number,number] = blue ? [255,255,255] : [0,0,0];
          FB(gx, ny, cGol, nh, ...bg);
          T(String(gn), gx+cGol/2, ny+nh-0.5, 3, false, 'center', ft);
          gx += cGol;
        }
      }
      // SUBSTITUIÇÕES
      x = gx;
      FB(x, cy, cSubsTotal, chH, ...DK);
      T('SUBSTITUIÇÕES', x+cSubsTotal/2, cy+chH/2+1.5, 3.5, true, 'center', [255,255,255]);
      for(let s=0;s<cSubs;s++) B(x+s*cSubW, cy, cSubW, chH);
    };
    drawHdrs(ML); drawHdrs(half);
    Y += chH;

    // ── PLAYER ROWS ───────────────────────────────────────────────────────
    const rH = 4.3;
    const maxR = 18;

    const drawRow = (sx: number, ath: any, evts: any[], idx: number) => {
      const even = idx%2===0;
      const rb: [number,number,number] = even ? [255,255,255] : [246,246,246];
      let x = sx;
      // registro
      FB(x, Y, cReg, rH, ...rb); x += cReg;
      // name
      FB(x, Y, cName, rH, ...rb);
      if(ath) T(ath.name, x+0.5, Y+rH/2+1.2, 4.3, false, 'left', [0,0,0]);
      x += cName;
      // nº
      FB(x, Y, cNum, rH, ...rb);
      if(ath) T(String(ath.number||''), x+cNum/2, Y+rH/2+1.2, 4.8, true, 'center');
      x += cNum;
      // Amarelo
      FB(x, Y, cAm, rH, ...rb);
      if(ath){ const n=evts.filter(e=>e.type==='amarelo'&&String(e.playerId)===String(ath.id)).length; if(n>0){FB(x+0.3,Y+0.3,cAm-0.6,rH-0.6,255,200,0);T(String(n),x+cAm/2,Y+rH/2+1.2,4.8,true,'center');} }
      x += cAm;
      // Vermelho
      FB(x, Y, cVm, rH, ...rb);
      if(ath){ const n=evts.filter(e=>e.type==='vermelho'&&String(e.playerId)===String(ath.id)).length; if(n>0){FB(x+0.3,Y+0.3,cVm-0.6,rH-0.6,210,20,20);T('V',x+cVm/2,Y+rH/2+1.2,4.8,true,'center',[255,255,255]);} }
      x += cVm;
      // Goal cells
      const tg = ath ? evts.filter(e=>e.type==='gol'&&String(e.playerId)===String(ath.id)).length : 0;
      let gi = 0;
      for(const gn of golNums) {
        if(gn==='|'){ FB(x,Y,cSepW,rH,200,200,200); x+=cSepW; }
        else {
          gi++;
          const mk = tg >= gi;
          FB(x, Y, cGol, rH, ...(mk?[20,160,20] as [number,number,number]:rb));
          if(mk) T('●', x+cGol/2, Y+rH/2+1.2, 2.8, false, 'center', [255,255,255]);
          else B(x, Y, cGol, rH);
          x += cGol;
        }
      }
      // Subs
      for(let s=0;s<cSubs;s++){ FB(x,Y,cSubW,rH,...rb); x+=cSubW; }
    };

    for(let r=0;r<maxR;r++) {
      drawRow(ML, homeAths[r]||null, evH, r);
      drawRow(half, awayAths[r]||null, evA, r);
      Y += rH;
    }

    // ── STAFF WITH GOAL COLUMNS (Técnico + Aux) ───────────────────────────
    const stH = 3.6;
    const drawStaffGoalRow = (label: string, ri: number) => {
      const rb: [number,number,number] = ri%2===0?[250,250,250]:[244,244,244];
      [ML, half].forEach(sx => {
        let x = sx;
        FB(x,Y,cReg,stH,...rb); x+=cReg;
        FB(x,Y,cName,stH,...rb); T(label,x+0.5,Y+stH/2+1.0,4.2); x+=cName;
        FB(x,Y,cNum,stH,...rb); x+=cNum;
        FB(x,Y,cAm,stH,...rb); x+=cAm;
        FB(x,Y,cVm,stH,...rb); x+=cVm;
        for(const gn of golNums){
          if(gn==='|'){FB(x,Y,cSepW,stH,200,200,200);x+=cSepW;}
          else{FB(x,Y,cGol,stH,...rb);B(x,Y,cGol,stH);x+=cGol;}
        }
        for(let s=0;s<cSubs;s++){FB(x,Y,cSubW,stH,...rb);x+=cSubW;}
      });
      Y += stH;
    };
    drawStaffGoalRow('Técnico:', 0);
    drawStaffGoalRow('Aux. Técnico:', 1);

    // Remaining staff (no goal columns)
    ['Prep. Físico:','Atendente:','Fisioterapeuta:','Supervisor:'].forEach((label, i) => {
      B(ML,Y,teamW,stH); T(label,ML+1,Y+stH/2+1.0,4.0);
      B(half,Y,teamW,stH); T(label,half+1,Y+stH/2+1.0,4.0);
      Y += stH;
    });

    // ── FOOTER ────────────────────────────────────────────────────────────
    const fY = Y, fH = PH - 2 - fY;
    FB(ML, fY, PW-ML-MR, fH, 240,240,240);

    // Arbitration block
    const arbW = 82;
    T('Equipe de Arbitragem:', ML+2, fY+3.5, 5.5, true);
    const arb = [
      ['ÁRBITRO 1:', data.referee||''],['ÁRBITRO 2:', data.assistant1||''],
      ['ANOTADOR:', data.assistant2||''],['CRONOMETRISTA:',''],['REPRESENTANTE:',''],
    ];
    let aY = fY+5;
    arb.forEach(([l, v]) => {
      B(ML,aY,arbW,4.2); T(l,ML+1,aY+3,5,true); T(v||'________________________________',ML+34,aY+3,5); aY+=4.2;
    });

    // Horário block
    const hX = ML+arbW+1, hW = 72, hCW = hW/3;
    T('HORÁRIO', hX+hW/2, fY+3.5, 5.5, true, 'center');
    let hY = fY+5;
    [['',hX],[' INÍCIO',hX+hCW],['TÉRMINO',hX+hCW*2]].forEach(([l,x]) => {
      FB(Number(x),hY,hCW,4,50,50,50); T(String(l),Number(x)+hCW/2,hY+3,4,true,'center',[255,255,255]);
    });
    hY += 4;
    ['1º Período','2º Período','Período Extra'].forEach(p => {
      B(hX,hY,hCW,5); T(p,hX+1,hY+3.5,4.5,true);
      B(hX+hCW,hY,hCW,5); B(hX+hCW*2,hY,hCW,5); hY+=5;
    });
    const wn = (data.homeScore!==''&&data.awayScore!=='')
      ? (Number(data.homeScore)>Number(data.awayScore)?homeTeam.name:Number(data.awayScore)>Number(data.homeScore)?awayTeam.name:'EMPATE')
      : '';
    FB(hX,hY,hW,5,20,20,20); T('VENCEDOR: '+wn,hX+1,hY+3.5,5,true,'left', [204, 255, 0]);

    // Contagens block
    const cX = hX+hW+1, cW = PW-MR-cX, cc = cW*2/3;
    T('CONTAGENS', cX+cW/2, fY+3.5, 5.5, true, 'center');
    let ctY = fY+5;
    FB(cX,ctY,cc,4,50,50,50); T('PERÍODO',cX+1,ctY+3,4,true,'left',[255,255,255]);
    FB(cX+cc,ctY,cW-cc,4,50,50,50); T('PLACAR',cX+cc+1,ctY+3,4,true,'left',[255,255,255]);
    ctY += 4;
    const fs = `${data.homeScore!==''?data.homeScore:'-'} x ${data.awayScore!==''?data.awayScore:'-'}`;
    ['1º Período','2º Período','Período Extra','Penalidades','FINAL'].forEach(p => {
      const isF = p==='FINAL';
      FB(cX,ctY,cc,5,...(isF?[20,20,20] as [number,number,number]:[248,248,248]));
      T(p,cX+1,ctY+3.5,isF?5:4.5,isF,'left',isF?[204,255,0]:[0,0,0]);
      FB(cX+cc,ctY,cW-cc,5,...(isF?[20,20,20] as [number,number,number]:[255,255,255]));
      T(isF?fs:'X',cX+cc+1,ctY+3.5,isF?5:4.5,isF,'left',isF?[204,255,0]:[0,0,0]);
      ctY += 5;
    });

    doc.setFontSize(4); doc.setTextColor(160,160,160);
    doc.text('Liga de Futsal Escolar — Garanhuns/PE — Documento Oficial — '+new Date().toLocaleDateString('pt-BR'), PW/2, PH-1, {align:'center'});
    doc.save('sumula_'+(game.category||'jogo').replace(/\s+/g,'_')+'_'+homeTeam.name?.split(' ')[0]+'_vs_'+awayTeam.name?.split(' ')[0]+'.pdf');
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
      onDelete={(id: number) => setTeams(teams.filter(t => t.id !== id))}
    />
  );

  const renderAthletes = () => (
    <DataTable 
      title="GERENCIAR ATLETAS" data={athletes}
      columns={[
        { label: "FOTO", render: (a: any) => a.photo ? <img src={a.photo} className="w-10 h-10 object-cover rounded-full" /> : <Users className="w-8 h-8 text-gray-500" /> },
        { label: "NOME", key: "name", render: (a: any) => <span className="font-display text-white">{a.name}</span>, renderText: (a: any) => a.name },
        { label: "EQUIPE", render: (a: any) => teams.find(t => t.id === Number(a.teamId))?.name || "Desconhecida", renderText: (a: any) => teams.find(t => t.id === Number(a.teamId))?.name || "Desconhecida" },
        { label: "NÚMERO", key: "number", renderText: (a: any) => a.number },
        { label: "CATEGORIA", key: "category", renderText: (a: any) => a.category }
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
        onDelete={(id: number) => setTechnicalDocs(technicalDocs.filter(d => d.id !== id))}
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

  // Authentication Mock
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-border">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-white mb-8 text-center">ÁREA RESTRITA</h2>
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); localStorage.setItem('lfe_admin_authenticated', 'true'); }} className="space-y-6">
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
            onDelete={(id: number) => setRegistrations(registrations.filter(r => r.id !== id))}
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
              { label: "CONFRONTO", render: (g: any) => `${teams.find(t=>t.id===Number(g.homeTeamId))?.name || "A"} vs ${teams.find(t=>t.id===Number(g.awayTeamId))?.name || "B"}`, renderText: (g: any) => `${teams.find(t=>t.id===Number(g.homeTeamId))?.name || "A"} vs ${teams.find(t=>t.id===Number(g.awayTeamId))?.name || "B"}` },
              { label: "STATUS", key: "status", renderText: (g: any) => g.status }
            ]}
            onAdd={() => { setCurrentData({ events: [] }); setModalType('game'); }}
            onEdit={(g: any) => { setCurrentData(g); setModalType('game'); }}
            onDelete={(id: number) => setGames(games.filter(g => g.id !== id))}
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
            sumulaState={sumuiaState}
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
          <select required className={inputClass} value={currentData.teamId || ''} onChange={e => setCurrentData({...currentData, teamId: Number(e.target.value)})}>
            <option value="">Selecione a equipe</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
          <label className={labelClass}>Categoria do Jogo</label>
          <select required className={inputClass} value={currentData.category || ''} onChange={e => setCurrentData({...currentData, category: e.target.value})}>
             <option value="">Selecione</option>
             {["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"].map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
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
          onChange={e => setSumulaState((p: any) => ({ ...p, selectedGameId: Number(e.target.value), homeEvents: [], awayEvents: [] }))}
          className={inputCls}
        >
          <option value="">-- Selecione um jogo para gerar a súmula --</option>
          {games.map((g: any) => {
            const ht = teams.find((t: any) => t.id === Number(g.homeTeamId || g.home_team_id));
            const at = teams.find((t: any) => t.id === Number(g.awayTeamId || g.away_team_id));
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
