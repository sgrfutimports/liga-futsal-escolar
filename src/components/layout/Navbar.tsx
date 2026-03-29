import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Trophy } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Classificação", path: "/classificacao" },
  { name: "Equipes", path: "/equipes" },
  { name: "Atletas", path: "/atletas" },
  { name: "Inscrição", path: "/inscricao" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img 
                src={localStorage.getItem('league_logo') || "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/liga-futsal-logo.png"} 
                alt="Liga de Futsal Escolar" 
                className="w-full h-full object-contain scale-[1.2]"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-primary', 'rounded-lg');
                }}
              />
              {/* Fallback Icon (hidden if image loads) */}
              <Trophy className="w-6 h-6 text-dark absolute inset-0 m-auto opacity-0 group-data-[error=true]:opacity-100" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                LIGA
              </span>
              <span className="text-[10px] font-sans font-medium text-gray-400 tracking-[0.2em] uppercase">
                Futsal Escolar
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
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
            <Link
              to="/admin"
              className="px-4 py-2 bg-dark-card border border-dark-border rounded-md font-display text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
              {navLinks.map((link) => (
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
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md font-display text-xl text-gray-400 hover:bg-dark-card hover:text-white mt-4 border border-dark-border"
              >
                Área Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
