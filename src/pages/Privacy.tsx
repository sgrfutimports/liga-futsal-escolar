import { Shield, Lock, Eye, Save, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function Privacy() {
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
            Diretrizes de <span className="text-primary italic">Privacidade</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm font-display font-black uppercase tracking-widest opacity-60"
          >
            Protocolo de Proteção e Dados Oficiais • Atualizado em 2026
          </motion.p>
        </header>

        <div className="space-y-20">
          
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <Shield className="w-5 h-5 text-primary" />
              </div>
              01. Introdução
            </h2>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80">
              A Liga de Futsal Escolar do Agreste Meridional valoriza a privacidade de seus atletas, pais, instrutores e torcedores. Esta política explica como coletamos, usamos e protegemos as informações fornecidas através do nosso portal oficial.
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
                 <Save className="w-5 h-5 text-primary" />
              </div>
              02. Coleta de Dados
            </h2>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80 mb-8">
              Coletamos dados estritamente necessários para a organização técnica e promoção da competição nacional.
            </p>
            <ul className="space-y-4">
              {[
                "Dados cadastrais de instituições e representantes legais",
                "Informações biográficas dos atletas para súmula oficial",
                "Registros de desempenho e estatísticas em tempo real"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-6 rounded-2xl font-display font-black uppercase text-xs tracking-widest text-gray-300">
                   <div className="w-2 h-2 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <h2 className="text-3xl font-display font-black text-white uppercase flex items-center gap-4 tracking-tighter">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                 <Eye className="w-5 h-5 text-primary" />
              </div>
              03. Uso de Imagem
            </h2>
            <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/20 shadow-3xl backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
               <p className="text-white font-display font-black uppercase italic text-2xl md:text-3xl tracking-tighter leading-tight relative z-10">
                 "As instituições e responsáveis concordam com o registro e divulgação de imagens para fins informativos e promocionais do certame."
               </p>
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
                 <Lock className="w-5 h-5 text-primary" />
              </div>
              04. Blindagem de Dados (LGPD)
            </h2>
            <p className="text-gray-400 font-display font-bold uppercase tracking-tight text-xl leading-relaxed opacity-80">
              Seguimos rigorosamente os protocolos da Lei Geral de Proteção de Dados. As informações são criptografadas e utilizadas apenas para a gestão técnica da competição. Não compartilhamos dados pessoais com terceiros para fins comerciais.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="pt-12 border-t border-white/5"
          >
            <p className="text-xs text-gray-700 font-display font-black uppercase tracking-[0.4em] text-center leading-relaxed">
              Dúvidas Técnicas? Contate o Encarregado de Dados da Liga de Futsal Escolar.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
