---
title: Spec-Driven AI Coding 落地指南：OpenSpec / Kiro / Spec Kit / Superpowers
date: 2026-06-14 10:30:00
tags: [AI, Spec Coding, OpenSpec, Kiro, Spec Kit, Superpowers, AI编程]
keywords: Spec-Driven Development, SDD, OpenSpec, Kiro, Spec Kit, Superpowers, AI编程, 规范驱动开发, 规范落地
---
# Spec-Driven AI Coding 落地指南：OpenSpec / Kiro / Spec Kit / Superpowers

上一篇《Spec Coding vs Vibe Coding》讲了「为什么」：Spec Coding 用一份规格逼着你在写代码之前把数据模型、功能边界、异常情况都想清楚。

但那篇留下了一个很现实的问题：**Spec 写在哪？怎么管？写完之后，怎么让 AI 真的按 Spec 去干活，而不是转头又自己自由发挥？**

这篇文章就讲「怎么落地」。目前主流的落地工具有四个：**OpenSpec、Kiro、GitHub Spec Kit、Superpowers**。它们思路相通，但定位差别很大。看完这篇你会清楚：它们分别解决什么问题、彼此怎么协作、新系统和老系统分别该怎么接、完整的工作流长什么样。

<!--more-->

## 一、先分清两层：管「写规范」还是管「按规范干活」

先讲整篇文章最重要的认知：很多人把这四个工具放在一起比较，其实它们不在同一个层面。

```text
┌──────────────────────────────────────────────┐
│            你的 AI 编程项目                    │
├──────────────────────────────────────────────┤
│                                              │
│  规范层（Spec）：决定「做什么、怎么做」        │
│  产物：需求 / 设计 / 任务         │
│  工具：OpenSpec  |  Kiro  |  GitHub Spec Kit │
│                                              │
│  ─────────────────────────────────────────  │
│                                              │
│  执行层（Discipline）：决定「怎么按规范干活」 │
│  行为：强制 TDD、subagent 派发、代码审查      │
│  工具：Superpowers                            │
│                                              │
└──────────────────────────────────────────────┘
```

- **OpenSpec、Kiro、Spec Kit** 都属于**规范层**：核心是产出并维护「需求 / 设计 / 任务」这套规范文档（具体命名因工具而异，比如 Kiro 是 requirements/design/tasks，Spec Kit 是 spec/plan/tasks），把「想法」沉淀成「可读、可改、可 review 的文档」。
- **Superpowers** 属于**执行层**：spec 只是它头脑风暴阶段的一个副产物，它的灵魂是**强制 AI 按工程纪律干活**——测试先行、子代理派发、自动隔离工作区、任务间审查。

记住这个分层，后面的选型就不再是「四选一」，而是「规范层选一个 + 要不要叠加执行层」。而且这两层可以组合，互不冲突。

## 二、工具详解

### 1. OpenSpec —— 最轻、最灵活、对老项目最友好

**定位**：Fission-AI 开源，CLI + slash 命令形态。把每个改动组织成独立文件夹，spec 跟代码一起进 git。

**核心功能**：

- **变更制（change-based）**：每个功能或修复一个独立文件夹，含 `proposal / specs / design / tasks` 四件套，互不干扰，可单独 review、独立回滚。
- **slash 命令工作流**：`/opsx:new`（建变更）→ `/opsx:ff`（fast-forward，一键生成四件套）→ `/opsx:apply`（实现）→ `/opsx:archive`（归档，spec 沉淀为现状）。
- **全局约束 `AGENTS.md`**：项目级游戏规则（技术栈、目录、禁区），让 AI 每次干活有统一上下文。
- **持久化上下文**：spec 存在仓库里，新开对话能直接接上，不用重新交代背景。
- **Spec Delta Review**：不翻 diff 就能高层级 review「这次要改什么」。
- **不绑定工具**：支持 20+ AI 助手（Claude Code、Cursor、Copilot、Windsurf、Cline 等）。

**怎么用**：

```bash
npm install -g @fission-ai/openspec    # 安装
cd your-project && openspec init        # 初始化（一次性）
```

```text
/opsx:new add-dark-mode     # 建变更文件夹
/opsx:ff                    # 一键生成 proposal/specs/design/tasks
# 人审这四份文档，确认边界
/opsx:apply                 # AI 按 tasks 实现
/opsx:archive               # 归档，spec 沉淀
```

