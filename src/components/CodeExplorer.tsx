import React, { useEffect, useState, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { CodeArchive, CodeArchiveFile } from '../types';
import { FileCode, Folder, Copy, Check, Terminal, ChevronRight, File, Code, Database } from 'lucide-react';

interface CodeExplorerProps {
  archiveId: string;
  projectTitle: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ archiveId, projectTitle }) => {
  const [archive, setArchive] = useState<CodeArchive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/data/code/${archiveId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`无法获取代码库数据 (HTTP ${res.status})`);
        return res.json();
      })
      .then((data: CodeArchive) => {
        if (!isMounted) return;
        setArchive(data);
        if (data.files && data.files.length > 0) {
          setSelectedPath(data.files[0].path);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || '加载代码库失败');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [archiveId]);

  const selectedFile = useMemo(() => {
    if (!archive || !archive.files) return null;
    return archive.files.find((f) => f.path === selectedPath) || archive.files[0] || null;
  }, [archive, selectedPath]);

  const filteredFiles = useMemo(() => {
    if (!archive || !archive.files) return [];
    if (!searchFilter.trim()) return archive.files;
    const q = searchFilter.toLowerCase();
    return archive.files.filter((f) => f.path.toLowerCase().includes(q));
  }, [archive, searchFilter]);

  const highlightedCode = useMemo(() => {
    if (!selectedFile) return '';
    try {
      const ext = selectedFile.path.split('.').pop()?.toLowerCase() || '';
      let lang = ext;
      if (['cpp', 'cc', 'cxx', 'h', 'hpp', 'ino'].includes(ext)) lang = 'cpp';
      else if (['c'].includes(ext)) lang = 'c';
      else if (['py'].includes(ext)) lang = 'python';
      else if (['js', 'jsx'].includes(ext)) lang = 'javascript';
      else if (['ts', 'tsx'].includes(ext)) lang = 'typescript';
      else if (['rs'].includes(ext)) lang = 'rust';
      else if (['html'].includes(ext)) lang = 'html';
      else if (['css'].includes(ext)) lang = 'css';
      else if (['json'].includes(ext)) lang = 'json';
      else if (['asm', 's'].includes(ext)) lang = 'x86asm';

      if (hljs.getLanguage(lang)) {
        return hljs.highlight(selectedFile.content, { language: lang }).value;
      }
      return hljs.highlightAuto(selectedFile.content).value;
    } catch (e) {
      return selectedFile.content;
    }
  }, [selectedFile]);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-900 p-8 text-center text-stone-400">
        <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">正在加载学生真实源代码档案...</p>
      </div>
    );
  }

  if (error || !archive) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-stone-700">
        <p className="font-semibold text-rose-800 mb-1">代码库暂未提供或提取中</p>
        <p className="text-xs text-stone-600">{error || '该项目源代码为实机调试或竞赛闭源'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 shadow-xl overflow-hidden text-stone-300">
      {/* Top Header bar with stats */}
      <div className="px-5 py-3.5 bg-stone-900/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Code2Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-stone-100">{projectTitle}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-400 border border-stone-700">
                {(archive.fileCount ?? archive.totalFiles ?? archive.files?.length ?? 0)} 文件 · {(archive.totalLines || 0).toLocaleString()} 行源码
              </span>
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-3 mt-0.5">
              <span>作者提交代码原件在线呈现</span>
              <span className="text-stone-600">•</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.isArray(archive.languages)
                  ? archive.languages.map((item: any, idx: number) => {
                      const name = typeof item === 'string' ? item : (item.lang || item.name || 'code');
                      const lines = typeof item === 'object' && item.lines ? `${item.lines}行` : (item.percent ? `${item.percent}%` : '');
                      return (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800/80 text-amber-300/80">
                          {name}{lines ? `: ${lines}` : ''}
                        </span>
                      );
                    })
                  : archive.languages && typeof archive.languages === 'object'
                  ? Object.entries(archive.languages).map(([ext, count]) => (
                      <span key={ext} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800/80 text-amber-300/80">
                        {ext}: {typeof count === 'object' ? (count as any)?.lines ?? JSON.stringify(count) : count}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>

        {/* Copy current file button */}
        {selectedFile && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? '已复制当前文件' : '复制代码'}</span>
          </button>
        )}
      </div>

      {/* Split pane: File tree (left) + Code viewer (right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 h-[650px] min-h-0">
        {/* Left column: File list */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-stone-800 bg-stone-900/40 flex flex-col h-full min-h-0 overflow-hidden">
          {/* File search filter */}
          <div className="p-2.5 border-b border-stone-800 shrink-0">
            <input
              type="text"
              placeholder="快速过滤源文件..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md text-xs bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500/50"
            />
          </div>

          {/* Files container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-1.5 space-y-0.5 text-xs font-mono">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFile?.path;
              const fileName = file.path.split('/').pop() || file.path;

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-200 font-medium'
                      : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                  }`}
                  title={file.path}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 shrink-0">{file.lines}L</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Code Viewer with line numbers */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col bg-[#0d1117] h-full min-h-0 overflow-hidden">
          {/* Current file path bar */}
          <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between text-xs font-mono text-stone-400 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <Folder className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-stone-200 font-semibold truncate">{selectedFile?.path}</span>
            </div>
            <div className="shrink-0 text-stone-500 text-[11px]">
              {selectedFile?.lines} 行 · {(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB
            </div>
          </div>

          {/* Code Body */}
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-auto p-4 font-mono text-xs leading-relaxed">
            <pre className="hljs bg-transparent p-0 m-0">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const Code2Icon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </svg>
);
