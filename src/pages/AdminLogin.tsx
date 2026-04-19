import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, User, ArrowRight, Trophy, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/src/lib/utils";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha padrão solicitada pelo usuário anteriormente
    if (password === "adminlfe2026") {
      localStorage.setItem('lfe_admin_authenticated', 'true');
      navigate("/admin");
    } else {
      setError("Senha de acesso inválida");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="mb-8 flex items-center gap-3 group bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-all">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest">Voltar para o Início</span>
          </Link>
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mb-6">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Portal <span className="text-primary">Admin</span></h1>
          <p className="text-gray-500 text-sm mt-2 font-display uppercase tracking-widest">Liga de Futsal Escolar</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a] border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-4">Senha Administrativa</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within:text-primary" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-sans"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-display flex items-center gap-3 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-black font-display font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-2 group transition-all active:scale-95"
            >
              Entrar no Painel <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-600 font-display text-[9px] uppercase tracking-[0.3em]">
          Ambiente restrito • Garanhuns PE
        </p>
      </div>
    </div>
  );
}