**适合**：独立开发者、老项目接入、不想折腾的人。5 分钟上手，不需要 Python。

### 2. Kiro —— 体验最完整、自动化最深

**定位**：AWS 出的完整 AI IDE（基于 VS Code），spec 系统开箱即用，不用装插件。

**核心功能**：

- **三文件强制结构**：`requirements.md`（用 EARS 语法写用户故事和验收标准）→ `design.md`（架构 + 时序图）→ `tasks.md`（可执行任务清单）。
- **两种 Spec 类型**：Feature Specs（建新功能）和 Bugfix Specs（诊断 → 修复 → 防回归）。
- **三种工作流**：Requirements-First（需求驱动）、Design-First（设计驱动）、Quick Plan（跳过审批，一键生成三件套）。
- **任务依赖图 + Wave 并发**：点「Run all Tasks」，Kiro 自动分析任务依赖，把无依赖的任务分波并发跑，大幅压缩执行时间——这是它最独门的能力。
- **Steering**：项目级上下文和约束（类似 OpenSpec 的 `AGENTS.md`）。
- **Hooks**：事件钩子，能在特定时机自动执行动作（比如提交前自动跑测试）。

**怎么用**：

```text
1. 下载安装 Kiro IDE，打开项目
2. 面板点 + → 选 Feature（或 Bug）→ 描述需求
3. Kiro 用 EARS 语法生成 requirements.md → 你确认
4. 生成 design.md → 你确认
5. 生成 tasks.md
6. 点「Run all Tasks」→ 自动建依赖图，按 Wave 并发执行
7. 实时看每个任务的 in-progress / completed 状态
```

**适合**：想要开箱即用、能接受换 IDE、追求自动化最深的人。代价是要换到 Kiro 这个 IDE，对老项目接入偏重。

### 3. GitHub Spec Kit —— 官方背书、agent 无关

**定位**：GitHub 官方开源，流程最严谨，同一套规范能配 30+ 种 AI 编码工具。

**核心功能**：

- **五步 slash 命令**：`/speckit.constitution`（立项目原则）→ `/speckit.specify`（写需求）→ `/speckit.plan`（技术方案）→ `/speckit.tasks`（拆任务）→ `/speckit.implement`（实现）。
- **Constitution 优先**：第一步先立项目原则（`constitution.md`），所有后续 spec/plan 都要遵守它。
- **规范的三件套产物**：`spec.md` / `plan.md` / `tasks.md`，结构清晰，利于团队 review。
- **可选增强命令**：`/speckit.clarify`（澄清模糊需求）、`/speckit.analyze`（跨文档一致性检查）、`/speckit.checklist`（生成质量清单，号称「给英文写的单元测试」）。
- **`/speckit.taskstoissues`**：把任务直接转成 GitHub Issues 做追踪。
- **Extensions & Presets**：扩展能加新命令/工作流，预设能定制模板格式（甚至能本地化成中文流程）。

**怎么用**：

```bash
# 装 uv 和 Python 3.11+，再装 specify CLI（把 vX.Y.Z 换成 Releases 里的最新版本号）
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
# 初始化项目（指定你的 AI 工具）
specify init my-project --integration copilot   # 或 claude / codex / gemini
```

```text
/speckit.constitution   # 立项目原则（一次性）
/speckit.specify        # 写需求，专注 what/why
/speckit.clarify        # 澄清模糊点（推荐，可选）
/speckit.plan           # 给技术栈和架构
/speckit.tasks          # 拆成带依赖和并行标记的任务
/speckit.analyze        # 一致性检查（可选）
/speckit.implement      # 按计划实现
```

**适合**：团队规模化铺开、深度用 GitHub 生态、需要 review/审计流程的组织。代价是偏重，需要 Python 环境。

### 4. Superpowers —— 最强的执行纪律

**定位**：Jesse Vincent（obra）/ Prime Radiant 开源。它不是 spec 工具，而是装在 AI 助手里的「工程纪律引擎」——强制 AI 按一套方法论干活。

**核心功能**：

