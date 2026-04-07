import { defaultData, getLogo, useSupaData } from "@/src/lib/store";
import { Star, Shield, Goal } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Sponsors() {
  const { data: sponsorsArr } = useSupaData('lfe_sponsors', []);
  const sponsorsPremium = sponsorsArr?.filter((s: any) => s.type === 'premium') || [];
  const sponsorsOfficial = sponsorsArr?.filter((s: any) => s.type === 'official') || [];

  const premiumSponsorItems = sponsorsPremium?.length > 0 ? sponsorsPremium : defaultData.sponsorsPremium || [];
  const officialSponsorItems = sponsorsOfficial?.length > 0 ? sponsorsOfficial : defaultData.sponsorsOfficial || [];

  if (premiumSponsorItems.length === 0 && officialSponsorItems.length === 0) return null;

  return (
    <div className="w-full">
      {/* Premium Sponsors Section */}
      {premiumSponsorItems?.length > 0 && (
        <section className="py-24 bg-dark relative overflow-hidden flex flex-col items-center border-t border-dark-border">
          {/* Subtle background glows */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border border-secondary/30 text-secondary font-display text-xs mb-6 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(232,95,1,0.15)]">
              <Star className="w-4 h-4 fill-current" /> COTA MASTER
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 uppercase tracking-tighter drop-shadow-lg">
              PATROCINADORES <br className="md:hidden"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-secondary to-[#a54200] drop-shadow-[0_0_15px_rgba(232,95,1,0.4)]">PREMIUM</span>
            </h2>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
              {premiumSponsorItems.map((sponsor: any) => (
                <div key={sponsor.id} className="group relative bg-[#0a0a0a] rounded-3xl p-px flex items-center justify-center overflow-hidden transition-all duration-700 cursor-pointer shadow-2xl hover:shadow-[0_0_60px_rgba(232,95,1,0.2)] hover:-translate-y-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-secondary/60 via-secondary/10 to-transparent rounded-3xl transition-opacity duration-700" />
                  <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#141414] to-[#0a0a0a] rounded-[23px] p-6 md:p-4 flex flex-col items-center justify-center m-[1px]">
                    <div className="absolute inset-0 bg-secondary/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[23px]"></div>
                    {getLogo(sponsor) ? (
                      <div className="w-full h-48 md:h-56 flex items-center justify-center p-4">
                        <img 
                          src={getLogo(sponsor)} 
                          alt={sponsor.name} 
                          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:scale-110 transition-all duration-700" 
                        />
                      </div>
                    ) : (
                      <Shield className="w-20 h-20 text-gray-700 group-hover:text-secondary transition-colors duration-700" />
                    )}
                    <span className="font-display text-sm text-gray-500 group-hover:text-white tracking-[0.3em] text-center mt-4 uppercase transition-colors duration-700">{sponsor.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Official Sponsors Section (Marquee) */}
      {officialSponsorItems?.length > 0 && (
        <section className="py-20 bg-dark-card/50 border-t border-dark-border overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase tracking-tighter drop-shadow-md">
              PATROCINADORES <span className="text-primary">OFICIAIS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          </div>

          <div className="relative w-full flex overflow-x-hidden border-y border-white/5 bg-gradient-to-r from-dark via-[#111] to-dark py-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] group/marquee">
            <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee whitespace-nowrap items-center group-hover/marquee:[animation-play-state:paused] transition-all duration-500">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-20 md:gap-32 px-10 md:px-16">
                  {officialSponsorItems.map((sponsor: any) => (
                    <div key={sponsor.id} className="flex flex-col items-center justify-center gap-4 group cursor-pointer opacity-90 hover:opacity-100 transition-all duration-500">
                      {getLogo(sponsor) ? (
                        <img src={getLogo(sponsor)} className="h-16 md:h-20 max-w-[180px] object-contain transition-all duration-500 transform group-hover:scale-110" alt={sponsor.name} />
                      ) : (
                        <Goal className="w-12 h-12 text-primary" />
                      )}
                      {!getLogo(sponsor) && <span className="text-lg md:text-xl font-display font-black text-white tracking-widest uppercase mt-2">{sponsor.name}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
