import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { 
  ChevronRight, Trophy, Calendar, 
  Shield, Users, MapPin, ArrowUpRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSupaData } from "@/src/lib/store";
import Sponsors from "@/src/components/layout/Sponsors";

export default function Home() {
  const { data: teams } = useSupaData('lfe_teams', []);
  const { data: games } = useSupaData('lfe_games', []);
  const { data: settingsArr } = useSupaData('lfe_settings', []);
  const settings = settingsArr?.[0] || {};

  // Calculations for highlights
  const nextGame = useMemo(() => {
    return (games || [])
      .filter((g: any) => String(g?.status || '').toLowerCase() !== 'finalizado')
      .sort((a: any, b: any) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      })[0];
  }, [games]);

  const lastResult = useMemo(() => {
    return (games || [])
      .filter((g: any) => String(g.status || '').toLowerCase() === 'finalizado')
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [games]);

  const leader = useMemo(() => {
    if (!teams || teams.length === 0 || !games || games.length === 0) return null;
    const cat = games[0]?.category || "Geral";
    const teamsInCat = teams.map((t: any) => {
       let pts = 0;
       games.filter((g: any) => g.category === cat && String(g.status).toLowerCase() === 'finalizado').forEach((g: any) => {
          const isHome = String(g.homeTeamId || g.home_team_id) === String(t.id);
          const isAway = String(g.awayTeamId || g.away_team_id) === String(t.id);
          if (isHome || isAway) {
            const hScore = Number(g.homeScore ?? g.home_score ?? 0);
            const aScore = Number(g.awayScore ?? g.away_score ?? 0);
            if (isHome) {
              if (hScore > aScore) pts += 3; else if (hScore === aScore) pts += 1;
            } else {
              if (aScore > hScore) pts += 3; else if (hScore === aScore) pts += 1;
            }
          }
       });
       return { ...t, pts };
    }).sort((a: any, b: any) => b.pts - a.pts);
    return teamsInCat[0];
  }, [teams, games]);

  const top5 = useMemo(() => {
    if (!teams || teams.length === 0) return [];
    return teams.map((t: any) => {
      let pts = 0;
      (games || []).filter((g: any) => String(g.status).toLowerCase() === 'finalizado').forEach((g: any) => {
        const isHome = String(g.homeTeamId || g.home_team_id) === String(t.id);
        const isAway = String(g.awayTeamId || g.away_team_id) === String(t.id);
        if (isHome || isAway) {
          const hScore = Number(g.homeScore ?? g.home_score ?? 0);
          const aScore = Number(g.awayScore ?? g.away_score ?? 0);
          if (isHome) { if (hScore > aScore) pts += 3; else if (hScore === aScore) pts += 1; }
          else { if (aScore > hScore) pts += 3; else if (hScore === aScore) pts += 1; }
        }
      });
      return { ...t, pts };
    }).sort((a: any, b: any) => b.pts - a.pts).slice(0, 5);
  }, [teams, games]);

  const upcomingList = useMemo(() => {
    return (games || [])
      .filter((g: any) => String(g.status || '').toLowerCase() !== 'finalizado')
      .slice(0, 3);
  }, [games]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* 1. HERO SECTION - DOBRA 1 */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-[#020617]/80 to-[#020617] z-10" />
          <img 
            src="/banner-principal.png" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-50" 
            alt="Futsal Action"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-display text-xs font-black uppercase tracking-[0.3em] mb-10"
            >
              <Trophy className="w-5 h-5" /> Temporada 2026
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-7xl md:text-9xl font-display font-black leading-[0.82] uppercase tracking-tighter mb-10"
            >
              A Maior <br/>
              <span className="text-primary italic">Liga Escolar</span> <br/>
              da Região
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl md:text-3xl text-gray-400 font-medium max-w-3xl mb-14 leading-tight border-l-4 border-primary/30 pl-8"
            >
              Competição, talento e emoção dentro das quadras. 
              O palco onde nascem os grandes campeões.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap gap-8"
            >
              <Link to="/jogos" className="group px-10 py-5 bg-primary text-dark font-display text-2xl font-black rounded-[2rem] flex items-center gap-4 hover:bg-white transition-all shadow-[0_30px_60px_rgba(204,255,0,0.2)] active:scale-95">
                VER JOGOS <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/inscricao" className="px-10 py-5 bg-white/5 border border-white/20 text-white font-display text-2xl font-black rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all backdrop-blur-xl active:scale-95">
                INSCREVER ESCOLA
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DESTAQUES RÁPIDOS */}
      <section className="-mt-32 relative z-30 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: Próximo Jogo */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block mb-8 relative z-10">Próximo Jogo</span>
            {nextGame ? (
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="w-14 h-14 bg-white rounded-2xl p-2.5 shadow-2xl transition-transform group-hover:scale-110">
                     <img src={(teams || []).find((t: any) => String(t.id) === String(nextGame.homeTeamId || nextGame.home_team_id))?.logo || "/logos/placeholder.png"} className="w-full h-full object-contain" />
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-gray-700 font-display font-black text-sm italic mb-1 uppercase tracking-widest">VS</span>
                     <div className="h-0.5 w-8 bg-primary/30 rounded-full" />
                   </div>
                   <div className="w-14 h-14 bg-white rounded-2xl p-2.5 shadow-2xl transition-transform group-hover:scale-110">
                     <img src={(teams || []).find((t: any) => String(t.id) === String(nextGame.awayTeamId || nextGame.away_team_id))?.logo || "/logos/placeholder.png"} className="w-full h-full object-contain" />
                   </div>
                </div>
                <div>
                   <p className="font-display font-black text-primary text-sm uppercase italic tracking-[0.2em] mb-1">{nextGame.date}</p>
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest opacity-60 truncate">{nextGame.location}</p>
                </div>
              </div>
            ) : <p className="text-gray-600 font-display font-black text-center py-4 italic uppercase tracking-widest text-[10px]">Sem agenda</p>}
          </div>

          {/* Card: Líder do Geral */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block mb-8 relative z-10">Líder do Geral</span>
            {leader ? (
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-white rounded-[1.8rem] p-3 shadow-2xl group-hover:rotate-6 transition-transform">
                  <img src={leader.logo || "/logos/placeholder.png"} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-display font-black text-xl md:text-2xl uppercase leading-none mb-2 tracking-tighter group-hover:text-primary transition-colors">{leader.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-display font-black text-3xl italic drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">{leader.pts} PTS</span>
                  </div>
                </div>
              </div>
            ) : <p className="text-gray-600 font-display font-black text-center py-4 italic uppercase tracking-widest text-[10px]">Indisponível</p>}
          </div>

          {/* Card: Artilheiro (Destaque Neon) */}
          <Link to="/fama" className="bg-primary backdrop-blur-3xl border border-primary/20 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(204,255,0,0.3)] hover:scale-105 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent)] opacity-30" />
            <span className="text-[10px] font-display font-black text-dark/40 uppercase tracking-[0.3em] block mb-8 relative z-10">Artilheiro</span>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-dark rounded-[1.8rem] p-4 flex items-center justify-center shadow-3xl group-hover:scale-110 transition-transform">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div className="text-dark">
                <p className="font-display font-black text-2xl md:text-3xl uppercase leading-[0.85] mb-2 tracking-tighter">CRAQUES<br/>LFE</p>
                <div className="inline-block bg-dark/10 px-3 py-1 rounded-full text-[9px] font-display font-black uppercase tracking-widest">Ver Rankings</div>
              </div>
            </div>
          </Link>

          {/* Card: Último Resultado */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <span className="text-[10px] font-display font-black text-gray-500 uppercase tracking-[0.3em] block mb-8 relative z-10">Último Resultado</span>
            {lastResult ? (
              <div className="flex flex-col items-center relative z-10">
                 <div className="flex items-center justify-center gap-8 mb-4">
                    <span className="text-6xl md:text-7xl font-display font-black text-white italic drop-shadow-2xl">{lastResult.homeScore ?? lastResult.home_score ?? 0}</span>
                    <div className="w-1 h-12 bg-primary/20 rounded-full" />
                    <span className="text-6xl md:text-7xl font-display font-black text-white italic drop-shadow-2xl">{lastResult.awayScore ?? lastResult.away_score ?? 0}</span>
                 </div>
                 <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-2 rounded-full backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <p className="text-[9px] font-display font-black text-primary uppercase tracking-[0.4em]">PLACAR FINAL</p>
                 </div>
              </div>
            ) : <p className="text-gray-600 font-display font-black text-center py-4 italic uppercase tracking-widest text-[10px]">Sem registros</p>}
          </div>

        </div>
      </section>

      {/* 3. PRÓXIMOS JOGOS */}
      <section className="py-40 container mx-auto px-4">
        <div className="flex items-end justify-between mb-20 gap-8">
           <div className="max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-4 leading-none">Próximos <br/><span className="text-primary italic">Confrontos</span></h2>
              <div className="h-2 w-32 bg-primary rounded-full shadow-[0_0_20px_rgba(204,255,0,0.5)]" />
           </div>
           <Link to="/jogos" className="font-display text-sm font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-colors shrink-0">
             Calendário completo <ArrowUpRight className="w-5 h-5 bg-white/5 rounded-full p-1" />
           </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
           {upcomingList.map((game: any) => {
             const hT = (teams || []).find((t: any) => String(t.id) === String(game.homeTeamId || game.home_team_id));
             const aT = (teams || []).find((t: any) => String(t.id) === String(game.awayTeamId || game.away_team_id));
             return (
               <div key={game.id} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-12 w-full lg:w-auto justify-center">
                     <div className="flex items-center gap-8 text-right">
                        <span className="font-display font-black text-2xl uppercase tracking-tighter hidden sm:block">{hT?.name}</span>
                        <div className="w-24 h-24 bg-white rounded-[2rem] p-4 shadow-3xl group-hover:scale-110 transition-transform duration-500"><img src={hT?.logo} className="w-full h-full object-contain" /></div>
                     </div>
                     <div className="flex flex-col items-center">
                        <span className="text-gray-800 font-display font-black text-5xl italic uppercase">VS</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-black tracking-widest mt-2">{game.category}</span>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-white rounded-[2rem] p-4 shadow-3xl group-hover:scale-110 transition-transform duration-500"><img src={aT?.logo} className="w-full h-full object-contain" /></div>
                        <span className="font-display font-black text-2xl uppercase tracking-tighter hidden sm:block">{aT?.name}</span>
                     </div>
                  </div>
                  <div className="flex flex-col lg:items-end items-center gap-4 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 w-full lg:w-auto">
                     <div className="space-y-1">
                        <p className="font-display font-black text-3xl uppercase italic text-white leading-none">{game.date}</p>
                        <p className="font-display font-black text-xl text-primary uppercase leading-none">{game.time || "19:00"}</p>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-5 h-5 text-gray-800" />
                        <span className="text-[11px] uppercase font-black tracking-widest truncate max-w-[250px]">{game.location}</span>
                     </div>
                     <Link to={`/jogos/${game.id}`} className="mt-4 px-8 py-3 bg-white text-dark rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
                       Ver Detalhes
                     </Link>
                  </div>
               </div>
             )
           })}
        </div>
      </section>

      {/* 4. TABELA RESUMIDA */}
      <section className="py-40 bg-dark/60 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="order-2 lg:order-1">
               <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-3xl relative">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text- dark shadow-[0_20px_40px_rgba(204,255,0,0.4)]">
                     <Trophy className="w-12 h-12 text-dark" />
                  </div>
                  <table className="w-full">
                     <thead>
                        <tr className="border-b border-white/10 text-[11px] font-display font-black text-gray-700 uppercase tracking-[0.4em]">
                           <th className="pb-6 text-left px-4">#</th>
                           <th className="pb-6 text-left px-4">EQUIPE</th>
                           <th className="pb-6 text-center px-4">PTS</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.03]">
                        {top5.map((team: any, idx: number) => (
                          <tr key={team.id} className="group hover:bg-white/[0.03] transition-all">
                             <td className="py-8 px-4">
                                <span className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg italic",
                                  idx === 0 ? "bg-primary text-dark shadow-primary/30" : "bg-dark/80 text-gray-700"
                                )}>
                                  {idx + 1}
                                </span>
                             </td>
                             <td className="py-8 px-4">
                                <Link to={`/equipes/${team.id}`} className="flex items-center gap-6">
                                   <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-2xl group-hover:scale-110 transition-transform"><img src={team.logo} className="w-full h-full object-contain" /></div>
                                   <span className="font-display font-black text-2xl uppercase tracking-tighter group-hover:text-primary transition-colors">{team.name}</span>
                                </Link>
                             </td>
                             <td className="py-8 px-4 text-center text-4xl font-display font-black italic text-white">{team.pts}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                  <Link to="/classificacao" className="block w-full text-center py-6 mt-10 font-display font-black text-sm text-gray-500 hover:text-primary hover:bg-dark transition-all border border-white/5 rounded-3xl uppercase tracking-widest">
                    Ver Tabela Completa
                  </Link>
               </div>
            </div>
            <div className="order-1 lg:order-2">
               <span className="text-[10px] font-display font-black text-primary uppercase tracking-[0.5em] block mb-8">Classificação Geral</span>
               <h2 className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-10 leading-[0.8]">
                 Domínio <br/><span className="text-primary italic">Absoluto</span>
               </h2>
               <p className="text-gray-400 text-2xl mb-12 max-w-lg leading-snug">Estes são os times que dão o tom da temporada. Cada ponto conta na jornada épica rumo ao título de 2026.</p>
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                     <p className="text-4xl font-display font-black text-white mb-2">{teams.length}</p>
                     <p className="text-[10px] font-display font-black text-gray-600 uppercase tracking-widest">EQUIPES</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                     <p className="text-4xl font-display font-black text-white mb-2">{games.length}</p>
                     <p className="text-[10px] font-display font-black text-gray-600 uppercase tracking-widest">CONFRONTOS</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DESTAQUES DA RODADA */}
      <section className="py-40 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
           <h2 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none">Destaques <br/><span className="text-primary italic">da Rodada</span></h2>
           <p className="text-gray-500 text-xl max-w-md md:text-right uppercase font-black tracking-widest leading-tight opacity-40">As notícias que agitaram as quadras nos últimos dias.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {[
             { title: "Virada Épica na Categoria Sub-15", category: "NOTÍCIA", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" },
             { title: "Inscrições Próximas do Encerramento", category: "ADMIN", img: "https://images.unsplash.com/photo-1543326131-de94b150c18d?auto=format&fit=crop&q=80&w=800" },
             { title: "Melhor Jogador do Mês é Revelado", category: "DESTAQUE", img: "https://images.unsplash.com/photo-1517603951034-af241c2c3dc4?auto=format&fit=crop&q=80&w=800" }
           ].map((news, i) => (
             <Link to="/noticias" key={i} className="group relative overflow-hidden rounded-[4rem] bg-white/[0.03] border border-white/10 hover:border-primary/50 transition-all flex flex-col h-full">
                <div className="aspect-[16/10] overflow-hidden relative">
                   <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 mix-blend-screen" />
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark to-transparent" />
                </div>
                <div className="p-10 flex flex-col flex-grow">
                   <span className="text-[10px] font-display font-black text-primary uppercase tracking-[0.4em] mb-6 block">{news.category}</span>
                   <h3 className="text-3xl font-display font-black leading-[1.1] mb-6 uppercase tracking-tighter group-hover:text-primary transition-colors">{news.title}</h3>
                   <div className="mt-auto flex items-center gap-3 text-white font-display font-black text-xs uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">
                     Ler Mais <ChevronRight className="w-4 h-4" />
                   </div>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="relative py-60 overflow-hidden text-center bg-[#ccff00]">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
         <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-12 leading-none text-dark">
              Quer fazer <br/>História?
            </h2>
            <p className="text-2xl md:text-3xl text-dark/60 mb-20 uppercase font-black tracking-[0.2em] italic max-w-3xl mx-auto">Inscreva sua equipe agora e dispute a maior liga estudantil da região.</p>
            <Link to="/inscricao" className="inline-block group active:scale-95 transition-all">
               <div className="relative px-16 py-8 bg-dark text-white rounded-[3.5rem] font-display text-4xl font-black uppercase tracking-tighter shadow-3xl hover:bg-[#020617] transition-all flex items-center gap-8">
                 INSCREVER EQUIPE
                 <ArrowUpRight className="w-12 h-12 text-primary group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
               </div>
            </Link>
         </div>
      </section>

    </div>
  );
}
