import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Maximize2, AlertCircle, RefreshCw, Download, ExternalLink } from 'lucide-react';

interface FlashPlayerProps {
  swfUrl: string;
  title: string;
  description?: string;
}

declare global {
  interface Window {
    RufflePlayer?: {
      newest: () => {
        createPlayer: () => HTMLElement & {
          load: (options: { url: string }) => Promise<void>;
        };
      };
    };
  }
}

export const FlashPlayer: React.FC<FlashPlayerProps> = ({ swfUrl, title, description }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedUrl = swfUrl.startsWith('/') ? swfUrl : `/${swfUrl}`;

  useEffect(() => {
    let isMounted = true;

    async function loadRuffle() {
      try {
        setLoading(true);
        setError(null);

        // Ensure Ruffle script is available (prefer local bundle, fallback to CDN)
        if (!window.RufflePlayer) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/ruffle/ruffle.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
              // fallback to unpkg if local fails
              const fallback = document.createElement('script');
              fallback.src = 'https://unpkg.com/@ruffle-rs/ruffle';
              fallback.async = true;
              fallback.onload = () => resolve();
              fallback.onerror = () => reject(new Error('无法加载 Ruffle WebAssembly 运行时'));
              document.head.appendChild(fallback);
            };
            document.head.appendChild(script);
          });
        }

        if (!isMounted || !containerRef.current) return;

        containerRef.current.innerHTML = '';
        const ruffle = window.RufflePlayer?.newest();
        if (!ruffle) {
          throw new Error('Ruffle 运行时初始化失败');
        }

        const player = ruffle.createPlayer();
        player.style.width = '100%';
        player.style.height = '100%';
        player.style.aspectRatio = '4/3';
        player.style.borderRadius = '12px';
        containerRef.current.appendChild(player);

        await player.load({ url: resolvedUrl });
        if (isMounted) setLoading(false);
      } catch (err: any) {
        if (isMounted) {
          console.warn('Ruffle load error:', err);
          setError(err.message || '加载 Flash 模拟器遇到问题');
          setLoading(false);
        }
      }
    }

    loadRuffle();

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [resolvedUrl]);

  return (
    <div className="rounded-2xl border border-stone-300 dark:border-stone-800 bg-stone-900 overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-stone-800 text-stone-200 flex items-center justify-between border-b border-stone-700 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Flash 交互演示 · {title}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
            WebAssembly 引擎
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resolvedUrl}
            download
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-700/80 hover:bg-stone-600 text-stone-300 hover:text-white transition-colors"
            title="下载原始 .swf 文件"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载 SWF 原件</span>
          </a>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative min-h-[460px] flex items-center justify-center bg-stone-950 p-2">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/80 z-10 text-stone-300 text-sm gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>正在通过 Ruffle 启动 Flash ActionScript 引擎...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-stone-300 p-6 text-center z-10">
            <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
            <p className="text-sm font-semibold text-rose-300 mb-1">{error}</p>
            <p className="text-xs text-stone-400 max-w-md">
              如果无法自动加载 WebAssembly 核心，您可以点击下方直接下载原始 .swf 文件或在本地 Flash 播放器中运行。
            </p>
            <a
              href={resolvedUrl}
              download
              className="mt-4 px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载原始 .swf 文件</span>
            </a>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      </div>

      {/* Description caption */}
      {description && (
        <div className="px-4 py-2 bg-stone-800/80 border-t border-stone-700 text-xs text-stone-300 leading-relaxed font-serif">
          {description}
        </div>
      )}
    </div>
  );
};
