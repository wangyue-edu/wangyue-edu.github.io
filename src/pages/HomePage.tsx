import React from 'react';
import { Link } from 'react-router-dom';
import { EDITIONS, getAllProjects, getBenchmarkProjects } from '../data';
import { AwardBadge } from '../components/AwardBadge';
import {
  Mountain,
  Trophy,
  Code2,
  Compass,
  ArrowRight,
  Layers,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const allProjects = getAllProjects();
  const benchmarkProjects = getBenchmarkProjects();

  // Metrics
  const totalEditions = EDITIONS.length;
  const totalProjects = allProjects.length;
  const codeProjectsCount = allProjects.filter((p) => p.hasCode).length;
  const demoProjectsCount = allProjects.filter(
    (p) => p.video || (p.interactiveDemos && p.interactiveDemos.length > 0)
  ).length;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Luminous Bright Snow Mountain Hero Section */}
      <section className="relative overflow-hidden min-h-[620px] flex flex-col justify-between pt-16 pb-20 border-b border-blue-100">
        {/* Full-width Snow Mountain Background */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_35%] pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/snow_mountain_hiking.jpg')` }}
        />

        {/* Bright Daylight Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-blue-100/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F8FB] via-white/30 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                会当凌绝顶 · 望岳求真知
              </h1>
              <p className="font-serif text-base sm:text-lg text-blue-700 font-medium tracking-wide">
                “会当凌绝顶，一览众山小” —— 杜甫《望岳》
              </p>
            </div>

            <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              纪念江苏省南通中学岳军老师极客基金。
              由历届通中校友全额资助与独立评选，鼓励中学生像攀登雪峰般突破常规，守护最纯粹的技术探索与工程造物热情。
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/editions"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>浏览历届历史画卷</span>
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-blue-50 text-slate-800 border border-slate-200 shadow-xs transition-all"
              >
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>探索全部 {totalProjects} 件作品</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Frosted White Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '历届盛典', value: `${totalEditions} 届`, desc: '2016至2026持续运作' },
              { label: '硬核成果', value: `${totalProjects} 项`, desc: '代码与真机全覆盖' },
              { label: '开源代码库', value: `${codeProjectsCount} 个`, desc: '工程源码在线浏览' },
              { label: '实机与视频演示', value: `${demoProjectsCount} 项`, desc: 'Web/Flash/视频实录' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-100 text-slate-800 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                <div className="my-1.5 font-mono text-3xl font-bold text-blue-600 tracking-tight">
                  {stat.value}
                </div>
                <span className="text-[11px] text-slate-400">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 10th Edition Application Notification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-400/30">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  申报正式启动
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/20">
                  第十届 · 十周年里程碑 (2026)
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                2026年第十届望岳奖学金申报通知
              </h2>
              <p className="font-serif text-sm sm:text-base text-blue-100/90 leading-relaxed">
                纪念岳军老师极客基金第十届评选现已面向江苏省南通中学全体在校学生（高一至高三）开放申请。
                只要你有课余自主构思并亲手完成的软硬件开发、电子工程、算法研究或创新实验，均可报名参选！
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono text-blue-200/80">
                <span>✦ 面向南通中学全校在校生</span>
                <span>✦ 独立性 100% 自主研发优先</span>
                <span>✦ 代码开源 & 答辩复现</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/editions/2026"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30 transition-all text-center"
              >
                <span>查阅第十届申报指南</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/downloads"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-center"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>下载申报细则与申请表</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hall of Fame (凌绝望岳金榜) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Trophy className="w-4 h-4" />
              <span>十周年荣誉殿堂 · 登顶时刻</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              凌绝望岳金榜 · 标杆作品集
            </h2>
          </div>
          <Link
            to="/projects?award=first"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>查看所有金奖档案</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benchmarkProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {project.editionYear} 第{project.editionNumber}届
                  </span>
                  <AwardBadge tier="first" size="sm" />
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-800">
                  {project.studentName} · {project.class}
                </span>
                <span className="text-blue-600 font-serif font-semibold">
                  {project.award}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Ten-Year Technological Evolution Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Layers className="w-4 h-4" />
            <span>通中极客十年技术演进</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            从 Flash 动效到微内核、现代 C++ 与自研硬件
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-serif">
            如同一支不断突破雪线、向上攀登的探险队伍，十年来通中学子的申报项目展现了中国中学生科技素养的深远跃迁：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-xs hover:border-blue-300 transition-colors">
            <span className="font-mono text-xs font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
              2016 – 2018 · 拓荒起步
            </span>
            <h4 className="font-serif font-bold text-base text-slate-900">
              单片机、Flash 交互与自制物理模型
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              首届周鹤洋的智慧校园树莓派、王徐旸的激光单目测距电磁小车、周子皓的 Flash ActionScript 工具套件与 RoboMaster 初步探索，奠定了“亲手造物”的底色。
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 space-y-3 shadow-xs hover:border-sky-300 transition-colors">
            <span className="font-mono text-xs font-bold text-sky-700 px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
              2019 – 2022 · 底层深探
            </span>
            <h4 className="font-serif font-bold text-base text-slate-900">
              微内核操作系统、分布式通信与现代农机
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              童亦洲独立手写 RUIOS 微内核与 RedIM 高性能即时通信服务器；姜冠群深入 NFC 协议栈；徐天润组建通中首个机器人协同团队；马佳悦迭代自制仔猪智能食槽。
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3 shadow-xs hover:border-blue-300 transition-colors">
            <span className="font-mono text-xs font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
              2023 – 2025 · 极客工业级
            </span>
            <h4 className="font-serif font-bold text-base text-slate-900">
              1.8万行算法库、客制化硬件 PCB 与深度学习
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              顾顺与吴泽宇交付 1.8 万行现代 C++ Cactus 算法库；顾顺自绘 PCB 制作 75 键分体机械键盘与纯逻辑门时钟；须天人开展自注意力人脸识别深度神经网络科研。
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Memorial Philosophy (岳军老师的寄托) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-blue-400/30 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              不设门槛，唯求纯粹
            </h3>
            <p className="font-serif text-sm sm:text-base text-blue-50 leading-relaxed">
              望岳奖学金不以单一的竞赛奖牌论英雄，更看重学生在课余自主探索的工程完整度、动手韧性与解决实际问题的极客精神。
              从独立性到社区贡献，我们坚信真正的技术创造源自内心的好奇与热爱。
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/rubric"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
              >
                <span>查阅六维评审规则</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-white/30 text-xs">·</span>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 hover:text-white transition-colors"
              >
                <span>阅读望岳创立故事</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
