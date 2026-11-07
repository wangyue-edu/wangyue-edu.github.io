import React from 'react';
import { ArtifactSpec } from '../types';
import { Binary, Shield, Cpu, HardDrive, AlertTriangle } from 'lucide-react';

interface ArtifactCardProps {
  specs: ArtifactSpec[];
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ specs }) => {
  return (
    <div className="space-y-4">
      {specs.map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 p-5 shadow-xs"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Binary className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                  {item.name}
                </h4>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {item.platform}
                </span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 pt-1 border-t border-stone-200 dark:border-stone-800">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-stone-400" />
                  类型: {item.type}
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-stone-400" />
                  大小: {item.size}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  评审团已现场真机复核运行
                </span>
              </div>
            </div>
          </div>

          {/* Security & Exhibition Notice */}
          <div className="mt-3.5 px-3 py-2 rounded-lg bg-stone-200/50 dark:bg-stone-800/40 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              安全与合规提示：该可执行文件仅在评审期间由导师在沙箱物理机上完成运行复核，依据网站安全策略不对外开放二进制公开下载，请通过上方实录视频与报告查看运行成果。
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
