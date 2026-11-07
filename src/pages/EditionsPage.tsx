import React from 'react';
import { Link } from 'react-router-dom';
import { EDITIONS } from '../data';
import { Compass, Trophy, FileText, ArrowRight, Calendar, Users, Sparkles } from 'lucide-react';

export const EditionsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Compass className="w-3.5 h-3.5" />
          <span>2016 – 2026 历届编年</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          历届华章 · 十载编年史
        </h1>
        <p className="font-serif text-slate-600 text-sm sm:text-base leading-relaxed">
          从首届 10 组项目的探索破冰，到第十届迎来十周年里程碑。完整查阅各届评审综述、现场档案照片与入选作品全貌。
        </p>
      </div>

      {/* Editions Timeline List */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-0.5 before:bg-blue-100 before:pointer-events-none">
        {EDITIONS.map((edition, idx) => {
          const isEven = idx % 2 === 0;
          const topPrize = edition.projects.find((p) => p.awardTier === 'first');

          return (
            <div
              key={edition.year}
              className={`relative flex flex-col md:flex-row items-center gap-6 ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Center Dot */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white text-white flex items-center justify-center text-xs font-mono font-bold shadow-md z-10">
                {edition.editionNumber}
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                <Link
                  to={`/editions/${edition.year}`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all space-y-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-100 transition-colors">
                      {edition.year}年度 · 第 {edition.editionNumber} 届
                    </span>
                    {edition.projects.length > 0 ? (
                      <span className="text-xs text-slate-500 font-mono">
                        {edition.projects.length} 项申报作品
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        正在开放申请
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {edition.title}
                    </h3>
                    <p className="text-xs text-blue-700 font-serif font-medium mt-1">
                      主题：{edition.theme}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {edition.intro}
                  </p>

                  {/* Highlights */}
                  {topPrize ? (
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50/50 border border-slate-200/80 group-hover:border-blue-200 text-xs flex items-center justify-between gap-2 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <Trophy className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-slate-700 truncate font-medium">
                          凌绝望岳：{topPrize.title}
                        </span>
                      </div>
                      <span className="text-blue-700 shrink-0 font-bold">{topPrize.studentName}</span>
                    </div>
                  ) : edition.projects.length === 0 ? (
                    <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                        <span className="text-amber-900 truncate font-medium">
                          第十届评选正在开放申报中 · 欢迎提交软硬件作品
                        </span>
                      </div>
                      <span className="text-amber-700 shrink-0 font-bold">开放中</span>
                    </div>
                  ) : null}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all">
                      <span>进入本届全景档案</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
