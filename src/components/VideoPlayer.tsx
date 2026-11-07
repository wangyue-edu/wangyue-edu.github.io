import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film } from 'lucide-react';
import { VideoInfo } from '../types';

interface VideoPlayerProps {
  video: VideoInfo;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const videoSrc = video.src.startsWith('/') ? video.src : `/${video.src}`;
  const posterSrc = video.poster ? (video.poster.startsWith('/') ? video.poster : `/${video.poster}`) : undefined;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black shadow-lg border border-stone-800 group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-auto aspect-video object-contain"
        onClick={togglePlay}
      />

      {/* Center Play Overlay on Initial State */}
      {!hasStarted && !isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <span className="mt-3 text-sm font-medium text-stone-200 tracking-wide drop-shadow-md flex items-center gap-1.5">
            <Film className="w-4 h-4 text-amber-400" />
            点击播放实机测试录像 · {video.title}
          </span>
        </div>
      )}

      {/* Floating Bottom Bar (visible on hover) */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-stone-300 font-medium truncate max-w-xs">{video.title}</span>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
          title="全屏播放"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
