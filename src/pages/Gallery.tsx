import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, Maximize2, X } from "lucide-react";

import { getStoredData } from "@/src/lib/store";

const demoMedia = [
  { id: 1, type: 'image', url: '/gallery/galeria_1.jpg', title: 'Disputa Intensa em Quadra' },
  { id: 2, type: 'image', url: '/gallery/galeria_2.jpg', title: 'Visão Clínica da Organização' },
  { id: 3, type: 'image', url: '/gallery/galeria_3.jpg', title: 'Foco e Oração Pré-Jogo' },
  { id: 4, type: 'image', url: '/gallery/galeria_4.jpg', title: 'A Emoção do Gol' },
  { id: 5, type: 'image', url: '/gallery/galeria_5.jpg', title: 'Instruções Mestre: O Tempo Técnico' }
];

export default function Gallery() {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // Sync with Admin panel data, fallback to demo if it's completely empty or new
  const storedGallery = getStoredData('gallery') || [];
  const galleryItems = storedGallery.length > 0 ? storedGallery : demoMedia;

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
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 flex items-center gap-4 uppercase">
            <Camera className="w-12 h-12 text-primary" /> GALERIA DE <span className="text-primary">FOTOS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Acompanhe os melhores momentos, lances incríveis e a vibração única da Liga de Futsal Escolar.
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedMediaIndex(index)}
                className="group relative bg-dark-card rounded-xl overflow-hidden cursor-pointer border border-dark-border hover:border-primary transition-all aspect-[4/3] shadow-lg"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <h3 className="text-white font-display text-xl translate-y-4 group-hover:translate-y-0 transition-transform">{item.title}</h3>
                  <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                     <Maximize2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="p-20 text-center flex flex-col items-center justify-center bg-dark-card border border-dark-border rounded-xl">
              <Camera className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
              <p className="text-gray-400 font-display text-xl">Nenhuma foto adicionada ainda.</p>
           </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 transition-all backdrop-blur-sm"
          onClick={() => setSelectedMediaIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedMediaIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-all z-[110] bg-white/5 hover:bg-white/20 p-4 rounded-xl border border-white/10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-all z-[110] bg-white/5 hover:bg-white/20 p-4 rounded-xl border border-white/10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          
          <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center pointer-events-none" onClick={e => e.stopPropagation()}>
             <div className="relative group pointer-events-auto">
               <img 
                 src={selectedMedia.url} 
                 className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" 
                 key={selectedMedia.id}
                 alt={selectedMedia.title} 
               />
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white font-display text-xs border border-white/20">
                 {selectedMediaIndex !== null ? selectedMediaIndex + 1 : 0} / {galleryItems.length}
               </div>
             </div>
             <div className="mt-8 text-center max-w-3xl pointer-events-auto">
                <h3 className="font-display text-2xl md:text-4xl text-white tracking-widest uppercase">{selectedMedia.title}</h3>
                <p className="text-gray-400 mt-2 font-sans italic">Liga de Futsal Escolar - Momentos Oficiais</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
