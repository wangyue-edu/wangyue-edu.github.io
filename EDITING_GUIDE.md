# 望岳奖学金数字档案网站 · 使用与脱敏维护指南

本项目为**江苏省南通中学 · 望岳奖学金（2016–2025）历届数字化纪念与成果展陈系统**。
本项目采用完全的静态站点架构（Static Web App，基于 React 19 + TypeScript + Vite + Tailwind CSS），构建产物位于 `website/dist/`，无需任何后端数据库或外部服务即可在任何静态服务器上离线运行。

---

## 1. 本地快速运行与体验

### 方式 A：使用 Vite 预览服务（推荐）
在 `website/` 目录下执行：
```bash
npm run preview
```
终端将输出访问地址（默认 `http://localhost:4173/`），在浏览器中打开即可流畅体验全部功能。

### 方式 B：使用 Python 原生静态 HTTP 服务
无需 Node 环境，直接在构建产物目录运行：
```bash
cd dist
python3 -m http.server 8000
```
在浏览器中访问：`http://localhost:8000`

---

## 2. 数据集中管理与离线脱敏编辑指南

所有人物、班级、项目、评分以及答辩评语数据**全部集中存放于纯文本 UTF-8 JSON 文件中**，没有任何数据硬编码在组件或编译脚本里。

### (1) 人物索引文件：`src/data/people.json`
本文件集中记录了历年来的 50 位申请学子与 17 位评审导师。
```json
{
  "students": [
    {
      "id": "wang-xuyang",
      "name": "王徐旸",        <-- 如需脱敏可直接修改为 "王同学" 或 "W同学"
      "class": "高三9班",       <-- 可修改为 "高三某班"
      "editions": ["2017"],
      "awards": [...]
    }
  ],
  "judges": [
    {
      "name": "吴培",          <-- 评委导师姓名
      "editions": ["2017", "2018", "2021", "2022"]
    }
  ]
}
```

### (2) 历届项目与评语档案：`src/data/editions/*.json`
每届对应一个单独的 JSON 文件：
* `src/data/editions/2016.json`（首届，10项成果）
* `src/data/editions/2017.json`（第二届，6项成果）
* `src/data/editions/2018.json`（第三届，5项成果）
* `src/data/editions/2020.json`（第四届，4项成果）
* `src/data/editions/2021.json`（第五届，11项成果）
* `src/data/editions/2022.json`（第六届，11项成果）
* `src/data/editions/2023.json`（第七届，4项成果）
* `src/data/editions/2024.json`（第八届，5项成果）
* `src/data/editions/2025.json`（第九届，2项成果）

在对应年份的 JSON 中，每个项目的结构如下：
```json
{
  "id": "2017-wang-xuyang-coilgun",
  "title": "无人电磁武器仿真模型的设计与制作",
  "studentName": "王徐旸",     <-- 作者姓名
  "class": "高三9班",          <-- 班级
  "award": "凌绝望岳",
  "summary": "...",
  "reviews": [                 <-- 评委评语
    {
      "judge": "吴培",
      "score": 10,
      "comment": "独立自主、工作量巨大..."
    }
  ],
  "interviewTranscript": [     <-- 面谈答辩问答录
    {
      "question": "键盘矩阵扫描有哪些方案？",
      "answer": "顾顺：采用多路复用器模拟开关..."
    }
  ]
}
```

### (3) 修改后重新构建
在 `website/` 目录下执行：
```bash
npm run build
```
仅需 2 秒即可重新打包更新 `dist/` 中的全站产物。

---

## 3. 核心功能与呈现方案说明

1. **可执行文件 (.exe, .apk) 与视频的呈现**：
   * 依据合规与安全要求，不在公网直接开放二进制下载链接。
   * 为可执行程序自动生成带有平台、架构、文件体积与实机复核标志的**《可执行文件与硬件制品规格卡》（`ArtifactCard`）**。
   * 配合高清实操录屏（`VideoPlayer`），生动展示运行效果。

