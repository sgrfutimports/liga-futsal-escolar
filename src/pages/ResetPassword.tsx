import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess("Senha atualizada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/admin/login"), 3000);
    } catch (err: any) {
      setError("Erro ao atualizar senha: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.2)]">
               <Shield className="w-10 h-10 text-dark" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase text-center">
            NOVA <span className="text-primary italic">SENHA</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Defina sua nova credencial de acesso</p>
        </div>

        <div className="bg-dark-card/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all tracking-widest"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all tracking-widest"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-display flex items-center gap-3">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-primary/20 border border-primary/30 p-4 rounded-xl text-primary text-xs font-display flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4" /> {success}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-white text-dark font-display font-black text-sm uppercase tracking-widest py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {loading ? <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : <>Atualizar Senha <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
