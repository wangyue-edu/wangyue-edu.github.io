import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllProjects, EDITIONS } from '../data';
import { AwardBadge } from '../components/AwardBadge';
import { Search, Filter, Code2, Film, Sparkles, X, Trophy } from 'lucide-react';
import { AwardTier } from '../types';

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allProjects = useMemo(() => getAllProjects(), []);

  // Filter States from URL or local state
  const query = searchParams.get('q') || '';
  const selectedAward = searchParams.get('award') || 'all';
  const selectedYear = searchParams.get('year') || 'all';
  const selectedCategory = searchParams.get('cat') || 'all';
  const filterHasCode = searchParams.get('code') === '1';
  const filterHasDemo = searchParams.get('demo') === '1';

  const updateParam = (key: string, val: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === '0') {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [allProjects]);

  // Filtered result
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Search term
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesStudent = p.studentName.toLowerCase().includes(q);
        const matchesClass = p.class.toLowerCase().includes(q);
        const matchesSummary = p.summary.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesStudent && !matchesClass && !matchesSummary && !matchesTags) {
          return false;
        }
      }

      // Award tier
      if (selectedAward !== 'all' && p.awardTier !== selectedAward) {
        return false;
      }

      // Year
      if (selectedYear !== 'all' && p.editionYear !== selectedYear) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Media capabilities
      if (filterHasCode && !p.hasCode) return false;
      if (filterHasDemo && !p.video && (!p.interactiveDemos || p.interactiveDemos.length === 0)) {
        return false;
      }

      return true;
    });
  }, [allProjects, query, selectedAward, selectedYear, selectedCategory, filterHasCode, filterHasDemo]);

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    query ||
    selectedAward !== 'all' ||
    selectedYear !== 'all' ||
    selectedCategory !== 'all' ||
    filterHasCode ||
    filterHasDemo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <Code2 className="w-4 h-4" />
          <span>全量成果检索中心</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          全部申报与获奖成果档案库（{allProjects.length} 项）
        </h1>
        <p className="text-slate-600 font-serif text-sm leading-relaxed max-w-3xl">
          支持按届别、奖项阶梯、技术领域及多媒体特性（可玩Demo、视频实录、在线源码）多重交叉检索。
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => updateParam('q', e.target.value)}
            placeholder="搜索作品名称、作者姓名、班级、技术标签或关键词（如：线圈炮、微内核、Cactus、PCB、深度学习）..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
          {query && (
            <button
              onClick={() => updateParam('q', null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Award Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">奖项：</span>
            <select
              value={selectedAward}
              onChange={(e) => updateParam('award', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:border-blue-400"
            >
              <option value="all">全部奖项</option>
              <option value="first">凌绝望岳奖（金奖）</option>
              <option value="second">坚韧登岳奖（银奖）</option>
              <option value="third">凭高临岳奖（铜奖/入围）</option>
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">届别：</span>
            <select
              value={selectedYear}
              onChange={(e) => updateParam('year', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:border-blue-400"
            >
              <option value="all">全部届别 (2016–2025)</option>
              {EDITIONS.map((e) => (
                <option key={e.year} value={e.year}>
                  {e.year}年度 (第{e.editionNumber}届)
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">领域：</span>
            <select
              value={selectedCategory}
              onChange={(e) => updateParam('cat', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:border-blue-400"
            >
              <option value="all">全部分类领域</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Code Filter Checkbox */}
          <button
            onClick={() => updateParam('code', filterHasCode ? null : '1')}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
              filterHasCode
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>含在线代码库</span>
          </button>

          {/* Demo Filter Checkbox */}
          <button
            onClick={() => updateParam('demo', filterHasDemo ? null : '1')}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
              filterHasDemo
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>含实录/Demo</span>
          </button>

          {/* Clear Filter Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>清空所有筛选条件</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>已为您筛选出 {filteredProjects.length} 项成果</span>
        <span>共收录 {allProjects.length} 项历史申报</span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3 bg-white">
          <p className="font-serif font-bold text-slate-700 text-base">未检索到匹配的项目</p>
          <p className="text-xs text-slate-500">建议尝试减少过滤选项或更换搜索关键词</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            重置所有筛选
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {project.editionYear} 第{project.editionNumber}届
                  </span>
                  <AwardBadge tier={project.awardTier} label={project.award} size="sm" />
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
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
      )}
    </div>
  );
};
