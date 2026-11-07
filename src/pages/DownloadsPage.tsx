import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  FileText,
  FileCode,
  Archive,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { DownloadItem } from '../types';

export const DownloadsPage: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    fetch('/data/downloads_index.json')
      .then((res) => res.json())
      .then((data: DownloadItem[]) => {
        setDownloads(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load downloads index:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', label: '全部类型' },
    { id: '评选细则', label: '评选细则 (章程)' },
    { id: '官方申请表', label: '官方申请表' },
    { id: '申请表原件', label: '申请表原件' },
    { id: '项目文档', label: '项目技术报告' },
    { id: '源代码工程', label: '源代码工程包' },
  ];

  const years = [
    { id: 'all', label: '全部届别' },
    { id: '2026', label: '2026 (第十届 · 申报中)' },
    { id: '2025', label: '2025 (第九届)' },
    { id: '2024', label: '2024 (第八届)' },
    { id: '2023', label: '2023 (第七届)' },
    { id: '2022', label: '2022 (第六届)' },
    { id: '2021', label: '2021 (第五届)' },
    { id: '2020', label: '2020 (第四届)' },
    { id: '2018', label: '2018 (第三届)' },
    { id: '2017', label: '2017 (第二届)' },
    { id: '2016', label: '2016 (首届)' },
  ];

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'all' && item.editionYear !== selectedYear) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchFilename = item.filename.toLowerCase().includes(q);
        const matchStudent = item.studentName?.toLowerCase().includes(q);
        const matchProject = item.projectTitle?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        return matchTitle || matchFilename || matchStudent || matchProject || matchDesc;
      }
      return true;
    });
  }, [downloads, selectedCategory, selectedYear, searchQuery]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <FileCheck className="w-5 h-5 text-rose-600" />;
      case 'zip':
      case 'archive':
        return <Archive className="w-5 h-5 text-amber-600" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-emerald-600" />;
      default:
        return <Download className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case '评选细则':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '官方申请表':
      case '申请表模板':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case '申请表原件':
      case '申报表原件':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '项目文档':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '源代码工程':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-mono">
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>望岳奖学金全量历史数字档案库</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            归档文件与工程资料下载中心
          </h1>
          <p className="font-serif text-sm sm:text-base text-blue-100/90 leading-relaxed">
            汇集 2016–2026 历届官方评选细则章程、官方申请表原件、各获奖项目原始申报表、技术报告论文原稿以及打包源代码工程包，便于历史留存、学术研究与申报参考。
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-blue-200/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              已归档收录 {downloads.length} 份数字文献与代码包
            </span>
            <span>·</span>
            <span>高速直链免提取码</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索文件名、学生姓名、项目名称或关键字（如：2021 评选细则、周子皓、树莓派、A*、代码）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Category & Year Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              分类：
            </span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Years */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              年份：
            </span>
            {years.map((y) => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedYear === y.id
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {y.id === 'all' ? '全部' : y.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <span>显示 {filteredDownloads.length} / {downloads.length} 份归档资源</span>
        {(selectedCategory !== 'all' || selectedYear !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="text-blue-600 hover:underline"
          >
            重置所有筛选条件
          </button>
        )}
      </div>

      {/* Downloads Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-mono text-sm">
          正在加载归档下载索引...
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <p className="text-base font-serif">未找到符合条件的下载资源</p>
          <p className="text-xs text-slate-400">请尝试更换关键字或重置分类筛选</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredDownloads.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.editionYear && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.editionYear}届
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category || '文件'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{item.size}</span>
                </div>

                {/* Title and Icon */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors shrink-0">
                    {getFileIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400 truncate mt-1">
                      {item.filename}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {item.projectId ? (
                  <Link
                    to={`/projects/${item.projectId}`}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <span>关联项目</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : item.editionYear ? (
                  <Link
                    to={`/editions/${item.editionYear}`}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <span>{item.editionYear}合集</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <div></div>
                )}

                <a
                  href={item.url}
                  download={item.filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs group-hover:bg-blue-600 group-hover:text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>立即下载</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