- **自动触发的 skills 系统**：装好后不用手动调用，AI 在合适时机会自动应用对应 skill（mandatory workflows, not suggestions）。
- **完整方法论 skill 链**：`brainstorming`（苏格拉底式逼出需求）→ `using-git-worktrees`（自动隔离工作区）→ `writing-plans`（2–5 分钟粒度任务）→ `subagent-driven-development`（每任务派新 subagent + 两阶段 review）→ `test-driven-development`（强制 RED-GREEN-REFACTOR）→ `requesting-code-review`（任务间审查）→ `finishing-a-development-branch`（合并/PR/discard 决策）。
- **systematic-debugging**：4 阶段根因排查（含 root-cause-tracing、defense-in-depth 等技术）。
- **verification-before-completion**：完成前强制验证，「evidence over claims」。
- **writing-skills**：能让 AI 自己写新 skill，持续扩展能力。
- **多 harness 通用**：Claude Code（官方 marketplace）、Codex CLI/App、Gemini CLI、Cursor、Copilot CLI 等都能装。

**怎么用**：

```text
# 以 Claude Code 为例（一行装好）
/plugin install superpowers@claude-plugins-official

# 装好后正常提需求即可，它自动接管流程：
# 你说「帮我做一个 X」
#   → 自动 brainstorming（问你到底要什么）
#   → 自动开 git worktree 隔离
#   → 自动 writing-plans（拆小任务给你确认）
#   → 自动 subagent 逐个实现 + TDD + 两阶段 review
#   → 自动收尾（合并 / PR / discard）
```

**适合**：正经写有测试的代码项目、追求质量、认同 TDD 方法论的人。代价是很硬核——强制 TDD 对脚本/配置/文档类项目几乎没法用（它会删掉测试之前写的代码）。

### 还有谁：从最轻到最重

除了这四个主流工具，spec 这个领域现在很拥挤（有人对比过 15+ 个框架）。值得知道的有三类。

**更重的方案 —— BMAD-METHOD**：约 48K stars，走「多 agent 角色编排」路线——让 AI 分别扮演分析师、PM、架构师、Scrum Master、开发，按敏捷流程跑完整 SDLC。如果说 Superpowers 是执行纪律，那 BMAD 就是一整套「虚拟团队」，更结构化，但也更复杂、学习曲线更陡。

**你可能已经在用的「最轻 spec」**：spec 不一定要三件套 Markdown。Cursor 的 `.cursorrules`、Claude Code 的 `CLAUDE.md`、Cline 的 `.clinerules`、Windsurf 的 `.windsurfrules`——这些项目级约束文件，本质上就是 spec 的极简形态，只是不强制结构。OpenSpec 的 `AGENTS.md`、Kiro 的 steering，就是把它们升级成有体系的规范。很多人其实已经在用 spec 而不自知。

