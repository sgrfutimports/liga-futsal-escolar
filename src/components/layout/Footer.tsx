import { Link } from "react-router";
import { Instagram, MapPin, Mail, Phone, Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/liga-futsal-logo.png" 
                  alt="Liga de Futsal Escolar" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-primary', 'rounded');
                  }}
                />
                <Trophy className="w-5 h-5 text-dark absolute opacity-0 group-data-[error=true]:opacity-100" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  LIGA
                </span>
                <span className="text-[8px] font-sans font-medium text-gray-400 tracking-[0.2em] uppercase">
                  Futsal Escolar
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              A maior liga de futsal escolar do agreste meridional. Formando atletas e cidadãos através do esporte.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-gray-400 hover:text-primary hover:bg-dark-border transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Competição</h3>
            <ul className="space-y-2">
              <li><Link to="/classificacao" className="text-gray-400 hover:text-primary text-sm transition-colors">Classificação</Link></li>
              <li><Link to="/equipes" className="text-gray-400 hover:text-primary text-sm transition-colors">Equipes</Link></li>
              <li><Link to="/atletas" className="text-gray-400 hover:text-primary text-sm transition-colors">Atletas</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Regulamento (PDF)</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Av. Esportiva, 1000<br/>Garanhuns, PE</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contato@ligafutsalescolar.com</span>
              </li>
            </ul>
          </div>

          {/* Sponsors */}
          <div>
            <h3 className="font-display text-lg mb-4 text-white">Patrocinadores Master</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">FERREIRA COSTA</span>
              </div>
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">UNICOMPRA</span>
              </div>
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">BÔNUS SUPERMERCADOS</span>
              </div>
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">SESC PERNAMBUCO</span>
              </div>
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">PREFEITURA DE GARANHUNS</span>
              </div>
              <div className="h-12 bg-dark rounded border border-dark-border flex items-center justify-center p-2">
                <span className="text-gray-400 font-display text-[10px] text-center">O BOTICÁRIO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Liga de Futsal Escolar. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
