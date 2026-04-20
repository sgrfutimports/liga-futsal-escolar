import { Gavel, Users, AlertCircle, FileText, ChevronLeft, ShieldCheck, Scale } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#020617] text-white py-24 md:py-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <Link to="/" className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all group mb-12">
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-display font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">Retornar ao Início</span>
           </Link>
        </motion.div>

        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-4 leading-none"
          >
            Termos de <span className="text-primary italic">Uso Oficial</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm font-display font-black uppercase tracking-widest opacity-60"
          >
            Regulamento Normativo do Portal LFE • Edição 2026
          </motion.p>
        </header>

        <div className="space-y-24">
          
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <FileText className="w-5 h-5 text-primary" />
              </div>
              01. Comprometimento Técnico
            </h2>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80">
              Ao acessar o portal da Liga de Futsal Escolar e utilizar nossos serviços de inscrição, você concorda integralmente com as condições estabelecidas. Este ecossistema digital rege a conduta técnica entre a Liga e as comitivas escolares.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <Users className="w-5 h-5 text-primary" />
              </div>
              02. Autoridade Institucional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <p className="text-[10px] font-display font-black uppercase tracking-widest leading-relaxed text-gray-400">As escolas detêm total responsabilidade pela veracidade dos dados biográficos e autorizações legais dos atletas participantes.</p>
               </div>
               <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4">
                  <Scale className="w-8 h-8 text-primary" />
                  <p className="text-[10px] font-display font-black uppercase tracking-widest leading-relaxed text-gray-400">A omissão de dados ou fraudes no credenciamento resultará em sanções técnicas severas conforme o Regulamento de Elite.</p>
               </div>
            </div>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <Gavel className="w-5 h-5 text-primary" />
              </div>
              03. Integridade Esportiva
            </h2>
            <p className="text-gray-300 font-display font-black uppercase text-4xl tracking-tighter leading-none italic border-l-8 border-primary pl-10 my-12">
               "Comportamentos antidesportivos são passíveis de banimento imediato da plataforma digital."
            </p>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80">
              O esporte escolar visa a formação cidadã. Insultos ou qualquer forma de violência física ou verbal resultam na suspensão irrevogável da conta administrativa da escola.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              04. Propriedade Intelectual
            </h2>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80">
              Todo o patrimônio digital deste portal (identidade visual, tabelas oficiais e conteúdo multimídia) é de propriedade exclusiva da Liga de Futsal Escolar. Reproduções não autorizadas serão combatidas judicialmente.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="pt-12 border-t border-white/5"
          >
            <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/20 text-center">
              <p className="text-[10px] text-gray-500 font-display font-black uppercase tracking-[0.4em] leading-relaxed italic">
                A Liga reserva-se o direito de atualizar este regime normativo periodicamente para refletir a evolução técnica do certame.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
