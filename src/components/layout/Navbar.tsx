import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Trophy, LogOut, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import NotificationBell from "./NotificationBell";
import { useSupaData } from "@/src/lib/store";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Jogos", path: "/jogos" },
  { name: "Tabela", path: "/classificacao" },
  { name: "Times", path: "/equipes" },
  { name: "Notícias", path: "/noticias" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr[0] || {};

  const isAdmin = localStorage.getItem('lfe_admin_authenticated') === 'true';
  const isChefe = localStorage.getItem('lfe_is_chefe') === 'true';

  let mergedLinks = [...navLinks];
  if (isAdmin || isChefe) {
    if (isChefe) {
      mergedLinks.push({ name: "Enviar Elenco", path: "/enviar-elenco" });
    }
    mergedLinks.push({ name: "Dep. Técnico", path: "/dep-tecnico" });
  }

  const handleLogout = () => {
    localStorage.removeItem('lfe_admin_authenticated');
    localStorage.removeItem('lfe_is_chefe');
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-500 shadow-2xl border border-white/10">
              <img 
                src={settings.leagueLogo || "/logos/logo.jpg"} 
                alt={settings.leagueName || "Liga de Futsal Escolar"} 
                className="w-full h-full object-contain scale-[1.1]"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors uppercase">
                {settings.leagueName || "LIGA"}
              </span>
              <span className="text-[10px] font-sans font-black text-gray-500 tracking-[0.2em] uppercase">
                {settings.eventName?.includes('Futsal') ? settings.eventName : 'Futsal Escolar'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            {mergedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-display text-sm font-black tracking-widest transition-all hover:text-primary relative py-2 uppercase",
                  location.pathname === link.path ? "text-primary" : "text-gray-400"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-8">
              <NotificationBell />
              <Link
                to="/inscricao"
                className="bg-primary text-dark font-display text-xs font-black px-6 py-2.5 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-white/20 uppercase tracking-widest"
              >
                INSCREVER EQUIPE
              </Link>
              {(isAdmin || isChefe) && (
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-[#050505] border-b border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-10 flex flex-col space-y-4">
              {mergedLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "font-display text-4xl font-black tracking-tighter py-3 transition-all block uppercase",
                      location.pathname === link.path ? "text-primary translate-x-2" : "text-gray-600 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <Link
                to="/inscricao"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full p-6 mt-4 rounded-3xl bg-primary text-dark font-display text-xl font-black uppercase tracking-tighter shadow-[0_0_30px_rgba(204,255,0,0.3)] shadow-primary/20"
              >
                INSCREVER EQUIPE
              </Link>

              {(isAdmin || isChefe) && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full p-6 mt-4 rounded-3xl bg-red-600/10 border border-red-600/20 text-red-500 font-display text-xl font-black uppercase tracking-tighter"
                >
                  SAIR DO SISTEMA
                  <LogOut className="w-6 h-6" />
                </motion.button>
              )}
            </div>
            <div className="px-6 py-6 border-t border-white/5 bg-black/40">
               <p className="text-[10px] font-display font-bold text-gray-700 tracking-[0.3em] uppercase text-center">{settings.leagueName || "Liga de Futsal Escolar"} • {settings.yearEdition || "2026"}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
