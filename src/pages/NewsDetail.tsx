import { useParams, Link } from "react-router";
import { 
  Calendar, ChevronLeft, Share2, Facebook, 
  Twitter, MessageCircle, Clock, ArrowRight,
  Bookmark, Award, Zap, Instagram, Share
} from "lucide-react";
import { motion } from "motion/react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const defaultNews = [
  {
    id: 1,
    slug: "abertura-oficial-liga-2026",
    title: "Grande Abertura da Liga de Futsal Escolar 2026",
    content: `
      <p>A Liga de Futsal Escolar do Agreste Meridional iniciou oficialmente sua temporada 2026 com uma cerimônia de gala no Ginásio do SESC Garanhuns. O evento contou com o desfile das 42 escolas participantes, reunindo mais de 800 jovens atletas das categorias Sub-11 ao Sub-18.</p>
      
      <h3>Expectativas para a Temporada</h3>
      <p>O coordenador técnico da Liga destacou o crescimento técnico das equipes: "Este ano vemos um investimento maior das escolas em treinamento e infraestrutura. Isso reflete diretamente na qualidade dos jogos que teremos pela frente."</p>

      <blockquote>"A Liga não é apenas sobre futsal, é sobre disciplina, educação e o fortalecimento dos laços entre as escolas da nossa região."</blockquote>

      <p>Os jogos regulares começam na próxima segunda-feira, com transmissões ao vivo selecionadas através do nosso portal e redes sociais. Fique ligado na tabela de jogos para não perder nenhum lance do seu time do coração.</p>
    `,
    category: "COMPETIÇÃO",
    date: "19 Abr 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function NewsDetail() {
  const { slug } = useParams();
  const { data: serverNews } = useSupaData('lfe_news', []);
  
  const newsList = serverNews.length > 0 ? serverNews : defaultNews;
  const news = newsList.find((n: any) => n.slug === slug) || newsList[0];

  const shareUrl = window.location.href;
  const shareTitle = news.title;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Immersive Header */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src={news.image} 
            className="w-full h-full object-cover" 
            alt={news.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-transparent hidden md:block" />
        </div>

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link to="/noticias" className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-xl">
               <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
               <span className="text-[10px] font-display font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em]">Portal de Notícias</span>
            </Link>
          </motion.div>
          
          <div className="max-w-5xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-primary rounded-2xl text-dark font-display font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl"
            >
              <Zap className="w-4 h-4" /> {news.category}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none"
            >
              {news.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-8 text-gray-400 font-display text-[10px] uppercase tracking-[0.3em] font-black opacity-60"
            >
               <div className="flex items-center gap-3 border-r border-white/10 pr-8">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  {news.date}
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  {news.readTime || "5 MIN"} LEITURA
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="container mx-auto px-4 py-32 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">
          
          {/* Sidebar Left: Share Components */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-40 space-y-16">
               <div className="space-y-8">
                  <h4 className="font-display font-black text-[10px] uppercase tracking-[0.4em] text-gray-800">Compartilhar Conteúdo</h4>
                  <div className="flex flex-col gap-4">
                     {[
                       { icon: Facebook, color: 'hover:bg-blue-600' },
                       { icon: Instagram, color: 'hover:bg-pink-600' },
                       { icon: MessageCircle, color: 'hover:bg-green-600' },
                       { icon: Share2, color: 'hover:bg-primary hover:text-dark' }
                     ].map((social, i) => (
                       <button key={i} className={cn("w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center transition-all group", social.color)}>
                          <social.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-8 pt-16 border-t border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 text-primary group cursor-pointer">
                       <Award className="w-6 h-6" />
                       <span className="text-[10px] font-display font-black uppercase tracking-widest group-hover:underline">Cobertura Oficial LFE</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 group cursor-pointer hover:text-white transition-colors">
                       <Bookmark className="w-6 h-6" />
                       <span className="text-[10px] font-display font-black uppercase tracking-widest">Leitura Posterior</span>
                    </div>
                  </div>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="lg:col-span-3">
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="prose prose-invert prose-2xl max-w-none font-display font-bold uppercase tracking-tight text-gray-400 space-y-12
                          prose-headings:font-black prose-headings:text-white prose-headings:tracking-tighter prose-headings:italic
                          prose-headings:h3:text-4xl prose-headings:h3:mt-24 prose-headings:h3:mb-12
                          prose-p:leading-[1.4] prose-p:mb-12
                          prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-white/[0.02] prose-blockquote:p-16 prose-blockquote:rounded-[3rem] prose-blockquote:my-20 prose-blockquote:text-white prose-blockquote:text-4xl prose-blockquote:shadow-3xl
                          prose-strong:text-primary"
               dangerouslySetInnerHTML={{ __html: news.content || news.excerpt }}
             />

             {/* Footer CTA */}
             <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mt-40 p-16 md:p-24 bg-white/[0.02] border border-white/5 rounded-[4rem] relative overflow-hidden backdrop-blur-3xl shadow-3xl"
             >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(204,255,0,0.05),transparent)]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                   <div className="space-y-4 text-center md:text-left">
                      <h4 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">Mergulhe na <span className="text-primary italic">Competição</span></h4>
                      <p className="text-gray-600 font-display font-black uppercase text-xs tracking-widest opacity-60">Confira todas as reportagens exclusivas no nosso portal.</p>
                   </div>
                   <Link to="/noticias" className="bg-primary text-dark px-12 py-6 rounded-3xl font-display font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all shadow-2xl shadow-primary/20 flex items-center gap-4">
                      Explorar Portal <ArrowRight className="w-5 h-5" />
                   </Link>
                </div>
             </motion.div>
          </article>
        </div>
      </section>

    </div>
  );
}
