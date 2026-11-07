import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getProject, getAllProjects } from '../data';
import { AwardBadge } from '../components/AwardBadge';
import { VideoPlayer } from '../components/VideoPlayer';
import { FlashPlayer } from '../components/FlashPlayer';
import { HtmlDemoViewer } from '../components/HtmlDemoViewer';
import { CodeExplorer } from '../components/CodeExplorer';
import { ArtifactCard } from '../components/ArtifactCard';
import { ReviewPanel } from '../components/ReviewPanel';
import { ImageLightbox } from '../components/ImageLightbox';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Download,
  FolderDown
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProject(id) : undefined;
  const allProjects = useMemo(() => getAllProjects(), []);
  const [activeDemoIdx, setActiveDemoIdx] = useState<number>(0);
  const [activeArchiveTab, setActiveArchiveTab] = useState<'all' | number>(0);
  const [galleryLightboxOpen, setGalleryLightboxOpen] = useState<boolean>(false);
  const [galleryLightboxIdx, setGalleryLightboxIdx] = useState<number>(0);

  useEffect(() => {
    setActiveDemoIdx(0);
    setActiveArchiveTab(0);
    setGalleryLightboxOpen(false);
  }, [id]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  // Find previous and next project for smooth navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <Link
          to={`/editions/${project.editionYear}`}
          className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回 {project.editionYear} 第 {project.editionNumber} 届档案</span>
        </Link>

        <span className="font-mono text-slate-400">
          项目序号 {currentIndex + 1} / {allProjects.length}
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-6 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/editions/${project.editionYear}`}
            className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
          >
            {project.editionYear}年度 · 第{project.editionNumber}届
          </Link>
          <AwardBadge tier={project.awardTier} label={project.award} size="md" />
          <span className="ml-auto text-xs font-medium text-slate-500">
            领域：{project.category}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          {project.title}
        </h1>

        {/* Student & Class Card */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">{project.studentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>申报班级：{project.class}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>评审时间：{project.editionYear}年度</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p className="text-base text-slate-700 font-serif leading-relaxed">
          {project.summary}
        </p>
      </div>

      {/* Interactive Media Showcase */}
      {/* 1. Interactive Demo Player (Flash / HTML / Scratch) */}
      {project.interactiveDemos && project.interactiveDemos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span>交互式运行演示 (Interactive Demos · 共 {project.interactiveDemos.length} 款作品)</span>
            </div>

            {project.interactiveDemos.length > 1 && (
              <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                {project.interactiveDemos.map((d: any, idx: number) => {
                  const isActive = activeDemoIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDemoIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{d.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Render Active Demo */}
          {(() => {
            const currentDemo: any = project.interactiveDemos[activeDemoIdx] || project.interactiveDemos[0];
            const swf = currentDemo.swfFile || currentDemo.swf || (currentDemo.type === 'flash' ? currentDemo.entryUrl : undefined);
            if (currentDemo.type === 'flash' && swf) {
              return (
                <FlashPlayer
                  key={swf}
                  swfUrl={swf}
                  title={currentDemo.title}
                  description={currentDemo.description}
                />
              );
            }
            if (currentDemo.type === 'html') {
              return (
                <HtmlDemoViewer
                  key={currentDemo.entryUrl}
                  entryUrl={currentDemo.entryUrl}
                  title={currentDemo.title}
                  description={currentDemo.description}
                />
              );
            }
            return null;
          })()}
        </section>
      )}

      {/* 2. Video Player */}
      {project.video && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span>实机运行与测试实录 (Video Demo)</span>
          </div>
          <VideoPlayer video={project.video} />
        </section>
      )}

      {/* 3. Executable / Binary Artifact Card */}
      {project.artifactSpecs && project.artifactSpecs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>可执行程序与硬件制品规格 (Executable Specification)</span>
          </div>
          <ArtifactCard specs={project.artifactSpecs} />
        </section>
      )}

      {/* 4. Interactive In-Page Code Explorer */}
      {project.hasCode && (project.codeArchives || project.codeArchiveId) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Code2 className="w-4 h-4" />
              <span>
                {project.codeArchives && project.codeArchives.length > 1
                  ? `自主研发源代码在线浏览器（包含 ${project.codeArchives.length} 个独立工程库）`
                  : '自主研发源代码在线浏览器 (Source Code Archive)'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              支持全文件在线浏览与高亮
            </span>
          </div>

          {/* Sub-project Switcher if multiple archives exist */}
          {project.codeArchives && project.codeArchives.length > 1 && (
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
              {project.codeArchives.map((arch, idx) => (
                <button
                  key={arch.id}
                  onClick={() => setActiveArchiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeArchiveTab === idx
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span>{arch.title}</span>
                  {arch.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                      {arch.badge}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setActiveArchiveTab('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeArchiveTab === 'all'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>并列展示两套独立工程代码库</span>
              </button>
            </div>
          )}

          {/* Render Active Explorer or Both */}
          {project.codeArchives && project.codeArchives.length > 1 ? (
            activeArchiveTab === 'all' ? (
              <div className="space-y-6">
                {project.codeArchives.map((arch) => (
                  <div key={arch.id} className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <h4 className="font-serif font-bold text-sm text-slate-800">{arch.title}</h4>
                      {arch.badge && (
                        <span className="text-[11px] font-mono text-slate-500">
                          ({arch.badge})
                        </span>
                      )}
                    </div>
                    <CodeExplorer archiveId={arch.id} projectTitle={arch.title} />
                  </div>
                ))}
              </div>
            ) : (
              <CodeExplorer
                archiveId={project.codeArchives[typeof activeArchiveTab === 'number' ? activeArchiveTab : 0].id}
                projectTitle={project.codeArchives[typeof activeArchiveTab === 'number' ? activeArchiveTab : 0].title}
              />
            )
          ) : (
            <CodeExplorer
              archiveId={project.codeArchiveId || project.codeArchives?.[0]?.id || ''}
              projectTitle={project.title}
            />
          )}
        </section>
      )}

      {/* 5. Project Engineering Gallery & Circuit Schematics */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Layers className="w-4 h-4" />
              <span>工程原理图、仿真曲线与硬件实物档案 (Circuit Schematics & Hardware Gallery · 共 {project.gallery.length} 幅)</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              点击可全屏高清查阅
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((item, idx) => {
              const src = item.src.startsWith('/') ? item.src : `/${item.src}`;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setGalleryLightboxIdx(idx);
                    setGalleryLightboxOpen(true);
                  }}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video cursor-pointer shadow-xs hover:shadow-md transition-all"
                >
                  <img
                    src={src}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-3 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                    {item.category && (
                      <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-600/80 text-white mb-1">
                        {item.category}
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
        </section>
      )}

      {/* Technical Details & Full Report */}
      {project.details && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              技术解析与申报研报 (Technical Report)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.details.skills && (
              <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-900 font-serif">💡 掌握与习得技能</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{project.details.skills}</p>
              </div>
            )}
            {project.details.difficulties && (
              <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-900 font-serif">🛠 克服的技术难点</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{project.details.difficulties}</p>
              </div>
            )}
            {project.details.innovations && (
              <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-900 font-serif">✨ 原创与核心亮点</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{project.details.innovations}</p>
              </div>
            )}
          </div>

          {/* Full Report HTML content */}
          {project.details.fullReportHtml && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                研报原件摘要与正文录入
              </h4>
              <div
                className="prose prose-slate max-w-none text-sm font-serif leading-relaxed space-y-3 text-slate-700"
                dangerouslySetInnerHTML={{ __html: project.details.fullReportHtml }}
              />
            </div>
          )}
        </section>
      )}

      {/* Project Downloads Section */}
      {project.downloads && project.downloads.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FolderDown className="w-5 h-5 text-blue-600" />
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                相关归档与原始资料下载 (Downloads)
              </h2>
            </div>
            <Link
              to="/downloads"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>前往全量档案下载专区</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.downloads.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-200 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                      {item.category || item.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{item.size}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                    {item.filename}
                  </span>
                  <a
                    href={item.url}
                    download={item.filename}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mentor Critiques Panel */}
      {project.reviews && project.reviews.length > 0 && (
        <section className="space-y-6">
          <ReviewPanel
            reviews={project.reviews}
            rubricScores={project.rubricScores}
          />
        </section>
      )}

      {/* Bottom Prev / Next Navigation */}
      <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject ? (
          <Link
            to={`/projects/${prevProject.id}`}
            className="group p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center gap-3 text-left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            <div className="truncate">
              <span className="text-[11px] text-slate-400 font-mono">上一项成果</span>
              <p className="font-serif font-bold text-sm text-slate-800 truncate">
                {prevProject.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            to={`/projects/${nextProject.id}`}
            className="group p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-end gap-3 text-right"
          >
            <div className="truncate">
              <span className="text-[11px] text-slate-400 font-mono">下一项成果</span>
              <p className="font-serif font-bold text-sm text-slate-800 truncate">
                {nextProject.title}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </Link>
        )}
      </div>

      {/* Lightbox for Project Gallery */}
      {project.gallery && (
        <ImageLightbox
          item={galleryLightboxOpen && project.gallery[galleryLightboxIdx] ? project.gallery[galleryLightboxIdx] : null}
          items={project.gallery}
          currentIndex={galleryLightboxIdx}
          onNavigate={(newIdx) => setGalleryLightboxIdx(newIdx)}
          onClose={() => setGalleryLightboxOpen(false)}
        />
      )}
    </div>
  );
};
