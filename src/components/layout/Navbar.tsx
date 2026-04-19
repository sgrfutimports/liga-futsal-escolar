import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Trophy, LogOut, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import NotificationBell from "./NotificationBell";
import { useSupaData } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Notícias", path: "/noticias" },
  { name: "Classificação", path: "/classificacao" },
  { name: "Jogos", path: "/jogos" },
  { name: "Equipes", path: "/equipes" },
  { name: "Atletas", path: "/atletas" },
  { name: "Galeria", path: "/galeria" },
  { name: "Inscrição", path: "/inscricao" },
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
      mergedLinks = mergedLinks.filter(link => link.name !== "Inscrição");
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
    <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img 
                src={settings.league_logo || "/logos/logo.jpg"} 
                alt={settings.league_name || "Liga de Futsal Escolar"} 
                className="w-full h-full object-contain scale-[1.2]"
              />
              <Trophy className="w-6 h-6 text-dark absolute inset-0 m-auto opacity-0 group-data-[error=true]:opacity-100" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                {settings.league_name || "LIGA"}
              </span>
              <span className="text-[10px] font-sans font-medium text-gray-400 tracking-[0.2em] uppercase">
                Futsal Escolar
              </span>
            </div>
          </Link>

          {/* Wrapper for Search/Notify and Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 mr-6 border-r border-dark-border pr-6 font-display font-medium">
               <NotificationBell />
            </div>
            
            {mergedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-display text-lg tracking-wide transition-colors hover:text-primary relative py-2",
                  location.pathname === link.path ? "text-primary" : "text-gray-400"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {(isAdmin || isChefe) ? (
              <div className="flex items-center gap-4 bg-dark-card border border-dark-border px-4 py-2 rounded-full shadow-inner">
                <div className="flex items-center gap-2 text-sm font-display text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="max-w-[100px] truncate">
                    {isAdmin ? "Admin" : "Chefe"}
                  </span>
                </div>
                <div className="w-px h-6 bg-dark-border"></div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/chefes-login"
                className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-md font-display text-sm text-primary hover:bg-primary hover:text-dark transition-all uppercase tracking-widest font-bold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-4">
            <NotificationBell />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-border bg-dark"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {mergedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-md font-display text-xl",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-gray-400 hover:bg-dark-card hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {!isChefe && !isAdmin && (
                <Link
                  to="/chefes-login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-md font-display text-xl text-primary bg-primary/10 mt-4 border border-primary/20 text-center"
                >
                  Área do Chefe
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
