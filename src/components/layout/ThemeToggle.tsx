import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('lfe-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('lfe-theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('lfe-theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden border",
        isLight 
          ? "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm" 
          : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
      )}
      title={isLight ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-5 h-5 animate-in zoom-in spin-in-90 duration-500" />
        ) : (
          <Moon className="w-5 h-5 animate-in zoom-in spin-in-gradient duration-500" />
        )}
      </div>
      
      {/* Decorative pulse effect on toggle */}
      <span className={cn(
        "absolute inset-0 rounded-xl animate-ping opacity-0",
        isLight ? "bg-orange-400/20" : "bg-primary/20",
        "pointer-events-none"
      )}></span>
    </button>
  );
}
