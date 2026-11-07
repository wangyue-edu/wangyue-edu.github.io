import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Memorial & Foundation */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-xs">
                <Mountain className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg text-slate-900 tracking-wider">
                南通中学 · 望岳奖学金
              </span>
            </div>
            <p className="text-sm text-slate-600 font-serif leading-relaxed max-w-lg">
              “高山仰止，景行行止。” 望岳奖学金由江苏省南通中学岳军老师的历届计算机学生于 2016 年发起设立，
              旨在纪念岳老师身患残疾依然数十载如一日带领学生攀登科学技术高峰的无私师魂，
              鼓励中学生保持最纯粹的极客自驱力与工程创造力。
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-medium">2016 – 2025 · 累计九届历史评选</span>
            </div>
          </div>

          {/* Column 2: Fast Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              快捷探索
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/editions" className="hover:text-blue-600 transition-colors">
                  历届华章（2016–2026）
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-blue-600 transition-colors">
                  全量 58 项硬核成果
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-blue-600 transition-colors">
                  档案下载（细则、模板与源码）
                </Link>
              </li>
              <li>
                <Link to="/rubric" className="hover:text-blue-600 transition-colors">
                  评审规则（六维综合量规）
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  望岳故事（设立缘起）
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2016–2026 望岳奖学金评审委员会 & 通中极客校友网络. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Nantong High School Geeks
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
