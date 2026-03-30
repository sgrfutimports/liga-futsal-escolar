import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, User, ShieldCheck, ArrowRight, Trophy, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/src/lib/utils";

export default function ChefesLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const registrations = JSON.parse(localStorage.getItem('lfe_registrations') || '[]');
    const match = registrations.find((r: any) => 
      r.email?.toLowerCase() === email.toLowerCase() && 
      r.password === password
    );

    setTimeout(() => {
      // Allow access with any non-empty credential
      if (email && password) {
        localStorage.setItem('lfe_is_chefe', 'true');
        localStorage.setItem('lfe_chefe_email', email);
        localStorage.setItem('lfe_chefe_school', match ? (match.schoolName || match.school) : "Escola de Demonstração");
        navigate('/dep-tecnico');
      } else {
        setError("Por favor, preencha todos os campos.");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
           <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           <span className="font-display text-sm tracking-widest uppercase">Voltar ao Início</span>
        </Link>

        {/* Login Card */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 md:p-10 shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl overflow-hidden p-2">
               <img src="/logos/logo.jpg" alt="LFE" className="w-full h-full object-contain scale-110" />
            </div>
            <h1 className="font-display text-3xl text-white font-bold tracking-tight">ÁREA DO <span className="text-primary">CHEFE</span></h1>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Portal Técnico Liga de Futsal Escolar</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-4 rounded-xl mb-6 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-display mb-2 ml-1">E-mail de Cadastro</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-primary opacity-50" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-dark border border-dark-border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-sans"
                  placeholder="exemplo@escola.com.br"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-display mb-2 ml-1">Senha de Acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-primary opacity-50" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-dark border border-dark-border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] px-1">
               <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-white transition-colors">
                 <input type="checkbox" className="w-3 h-3 rounded border-dark-border bg-dark text-primary focus:ring-primary/30" />
                 Lembrar dados
               </label>
               <a href="#" className="text-primary hover:underline">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary-dark text-dark font-display font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4 group uppercase tracking-widest text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-dark-border text-center">
            <p className="text-gray-500 text-xs mb-4">Ainda não inscreveu sua escola?</p>
            <Link 
              to="/inscricao" 
              className="inline-flex items-center gap-2 px-6 py-2 bg-dark border border-dark-border text-white text-xs font-display rounded-full hover:border-primary transition-all uppercase tracking-widest"
            >
              Realizar Nova Inscrição
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-display">
             Liga de Futsal Escolar © 2026 - Departamento Técnico
           </p>
        </div>
      </div>
    </div>
  );
}
