import { Link } from "react-router";
import { Instagram, MapPin, Mail, LogOut } from "lucide-react";
import { useSupaData } from "@/src/lib/store";

export default function Footer() {
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};

  return (
    <footer className="bg-[#010310] border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Section: Brand & Contact */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 transition-transform">
                <img 
                  src={settings.league_logo || "/logos/logo.jpg"} 
                  alt={settings.league_name || "LFE"} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white uppercase tracking-tighter block leading-none">
                  {settings.league_name || "LIGA"}
                </span>
                <span className="text-[10px] font-sans font-black text-gray-600 tracking-[0.3em] uppercase">
                  Escolar 2026
                </span>
              </div>
            </Link>
            <div className="space-y-4">
              <h3 className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.5em]">CONTATO</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-gray-400 group">
                  <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{settings.contact_address || "Garanhuns, Pernambuco - Brasil"}</span>
                </li>
                <li className="flex items-center gap-4 text-gray-400 group">
                  <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{settings.contact_email || "contato@ligafutsalescolar.com"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section: Links & Regulation */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
               <h3 className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.5em]">NAVEGAÇÃO</h3>
               <ul className="space-y-4">
                 <li><Link to="/equipes" className="text-gray-400 hover:text-primary text-sm font-bold transition-all uppercase tracking-widest">Times</Link></li>
                 <li><Link to="/classificacao" className="text-gray-400 hover:text-primary text-sm font-bold transition-all uppercase tracking-widest">Tabela</Link></li>
                 <li><Link to="/jogos" className="text-gray-400 hover:text-primary text-sm font-bold transition-all uppercase tracking-widest">Jogos</Link></li>
               </ul>
            </div>
            <div className="space-y-8">
               <h3 className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.5em]">DOCUMENTOS</h3>
               <ul className="space-y-4">
                 <li><Link to="/regulamento" className="text-gray-400 hover:text-primary text-sm font-bold transition-all uppercase tracking-widest">Regulamento</Link></li>
                 <li><Link to="/privacidade" className="text-gray-400 hover:text-primary text-sm font-bold transition-all uppercase tracking-widest">Privacidade</Link></li>
               </ul>
            </div>
          </div>

          {/* Section: Social & Partners Placeholder */}
          <div className="md:col-span-4 space-y-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.5em]">REDES SOCIAIS</h3>
              <div className="flex gap-4">
                <a 
                  href={settings.instagram_url || "https://www.instagram.com/ligadefutsalescolar/"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-2xl active:scale-95 border border-white/5 bg-white/5"
                >
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>
            <div className="space-y-6">
               <h3 className="text-[10px] font-display font-black text-gray-700 uppercase tracking-[0.5em]">PARCEIROS</h3>
               <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Apoiando o esporte estudantil em Pernambuco.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-center md:text-left text-[10px] font-display font-black text-gray-800 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {settings.league_name || "Liga de Futsal Escolar"} • TODOS OS DIREITOS RESERVADOS
          </p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse" />
             <span className="text-[9px] font-display font-black text-gray-600 uppercase tracking-widest">SISTEMA ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
