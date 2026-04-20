import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, Maximize2, X, Trophy, Grid, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSupaData } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const demoMedia = [
  { id: 1, type: 'image', url: '/gallery/galeria_1.jpg', title: 'Disputa Intensa em Quadra' },
  { id: 2, type: 'image', url: '/gallery/galeria_2.jpg', title: 'Visão Clínica da Organização' },
  { id: 3, type: 'image', url: '/gallery/galeria_3.jpg', title: 'Foco e Oração Pré-Jogo' },
  { id: 4, type: 'image', url: '/gallery/galeria_4.jpg', title: 'A Emoção do Gol' },
  { id: 5, type: 'image', url: '/gallery/galeria_5.jpg', title: 'Instruções Mestre: O Tempo Técnico' }
];

export default function Gallery() {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // Load dynamic data from Supabase
  const { data: serverGallery } = useSupaData('lfe_gallery', []);
  const galleryItems = serverGallery.length > 0 ? serverGallery : demoMedia;

  const handleNext = (e?: any) => {
    e?.stopPropagation();
    if (selectedMediaIndex === null) return;
    setSelectedMediaIndex((selectedMediaIndex + 1) % galleryItems.length);
  };

  const handlePrev = (e?: any) => {
    e?.stopPropagation();
    if (selectedMediaIndex === null) return;
    setSelectedMediaIndex((selectedMediaIndex - 1 + galleryItems.length) % galleryItems.length);
  };

  const selectedMedia = selectedMediaIndex !== null ? galleryItems[selectedMediaIndex] : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 text-center flex items-center justify-center opacity-10">
           <Grid className="w-full h-full text-white/5" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 font-display text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Camera className="w-4 h-4 text-primary" /> Momentos Oficiais
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Galeria de <span className="text-primary italic">Fotos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60"
          >
            A vibração, a técnica e a emoção capturadas em cada clique nas quadras.
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 container mx-auto px-4">
        {galleryItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
            {galleryItems.map((item: any, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedMediaIndex(index)}
                className="group relative bg-[#0f172a] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-all shadow-2xl break-inside-avoid"
              >
                <img 
                  src={item.url || item.image || item.photo} 
                  alt={item.title} 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 group-hover:opacity-0 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-20 transition-transform">
                   <h3 className="font-display text-lg font-black uppercase tracking-tighter text-white leading-tight">{item.title}</h3>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-primary/50">
                      <Maximize2 className="w-6 h-6 text-primary" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
           <div className="p-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
              <Camera className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-display font-black text-gray-600 uppercase tracking-widest">Nenhum registro encontrado</h3>
              <p className="text-gray-700 mt-2 font-display uppercase text-xs tracking-widest">Estamos capturando os melhores lances para você.</p>
           </div>
        )}
      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedMediaIndex(null)}
          >
            {/* Close */}
            <button 
              onClick={() => setSelectedMediaIndex(null)}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-[110] bg-white/10 p-4 rounded-2xl border border-white/10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button 
              onClick={handlePrev}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-all z-[110] bg-white/5 p-6 rounded-3xl border border-white/10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-all z-[110] bg-white/5 p-6 rounded-3xl border border-white/10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center pointer-events-none" 
              onClick={e => e.stopPropagation()}
            >
               <div className="relative group pointer-events-auto">
                 <img 
                   src={selectedMedia.url || selectedMedia.image || selectedMedia.photo} 
                   className="max-w-full max-h-[75vh] object-contain rounded-[4rem] shadow-[0_0_100px_rgba(204,255,0,0.1)] border border-white/10" 
                   key={selectedMedia.id}
                   alt={selectedMedia.title} 
                 />
                 <div className="absolute -top-6 -right-6 bg-primary px-6 py-2 rounded-full text-dark font-display text-xs font-black shadow-2xl">
                   {selectedMediaIndex !== null ? selectedMediaIndex + 1 : 0} / {galleryItems.length}
                 </div>
               </div>
               <div className="mt-12 text-center max-w-3xl pointer-events-auto">
                  <h3 className="font-display text-4xl md:text-6xl text-white font-black uppercase tracking-tighter leading-none mb-4">{selectedMedia.title}</h3>
                  <div className="flex items-center justify-center gap-4 text-gray-500 font-display font-bold uppercase tracking-widest text-[10px]">
                     <ImageIcon className="w-4 h-4 text-primary" /> Cobertura Oficial Liga Escolar 2026
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
