import React from 'react';
import { Scale, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RubricPage: React.FC = () => {
  const rubrics = [
    {
      title: '独立性 (Independence)',
      weight: '必须项 · 面谈强校验',
      desc: '评价项目是否由申请人自主构思与完成。凌绝望岳奖必须达到 5 分并通过评委一对一面对面或线上答辩验证。',
      levels: [
        { score: '5分', text: '100% 由申请人独立设计与编码，能深入解答所有软硬件实现细节' },
        { score: '3分', text: '了解项目所有核心细节，机械加工或部分非核心由外包或老师协助' },
        { score: '1分', text: '对于项目技术实现缺乏深入认知，仅能大概描述功能' },
      ],
    },
    {
      title: '完成度 (Completeness)',
      weight: '实物运行与闭环',
      desc: '评价项目是否具备可执行的实机演示、完备的代码仓库与详尽的技术报告。',
      levels: [
        { score: '5分', text: '软硬件具备完整的可运行实物展示，或具备深度实验数据的学术报告' },
        { score: '3分', text: '核心模块实现完成，但在部分非关键链路上仍有待完善' },
        { score: '1分', text: '仅停留在方案设计或PPT阶段，缺乏实物或代码落地' },
      ],
    },
    {
      title: '创新度 (Innovation)',
      weight: '破局需求与原创解法',
      desc: '评价项目是否提出了具有新颖性的问题，或针对个性化需求给出了独到的解法。',
      levels: [
        { score: '5分', text: '解决了具有强烈创新的需求，如自研原创数据结构、自制硬件武器小车' },
        { score: '3分', text: '利用成熟的开源或成熟工业方案解决身边具体痛点，如校园网自动登录' },
        { score: '1分', text: '直接复制官方教程或开源样例，未作任何针对性改造' },
      ],
    },
    {
      title: '难度 / 深度 (Technical Depth)',
      weight: '技术门槛与体系挑战',
      desc: '考察项目所触及的计算机理论或工程技术在认知与技能上的高度。',
      levels: [
        { score: '5分', text: '技术难度超过普通高校本科生毕业设计水准，如自写微内核、注意力CNN' },
        { score: '3分', text: '技术难度超过高中生平均水准，能熟练运用标准工业 SDK 开展开发' },
        { score: '1分', text: '仅调用单条系统命令或基础脚本拼接' },
      ],
    },
    {
      title: '复杂度 (Complexity)',
      weight: '工程体量与心血投入',
      desc: '考察项目所需要的长期精力投入与系统模块间的调度集成规模。',
      levels: [
        { score: '5分', text: '代码量超过数千至上万行，或历经数月乃至整年长期迭代与调优' },
        { score: '3分', text: '需要一定量的精力投入，通常需要一周以上至一个月的调试与调研' },
        { score: '1分', text: '一两天内即可拼凑完成的简易作业' },
      ],
    },
    {
      title: '社区贡献 (Community Impact)',
      weight: '极客精神与开源传承',
      desc: '考察申请人是否为校内同学组织技术教学、社团带动或在开源生态中有所贡献。',
      levels: [
        { score: '5分', text: '长期为校内极客社团提供技术教学，或开源库获得广泛 Star 与复用' },
        { score: '3分', text: '积极组织校内技术沙龙与社团活动，带动同学共同学习' },
        { score: '1分', text: '个人独立研究，未参与社区分享' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Scale className="w-3.5 h-3.5" />
          <span>客观量化 · 严谨治学</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          望岳奖学金评审规则
        </h1>
        <p className="font-serif text-slate-600 text-base sm:text-lg leading-relaxed">
          不以单一奖牌论英雄，以技术独立性、解决真实问题、工程动手能力为唯一准绳
        </p>
      </div>

      {/* 2. Review Mechanism Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-serif font-bold text-base">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>独立性强校验</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            所有进入终审的项目均须接受评委一对一面对面质询或线上实机答辩，深入追问架构设计、软硬件选型与代码细节，确保成果100%自主完成。
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-serif font-bold text-base">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>源码复现与真机演示</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            提倡硬核实干，拒绝空洞概念。硬件项目需实机联调运行，软件项目需提供可编译代码仓库与执行录像，严谨验证系统的健壮性。
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-serif font-bold text-base">
            <Scale className="w-4 h-4 shrink-0" />
            <span>多维矩阵综合评分</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            自第八届起固化六维度客观评审模型，学术界与工业界校友导师独立打分，综合加权、取长补短，兼顾科学前沿探索与校内实用赋能。
          </p>
        </div>
      </div>

      {/* 3. The 6-Dimension Rubric */}
      <div className="space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Scale className="w-4 h-4" />
            <span>核心评价体系</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            六维度综合评审量规体系 (Rubric)
          </h2>
          <p className="text-sm text-slate-600 font-serif">
            所有申报项目均在六个维度上接受评委严格审视与量化打分：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rubrics.map((r, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-slate-900">{r.title}</h3>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {r.weight}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-serif">{r.desc}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs font-mono">
                {r.levels.map((lvl, lidx) => (
                  <div key={lidx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-blue-700 shrink-0">{lvl.score}</span>
                    <span className="text-slate-600 font-sans">{lvl.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Award Tiers Philosophy */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-blue-400/30 space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
          <Award className="w-4 h-4 text-amber-300" />
          <span>三大奖项阶梯</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          评奖哲学：宁缺毋滥，激励卓越
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
            <span className="font-serif font-bold text-amber-300 text-base">凌绝望岳奖</span>
            <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
              最高荣誉。要求项目 75% 以上由团队成员自主完成，项目高度完整，有深刻思考、突破性创新与技术难度。若当年无项目达到标准，该奖项坚决轮空，留待次年发掘更具突破性的卓越作品。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
            <span className="font-serif font-bold text-emerald-300 text-base">坚韧登岳奖</span>
            <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
              二等奖。要求项目 50% 以上自主完成，项目相对完整，在技术深度、创新解法、工程难度或系统复杂度上至少呈现一个令人眼前一亮的突出亮点。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
            <span className="font-serif font-bold text-sky-200 text-base">凭高临岳奖</span>
            <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
              三等奖 / 入围鼓励。要求项目 50% 以上自主完成，具备良好的完成度与动手记录，鼓励探索、包容试错，支持年轻极客扬帆起航。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
