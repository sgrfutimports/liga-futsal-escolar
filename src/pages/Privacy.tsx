import { Shield, Lock, Eye, Save, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-bg text-text py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-display text-xs uppercase tracking-widest mb-8 hover:translate-x-1 transition-transform">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Início
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
            Política de <span className="text-primary italic">Privacidade</span>
          </h1>
          <p className="text-text-muted text-lg font-sans">Atualizado em 19 de Abril de 2026</p>
        </header>

        <div className="space-y-12 font-sans leading-relaxed text-text/80">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" /> 1. Introdução
            </h2>
            <p>
              A Liga de Futsal Escolar do Agreste Meridional valoriza a privacidade de seus atletas, pais, instrutores e torcedores. Esta política explica como coletamos, usamos e protegemos as informações fornecidas através do nosso portal oficial.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Save className="w-6 h-6 text-primary" /> 2. Coleta de Dados
            </h2>
            <p>
              Coletamos dados necessários para a organização da competição, incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dados cadastrais de escolas e responsáveis;</li>
              <li>Informações dos atletas (nome, data de nascimento, foto para súmula);</li>
              <li>Registros de desempenho esportivo (gols, cartões e estatísticas).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" /> 3. Uso de Imagem
            </h2>
            <p className="bg-primary/5 p-6 rounded-2xl border border-primary/20 italic">
              "Ao participar da Liga, as instituições de ensino e responsáveis concordam com o registro e divulgação de imagens (fotos e vídeos) dos jogos para fins estritamente informativos, jornalísticos e promocionais da competição em nosso portal e redes sociais."
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" /> 4. Proteção de Dados (LGPD)
            </h2>
            <p>
              Seguimos as diretrizes da Lei Geral de Proteção de Dados. As informações dos atletas são armazenadas de forma segura e utilizadas apenas para a gestão técnica da competição. Não compartilhamos dados pessoais com terceiros para fins comerciais.
            </p>
          </section>

          <section className="pt-12 border-t border-border">
            <p className="text-sm text-text-muted">
              Dúvidas sobre seus dados? Entre em contato com o Departamento Técnico através do e-mail oficial da Liga.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
