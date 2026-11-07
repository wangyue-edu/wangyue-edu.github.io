import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  LayoutGrid,
  Film,
  Sparkles,
  Camera,
  FolderOpen
} from 'lucide-react';
import { GalleryItem } from '../types';
import { ImageLightbox } from './ImageLightbox';

interface InteractiveAlbumProps {
  items: GalleryItem[];
  title?: string;
  defaultCategory?: string;
}

// Category meta definitions for icons & friendly labels
const CATEGORY_META: Record<string, { label: string; icon: string; description: string }> = {
  '宣讲': {
    label: '宣讲动员',
    icon: '📢',
    description: '望岳奖学金设立宣讲与技术作品申报动员'
  },
  '座谈': {
    label: '师生座谈',
    icon: '💬',
    description: '校友导师与通中极客社及参赛同学交流研讨'
  },
  '答辩': {
    label: '现场答辩',
    icon: '🎤',
    description: '敬孺楼现场项目展示、系统演练与评委质询'
  },
  '颁奖': {
    label: '颁奖盛典',
    icon: '🏆',
    description: '荣誉证书颁发、创客先锋表彰与敬孺楼浮雕前大合影'
  },
  'ceremony': {
    label: '典礼合影',
    icon: '🌟',
    description: '全体获奖学生与导师嘉宾大合影'
  },
  'demo': {
    label: '项目演示',
    icon: '💻',
    description: '实物运行与系统界面展示'
  },
  'document': {
    label: '官方档案',
    icon: '📑',
    description: '申报表与评审文书原件'
  }
};

export const InteractiveAlbum: React.FC<InteractiveAlbumProps> = ({
  items,
  title = '活动现场纪实相册',
  defaultCategory
}) => {
  // Extract categories present in items
  const categories = useMemo(() => {
    const cats: string[] = [];
    const knownOrder = ['宣讲', '座谈', '答辩', '颁奖'];
    
    // Check known categories first
    knownOrder.forEach((c) => {
      if (items.some((it) => it.category === c)) {
        cats.push(c);
      }
    });

    // Check any remaining categories
    items.forEach((it) => {
      if (it.category && !cats.includes(it.category)) {
        cats.push(it.category);
      }
    });

    return cats;
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (defaultCategory && (categories.includes(defaultCategory) || defaultCategory === 'all')) {
      return defaultCategory;
    }
    return categories.length > 0 ? categories[0] : 'all';
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'album' | 'grid'>('album');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Filter items by active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all' || categories.length === 0) {
      return items;
    }
    return items.filter((it) => it.category === activeCategory);
  }, [items, activeCategory, categories]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  const handlePrev = () => {
    if (filteredItems.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (filteredItems.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const currentItem = filteredItems[currentIndex] || filteredItems[0];

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentMeta = CATEGORY_META[activeCategory] || {
    label: activeCategory === 'all' ? '全部照片' : activeCategory,
    icon: '📷',
    description: ''
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-sm space-y-5">
      {/* Album Header & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-serif text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              共 {items.length} 张原照
            </span>
          </div>
          {currentMeta.description && (
            <p className="text-xs font-serif text-slate-500">
              {currentMeta.description}
            </p>
          )}
        </div>

        {/* View Mode Toggle: Interactive Album vs Grid */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('album')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'album'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>交互相册</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>全部平铺</span>
            </button>
          </div>
        </div>
      </div>

      {/* Album Tabs (宣讲, 座谈, 答辩, 颁奖, 全部) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat] || { label: cat, icon: '📁' };
            const count = items.filter((it) => it.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-102 ring-2 ring-blue-600/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span>{meta.icon}</span>
                <span className="font-serif">{meta.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* All tab */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-slate-900/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <span>🖼️</span>
            <span className="font-serif">全部纪实</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {items.length}
            </span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'album' && currentItem ? (
        <div className="space-y-3">
          {/* Main Stage Viewport */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 aspect-16/10 sm:aspect-16/9 flex items-center justify-center select-none shadow-lg"
          >
            {/* Ambient Blurred Backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 pointer-events-none transition-all duration-500"
              style={{
                backgroundImage: `url(${currentItem.src.startsWith('/') ? currentItem.src : `/${currentItem.src}`})`
              }}
            />

            {/* Main Crisp Image */}
            <img
              key={currentItem.src}
              src={currentItem.src.startsWith('/') ? currentItem.src : `/${currentItem.src}`}
              alt={currentItem.caption}
              onClick={() => openLightboxAt(currentIndex)}
              className="relative z-10 max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Top Left: Zoom in pill */}
            <button
              onClick={() => openLightboxAt(currentIndex)}
              className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-serif backdrop-blur-md border border-white/20 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>点击全屏大图</span>
            </button>

            {/* Top Right: Counter Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-stone-200 backdrop-blur-md border border-white/20">
                {CATEGORY_META[currentItem.category || '']?.label || currentItem.category || '纪实'} · {currentIndex + 1} / {filteredItems.length}
              </span>
            </div>

            {/* Left Nav Arrow */}
            {filteredItems.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-90"
                aria-label="上一张 (← 键盘左键)"
                title="上一张 (←)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Right Nav Arrow */}
            {filteredItems.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-90"
                aria-label="下一张 (→ 键盘右键)"
                title="下一张 (→)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Bottom Caption Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 sm:p-5 flex flex-col justify-end pointer-events-none">
              <p className="font-serif text-sm sm:text-base text-white leading-relaxed drop-shadow-md">
                {currentItem.caption}
              </p>
            </div>
          </div>

          {/* Filmstrip / Thumbnail Row */}
          {filteredItems.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
              {filteredItems.map((item, idx) => {
                const isActive = idx === currentIndex;
                const src = item.src.startsWith('/') ? item.src : `/${item.src}`;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-200 border ${
                      isActive
                        ? 'ring-2 ring-blue-600 border-white scale-105 shadow-md z-10 opacity-100'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                    title={item.caption}
                  >
                    <img
                      src={src}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/60 text-[10px] text-white font-mono text-center py-0.5">
                      {idx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Grid Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => {
            const src = item.src.startsWith('/') ? item.src : `/${item.src}`;
            return (
              <div
                key={idx}
                onClick={() => openLightboxAt(idx)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-3.5 flex flex-col justify-end opacity-95 group-hover:opacity-100 transition-opacity">
                  {item.category && (
                    <span className="self-start text-[10px] font-serif px-2 py-0.5 rounded-md bg-blue-600/80 text-white mb-1">
                      {CATEGORY_META[item.category]?.label || item.category}
                    </span>
                  )}
                  <span className="text-xs font-serif text-slate-100 line-clamp-2">
                    {item.caption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal with Full Carousel Switching */}
      <ImageLightbox
        item={lightboxOpen && filteredItems[lightboxIndex] ? filteredItems[lightboxIndex] : null}
        items={filteredItems}
        currentIndex={lightboxIndex}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
