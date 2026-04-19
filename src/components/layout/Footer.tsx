import { Link } from "react-router";
import { Instagram, MapPin, Mail, Trophy } from "lucide-react";

export default function Footer() {
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};

  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 pr-0 md:pr-12">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-border">
                <img 
                  src={settings.league_logo || "/logos/logo.jpg"} 
                  alt={settings.league_name || "LFE"} 
                  className="w-full h-full object-contain scale-[1.2]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors uppercase">
                  {settings.league_name || "LIGA"}
                </span>
                <span className="text-[8px] font-sans font-medium text-text-muted tracking-[0.2em] uppercase">
                  Futsal Escolar
                </span>
              </div>
            </Link>
            <p className="text-text-muted text-sm mb-6">
              A maior liga de futsal escolar do agreste meridional. Formando atletas e cidadãos através do esporte.
            </p>
            <div className="flex gap-4">
              <a 
                href={settings.instagram_url || "https://www.instagram.com/ligadefutsalescolar/"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg active:scale-95"
                style={{ 
                  background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' 
                }}
              >
                <Instagram className="w-6 h-6" strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-lg mb-4 text-text uppercase">Competição</h3>
            <ul className="space-y-2">
              <li><Link to="/classificacao" className="text-text-muted hover:text-primary text-sm transition-colors">Classificação</Link></li>
              <li><Link to="/equipes" className="text-text-muted hover:text-primary text-sm transition-colors">Equipes</Link></li>
              <li><Link to="/atletas" className="text-text-muted hover:text-primary text-sm transition-colors">Atletas</Link></li>
              <li><Link to="/noticias" className="text-text-muted hover:text-primary text-sm transition-colors">Notícias</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg mb-4 text-text uppercase">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-text-muted text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.contact_address || "Garanhuns, PE"}</span>
              </li>
              <li className="flex items-center gap-3 text-text-muted text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.contact_email || "contato@ligafutsalescolar.com"}</span>
              </li>
              {settings.whatsapp_number && (
                <li className="flex items-center gap-3 text-text-muted text-sm border-t border-border mt-3 pt-3">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>WhatsApp: {settings.whatsapp_number}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} {settings.league_name || "Liga de Futsal Escolar"}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-[10px] font-display font-black uppercase tracking-widest text-text-muted">
            <Link to="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
      </div>
    </footer>
  );
}
