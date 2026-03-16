import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

export interface GalleryImageProps {
  id: string;
  url: string;
  alt: string | null;
}

export function MarqueeGallery({ images, className }: { images: GalleryImageProps[], className?: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!images || images.length === 0) return null;

  // We repeat images enough times so one "set" fills large screens.
  // The CSS translates by -50%, so we render two identical sets.
  const multiplier = Math.max(1, Math.ceil(12 / images.length));
  const singleSet = Array.from({ length: multiplier }).flatMap(() => images);
  const displayImages = [...singleSet, ...singleSet];

  return (
    <section className={`w-full overflow-hidden py-16 ${className || 'bg-brand-base'}`}>
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-contrast">Un'occhiata a cosa faccio</h2>
      </div>

      {/* Infinite Marquee Loop */}
      <div 
        className="relative flex overflow-x-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="animate-marquee whitespace-nowrap flex gap-4 px-2 items-center"
          style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        >
          {/* Render the duplicated array to create the seamless -50% translation loop */}
          {displayImages.map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              className="relative w-[280px] md:w-[380px] aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group/item flex-shrink-0 shadow-sm"
              onClick={() => setSelectedImage(img.url)}
            >
              <img
                src={img.url}
                alt={img.alt || `Gallery visual ${idx}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
              />
              <div className="absolute inset-0 bg-brand-contrast/0 group-hover/item:bg-brand-contrast/30 transition-colors flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover/item:opacity-100 transition-opacity transform scale-50 group-hover/item:scale-100 duration-300" size={48} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Dialog Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-[80vh] md:h-[90vh] max-w-7xl rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage}
              alt="High resolution view"
              className="max-w-full max-h-full object-contain cursor-pointer"
            />
          </div>
        </div>
      )}
    </section>
  );
}
