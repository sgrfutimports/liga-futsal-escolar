import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Trophy, LogOut, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import NotificationBell from "./NotificationBell";
import { useSupaData } from "@/src/lib/store";

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
    <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/5">
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

          {/* Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4 mr-6 border-r border-dark-border pr-6">
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
              </Link>
            ))}
            
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
    </nav>
  );
}