2. **交互式 Demo（Flash 与 Web 全景）**：
   * **Flash (.swf) 作品**（如周子皓的《元宝PK战》《柔情雪花》《教师节贺卡》）：内置 WebAssembly 驱动的 Ruffle 仿真引擎，无需安装 Flash 插件即可在现代浏览器中直接游玩。
   * **HTML 3D 全景校园**（俞选涛《通中 3D 漫游导览》）：以沙箱 iframe 形式无缝嵌入，支持全屏漫游与节点穿梭。
   * **辩论赛计时器系统**（仇怡）：支持直接在网页上体验多辩制切换与倒计时。

3. **完整代码库（Codebase）的高清在线浏览**：
   * 针对周子皓 RoboMaster 361 个源文件、童亦洲 RUIOS 微内核、顾顺 Cactus 1.8 万行现代 C++ 算法库、须天人 PyTorch 人脸识别等 18 个代码库：
   * 自动过滤了第三方 `vendor` 大库和敏感名单，保留纯净学生自主编写代码。
   * 提供**分栏代码浏览器（`CodeExplorer`）**，具备左侧文件树检索、代码行数统计、语言标识、语法高亮与一键复制功能。

4. **评审记录与六维指标体系**：
   * 完整录入了历届评审打分矩阵表（Score Matrix），计算平均得分与排位。
   * 规范录入了评委评语与一对一面谈问答录，补齐了断句与标点，通顺易读。
   * 设立了专门的《六维评审量规体系》（独立性、完成度、创新度、难度/深度、复杂度、社区贡献），展示通中极客评奖标准。

---

## 4. 生产部署建议

构建产物目录 `website/dist/` 为纯静态网页，支持以下任意部署方式：
* **GitHub Pages**：直接将 `dist/` 内容推送到 `gh-pages` 分支。
* **Vercel / Netlify / Cloudflare Pages**：根目录选择 `website`，构建命令填 `npm run build`，输出目录填 `dist`。
* **通中校内服务器 / 局域网机房**：直接将 `dist/` 拷贝到 Nginx / Apache 的 `html/` 根目录下即可。

## 发布前的隐私检查

`npm run build` 现在会先执行 `npm run verify:privacy`，再清空并重建 `dist`。隐私检查覆盖网站数据、下载文档的正文和隐藏元数据、压缩包内的文件，以及 PDF 和旧版 Word 文档的已审查内容指纹。历史蓝牙配对 PIN 按站点所有者的要求保留，不作为邮箱或 QQ 联系方式处理。

站点所有者已明确允许保留原始签名的“全屋定制价格王”APK 及其第三方 Qt 许可证邮箱。例外仅匹配原始 APK 的 SHA-256 指纹；不得修改签名文件或将例外扩大到其他联系方式。

不要将机器人社团招新问卷重新放入 `public` 或源码压缩包。仅把单元格显示为匿名不能删除 Excel 的隐藏字符串记录。也不要把旧 `dist` 的文件手动合并回新构建目录。

导入新的原始材料时，可用 `scripts/sanitize_public_contacts.py` 清理文本、Word/XML 元数据和嵌套压缩包，用 `scripts/redact_public_pdfs.py` 对 PDF 做实际内容删除。两者的 `--write` 参数才会修改文件，`--work-dir` 应指向网站目录外的临时工作目录；这些编辑工具分别需要 `lxml` 和 `pymupdf`。普通构建的隐私检查只需要 Python 3 标准库。

PDF 改动后须检查正文、截图和实际渲染结果。完成复核后，才可用 PDF 工具的 `--write --record-reviewed-pdfs` 更新已审查 PDF 指纹。最后执行 `npm run build` 及 `python3 scripts/verify_public_privacy.py --dist`，检查最终发布目录。请保留网站目录外的原始私有档案，不要将原件或临时复核副本复制到 `public`。
