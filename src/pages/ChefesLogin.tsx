import React, { useState } from "react";
import { useNavigate } from "react-router";
import { User, LogIn, Trophy, ArrowRight, ChevronLeft, Building2, Lock, Shield } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function ChefesLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.length >= 4) {
      localStorage.setItem('lfe_is_chefe', 'true');
      localStorage.setItem('lfe_chefe_code', accessCode);
      navigate("/enviar-elenco");
    } else {
      setError("Código de acesso muito curto");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Navigation / Logo */}
        <div className="flex flex-col items-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/" className="mb-12 flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all group">
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-display font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">Retornar ao Início</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[60px] opacity-30 animate-pulse" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] p-6 shadow-3xl overflow-hidden flex items-center justify-center border border-white/10">
              <img src="/logos/logo.jpg" className="w-full h-full object-contain scale-110" alt="Liga Logo" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mt-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">Área do <span className="text-primary italic">Chefe</span></h1>
            <p className="text-gray-500 text-[11px] mt-4 font-display uppercase tracking-[0.4em] font-black opacity-60">Portal de Delegações Escolares</p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 p-12 md:p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
          
          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-display font-black text-gray-600 uppercase tracking-[0.4em] ml-6">Código de Acesso Institucional</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-focus-within:border-primary/50">
                   <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="EX: LFE-2026-GAR"
                  className="w-full bg-[#020617]/50 border border-white/10 rounded-[2rem] py-6 pl-20 pr-8 text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-display font-black uppercase tracking-[0.2em] text-sm"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-700 ml-6 font-display font-black uppercase tracking-widest opacity-60">Enviado para o e-mail cadastrado na inscrição.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-[10px] font-display font-black uppercase tracking-widest flex items-center gap-4"
                >
                  <Shield className="w-5 h-5 shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full bg-primary text-dark font-display font-black text-xs uppercase tracking-[0.3em] py-7 rounded-[2.5rem] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group transition-all hover:scale-[1.02] active:scale-95"
            >
              Autenticar Acesso <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-3" />
            </button>
          </form>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
           <p className="text-[10px] text-gray-700 font-display font-bold uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
             Problemas no credenciamento? Contate a secretaria técnica oficial.
           </p>
        </motion.div>
      </div>
    </div>
  );
}
