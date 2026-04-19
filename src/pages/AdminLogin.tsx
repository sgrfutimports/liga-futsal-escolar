import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Mail, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { supabase } from "@/src/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.user) {
        localStorage.setItem('lfe_admin_authenticated', 'true');
        navigate("/admin");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message === "Invalid login credentials" 
        ? "E-mail ou senha administrativa incorretos." 
        : "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, digite seu e-mail para recuperar a senha.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetError) throw resetError;
      
      setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError("Erro ao enviar e-mail de recuperação: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-display font-black uppercase tracking-[0.3em]">Retornar ao Portal Público</span>
        </Link>

        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-8">
            <div className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.3)]">
               <Shield className="w-12 h-12 text-dark" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase text-center leading-none">
            ACESSO <br/><span className="text-primary italic">RESTRITO</span>
          </h1>
        </div>

        <div className="bg-dark-card/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] ml-2">E-mail Administrativo</label>
              <div className="relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within/input:text-primary" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ligafutsal.com"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em]">Senha de Segurança</label>
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  className="text-[9px] font-display font-bold text-primary hover:text-white uppercase tracking-widest transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 transition-colors group-focus-within/input:text-primary" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all tracking-widest"
                  required={!success}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-xs font-display flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-primary/20 border border-primary/30 p-5 rounded-2xl text-primary text-xs font-display flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {success}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-white text-dark font-display font-black text-sm uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group transition-all"
            >
              {loading ? <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : <>Entrar no Painel <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
