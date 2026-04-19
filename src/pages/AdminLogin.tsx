import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Mail, ArrowRight, ChevronLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/src/lib/utils";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de autenticação (Pode ser conectada ao Supabase Auth futuramente)
    if (email.toLowerCase() === "admin@ligafutsal.com" && password === "adminlfe2026") {
      localStorage.setItem('lfe_admin_authenticated', 'true');
      localStorage.setItem('lfe_admin_email', email);
      
      // Delay para efeito de loading elegante
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } else {
      setLoading(false);
      setError("Credenciais administrativas inválidas.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-display font-black uppercase tracking-[0.3em]">Retornar ao Portal Público</span>
        </Link>

        {/* Header Unit */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-8">
            <div className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.3)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <Shield className="w-12 h-12 text-dark" strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase text-center leading-none">
            ACESSO <br/><span className="text-primary italic">RESTRITO</span>
          </h1>
          <div className="h-1 w-20 bg-primary/30 mt-6 rounded-full" />
        </div>

        {/* Login Form Card */}
        <div className="bg-dark-card/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          {/* Internal Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] ml-2">E-mail Administrativo</label>
              <div className="relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within/input:text-primary" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ligafutsal.com"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-sans text-sm md:text-base"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em]">Senha de Segurança</label>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within/input:text-primary" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-sans text-sm md:text-base tracking-widest"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-xs font-display flex items-center gap-3 animate-shake">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-white text-dark font-display font-black text-sm uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Painel <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center flex flex-col items-center gap-4">
           <p className="text-gray-600 font-display text-[9px] uppercase tracking-[0.5em]">
             Sistema de Gestão LFE © 2026 • Garanhuns - PE
           </p>
           <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-3 h-3" />
              <span className="text-[8px] uppercase tracking-widest">Conexão Criptografada SSL</span>
           </div>
        </div>
      </div>
    </div>
  );
}
