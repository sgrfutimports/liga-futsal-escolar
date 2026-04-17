import { useState, useEffect } from "react";
import { Upload, FilePlus, ChevronLeft, ShieldAlert, CheckCircle2, Trophy, Save } from "lucide-react";
import { Link } from "react-router";
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
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white p-4">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-display font-bold mb-2">Acesso Negado</h1>
        <p className="text-gray-400 mb-8 max-w-md text-center">Você precisa estar logado na Área do Chefe de Delegação para enviar elencos oficiais.</p>
        <Link to="/chefes-login" className="px-6 py-3 bg-primary text-dark font-display font-bold rounded-lg hover:bg-white transition-colors">
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-display text-sm mb-8">
          <ChevronLeft className="w-4 h-4" /> VOLTAR PARA INÍCIO
        </Link>

        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-center gap-4 mb-2">
            <Trophy className="w-10 h-10 text-primary" />
            <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter uppercase drop-shadow-md">
              Envio de Elenco
            </h1>
          </div>
          <p className="text-gray-400 max-w-xl font-sans mt-2 relative z-10">
            Utilize este painel para o envio oficial e suplementar do elenco da sua delegação caso tenha optado por repassar os atletas após o momento da inscrição.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Elenco Recebido!</h2>
            <p className="text-green-500/80 max-w-md mx-auto font-sans mb-8">
              Sua lista de relação nominal suplementar foi enviada com sucesso para o Departamento Técnico da LFE. Nossa comissão irá avaliar os arquivos.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="px-8 py-3 outline outline-1 outline-green-500/50 text-green-500 font-display text-sm font-bold tracking-widest uppercase hover:bg-green-500 hover:text-dark transition-all rounded-lg"
            >
              Enviar Outro Arquivo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-display text-white border-b border-dark-border pb-4 flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-primary" />
                Dados do Cadastro
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-display text-gray-400 tracking-wider">Escola / Delegação</label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={e => setFormData(prev => ({...prev, school: e.target.value}))}
                    placeholder="Ex: Escola SESC"
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-display text-gray-400 tracking-wider">Categoria / Modalidade</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-sans appearance-none"
                  >
                    <option value="SUB-11">SUB-11</option>
                    <option value="SUB-13">SUB-13</option>
                    <option value="SUB-14">SUB-14</option>
                    <option value="SUB-15">SUB-15</option>
                    <option value="SUB-17">SUB-17</option>
                    <option value="Feminino Livre">Feminino Livre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-display text-gray-400 tracking-wider">Arquivo do Elenco Nominal (PDF, Excel ou Imagem)</label>
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-40 md:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-dark hover:bg-dark/80",
                  formData.file ? "border-primary/50 bg-primary/5" : "border-dark-border hover:border-primary border-gray-600"
                )}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={cn("w-10 h-10 mb-3 transition-colors", formData.file ? "text-primary" : "text-gray-400")} />
                    <p className="mb-2 text-sm text-gray-400 font-sans">
                      {formData.file ? (
                        <span className="text-primary font-bold">{formData.file.name}</span>
                      ) : (
                        <><span className="font-semibold text-white">Clique para selecionar</span> ou arraste o arquivo</>
                      )}
                    </p>
                    <p className="text-xs text-gray-600 font-sans">CSV, XLSX, PDF ou Imagem (MAX. 5MB)</p>
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

              <div className="space-y-2">
                 <label className="text-sm font-display text-gray-400 tracking-wider">Observações Opcionais</label>
                 <textarea
                    value={formData.comments}
                    onChange={e => setFormData(prev => ({...prev, comments: e.target.value}))}
                    placeholder="Adicione qualquer detalhe técnico sobre o envio dos jogadores..."
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-sans min-h-[100px] resize-y"
                 />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !formData.school}
                className="group relative px-8 py-4 bg-primary text-dark font-display text-lg tracking-widest font-bold rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] shadow-primary/20 flex items-center gap-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Enviando ...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    CONFIRMAR ENVIO
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
