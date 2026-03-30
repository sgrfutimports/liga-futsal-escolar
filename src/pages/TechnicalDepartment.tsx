import React, { useState } from "react";
import { FileText, Download, Notebook as Folder, Search, Filter, Calendar, ExternalLink } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [searchQuery, setSearchQuery] = useState("");

  const storedDocs = getStoredData('technical_documents') || [];
  
  const filteredDocs = storedDocs.filter((doc: any) => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TODOS" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
           <div className="shrink-0">
             <Link to="/admin" className="px-8 py-4 bg-dark-card border border-dark-border text-white rounded-xl font-display uppercase tracking-widest text-xs hover:border-primary transition-all">Acesso Administrativo</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
