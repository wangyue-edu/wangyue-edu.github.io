import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Compass, Code2, BookOpen, Scale, Menu, X, Sparkles, Download } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: '首页', icon: Mountain },
    { to: '/editions', label: '历届华章', icon: Compass },
    { to: '/projects', label: '全量项目库', icon: Code2 },
    { to: '/downloads', label: '档案下载', icon: Download },
    { to: '/rubric', label: '评审规则', icon: Scale },
    { to: '/about', label: '望岳故事', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-blue-100/80 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Mountain className="w-5 h-5 text-blue-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-slate-900 tracking-wider flex items-center gap-1.5">
                望岳奖学金
                <span className="text-[10px] font-sans font-semibold tracking-normal px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  2016–2026
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-sans tracking-wide">
                江苏省南通中学 · 纪念岳军老师极客基金
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'text-blue-700 bg-blue-50/90 font-semibold shadow-xs border border-blue-200/80'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick jump badge & Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/editions/2026"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>第十届 (2026) 开放申报</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-blue-100 px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
