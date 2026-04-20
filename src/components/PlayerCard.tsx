import { User, Goal, Trophy, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PlayerCardProps {
  player: any;
  teamLogo?: string;
  stats: {
    goals: number;
    assists: number;
    games: number;
  };
  className?: string;
}

export default function PlayerCard({ player, teamLogo, stats, className }: any) {
  const safeName = String(player.name || "Uniformado").trim();

  return (
    <div 
      className={cn(
        "group relative flex flex-col bg-white rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] aspect-[10/14]",
        className
      )}
    >
      {/* 1. FUNDO E EFEITO CARTA MARCA D'ÁGUA */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Trophy className="w-64 h-64 -rotate-12" />
        </div>

        {/* Watermark Name Behind */}
        <div className="absolute bottom-20 left-12 right-12 z-0 opacity-[0.05] pointer-events-none">
          <h4 className="font-display font-black text-7xl md:text-8xl text-slate-900 leading-[0.8] uppercase tracking-tighter whitespace-pre-wrap break-words">
            {safeName}
          </h4>
        </div>
        
        {player.photo ? (
          <img 
            src={player.photo} 
            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <User className="w-32 h-32 text-slate-300" />
          </div>
        )}
        
        {/* Overlays de Estilo */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* 2. ESTATÍSTICAS ESTILO CARTA ESPORTIVA */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {[
          { label: "GOL", value: stats.goals, icon: Goal },
          { label: "AST", value: stats.assists, icon: Star },
          { label: "JOG", value: stats.games, icon: Trophy },
        ].map((stat, i) => (
          <div 
            key={i}
            className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-xl flex flex-col items-center group-hover:bg-primary transition-all duration-300 group-hover:scale-110"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span className="text-[8px] font-display font-black text-white/40 uppercase tracking-tighter group-hover:text-black/60 italic leading-none mb-1">
              {stat.label}
            </span>
            <span className="text-xl font-display font-black text-white group-hover:text-black leading-none tracking-tighter">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* 3. CABEÇALHO (Categoria e Número) */}
      <div className="relative z-10 p-8 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-100 rounded-lg text-[10px] font-display font-black text-slate-900 uppercase tracking-widest shadow-sm">
            {String(player.category || "---").toUpperCase()}
          </span>
          <span className="px-3 py-1 bg-primary text-black rounded-lg text-[9px] font-display font-black uppercase tracking-widest shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {player.position || "ATLETA"}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-display font-black text-8xl italic leading-none tracking-tighter text-slate-900 drop-shadow-md group-hover:text-primary transition-colors">
            {player.number}
          </span>
          {teamLogo && (
            <div className="w-14 h-14 bg-white rounded-full p-2.5 mt-2 shadow-2xl border border-slate-100 overflow-hidden flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <img src={teamLogo} alt="Team" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* 4. NOME NA BASE */}
      <div className="relative z-10 mt-auto p-10 flex flex-col items-center">
        <div className="w-full h-px bg-slate-900/20 mb-4 group-hover:bg-primary/50 transition-colors" />
        <h3 className="font-display font-black text-5xl text-slate-950 text-center uppercase leading-none tracking-tighter group-hover:scale-110 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:text-primary">
          {safeName}
        </h3>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-8 h-1.5 bg-slate-900 rounded-full group-hover:bg-primary transition-colors" />
          <div className="w-2 h-1.5 bg-slate-900/20 rounded-full" />
        </div>
      </div>

      {/* 5. EFEITO DE BRILHO (Gloss) */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full duration-1000" />
    </div>
  );
}
