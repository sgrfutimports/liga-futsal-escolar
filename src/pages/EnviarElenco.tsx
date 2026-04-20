import { useState, useEffect } from "react";
import { Upload, FilePlus, ChevronLeft, ShieldAlert, CheckCircle2, Trophy, Save, FileText, Send, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function EnviarElenco() {
  const [isChefe, setIsChefe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    school: "",
    category: "SUB-17",
    file: null as File | null,
    comments: ""
  });

  useEffect(() => {
    const chefeAuth = localStorage.getItem('lfe_is_chefe') === 'true';
    const adminAuth = localStorage.getItem('lfe_admin_authenticated') === 'true';
    if (chefeAuth || adminAuth) {
      setIsChefe(true);
    }
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ school: "", category: "SUB-17", file: null, comments: "" });
    }, 1500);
  };

  if (!isChefe) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-4">Acesso <span className="text-red-500 italic">Negado</span></h1>
          <p className="text-gray-500 font-display font-bold uppercase tracking-widest text-[10px] mb-12 max-w-sm mx-auto">Você precisa estar logado na Área do Chefe para realizar envios oficiais.</p>
          <Link to="/chefes-login" className="px-10 py-5 bg-white text-dark font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white-hover transition-all shadow-2xl">
            Retornar ao Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/10 to-transparent opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all group mb-12">
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-display font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">Retornar ao Início</span>
          </Link>

          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
             <div className="max-w-3xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
                  <FilePlus className="w-6 h-6 text-primary" />
                  <span className="text-gray-500 font-display font-black text-xs uppercase tracking-[0.4em]">Protocolo de Delegação</span>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none mb-4"
                >
                  Envio de <span className="text-primary italic">Elenco</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-500 text-lg md:text-2xl font-display uppercase font-bold tracking-tight opacity-70"
                >
                   Painel oficial para registro nominal suplementar de atletas.
                </motion.p>
             </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 pb-40 pt-20">
        
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary/5 border border-primary/20 rounded-[4rem] p-20 text-center backdrop-blur-3xl"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-6 leading-none">Dados Recebidos!</h2>
              <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-lg mb-12 leading-relaxed max-w-md mx-auto opacity-70">
                Sua relação nominal foi enviada com sucesso ao Departamento Técnico da LFE. Aguarde a homologação.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-12 py-5 bg-primary text-dark font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/20"
              >
                Enviar Novo Protocolo
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-12"
            >
              <div className="bg-white/[0.03] border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.3)] backdrop-blur-3xl space-y-16">
                 
                 <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-dark font-display font-black flex items-center justify-center shadow-lg shadow-primary/20">
                       <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-white">Dados da <span className="text-primary italic">Inscrição</span></h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.4em] ml-4">Instituição / Delegação</label>
                       <input
                         type="text"
                         required
                         value={formData.school}
                         onChange={e => setFormData(prev => ({...prev, school: e.target.value}))}
                         placeholder="Ex: Escola SESC Garanhuns"
                         className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 text-white font-display font-black uppercase tracking-tight text-lg focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-800 shadow-inner"
                       />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.4em] ml-4">Categoria Oficial</label>
                       <div className="relative">
                          <select
                            value={formData.category}
                            onChange={e => setFormData(prev => ({...prev, category: e.target.value}))}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-8 text-white font-display font-black uppercase tracking-widest text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer shadow-inner pr-16"
                          >
                            <option value="SUB-11" className="bg-[#020617]">SUB-11</option>
                            <option value="SUB-13" className="bg-[#020617]">SUB-13</option>
                            <option value="SUB-14" className="bg-[#020617]">SUB-14</option>
                            <option value="SUB-15" className="bg-[#020617]">SUB-15</option>
                            <option value="SUB-17" className="bg-[#020617]">SUB-17</option>
                            <option value="FEMININO" className="bg-[#020617]">FEMININO LIVRE</option>
                          </select>
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                             <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <ChevronLeft className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.4em] ml-4">Arquivo de Relação Nominal (PDF/Digitalizado)</label>
                    <label className={cn(
                      "flex flex-col items-center justify-center w-full h-[300px] border-4 border-dashed rounded-[4rem] cursor-pointer transition-all relative overflow-hidden group shadow-inner",
                      formData.file ? "border-primary bg-primary/5" : "border-white/5 bg-[#020617]/50 hover:border-primary/30"
                    )}>
                      <div className="flex flex-col items-center justify-center p-12 text-center">
                         <div className={cn("w-20 h-20 rounded-[2rem] mb-6 flex items-center justify-center transition-all", formData.file ? "bg-primary text-dark" : "bg-white/5 text-gray-700 group-hover:text-primary")}>
                            {formData.file ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                         </div>
                         <h4 className={cn("font-display text-2xl font-black uppercase tracking-tighter leading-none mb-3", formData.file ? "text-white" : "text-gray-600")}>
                           {formData.file ? formData.file.name : "Clique para Upload"}
                         </h4>
                         <p className="text-[10px] font-display font-black text-gray-800 uppercase tracking-[0.3em]">{formData.file ? "ARQUIVO PRONTO PARA ENVIO" : "RECOMENDADO PDF OU XLSX (MÁX 5MB)"}</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData(prev => ({...prev, file: e.target.files![0]}));
                          }
                        }} 
                      />
                    </label>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.4em] ml-4">Notas Técnicas Suplementares</label>
                    <textarea
                       value={formData.comments}
                       onChange={e => setFormData(prev => ({...prev, comments: e.target.value}))}
                       placeholder="Adicione observações relevantes sobre o elenco..."
                       className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-10 text-white font-display font-bold uppercase tracking-tight text-lg focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-950 min-h-[150px] shadow-inner"
                    />
                 </div>
              </div>

              <div className="flex justify-center pt-8">
                 <button
                   type="submit"
                   disabled={loading || !formData.school || !formData.file}
                   className="group relative w-full py-8 bg-primary text-dark font-display text-2xl font-black uppercase tracking-[0.2em] rounded-[3rem] hover:scale-[1.02] active:scale-95 transition-all shadow-3xl shadow-primary/20 overflow-hidden disabled:opacity-50"
                 >
                   <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-1000"></span>
                   <div className="relative flex items-center justify-center gap-4">
                     {loading ? (
                       <div className="w-8 h-8 border-4 border-dark border-t-transparent animate-spin rounded-full" />
                     ) : (
                       <>
                         <Send className="w-7 h-7" /> Confirmar Protocolo Oficial
                       </>
                     )}
                   </div>
                 </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
