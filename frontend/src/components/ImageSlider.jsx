import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400">
        No Image Available
      </div>
    );
  }

  const prevSlide = (e) => {
    e.stopPropagation(); // Prevent card clicks
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (e) => {
    e.stopPropagation(); // Prevent card clicks
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex, e) => {
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  // Build full image url if relative path (local upload fallback)
  const getImageUrl = (url) => {
    if (url.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '') 
        : 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  return (
    <div className="relative w-full h-full group/slider overflow-hidden">
      {/* Slide Image */}
      <img
        src={getImageUrl(images[currentIndex])}
        alt={`Product Slide ${currentIndex + 1}`}
        className="w-full h-full object-contain bg-slate-50/50 dark:bg-slate-950/20 transition-all duration-500 ease-out"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
        }}
      />

      {/* Chevrons (only if there is more than 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-md text-slate-700 dark:text-slate-200 transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-md text-slate-700 dark:text-slate-200 transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots (only if there is more than 1 image) */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={(e) => goToSlide(slideIndex, e)}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                currentIndex === slideIndex
                  ? 'w-4 bg-primary-500'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
