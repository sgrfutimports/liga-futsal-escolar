import { useState } from "react";
import { useNavigate } from "react-router";
import { User, LogIn, Trophy, ArrowRight, ChevronLeft, Building2 } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/src/lib/utils";

export default function ChefesLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica simples baseada nos anos de edição ou código fixo para teste
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
      <div className="absolute top-0 right-0 w-full h-full z-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="mb-8 flex items-center gap-3 group bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-all">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest">Voltar para o Início</span>
          </Link>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-50" />
            <div className="relative w-24 h-24 bg-white/95 rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden">
              <img src="/logos/logo.jpg" className="w-full h-full object-contain scale-125" alt="Liga Logo" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter mt-8">Área do <span className="text-primary italic">Chefe</span></h1>
          <p className="text-gray-500 text-[10px] mt-2 font-display uppercase tracking-[0.3em] font-bold">Portal de Delegações Escolares</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a] border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -mr-16 -mt-16" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-widest ml-4">Código de Acesso da Equipe</label>
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within:text-primary" />
                <input 
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="EX: LFE-2026-CGA"
                  className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-display uppercase tracking-widest text-xs"
                  required
                />
              </div>
              <p className="text-[9px] text-gray-600 ml-4 font-sans italic italic">O código foi enviado para o e-mail institucional da escola.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-display flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-white hover:bg-white-hover text-black font-display font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-white/5 flex items-center justify-center gap-2 group transition-all active:scale-95"
            >
              Acessar Painel <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        <div className="mt-8 bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center">
           <p className="text-[10px] text-gray-500 font-display font-bold uppercase tracking-widest leading-relaxed">
             Dificuldades no acesso? Entre em contato com a Secretaria Geral da Liga através do nosso canal oficial.
           </p>
        </div>
      </div>
    </div>
  );
}
