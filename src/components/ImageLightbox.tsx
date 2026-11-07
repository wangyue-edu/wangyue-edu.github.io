import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

export interface ImageLightboxProps {
  item: GalleryItem | null;
  items?: GalleryItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  item,
  items,
  currentIndex = 0,
  onNavigate,
  onClose
}) => {
  if (!item) return null;

  const currentItem = (items && items.length > 0 && typeof currentIndex === 'number')
    ? items[currentIndex] || item
    : item;

  const hasMultiple = items && items.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultiple || !onNavigate) return;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIdx);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultiple || !onNavigate) return;
    const nextIdx = (currentIndex + 1) % items.length;
    onNavigate(nextIdx);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]);

  const rawSrc = currentItem.src;
  const src = rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
    >
      {/* Top Bar with Info and Close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white/80 z-20"
      >
        <div className="flex items-center gap-2.5">
          {currentItem.category && (
            <span className="px-2.5 py-1 rounded-full text-xs font-serif bg-blue-600/80 text-white backdrop-blur-sm border border-blue-400/30">
              {currentItem.category}
            </span>
          )}
          {hasMultiple && (
            <span className="text-xs sm:text-sm font-mono text-stone-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/15">
              {currentIndex + 1} / {items.length}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
          aria-label="关闭全屏"
          title="关闭 (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Viewport with Nav Arrows */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full max-h-[82vh] flex flex-col items-center justify-center"
      >
        {/* Left Arrow Button */}
        {hasMultiple && (
          <button
            onClick={handlePrev}
            className="absolute -left-2 sm:left-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 hover:border-white/40"
            aria-label="上一张"
            title="上一张 (← 键盘左键)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Right Arrow Button */}
        {hasMultiple && (
          <button
            onClick={handleNext}
            className="absolute -right-2 sm:right-4 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 hover:border-white/40"
            aria-label="下一张"
            title="下一张 (→ 键盘右键)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <img
          key={src}
          src={src}
          alt={currentItem.caption}
          className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10 transition-opacity duration-200"
        />

        {/* Caption */}
        <p className="mt-3.5 sm:mt-4 text-center text-xs sm:text-sm text-stone-200 font-serif max-w-3xl px-4 leading-relaxed tracking-wide">
          {currentItem.caption}
        </p>
      </div>

      {/* Bottom Thumbnails Strip (if multiple) */}
      {hasMultiple && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 sm:bottom-4 inset-x-4 max-w-2xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none"
        >
          {items.map((it, idx) => {
            const isActive = idx === currentIndex;
            const thumbSrc = it.src.startsWith('/') ? it.src : `/${it.src}`;
            return (
              <button
                key={idx}
                onClick={() => onNavigate?.(idx)}
                className={`relative w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden shrink-0 transition-all border ${
                  isActive
                    ? 'ring-2 ring-blue-400 border-white scale-110 opacity-100 z-10'
                    : 'border-white/20 opacity-40 hover:opacity-80'
                }`}
                title={it.caption}
              >
                <img
                  src={thumbSrc}
                  alt={it.caption}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
