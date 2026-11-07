import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getEdition } from '../data';
import { AwardBadge } from '../components/AwardBadge';
import { InteractiveAlbum } from '../components/InteractiveAlbum';
import { VideoPlayer } from '../components/VideoPlayer';
import {
  Compass,
  FileText,
  Trophy,
  ArrowLeft,
  Users,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  Film,
  FileDown,
  CheckCircle2,
  FolderDown
} from 'lucide-react';

export const EditionDetailPage: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const edition = year ? getEdition(year) : undefined;

  if (!edition) {
    return <Navigate to="/editions" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/editions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回历届华章编年表</span>
        </Link>
      </div>

      {/* Edition Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-blue-400/30 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
            {edition.year} 年度 · 第 {edition.editionNumber} 届
          </span>
          <span className="text-xs text-blue-100 font-mono">
            {edition.projects.length} 项申报作品
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {edition.title}
          </h1>
          <p className="font-serif text-base sm:text-lg text-blue-100 font-medium">
            年度主题：{edition.theme}
          </p>
        </div>

        <p className="text-sm sm:text-base text-blue-50 font-serif leading-relaxed max-w-4xl">
          {edition.intro}
        </p>

        {/* Official Documents & Downloads */}
        {edition.downloads && edition.downloads.length > 0 && (
          <div className="pt-4 border-t border-white/20 flex flex-wrap items-center gap-3">
            <span className="text-xs text-blue-200 flex items-center gap-1.5 font-semibold">
              <FileDown className="w-4 h-4 text-amber-300" />
              官方章程与申报资料下载：
            </span>
            {edition.downloads.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                download={item.filename}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-200" />
                <span>{item.title}</span>
                <span className="text-[10px] opacity-75 font-mono">({item.size})</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Official Edition Downloads Card */}
      {edition.downloads && edition.downloads.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-blue-600" />
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {edition.year} 届官方章程与申报资料下载
              </h3>
            </div>
            <Link
              to="/downloads"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>查看全量历史下载专区</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {edition.downloads.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-200 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {item.type.toUpperCase()} 官方文件
                    </span>
                    <span className="text-xs font-mono text-slate-400">{item.size}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                    {item.filename}
                  </span>
                  <a
                    href={item.url}
                    download={item.filename}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>立即下载</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Summary Alert */}
      {edition.reviewSummary && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-2">
          <h3 className="font-serif font-bold text-base text-blue-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            评审委员会综合评述与授奖记录
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed">
            {edition.reviewSummary}
          </p>
        </div>
      )}

      {/* Video Documentary / News Report */}
      {edition.video && (
        <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-600" />
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {edition.year === '2016' ? '主流媒体专题报道：南通电视台《城市日历》首届现场纪实' : `${edition.year} 届活动影像与纪实视频`}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              视频档案
            </span>
          </div>
          <div className="max-w-3xl mx-auto pt-2">
            <VideoPlayer video={edition.video} />
          </div>
        </div>
      )}

      {/* Interactive Photo Album */}
      {edition.gallery && edition.gallery.length > 0 && (
        <InteractiveAlbum
          items={edition.gallery}
          title={edition.year === '2016' ? '首届活动现场纪实相册 (2016)' : `${edition.year} 现场纪实与实物档案`}
          defaultCategory={edition.year === '2016' ? '宣讲' : undefined}
        />
      )}

      {/* Projects List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              本届全部申报与获奖作品（{edition.projects.length} 项）
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(edition.projects || []).map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium text-slate-500">
                    {project.category}
                  </span>
                  <AwardBadge tier={project.awardTier} label={project.award} size="sm" />
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(project.tags || []).slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">
                  {project.studentName} · {project.class}
                </span>
                <span
                  className={
                    (project.award && project.award.includes('凌绝望岳')) || project.awardTier === 'first'
                      ? 'text-amber-800 font-serif font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shadow-2xs'
                      : (project.award && project.award.includes('坚韧登岳')) || project.awardTier === 'second'
                      ? 'text-blue-700 font-serif font-medium'
                      : 'text-slate-400 font-serif font-normal'
                  }
                >
                  {project.award}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
