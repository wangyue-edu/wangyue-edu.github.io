import React from 'react';
import { Mountain, Heart, Compass, Sparkles, ArrowRight, BookOpen, Quote, ShieldCheck, FileText, Download, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>师恩浩荡 · 极客传承</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          望岳的故事
        </h1>
        <p className="font-serif text-slate-600 text-base sm:text-lg leading-relaxed">
          纪念江苏省南通中学计算机竞赛功勋教师 —— 岳军老师
        </p>
      </div>

      {/* 2. Hero Story Card */}
      <div className="rounded-3xl border border-blue-100 bg-white/95 backdrop-blur-md p-8 sm:p-12 shadow-sm space-y-8">
        <div className="relative pl-6 border-l-2 border-blue-400 italic font-serif text-base sm:text-lg text-slate-700 leading-relaxed">
          <Quote className="w-8 h-8 text-blue-200 absolute -left-4 -top-3 -z-10" />
          <p>
            “会当凌绝顶，一览众山小。” 杜甫登泰山而望众峰，见天地之壮阔；而在南通中学的校园里，岳老师用一支拐杖、数间机房，为一代代通中学子撑起了一片通往数字科技巅峰的辽阔天空。
          </p>
        </div>

        <div className="prose prose-slate max-w-none font-serif text-slate-700 leading-relaxed text-sm sm:text-base space-y-5">
          <h2 className="font-bold text-xl text-slate-900 font-serif pt-2">
            一、拄拐拓荒的师魂岁月
          </h2>
          <p>
            在江苏省南通中学的计算机与信息学竞赛拓荒年代，岳军老师默默耕耘了十余个春秋。早年他因意外身体残疾，常年需拄双拐行走，上下楼梯与辗转奔波尤为艰难。然而，在身体行动极为不便的情况下，岳老师从未缺席过哪怕一次学生的求知时刻。
          </p>
          <p>
            在那个互联网与算法资源尚属匮乏的时代，他数年如一日、无怨无悔地带领学生辗转全国各地参加信息技术奥赛集训与高水平竞赛。在机房里，他彻夜陪同调试程序；在赛场外，他拄着拐杖静静守候。他不仅传授算法与逻辑，更以自身坚毅不屈的人格力量，教会了年轻学子何谓专注、何谓韧性、何谓对真理的求索。
          </p>

          <h2 className="font-bold text-xl text-slate-900 font-serif pt-4">
            二、设立缘起：纯校友发起与资助
          </h2>
          <p>
            岳军老师逝世后，其历届学生与毕业校友深感师恩浩荡，久久不能释怀。为了将岳老师生前对计算机技术的热爱、对年轻人的包容与激励长久传承下去，2016年，由首批走出通中的计算机专业校友共同发起倡议，设立了“望岳奖学金”。
          </p>
          <p>
            从设立之初，望岳奖学金就确立了极其特殊的运作原则：
            <strong>全部奖学金由历届通中校友个人自发资助，由校友评审委员会独立评审，不设任何行政学科学业门槛，不以单一应试分数或竞赛奖牌论英雄</strong>。我们希望打造一个纯粹的极客舞台，只看重中学生在课外基于纯粹自驱力完成的技术创造。
          </p>

          <h2 className="font-bold text-xl text-slate-900 font-serif pt-4">
            三、“望岳”之名与精神图腾
          </h2>
          <p>
            “望岳”之名，蕴含双重深远寄托：
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>景仰恩师，铭记风骨</strong>：取《诗经》“高山仰止，景行行止”之意，深情纪念岳军老师德高望重、潜心育人的崇高师魂；
            </li>
            <li>
              <strong>勇攀高峰，求索真知</strong>：取杜甫《望岳》“会当凌绝顶，一览众山小”之气魄，激励中学生不畏险阻，如攀登风雪冰峰般突破常规，不断向未知技术领地发起挑战。
            </li>
          </ul>

          <h2 className="font-bold text-xl text-slate-900 font-serif pt-4">
            四、十年九届：守护纯粹的造物之火
          </h2>
          <p>
            自 2016 年首届破冰评选以来，望岳奖学金已走过 9 届历程，累计收录了 58 项具有鲜明极客基因的优秀成果。
            从早期的物理仿真、校园服务工具、电磁武器小车，到后来的独立自研微内核操作系统、1.8万行C++算法库、客制化硬件PCB与自注意力深度神经网络……通中学子在这里展现了令人惊叹的创造力与工程完整度。
          </p>
          <p>
            每一位获奖同学在毕业后，许多人又以评委、导师或捐助者的身份反哺奖学金，形成了生生不息的通中极客传承网络。无论技术浪潮如何更迭，望岳的初心始终如一：<strong>守护中学生内心深处最纯粹的好奇心与造物之火</strong>。
          </p>

          {/* 5-Year Summary Official Document Card */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-xs">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-blue-950 font-bold font-serif text-base">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <span>望岳奖学金五周年总结档案（2017–2021）</span>
              </div>
              <p className="text-xs text-slate-600 font-serif leading-relaxed">
                由评审委员会撰写编印，系统梳理了望岳奖学金前五届的创立脉络、极客精神内涵、导师评审机制演进与代表性获奖成果。
              </p>
            </div>
            <a
              href="/docs/2017_2021_five_year_summary.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>查阅五周年纪要 (PDF)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Alumni Academic Lecture Card: 吴培博士《AI大模型与量子计算》前沿讲座 */}
      <div className="rounded-3xl border border-blue-100 bg-white/95 backdrop-blur-md p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>校友反哺 · 前沿学术报告</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              走出通中，心系母校：吴培博士学术讲座
            </h2>
            <div className="prose prose-slate font-serif text-slate-700 leading-relaxed text-sm sm:text-base space-y-3">
              <p>
                望岳奖学金不仅是一个奖励创新的评选机制，更是一座连接历届通中学子与前沿科技世界的精神桥梁。从通中走向全球顶尖学府与科研工业界的学长学姐，始终怀揣对母校的深厚情感，以担任评审导师、捐助资金、开设学术讲座等多种形式持续反哺通中校园。
              </p>
              <p>
                2023 年第七届望岳奖学金期间，通中 2009 届校友、加州大学洛杉矶分校（UCLA）博士、望岳奖学金发起人之一<strong>吴培</strong>专程回到母校，在国际交流中心二楼会议室为科技创新学子带来了一场题为<strong>《AI大模型 & 量子计算》</strong>的深度前沿学术讲座。
              </p>
              <p>
                讲座深入浅出地剖析了生成式人工智能与大语言模型的技术范式跃迁，同时揭示了量子态叠加、量子纠缠与前沿量子计算体系对未来算力边界的重塑。吴培博士勉励学弟学妹们在中学时代打牢数理与编程根基，勇于探索未知的科学无人区。这份代代相承的极客情怀，正是“望岳”历久弥新的生动写照。
              </p>
            </div>
          </div>
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md transition-all hover:shadow-xl">
              <img
                src="/media/2023/wu_pei_alumnus_lecture_poster.jpg"
                alt="通中校友吴培博士回母校学术讲座海报"
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-3 bg-white/95 border-t border-slate-100 text-center">
                <p className="font-serif text-xs font-medium text-slate-800">
                  南通中学国际交流中心
                </p>
                <p className="font-serif text-[11px] text-slate-500">
                  《AI大模型 & 量子计算》讲座海报
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Media Coverage Documentary Card: 南通电视台《城市日历》新闻专题报道 */}
      <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Tv className="w-3.5 h-3.5" />
            <span>媒体专题报道与影像档案</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            南通电视台《城市日历》首届望岳奖学金新闻纪实
          </h2>
          <p className="font-serif text-sm text-slate-600 leading-relaxed max-w-3xl">
            2016 年首届望岳奖学金在南通中学设立与现场答辩，受到了主流媒体的广泛关注。南通电视台品牌民生新闻栏目《城市日历》记者深入敬孺楼答辩现场，记录了通中校友自筹奖金、纪念恩师岳军老师、褒奖中学生纯粹动手创新的创立初衷，并记录了首届获奖选手的精彩作品展示。
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-black">
          <VideoPlayer
            video={{
              src: 'media/2016_city_calendar.mp4',
              poster: 'media/2016_city_calendar_poster.jpg',
              title: '南通电视台《城市日历》首届望岳奖学金新闻专题报道'
            }}
          />
        </div>
      </div>

      {/* 3. Link to Rubric Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white p-8 sm:p-10 shadow-xl border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-serif font-bold text-xl text-white">
            查阅六维度客观评审规则与三大阶梯
          </h3>
        </div>
        <Link
          to="/rubric"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 transition-all shadow-md shrink-0"
        >
          <span>进入评审规则体系</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
