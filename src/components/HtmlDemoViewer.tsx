import React, { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, Compass } from 'lucide-react';

interface HtmlDemoViewerProps {
  entryUrl: string;
  title: string;
  description?: string;
}

export const HtmlDemoViewer: React.FC<HtmlDemoViewerProps> = ({ entryUrl, title, description }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-lg transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-stone-950' : 'relative'
      }`}
    >
      {/* Viewer toolbar */}
      <div className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>交互演示 · {title}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            原生 Web 交互
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={entryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition-colors"
            title="在新标签页独立全屏打开"
          >
            <span>新窗口打开</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏展示'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Iframe Viewport */}
      <div className={`relative ${isFullscreen ? 'flex-1' : 'h-[500px]'} bg-stone-900`}>
        <iframe
          src={entryUrl}
          title={title}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {/* Description footer */}
      {description && !isFullscreen && (
        <div className="px-4 py-2 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
          {description}
        </div>
      )}
    </div>
  );
};
