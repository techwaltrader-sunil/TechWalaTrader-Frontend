import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ images, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Zoom के लिए State बनाएँ
  const [zoomStyle, setZoomStyle] = useState({
    transform: 'scale(1)',
    transformOrigin: 'center center'
  });

  // Reset logic (जब मॉडल खुले, तो सब कुछ रिसेट हो)
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]); 

  if (!isOpen || !images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    // Slide change hone par zoom reset karein
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
  };

  // --- 🔥 2. MAGIC ZOOM LOGIC HERE ---
  const handleMouseMove = (e) => {
    // Image container ki details nikalein
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Mouse ki position calculate karein (0% se 100% tak)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Zoom style set karein
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`, // Jaha mouse hai, wahi center banega
      transform: 'scale(2.5)',        // Kitna zoom karna hai (2.5x)
    });
  };

  const handleMouseLeave = () => {
    // Mouse hatne par wapas normal karein
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition z-50"
      >
        <X size={24} />
      </button>

      {/* Main Image Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col items-center justify-center">
        
        {/* 3. Image Wrapper:
            'overflow-hidden' zaruri hai taaki zoomed image bahar na nikle 
        */}
        <div 
          className="relative overflow-hidden rounded shadow-2xl cursor-zoom-in max-w-full max-h-[85vh]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* The Image */}
          <img 
            src={images[currentIndex]} 
            alt={`Full view ${currentIndex + 1}`} 
            // Style prop me hum dynamic zoom laga rahe hain
            style={zoomStyle}
            className="w-auto h-auto max-h-[85vh] object-contain transition-transform duration-100 ease-out"
          />
        </div>

        {/* Caption / Counter */}
        <div className="absolute bottom-4 bg-black/60 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none">
           {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-white hover:text-black transition z-50"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-white hover:text-black transition z-50"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageModal;