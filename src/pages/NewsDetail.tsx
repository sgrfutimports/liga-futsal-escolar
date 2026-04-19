import { useParams, Link } from "react-router";
import { 
  Calendar, ChevronLeft, Share2, Facebook, 
  Twitter, MessageCircle, Clock, ArrowRight,
  Bookmark, Award, Zap
} from "lucide-react";
import { useSupaData } from "@/src/lib/store";

// Usando o mesmo mock para consistência
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
  },
  // ... outros seriam carregados via slug
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
      
      {/* Article Header & Image */}
      <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={news.image} className="w-full h-full object-cover shadow-2xl" alt={news.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-12">
          <Link to="/noticias" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-display text-xs uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit">
             <ChevronLeft className="w-4 h-4" /> Voltar ao Portal
          </Link>
          
          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-primary text-black font-display font-black text-[11px] rounded-lg uppercase tracking-widest inline-block">
              {news.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-400 font-display text-[10px] uppercase tracking-widest font-bold">
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {news.date}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {news.readTime || "5 min"} de leitura</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left: Share Bar Sidebar */}
        <div className="lg:col-span-1 border-r border-white/5 pr-8 hidden lg:block">
           <div className="sticky top-32 space-y-12">
              <div className="space-y-6">
                 <p className="font-display font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Compartilhar</p>
                 <div className="flex flex-col gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all group">
                       <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all group">
                       <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all group">
                       <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                 </div>
              </div>

              <div className="space-y-6 pt-12 border-t border-white/5">
                 <div className="flex items-center gap-3 text-primary">
                    <Award className="w-5 h-5" />
                    <span className="text-[10px] font-display font-black uppercase tracking-widest">Matéria Especial</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-500">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-[10px] font-display font-black uppercase tracking-widest">Salvar Notícia</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Middle: Content */}
        <div className="lg:col-span-3 space-y-12">
           <div 
             className="prose prose-invert prose-lg max-w-none font-sans text-gray-300 leading-relaxed
                        prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white
                        prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic
                        prose-strong:text-primary prose-a:text-primary"
             dangerouslySetInnerHTML={{ __html: news.content || news.excerpt }}
           />

           {/* Mobile Share Bar */}
           <div className="lg:hidden flex items-center gap-4 pt-12 border-t border-white/5">
              <span className="text-xs font-display font-bold text-gray-500 uppercase">Compartilhar:</span>
              <Facebook className="w-6 h-6 text-gray-400" />
              <Twitter className="w-6 h-6 text-gray-400" />
              <MessageCircle className="w-6 h-6 text-gray-400" />
           </div>

           {/* More News CTA */}
           <div className="mt-20 p-10 bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                 <h4 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Quer ler mais?</h4>
                 <p className="text-gray-400 text-sm">Confira todas as reportagens exclusivas no nosso portal.</p>
              </div>
              <Link to="/noticias" className="bg-primary text-black px-8 py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                 Ver Mais Notícias <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