**官方节制版**：Anthropic 的 [anthropics/skills](https://github.com/anthropics/skills) 可以看作 Superpowers 的官方克制版——更通用，不强制删代码。

把这些和前面四个放在一起，能看到一条从轻到重的谱系：

```text
平台 Rules 文件          最轻，零结构
（.cursorrules / CLAUDE.md 等）
        │
        ▼
OpenSpec / Spec Kit      有结构的三件套规范
        │
        ▼
Kiro                     IDE 内置，EARS + 并发执行
        │
        ▼
Superpowers              强制执行纪律（TDD / subagent）
        │
        ▼
BMAD                     最重，多 agent 虚拟团队
```

工具越往下越重、约束越多，但也越挑场景。对绝大多数人来说，主流四个里选一个，再配上平台自带的 rules 文件，就已经够用了。

## 三、Spec-Driven 的通用工作流

不管你最后选哪个工具，背后的核心流程都是同一条。理解了这条主线，换任何工具都能立刻上手。

```text
一个模糊的想法
      │
      ▼
┌──────────┐    要不要做？边界在哪？     ┌──────────────┐
│ 1. 需求  │ ─────────────────────────▶ │ requirements │
│  Requirements                          │  .md         │
└──────────┘                              └──────┬───────┘
                                                 │ 你签字确认
                                                 ▼
┌──────────┐    怎么实现？架构怎样？    ┌──────────────┐
│ 2. 设计  │ ◀───────────────────────── │   design     │
│  Design  │                            │   .md        │
└──────────┘                            └──────┬───────┘
                                                 │ 你签字确认
                                                 ▼
┌──────────┐    拆成可执行的小任务      ┌──────────────┐
│ 3. 任务  │ ◀───────────────────────── │   tasks      │
│  Tasks   │                            │   .md        │
└──────────┘                            └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  4. 实现     │
                                          │ Implement    │
                                          └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  5. 验证     │
                                          │  Verify      │
                                          └──────────────┘
```

这条流程的关键不在工具，而在**两个「签字确认」的闸门**：

- **需求 → 设计** 之间停下来：确认要做什么，再谈怎么做。
- **设计 → 任务** 之间停下来：确认架构，再拆任务。

Vibe Coding 之所以容易失控，正是因为它跳过了这两个闸门——从「想法」直奔「实现」。Spec-Driven 的本质，就是把这两个闸门显式化。

## 四、新系统怎么落地（Greenfield）

新系统是 Spec-Driven 的最佳战场。没有历史包袱，建议从第一个 feature 开始就用，越早越受益。

### 落地步骤

命令层面直接套用第二节 OpenSpec 的「怎么用」：`openspec init` → `/opsx:new` → `/opsx:ff` → 人审 → `/opsx:apply` → `/opsx:archive`（Kiro 和 Spec Kit 同样适用，只是命令和产物目录不同）。

第一次完整跑通这个闭环，是整件事的关键——后面就是肌肉记忆。其中**人审这一步千万别跳过**：`/opsx:ff` 生成四份文档后，认真读 proposal 和 specs，确认边界、验收标准无误再实现。这步省下的 5 分钟，会在实现阶段花 50 分钟来还。

### 新系统落地的三条原则

**原则一：spec 是第一公民，代码是它的衍生品。**
新系统最大的奢侈是「没有存量」。利用这一点，让 spec 成为 source of truth，后续所有改动都先改 spec 再改代码。三个月后回来看，spec 告诉你当时的意图，而不是让你去代码里猜。

**原则二：每个 feature 一个独立的 spec 文件夹。**
不要把所有需求塞进一个大文档。OpenSpec 的「每个变更一个文件夹」结构天生为此设计。这样做的好处是：feature 之间不耦合，可以并行、可以单独 review、可以独立回滚。

**原则三：第一个 feature 用它跑通整个闭环，别贪多。**
新系统接 SDD，第一周只做一件事：完整跑一遍 `new → ff → 人审 → apply → archive` 的闭环。跑顺了，后面就是肌肉记忆。一上来就想给整个系统铺全套 spec，往往会陷入文档地狱。

### 如果新系统用 Kiro

Kiro 的新系统流程更省心，代价是绑在它的 IDE 里：

```text
在 Kiro 里点 + 创建 Spec
      → 选 Feature，描述需求
      → Kiro 用 EARS 语法生成 requirements.md
      → 你确认后，生成 design.md
      → 你确认后，生成 tasks.md
      → 点「Run all Tasks」
      → Kiro 自动建依赖图，按 Wave 并发执行
```

它的「任务依赖图 + Wave 并发」是独门优势：tasks.md 里没依赖关系的任务会自动并发跑，新系统功能多的时候，能显著压缩执行时间。

## 五、老系统怎么落地（Brownfield）

这才是真正的难点，也是最容易劝退的地方。

给一个跑了三年的系统一次性补全套 spec，几乎不可能成功——文档量太大、和代码对不上、写完就过时。所以老系统的核心策略只有两个字：**渐进**。

### 渐进落地的核心思路

```text
老系统（一大坨没文档的代码）
        │
        ├──▶ 第 1 步：先建一份「全局约束」（轻量，一次性）
        │     OpenSpec 的 AGENTS.md / Kiro 的 steering
        │     只写：技术栈、目录约定、不能碰的禁区、代码风格
        │     ── 不写具体功能 spec，只立规矩
        │
        ├──▶ 第 2 步：改动到哪，spec 补到哪
        │     要改某个老模块？先让 AI 读代码反推一份「现状 spec」
        │     在现状 spec 上写「要改成什么」，再实现
        │     ── 改动驱动，不主动全量补
        │
        ├──▶ 第 3 步：新功能一律走完整 SDD
        │     老代码保持原样，新功能用 spec 驱动
        │     ── 新老隔离，互不干扰
        │
        └──▶ 第 4 步：Bug 修复用 Bugfix Spec
              出 bug 的地方，趁机补一份诊断 spec
              ── 把事故变成文档资产
```

### 第 1 步：先立规矩，而不是先写功能

老系统接入 SDD，**第一件事不是写 requirements，而是写一份全局约束**。

- OpenSpec 里对应 `AGENTS.md`。
- Kiro 里对应 **steering** 文件。
- Spec Kit 里对应 `/speckit.constitution` 生成的 `constitution.md`。

这份文档只回答几个问题：这个项目用什么技术栈？目录怎么组织？哪些地方是禁区不能动？代码风格有什么硬性要求？测试怎么跑？

它不写任何具体功能，只立「游戏规则」。这一步轻量、低风险，但收益极大——AI 后续每次干活都有统一约束，不会再每次靠 prompt 临时交代。

### 第 2 步：改动驱动，按需补 spec

老系统最忌讳「主动全量补文档」。正确做法是**被动补**：只有当你真的要改某个模块时，才为它补 spec。

具体动作：

```text
要改「订单退款」模块
        │
        ▼
让 AI 读现有代码，反推一份现状 spec
   （这是 reverse engineering，AI 比人快）
        │
        ▼
在现状 spec 上，写明「这次要改什么、改成什么样」
        │
        ▼
AI 按改动后的 spec 实现
        │
        ▼
改动完成，这份 spec 就沉淀下来了
   下次再碰这个模块，直接基于它迭代
```

这样做有三个好处：一，spec 永远和「真正在变的代码」同步，不会过时；二，投入和收益成正比，不浪费在永远不碰的代码上；三，每次改动都顺带把文档资产积累起来。

### 第 3 步：新功能隔离走完整 SDD

老代码可以暂时不管，但**新加的功能一律走完整的 Spec-Driven 流程**。新老代码物理隔离（独立目录或独立模块），新功能用 spec 驱动，老功能保持原样。

时间一长，系统里 spec 覆盖的部分会越来越多，没覆盖的部分逐渐被新的替代或重构。这是一个温和的迁移，不需要专门停业务做重构。

### 第 4 步：把 Bug 变成文档资产

线上出 bug，是补 spec 的最佳时机。

Kiro 有专门的 **Bugfix Specs**：诊断（当前行为 / 期望行为 / 不变行为）→ 设计修复 → 防回归。一次 bug 修复，顺带沉淀出一份「这个模块的正确行为」文档。OpenSpec 也能用同样的思路走 `/opsx:new` 修复一个 bug。

把事故变成文档资产，是老系统迁移里性价比最高的一招。

### 老系统选型建议

老系统强相关的特性：

- **OpenSpec**：天生为 brownfield 设计，`openspec init` 不重写应用，brownfield 哲学写在它首页。
- **Spec Kit**：也支持存量接入，但流程更重，适合团队。
- **Kiro**：对老项目偏重，更适合新项目或愿意深度迁移的团队。

如果是个人或小团队维护老项目，**OpenSpec 是首选**；如果是团队要给大型存量系统立规矩，**Spec Kit + 全局 steering 文件** 更合适。

## 六、实战：新老系统各走一遍

光讲流程太抽象。下面用两个具体例子，把第四节、第五节的方法真正跑一遍——一个新系统，一个老系统，对比着看最清楚。

### 6.1 新系统实战：用 OpenSpec 从零做一个短链接服务

需求：输入长 URL 生成短码，访问短码时 302 跳转。技术栈 Node.js + Express。

**第 1 步：初始化**

```bash
npm install -g @fission-ai/openspec
cd url-shortener
openspec init
```

**第 2 步：建立变更、一键生成规划文档**

```text
/opsx:new short-link-core
/opsx:ff
```

`/opsx:ff` 会一次性生成 proposal、specs、design、tasks 四份文档。其中 `specs/` 里会得到类似这样的需求片段：

```markdown
## 创建短链接
- 触发：POST /api/shorten，body: { "url": "<长链接>" }
- 规则：
  - url 必须是合法 http(s) 链接，否则 400
  - 同一长链接重复请求，返回已有短码（幂等）
- 返回：{ "shortCode": "x7Kq2a", "shortUrl": "https://s.io/x7Kq2a" }

## 访问短链接
- 触发：GET /:shortCode
- 行为：存在则 302 跳转，不存在则 404
- 记录一次访问计数

## 短码生成规则
- 字符集：a-z A-Z 0-9，去掉易混的 0/O、1/l/I
- 长度 6 位，冲突则重新生成
```

关键点：**幂等、字符集去易混字符、冲突重试**这些边界，如果纯 vibe coding，往往要等用户报 bug 才发现。spec 阶段就把它们写明了。`design.md` 会定存储方案（先 SQLite，后续可换 Redis）和短码生成方式；`tasks.md` 拆成 2–5 分钟的小任务（建骨架 → 数据模型 → 创建接口 → 跳转接口 → 幂等查重 → 错误处理）。

**第 3 步：人审 → 实现 → 归档**

读 specs 确认边界无误，然后：

```text
/opsx:apply    # AI 按 tasks 逐项实现
/opsx:archive  # 归档，specs 沉淀为「现状」
```

全程约 20 分钟（含写 spec）。产物不止是能跑的代码，还有一份随时可查、可作为下次开发上下文的 spec。

### 6.2 老系统实战：给老 Express 后端加操作审计日志

更真实的场景：一个跑了两年、没文档的 Express 后端，现在出于合规要求，要给关键接口加「操作审计日志」——记录谁、在什么时间、做了什么操作。难点在于审计要横切几乎所有老模块（订单、库存、用户…），而你不完全记得它们当初是怎么组织的。

**第 1 步：先立规矩（一次性，轻量）**

在项目根写 `AGENTS.md`，只立游戏规则，不写任何功能：

```markdown
# 项目约束
## 技术栈
- Node.js 18 + Express 4 + Sequelize (MySQL)
- 测试：Jest + Supertest
## 目录约定
- 路由 routes/，控制器 controllers/，模型 models/，业务逻辑 services/
## 禁区
- 不动 payment/ 目录，支付逻辑由专人维护
- 数据库迁移必须可回滚，不允许手改表结构
## 规范
- 新接口必须有错误处理中间件兜底
- 涉及金额一律用整数分，不用浮点
```

这让 AI 后续每次干活都有统一约束，不用每次靠 prompt 临时交代。

**第 2 步：新功能走完整 SDD，但碰老模块前先反推 spec**

审计日志是新功能，但它要给大量老接口「加壳」——这是老系统最容易出问题的地方。先让 AI 摸清老的中间件和路由结构：

```text
请阅读 app.js 和 routes/ 下所有路由文件，
反推当前的中间件链和接口清单，写成一份现状 spec，
重点关注：全局中间件的执行顺序、鉴权挂在哪一层、哪些接口已有后置处理。
```

AI 读完代码产出一份「接口与中间件现状 spec」。你在它上面明确「审计点统一挂在鉴权之后的哪一层、记哪些字段、绝不侵入业务控制器」。新功能的 spec 于是建立在对老代码的真实理解上，而不是凭印象——也避免了到处手改接口。

**第 3 步：实现 + 顺手沉淀文档**

```text
/opsx:apply
/opsx:archive
```

这一刻你不仅交付了审计功能，还顺手给老路由和中间件留下了一份接口清单文档——下次再有人碰全局架构，不用从头读代码。

**老系统实战的要点**：核心不是「补全 spec」，而是**改动驱动**——碰哪里补哪里。审计日志横切了多个老模块，就趁机把它们的接口现状一次性摸清并沉淀下来。两年后回头看，spec 覆盖的部分越来越多，没覆盖的逐渐被重构替代。一次不用停业务的温和迁移。

## 七、怎么选：一张决策表

把前文的所有信息压缩成一张表：

| 你的情况 | 推荐 | 理由 |
| --- | --- | --- |
| 独立开发者，老项目想加 spec | **OpenSpec** | 轻量、brownfield 友好、不换工具 |
| 新项目，想要最强自动化 | **Kiro** | EARS + Wave 并发，开箱即用 |
| 团队要标准化、用 GitHub 生态 | **Spec Kit** | 官方背书、agent 无关、流程严谨 |
| 正经写有测试的代码，要质量 | **Superpowers** | 强制 TDD、subagent 派发、自主执行 |
| 内容/文档/配置类项目 | **OpenSpec** 或都不用 | 强制 TDD 的工具不适用 |
| 既要管 spec，又要执行纪律 | **OpenSpec + Superpowers** | 两层叠加，互不冲突 |

最后两行尤其重要：

- **内容/配置类项目**（比如这个 Hexo 博客），强制 TDD 的 Superpowers 和 EARS 需求的 Kiro 都不合适——没有「测试」可言。对这类项目，用 OpenSpec 的 proposal 思路管理「要写哪篇、大纲是什么」就够，或者干脆用 Superpowers 的 `brainstorming` skill 打磨选题，不必上完整 SDD。
- **组合玩法**是进阶选项，下一节展开。

## 八、组合玩法：规范层 + 执行层

既然是两层，就可以叠加。最经典的组合是 **OpenSpec（管 spec）+ Superpowers（管执行）**。

```text
┌─────────────────────────────────────────┐
│  OpenSpec：决定做什么、怎么做            │
│  产出 proposal / specs / design / tasks │
└──────────────────┬──────────────────────┘
                   │ tasks 交给 AI 实现
                   ▼
┌─────────────────────────────────────────┐
│  Superpowers：决定怎么按规范干活        │
│  自动 worktree → TDD → subagent → review│
└─────────────────────────────────────────┘
```

OpenSpec 负责「想清楚并文档化」，Superpowers 负责「严格按文档执行」。两者职责清晰，不会打架——Superpowers 不排斥外部 spec，它只是确保 AI 在执行时遵守纪律。

另一个常见组合是 **Kiro（内置 spec）+ 手工借用 Superpowers 的 TDD skill**。因为 Kiro 自己已经有一套 spec 体系，通常单用就够，但如果觉得它的执行纪律不够硬，可以把 Superpowers 的 TDD 工作流嫁接过来。

## 九、实战避坑

最后是几条落地时最容易踩的坑。

**坑一：一上来就追求完美 spec。**
Spec 是活的，会随需求演进。第一版 spec 写粗一点没关系，关键是先把闭环跑通。等你用了一两周，自然知道哪些地方该写细。

**坑二：spec 不进 git。**
spec 必须和代码一起版本管理。OpenSpec 和 Spec Kit 都把 spec 放在仓库里，这是它们的刻意设计。spec 进 git，意味着每次需求变更都有 commit 记录，可追溯、可 review、可在新对话里直接接上。

**坑三：把 SDD 当 waterfall。**
有人误以为「先写完所有 spec 再实现」就是 SDD。错。SDD 是**迭代**的：spec → 实现 → 发现 spec 不对 → 改 spec → 再实现。OpenSpec 的哲学就是「fluid not rigid, iterative not waterfall」。别为了「流程正确」而拒绝在实现中回头改 spec。

**坑四：spec 写完就再也不更新。**
spec 不是一次性文档。需求变了，spec 要先变，代码再跟着变。如果发现代码和 spec 对不上了，先问「是 spec 过时了，还是代码跑偏了」，而不是默认代码永远对。

**坑五：盲目上 Superpowers 的强制 TDD。**
强制 TDD 是 Superpowers 的灵魂，也是它最挑场景的地方。脚本工具、配置文件、文档项目都没有有意义的「测试」，强行 TDD 只会徒增痛苦。Superpowers 是给「有测试的代码项目」准备的，用错了会变成负担。

**坑六：把 spec 写成需求堆砌。**
spec 不是把功能列表抄一遍，而是定义行为、边界和约束。一个常见的反面写法：

```text
# 坏 spec
实现登录功能：用户输入账号密码，点登录，成功就进首页。
```

这和直接跟 AI 说话没区别，没有沉淀任何思考。好的 spec 要写出触发条件、规则、边界和返回，让 AI 没有自由发挥的歧义：

```text
# 好 spec
## 登录
- 触发：POST /api/login，body: { account, password }
- 规则：
  - account 支持邮箱或用户名
  - 密码错误连续 5 次，锁定该账号 15 分钟
- 成功返回：{ token, expiresIn: 7200 }
- 失败返回：401 + { code: "INVALID_CREDENTIALS" }
- 边界：account 或 password 为空 → 400
```

判断一份 spec 好不好的简单标准：**把它交给一个完全不了解项目的人（或新开一个对话的 AI），他能不能照着实现而不需要再问你**。能，就是好 spec；不能，就是需求堆砌。

## 十、结语

回到上一篇文章的核心结论：**Spec Coding 的价值不是产出一份文档，而是逼着你在写代码之前想清楚。**

工具要解决的，是让「想清楚」这件事可持续——spec 写在哪、怎么管、怎么不变成一次性废纸、怎么让 AI 真的按它干活。

具体到行动，记住文章开头那个分层：**项目卡在「想不清楚」，补规范层；卡在「AI 不按规矩干」，补执行层。** 大多数项目，补好规范层就能解决八成问题，执行层是给追求极致质量的人准备的进阶选项。

但工具再好，它们降低的只是「落地的门槛」，不是「思考的责任」。选对工具，能让你把更多精力花在真正难的部分——把需求想清楚、把边界定义好、把异常情况考虑全。

说到底，**工具是脚手架，思考才是那栋楼。** 真正的技能不是选对工具，而是知道什么时候该把规范写细，什么时候该让它保持轻量。
