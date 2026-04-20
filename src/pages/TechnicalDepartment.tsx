import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Download, Notebook as Folder, Search, Filter, Calendar, ExternalLink, LogOut, User as UserIcon, Users, Shield, ArrowRight, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSupaData } from "@/src/lib/store";
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

  const { data: storedDocs } = useSupaData('lfe_technical_documents', []);
  const { data: registrations } = useSupaData('lfe_registrations', []);
  const { data: allAthletes } = useSupaData('lfe_athletes', []);

  // Find school team and athletes
  const myReg = registrations.find((r: any) => String(r.email || '').toLowerCase() === String(session?.email || '').toLowerCase());
  const myAthletes = myReg?.teamId || myReg?.team_id ? allAthletes.filter((a: any) => String(a.team_id || a.teamId) === String(myReg?.teamId || myReg?.team_id)) : [];
  
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
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Session/User Bar */}
      {session && (
        <section className="bg-white/5 border-b border-white/10 py-4 sticky top-20 z-50 backdrop-blur-2xl">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                 <UserIcon className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <h4 className="font-display font-black text-xs uppercase tracking-widest leading-none mb-1">{session.name}</h4>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{session.isAdmin ? 'Admin' : 'Chefe de Equipe'} • Online</span>
                 </div>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all font-display font-black text-[10px] uppercase tracking-widest flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" /> Finalizar Sessão
            </button>
          </div>
        </section>
      )}

      {/* Hero Header */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
             <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                  <span className="text-gray-500 font-display font-black text-xs uppercase tracking-[0.4em]">Painel do Dep. Técnico</span>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none mb-8"
                >
                  Gestão & <span className="text-primary italic">Documentação</span>
                </motion.h1>
             </div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="relative w-full md:w-96 group"
             >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar arquivos oficiais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-white font-display font-black uppercase tracking-widest text-[10px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                />
             </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-40">
        
        {/* Roster Highlight (Chefe only) */}
        {!session?.isAdmin && myAthletes.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 bg-white/5 border border-white/5 rounded-[3rem] p-12 relative overflow-hidden backdrop-blur-3xl shadow-3xl"
          >
             <div className="absolute -top-20 -right-20 opacity-[0.03] rotate-12">
               <Shield className="w-80 h-80 text-primary" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                   <h5 className="text-primary font-display font-black text-[10px] uppercase tracking-[0.4em] mb-4">Elenco Homologado 2026</h5>
                   <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-6">{session?.name}</h2>
                   <div className="flex gap-4">
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                         <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</span>
                         <span className="text-primary font-display font-black text-xl uppercase italic">Ativo</span>
                      </div>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                         <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Efetivo</span>
                         <span className="text-white font-display font-black text-xl italic">{myAthletes.length} ATLETAS</span>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col gap-4">
                   <button 
                     onClick={exportRosterPDF}
                     className="w-full py-6 bg-primary text-dark font-display font-black text-sm uppercase tracking-[0.2em] rounded-3xl hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-4"
                   >
                     <Download className="w-6 h-6" /> Exportar Ficha Oficial (PDF)
                   </button>
                   <p className="text-[9px] font-black text-gray-700 text-center uppercase tracking-widest">Este documento deve ser apresentado em todas as partidas da temporada.</p>
                </div>
             </div>
          </motion.section>
        )}

        {/* Categories Bar */}
        <section className="mb-16 flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
           <Filter className="w-5 h-5 text-gray-800 shrink-0" />
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={cn(
                 "px-8 py-3 rounded-2xl font-display text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                 activeCategory === cat 
                   ? "bg-primary border-primary text-dark shadow-2xl shadow-primary/20" 
                   : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
               )}
             >
               {cat}
             </button>
           ))}
        </section>

        {/* Documents Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {filteredDocs.map((doc: any) => (
             <motion.div 
               key={doc.id}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/10 hover:border-primary/30 transition-all group relative backdrop-blur-xl shadow-2xl flex flex-col"
             >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-dark/50 border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full">{doc.category}</span>
                </div>

                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors line-clamp-2 h-14">{doc.title}</h3>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {doc.date}
                   </div>
                   <span className="text-[8px] font-black text-gray-800 uppercase tracking-widest">{doc.size || 'PDF'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                   <a 
                     href={doc.url} 
                     target="_blank"
                     className="py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all text-[9px] font-black uppercase text-center tracking-widest flex items-center justify-center gap-2"
                   >
                     <ExternalLink className="w-4 h-4" /> Visualizar
                   </a>
                   <a 
                     href={doc.url} 
                     download
                     className="py-4 rounded-2xl bg-primary text-dark font-black transition-all text-[9px] uppercase text-center tracking-widest flex items-center justify-center gap-2 shadow-lg"
                   >
                     <Download className="w-4 h-4" /> Baixar
                   </a>
                </div>
             </motion.div>
           ))}

           {filteredDocs.length === 0 && (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                 <Folder className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                 <h3 className="text-2xl font-display font-black text-gray-600 uppercase tracking-widest">Nenhum documento listado</h3>
                 <p className="text-gray-700 mt-2 font-display uppercase text-xs tracking-widest">Verifique os filtros ou tente outra busca.</p>
            </div>
           )}
        </section>

        {/* Channel Info */}
        <section className="mt-40 bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden backdrop-blur-3xl shadow-3xl">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(204,255,0,0.05),transparent)] pointer-events-none" />
           <div className="w-28 h-28 md:w-40 md:h-40 rounded-[3rem] bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-2xl shadow-primary/10">
             <Users className="w-12 h-12 md:w-16 md:h-16 text-primary" />
           </div>
           <div className="text-center md:text-left">
              <h2 className="text-4xl font-display font-black uppercase tracking-tighter leading-none mb-6">Canal Direto com os <span className="text-primary italic">Chefes de Equipe</span></h2>
              <p className="text-gray-500 font-display font-bold uppercase tracking-tight text-lg mb-8 leading-relaxed opacity-70">
                 Este espaço é dedicado à transparência e agilidade técnica. Se você é um chefe de equipe e não encontrou um boletim ou súmula específica, entre em contato imediatamente.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                    <ArrowRight className="w-5 h-5 text-primary" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Prioridade Técnica</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                    <ArrowRight className="w-5 h-5 text-primary" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Atualizações em Tempo Real</span>
                 </div>
              </div>
           </div>
        </section>

      </main>

    </div>
  );
}
