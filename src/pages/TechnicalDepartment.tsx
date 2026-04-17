import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Download, Notebook as Folder, Search, Filter, Calendar, ExternalLink, LogOut, User as UserIcon, Users } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getStoredData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const categories = [
  "TODOS",
  "NOTAS OFICIAIS",
  "REGULAMENTOS",
  "NORMAS",
  "SÚMULAS",
  "COMUNICADOS",
  "BOLETIM",
  "FORMULÁRIOS"
];

export default function TechnicalDepartment() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in (either Admin or Chefe)
    const isAdmin = localStorage.getItem('lfe_admin_authenticated') === 'true';
    const isChefe = localStorage.getItem('lfe_is_chefe') === 'true';

    if (!isAdmin && !isChefe) {
      navigate('/chefes-login');
      return;
    }

    setSession({
      isAdmin,
      name: isAdmin ? "Administrador LFE" : localStorage.getItem('lfe_chefe_school') || "Chefe de Equipe",
      email: isAdmin ? "central@ligafutsal.com" : localStorage.getItem('lfe_chefe_email')
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('lfe_is_chefe');
    localStorage.removeItem('lfe_chefe_email');
    localStorage.removeItem('lfe_chefe_school');
    localStorage.removeItem('lfe_admin_authenticated');
    navigate('/chefes-login');
  };

  const storedDocs = getStoredData('technical_documents') || [];
  const registrations = getStoredData('registrations') || [];
  const allAthletes = getStoredData('athletes') || [];

  // Find school team and athletes
  const myReg = registrations.find((r: any) => r.email?.toLowerCase() === session?.email?.toLowerCase());
  const myAthletes = myReg?.teamId ? allAthletes.filter((a: any) => a.teamId === myReg?.teamId) : [];
  
  const filteredDocs = storedDocs.filter((doc: any) => {
    const matchesSearch = String(doc.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    const dateA = String(a.date || "").split('/').reverse().join('-');
    const dateB = String(b.date || "").split('/').reverse().join('-');
    return new Date(dateB).getTime() - new Date(dateA).getTime() || 0;
  });

  const exportRosterPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(204, 255, 0);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("LIGA DE FUTSAL ESCOLAR", 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.text("LISTA DE ATLETAS HOMOLOGADOS", 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`ESCOLA: ${(myReg?.schoolName || myReg?.school || "N/A").toUpperCase()}`, 14, 40);
    doc.text(`RESPONSÁVEL: ${(myReg?.respName || myReg?.resp || "N/A").toUpperCase()}`, 14, 45);
    doc.text(`DATA DE GERAÇÃO: ${new Date().toLocaleDateString('pt-BR')}`, 14, 50);

    const tableData = myAthletes.map((a: any, i: number) => [
      i + 1,
      String(a.name || "Sem Nome").toUpperCase(),
      a.number,
      a.category
    ]);

    autoTable(doc, {
      head: [["#", "NOME DO ATLETA", "Nº", "CATEGORIA"]],
      body: tableData,
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [204, 255, 0] }
    });

    doc.save(`Elenco_${myReg?.schoolName || 'Escola'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Info Bar */}
        {session && (
          <div className="flex items-center justify-between bg-dark-card border border-dark-border rounded-2xl p-4 mb-10 shadow-lg">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                   <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h4 className="text-white font-display text-sm font-bold uppercase tracking-tight">{session.name}</h4>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest">{session.isAdmin ? "ACESSO ADMINISTRATIVO" : "CHETE DE EQUIPE AUTORIZADO"}</p>
                   </div>
                </div>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs border border-transparent hover:border-white/10"
             >
               <LogOut className="w-4 h-4" /> Sair
             </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Folder className="w-10 h-10 text-primary" />
              <span className="text-primary font-display tracking-widest text-sm uppercase">Secretaria / Técnica</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase">
              DEP. <span className="text-primary">TÉCNICO</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Acesso centralizado a documentos oficiais, normas, regulamentos e boletins informativos da Liga.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-dark-border rounded-xl leading-5 bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm font-sans transition-all shadow-lg"
              placeholder="Buscar documento..."
            />
          </div>
        </div>

        {/* My Roster Section (Only for homologated Chefes) */}
        {!session?.isAdmin && myAthletes.length > 0 && (
          <div className="mb-12 bg-dark-card border border-primary/20 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-primary font-display text-xs uppercase tracking-[0.3em] mb-2">Seu Elenco Homologado</h2>
                <h3 className="text-3xl text-white font-display uppercase font-bold mb-4">{session?.name}</h3>
                <div className="flex flex-wrap gap-4">
                   <div className="px-4 py-2 bg-dark rounded-lg border border-dark-border">
                      <span className="text-gray-500 text-[10px] uppercase block mb-1">Total de Atletas</span>
                      <span className="text-white font-display text-xl">{myAthletes.length}</span>
                   </div>
                   <div className="px-4 py-2 bg-dark rounded-lg border border-dark-border">
                      <span className="text-gray-500 text-[10px] uppercase block mb-1">Status</span>
                      <span className="text-success font-display text-xl uppercase">Ativo</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button 
                  onClick={exportRosterPDF}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-dark font-display font-bold rounded-xl hover:bg-primary-dark transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                  <Download className="w-5 h-5" /> Baixar Elenco PDF
                </button>
              </div>
            </div>

            {/* List Preview */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               {myAthletes.slice(0, 4).map((a: any) => (
                 <div key={a.id} className="bg-dark/50 p-3 rounded-lg border border-dark-border/50 text-sm">
                    <span className="text-primary font-display mr-2">#{a.number}</span>
                    <span className="text-gray-300 uppercase text-xs">{a.name}</span>
                 </div>
               ))}
               {myAthletes.length > 4 && (
                 <div className="bg-dark/50 p-3 rounded-lg border border-dark-border/50 text-sm flex items-center justify-center text-gray-500 italic">
                   + {myAthletes.length - 4} outros atletas
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-dark-border/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 font-display text-sm rounded-full transition-all border uppercase tracking-wider",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-dark-card text-gray-500 border-dark-border hover:border-gray-600 hover:text-white"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc: any) => (
            <div key={doc.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-all group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-dark rounded-lg group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <span className="px-3 py-1 bg-dark text-gray-400 text-[10px] rounded-full border border-dark-border uppercase font-display">
                  {doc.category}
                </span>
              </div>
              
              <h3 className="font-display text-xl text-white mb-2 line-clamp-2 min-h-[3.5rem]">{doc.title}</h3>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-6 border-t border-dark-border/50">
                 <div className="flex items-center gap-1.5 uppercase tracking-wider">
                   <Calendar className="w-3.5 h-3.5" />
                   {doc.date}
                 </div>
                 {doc.size && <div className="ml-auto font-sans">{doc.size}</div>}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <a 
                  href={doc.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-dark border border-dark-border text-white text-sm font-display rounded-lg hover:border-primary/50 hover:text-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> VER
                </a>
                <a 
                  href={doc.url} 
                  download 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-dark text-sm font-display font-bold rounded-lg hover:bg-primary-dark transition-all"
                >
                  <Download className="w-4 h-4" /> BAIXAR
                </a>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-dark-card border border-dark-border rounded-xl">
               <FileText className="w-16 h-16 text-gray-700 opacity-20 mb-4" />
               <p className="text-gray-400 font-display text-xl">Nenhum documento encontrado para os critérios selecionados.</p>
               <button onClick={() => { setActiveCategory("TODOS"); setSearchQuery(""); }} className="mt-4 text-primary hover:underline font-display uppercase tracking-widest text-sm">Limpar filtros</button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
             <Folder className="w-10 h-10 text-primary" />
           </div>
           <div>
             <h4 className="font-display text-2xl text-white mb-2 uppercase tracking-tight">CANAL DO <span className="text-primary">CHEFES DE EQUIPE</span></h4>
             <p className="text-gray-400 font-sans leading-relaxed">
               Este espaço é dedicado à transparência e agilidade técnica. Se você é um chefe de equipe e não encontrou um boletim ou súmula específica, entre em contato com o Dep. Técnico via WhatsApp para solicitação imediata.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
