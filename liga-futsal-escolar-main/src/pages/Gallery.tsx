import { useState } from "react";
import { Camera, Maximize2, X } from "lucide-react";

import { getStoredData } from "@/src/lib/store";

const demoMedia = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000', title: 'Abertura do Campeonato' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000', title: 'Aquecimento e Preparação' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-151860534846c-65576f3d1798?q=80&w=1000', title: 'Vibração da Torcida' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000', title: 'Chute ao Gol Decisivo' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-151860536846c-5954605178af?q=80&w=1000', title: 'Disputa de Bola Acirrada' },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1551953258-2d44cfc5ae3c?q=80&w=1000', title: 'A Grande Comemoração' }
];

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // Sync with Admin panel data, fallback to demo if it's completely empty or new
  const storedGallery = getStoredData('gallery') || [];
  const galleryItems = storedGallery.length > 0 ? storedGallery : demoMedia;

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 flex items-center gap-4">
            <Camera className="w-12 h-12 text-primary" /> GALERIA DE <span className="text-primary">FOTOS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Acompanhe os melhores momentos, lances incríveis e a vibração única da Liga de Futsal Escolar.
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedMedia(item)}
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
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 transition-all">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center">
             <img 
               src={selectedMedia.url} 
               className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in" 
               alt={selectedMedia.title} 
             />
             <div className="mt-6 text-center">
               <h3 className="font-display text-3xl text-white tracking-wider">{selectedMedia.title}</h3>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
