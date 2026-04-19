import { Gavel, Users, AlertCircle, FileText, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function Terms() {
  return (
    <div className="min-h-screen bg-bg text-text py-12 md:py-20 animate-in slide-in-from-right-4 duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-display text-xs uppercase tracking-widest mb-8 hover:translate-x-1 transition-transform">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Início
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
            Termos de <span className="text-primary italic">Uso</span>
          </h1>
          <p className="text-text-muted text-lg font-sans">Regulamento de uso do Portal LFE 2026</p>
        </header>

        <div className="space-y-12 font-sans leading-relaxed text-text/80">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" /> 1. Aceite dos Termos
            </h2>
            <p>
              Ao acessar o portal da Liga de Futsal Escolar e utilizar nossos serviços de inscrição e consulta, você concorda integralmente com as condições aqui estabelecidas. Estes termos regem a relação entre a organização da Liga e as escolas participantes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" /> 2. Responsabilidade das Instituições
            </h2>
            <p>
              As escolas são responsáveis pela veracidade dos dados fornecidos no formulário de inscrição e pela autorização prévia dos pais ou responsáveis legais para a participação dos menores de idade na competição e no portal oficial.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <Gavel className="w-6 h-6 text-primary" /> 3. Conduta Ética
            </h2>
            <p>
              O esporte escolar visa a formação cidadã. Comportamentos antidesportivos, insultos ou qualquer forma de violência física ou verbal, dentro ou fora de quadra, podem resultar na suspensão da conta administrativa da escola e exclusão da liga.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-black text-text uppercase flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-primary" /> 4. Direitos Autorais
            </h2>
            <p>
              Todo o conteúdo deste portal (logos, textos, design e tabelas) é de propriedade da Liga de Futsal Escolar. A reprodução sem autorização prévia para fins comerciais é estritamente proibida.
            </p>
          </section>

          <section className="pt-12 border-t border-border">
            <div className="bg-yellow-500/5 p-6 rounded-2xl border border-yellow-500/20 text-sm italic">
              A Liga reserva-se o direito de atualizar estes termos periodicamente para refletir mudanças no Regulamento Técnico da competição.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
