---
title: Loop 与 Graph Engineering：AI Agent 编排范式演进与实战
date: 2026-08-01 14:32:15
tags: [AI, Claude Code, Codex, Agent编排, 工作流, Graph Engineering]
keywords: Loop Engineering, Graph Engineering, AI Agent, Claude Code Workflow, Codex子代理, graph-max, Symphony, 多Agent编排
---
# Loop 与 Graph Engineering：AI Agent 编排范式演进与实战

读完这篇你能拿到什么：**一个能分辨 Loop / Graph Engineering 真假的坐标系** + **四篇可直接套用的实战**（Claude Code 并行审计 / Codex 多视角 Code Review / 两种「改到全绿为止」的闭环）。<!--more-->

2026 年，Addy Osmani 把「盖在 Agent ReAct 循环之上」的工程（自动找活、派活、验收、记状态）命名为 **Loop Engineering**；紧接着又冒出 **Graph Engineering**，主张把步骤打开成可编排的图。这两个词在 X 上几周刷屏，也伴随大量噪音甚至假消息。

但如果你去看 Anthropic、OpenAI、Google、LangChain 的官方文档，会发现它们**没有统一采用社区所说的 Prompt → Context → Loop → Graph 演进叙事**，而是用同一组更本质的概念。所以本文不只讲社区新词，更帮你建立业界通用的坐标系，然后落到 Claude Code 和 Codex 里一个能真正跑起来的最小工作流。

> 本文概念部分依据 2026 年公开资料，命令部分依据 `code.claude.com` 官方文档与大公司一手文档（Anthropic / OpenAI / Google ADK / LangChain / Codex）。Loop/Graph Engineering 是很新的社群提法，迭代极快，请以文末官方来源为准。文中明确区分「官方能力」「社群技巧」「外部规范」，避免把不存在的东西当成命令。

## 先建立坐标系：两个正交维度，不是一条对应关系

社区爱造词（Prompt → Context → Loop → Graph Engineering），但四大公司/框架的官方文档里，核心其实是**两个正交维度**，别把它们揉成一条对应关系。

**维度一：决策归属——控制流归谁？**

| 来源 | 「用代码定义控制流」那端 | 「交给 LLM 自主决定」那端 |
| --- | --- | --- |
| **Anthropic** | **workflows**（预定义代码路径编排 LLM 和工具） | **agents**（LLM 动态指挥自己的过程） |
| **OpenAI Agents SDK** | **orchestrating via code** | **orchestrating via LLM** |
| **Google ADK** | **workflow agents**（1.x：Sequential / Parallel / Loop；**2.0 起主线转向 graph-based / dynamic workflows**，模板保留为 Template workflows） | **LlmAgent transfer**（动态路由） |

**维度二:拓扑结构——长什么样?**

> 按结构丰富度，从简到繁：**单步 → Loop（带环）→ Graph（多节点 + 边 + 状态）**。⚠️ 这是"结构复杂度"的排序，**不是"前后替代"**——Loop 本身就是一种带环图，Graph 并不是 Loop 的下一代（后文会展开：loop ⊂ graph）。

**这两个维度是正交的，不能划等号。** LangGraph 官方原话："each node sits at a different point on the deterministic-to-agentic scale"（每个节点都在「确定性→自主」这条频谱上有自己的位置）——也就是说，**同一张图里，有的节点用代码、有的节点放 LLM，确定性是 per-node 的属性，和图拓扑相互独立**。

这点特别重要，因为社区（包括早期版本的本文）常犯一个错：把「graph engineering ≈ workflows（代码端）」「loop engineering ≈ agents（LLM 端）」直接等同。**这是不对的**：

- **loop 既可由 LLM 驱动（自主 agent），也可纯代码**——Google ADK 1.x 把 `Loop` 明确归为 workflow agent（代码端，2.0 里归入 Template workflows）；OpenAI 把 "while loop + evaluator" 归入 orchestrating via code；CI 里的固定重试脚本也是纯代码 loop。
- **graph 也可以由 LLM 动态路由**——LangGraph 的 `Send`、Supervisor 运行时选 worker、OpenAI 的 handoffs，都是 LLM 决定图内下一步走哪。
- 所以别把 graph 和「代码端」、loop 和「LLM 端」绑死——**两个维度正交，同一张图里可以混用，loop 也能纯代码**。

选型原则（Anthropic）："we recommend finding the simplest solution possible, and only increasing complexity when needed"（先用最简方案，按需加复杂度）——**这可能意味着根本不该上 agent 或 graph**。

**一张图看懂「正交」**（横轴 = 控制流归谁，纵轴 = 拓扑复杂度）：

```
                  代码定义控制流                LLM 自主决定
              ┌──────────────────────┬──────────────────────────┐
  Graph       │ Claude Dynamic       │ LangGraph Supervisor     │
  (多节点+边) │ Workflows 脚本       │ 运行时选 worker           │
              │ Google ADK 2.0 图    │ OpenAI handoffs          │
              ├──────────────────────┼──────────────────────────┤
  Loop        │ CI 重试脚本          │ Claude Code / Codex      │
  (带环)      │ ADK 1.x LoopAgent    │ 单 Agent ReAct 循环       │
              │ evaluator-optimizer  │ /goal 驱动闭环            │
              ├──────────────────────┼──────────────────────────┤
  单步        │ prompt chaining      │ 单次 LLM 调用             │
              │ 简单 routing         │                          │
              └──────────────────────┴──────────────────────────┘
```

> 每个格子里的工具只是举例，重点看**两个维度各自独立**——你可以在任意一个格子里找到适合你任务的方案。

## 一条社区叙事：从 Prompt 到 Graph（了解即可）

社区用四个阶段概括演进（完整谱系里还夹着一个 "harness engineering"，本文从略）。**先说明：这是社群叙事，不是学术共识**，定位用。

| 阶段 | 时间 | 你在优化什么 |
| --- | --- | --- |
| Prompt Engineering | 2023 | 一句话的表达 |
| Context Engineering | 2025 | 把上下文窗口塞对（RAG、系统提示、few-shot） |
| Loop Engineering | 2026 | 把循环工程化（反馈循环 + 终止条件 + 错误处理） |
| Graph Engineering | 2026 | 把循环打开成可编排的图 |

这里必须诚实交代，对你判断信息质量很重要：

> 「Loop Engineering」「Graph Engineering」是 X 上的社群流行词，迭代极快、伴随噪音（社区对 "graph" 一度给出**四种**互相竞争的定义；还出现过一条伪造的「graph engineering 已在某机构**取代 RAG、准确率 +18%、成本 −85%**」假数据——后被辟谣：数字其实出自一篇把 GraphRAG 用于工业图纸的论文，与编排图无关），甚至有文章调侃「Loop Engineering 只活了六周」就被取代。

所以这两个词目前**不是 RAG、ReAct 那种稳固术语**。LangChain 官方博客自己都说：Graph Engineering「不是新主意，是一项成熟实践的最新名字」——他们用 LangGraph 做这件事已经三年。

## Loop Engineering：Goal → Evaluator → Loop → Termination

### 先分清两层 loop（全文最容易混的地方）

读下去之前先记住 **"loop" 有两层**，本文反复在防的就是把它俩混成一个：

- **内层 = Agent 自己的工具调用循环（ReAct）**：Reason（想下一步）→ Act（调工具/写代码）→ Observe（读结果）→ Repeat。这是单个 Agent 在 harness 里干活的循环，Claude Code、Codex CLI 底层都是它。Anthropic 对 agent 的定义就是「在循环里用工具、根据反馈行动的 LLM」。
- **外层 = Loop Engineering**（Osmani 2026 的提法）：它**坐在 harness 上一层**——自动发现/调度任务、开 worktree 隔离并行、用 skills 沉淀项目知识、派 sub-agent、把状态持久化到对话之外、再用一个独立小模型做「达标验收」（即 `/goal`）。一句话：**内层是"一个 agent 怎么干活"，外层是"谁来派活、怎么验收、状态记哪"**。

> 下面这套 Goal→Evaluator→Loop→Termination 四层模型，是用来分析**外层执行闭环**的骨架——它不是 Loop Engineering 的完整定义（完整版还含任务发现、调度、worktree、skills、状态等，见 Osmani 原文），更不是内层 ReAct 循环。把它当分析工具，别当标准分类。

### 四层模型（别把 goal 和 termination 混成一个）

一个工程化 loop 的核心是四层（**本文归纳的模型**，不是哪家官方标准分类），**不要把 goal 和 termination 混在一起**：

> **Goal（期望状态：什么叫完成）→ Evaluator（评估闸门：用证据检验是否达标，如 pytest 退出码）→ Loop（未达标就继续）→ Termination（停止规则：成功达标 / 预算耗尽 / 阻塞 / 暂停 / 人工中断）**

`tools`、`context`、`errors` 是配套维度。注意 Goal 和 Termination 是两件事：Goal 是「想要什么」（如「所有 pytest 通过 + ruff 无报错」），Termination 是「什么时候停」（达标停 / 跑满 N 轮停 / 连续无进展停）。

- 好 Goal：「所有 pytest 通过 + ruff 无报错」（可评估）
- 坏 Goal：「让 app 更好」（无法判断达标 → 死循环或乱停）

**这套外层闭环不是抽象理论——Claude Code 和 Codex 都给了产品原语 `/goal`**：

- **Claude `/goal`**：设一个完成条件，每轮由一个小快模型（默认 Haiku）评估是否满足，未满足就再起一轮、满足才自动清除，底层是 session 级 Stop hook。注意：这个评估器**不调工具、不读文件**，只能根据主 agent 已经写进对话的证据判断——所以条件要写成「agent 自己的输出能证明」的形式。它覆盖了 Goal + Evaluator + Termination。
- **Codex `/goal`**：同样提供官方 `/goal`（`/goal <objective>` 设置、`/goal` 查看、`/goal pause` / `resume` / `clear`，目标最长 4000 字符），把「持久化目标」做成能力。

所以 `/goal` 是**支撑"持续验收循环"的产品原语**——但它**只是外层 Loop Engineering 的一个部件，不等于完整 Loop Engineering**（完整版还含调度、worktree、状态等），更不是内层 ReAct 循环。

### Loop Engineering 的完整画面（不只是 Goal→Evaluator→Loop→Termination）

上面的四层模型只抓了 Loop Engineering 的**验收闭环**。Osmani 原文还有更大的一层意思——**你的角色变了**：

> 你不再是「坐在聊天框前逐条输入的人」，而是「设计一个自动化系统的人」——谁来发现任务、谁来执行、谁来验收、状态存哪、失败怎么恢复，这些都是你要设计的。

这个身份转变落到工具里，体现为三层能力（四层模型只覆盖了第二层）：

| 层 | 你在设计什么 | Claude Code 对应 | Codex 对应 |
| --- | --- | --- | --- |
| **任务发现** | 谁来找到要做的事？ | `/loop`（定时轮询：每隔 N 分钟跑一遍提示词，如「检查 CI 状态并修失败项」） | Symphony（外部开源规范，非 Codex 内置；从 Linear 拉 issue 自动分派） |
| **验收闭环** | 怎么判断做完了？失败怎么重试？ | `/goal`（Haiku 评估 + Stop hook） + Dynamic Workflows 的 gate agent | `/goal`（持久化目标 + 自动循环） |
| **状态持久化** | 做过的事怎么记住、下次怎么复用？ | `.claude/workflows/` 存脚本 → `/命令` 复用；worktree 隔离并行；skills 沉淀项目知识（`CLAUDE.md`） | `.codex/agents/*.toml` 角色级复用；app-server 状态层（关终端目标不丢） |

一句话：**Loop Engineering 的核心不是 `for` 循环本身，而是「把人从循环里拿出来，让系统自己转」**——任务发现、验收闭环、状态持久化是它的三根支柱，`/goal` 只是其中验收那根。

> 辨析三个容易混的命令：Claude `/loop`（bundled Skill）是**按时间间隔反复跑提示词**（定时调度，对应上表「任务发现」层，和 Loop Engineering 方法论不是一回事；省略间隔时，Anthropic API 上 Claude 会自适应步频 1 分–1 小时，但 Bedrock / Vertex AI / Microsoft Foundry 上是固定 10 分钟）；Codex 没有官方 `/loop`；`/goal`（两端都有）才是状态驱动的「设目标、持续对齐」，对应「验收闭环」层。别把方法论和命令搞混。

### 一个最小闭环骨架

```python
# 数据流伪代码：重点看 GOAL、评估器输出、错误如何回流到下一轮
MAX_ITER = 8
NO_PROGRESS_LIMIT = 3      # 连续 N 轮无进展即提前停，别硬烧到 MAX_ITER
GOAL = "所有单元测试通过，且 ruff 检查无报错。"

def run_tests():
    # 评估器 = Goal 的 verification surface：必须和 GOAL 一一对应（这里即 pytest + ruff）
    # return passed: bool, feedback: str（把 stdout/stderr 都带上，别只看退出码）
    ...

def agent_step(goal, last_feedback):
    # 一轮 LLM 调用：把 Goal 和上一次的失败反馈都喂进去，给出修复补丁
    # return patch: str | None（给不出补丁就返回 None）
    ...

def loop():
    # 先评估一次：项目可能已经达标，就别动它（避免无谓修改）
    passed, feedback = run_tests()
    if passed:
        print(f"✓ {GOAL}（开始前已达标，无需修改）")
        return

    last_feedback = feedback
    no_progress = 0
    for i in range(1, MAX_ITER + 1):
        patch = agent_step(GOAL, last_feedback)     # 把 Goal + 上一轮反馈喂进去
        if not patch:                                 # 分支：agent 给不出补丁
            print(f"✗ 第 {i} 轮无补丁，升级人工处理")
            return
        try:
            apply_patch(patch)                        # 把补丁写回项目（git apply / 写文件）
        except Exception as e:                        # 分支：补丁应用失败，别崩，把错误喂回去
            last_feedback = f"补丁应用失败：{e}"
            continue
        passed, feedback = run_tests()                # Evaluator：客观闸门
        if passed:                                    # Termination：成功达标
            print(f"✓ {GOAL}（第 {i} 轮达标）")
            return
        if feedback == last_feedback:                 # Termination：连续无进展
            no_progress += 1
            if no_progress >= NO_PROGRESS_LIMIT:
                print(f"✗ 连续 {NO_PROGRESS_LIMIT} 轮无进展，提前升级人工处理")
                return
        else:
            no_progress = 0
        last_feedback = feedback
    print(f"✗ {MAX_ITER} 轮预算耗尽，升级人工处理")    # Termination：预算耗尽
```

> **这段骨架和实战三的关系**：上面是**语言无关的抽象**（Python 伪代码），实战三的 `fix-until-green.js` 是它**在 Claude Dynamic Workflows 里的落地实现**——变量名刻意对齐（`MAX_ITER=8`、`NO_PROGRESS_LIMIT=3`），方便你对照看。如果你直接用 Claude Code，跳到实战三拿 JS 脚本跑即可。

关键不是循环本身，而是 **Evaluator（评估闸门）和 Termination（停止规则）**——这两样决定 loop 是「可靠自动化」还是「烧 token 的死循环」。生产默认 **closed first**（这里 closed 指「约束先于探索」，不是控制理论的 closed-loop）：先把目标、闸门、终止都定义死跑稳，再逐步放开探索空间。

## Graph Engineering：显式控制流，不只是并行

### 本质是「显式编码控制流」，不是「并行」

很多人以为 graph 相对 loop 的本质区别是「并行」。**这是被社区文带偏的表述**。LangChain 官方把 graph 的本质讲得很清楚：

> "representing agentic systems as graphs... lets you **impose your preconceptions of how the system should work into more constrained paths**, not relying solely on the judgement of the LLM"
> （把 agent 系统建模成图，能让你把"系统该怎么跑"的预判编码进更受约束的路径，而不是全靠 LLM 当场判断）

graph 的本质是：**把控制流显式化（节点 + 边 + 状态），让你在想要确定性的地方用代码、在想要灵活性的地方放 LLM/agent**。LangGraph 自己说的核心价值就是「确定性路径与自主步骤之间的平衡」。**并行只是 graph 支持的一种拓扑，不是它的本质。**

### loop 不是被 graph「取代」，是 graph 的特例

> 先界定一下 graph 的两层含义，免得和前面"拓扑阶梯"打架：下文取**广义 graph**（任何"节点 + 边 + 环"），所以 loop 是它的特例；前文拓扑轴里的 "graph" 取**狭义**（多节点富结构）。两者并不冲突。

LangChain 官方有一句金句，建议直接记下：

> "**Loop engineering isn't an alternative to graphs, so much as a simple version of them. As David Khourshid put it, a loop is just a directed, cyclic graph.**"
> （loop engineering 不是 graph 的替代品，而是它的一个简单版本。一个 loop，就是一个有向的、带环的图——后半句是 LangChain 引 David Khourshid 的话。）

也就是说 **loop ⊂ graph**。这也解释了一个反直觉的事实——**生产级的 agent 图通常不是 DAG**（LangGraph 官方原话："agent graphs are usually not DAGs"），因为重试、追问、修订都需要循环。

### 并行只是 graph 的一种模式

并行确实是 graph 带来的一个高价值能力，但要摆正位置：

- **Anthropic** 把 parallelization 列为五种 workflow 模式之一（另四种：prompt chaining、routing、orchestrator-workers、evaluator-optimizer），且并行分两种——**sectioning**（拆成独立子任务并行）和 **voting**（同一任务跑多次，取多样化输出/投票裁决）
- **OpenAI Agents SDK** 把「用 `asyncio.gather` 并行跑多个 agent」列为 "orchestrating via code" 的常见模式之一——**这意味着并行用朴素 Python 原语就能做，不必上 graph 框架**（其主页亦强调 "Python-first, rather than needing to learn new abstractions"）
- 所以「并行」不等于「graph」，并行用最朴素的代码就能做

### fan-out 不等于闭环

这里要区分两种 graph 形态，**别混**：

- **一次性 fan-out（map-reduce）**：派多个 agent 各做一件事 → 汇总。没有反馈边、没有客观通过条件。Claude Code 官方文档把它单列为一种 shape（"Audit many files for the same issue"）。
- **带反馈的闭环**：跑 checker → 修失败项 → 重复，直到通过或停止进展（Claude Code 官方另一种 shape："Keep fixing until a check passes"）。这才需要客观 gate + 停止规则。

实战一、实战二都是**前者（fan-out 单趟）**，不是闭环——这点先说清楚，免得你误以为并行审查就等于"验证闭环"；想要闭环见实战三（Claude）/ 实战四（Codex）。

### 别把 agent 当僵化节点（多个实践的一致忠告）

graph 的"新"主要新在**节点里能放什么**：早期节点是确定性代码或单次 LLM 调用，现在模型够可靠了，**一个节点可以是一整个带内部循环的 agent**（LangGraph 原话："what's changed is what you can put inside a node"——出自其"What's actually new"小节）。

但多个实践都给了同一个反向警告——**别把 agent 当成状态机里僵化的节点**：

- **OpenAI Symphony 团队**："treating agents as rigid nodes in a state machine doesn't work well... So we eventually moved toward giving agents **objectives** instead of strict transitions"（给目标，而不是严格转移）
- **LangGraph**：有些任务天生 agentic，硬塞进确定性路径是错的。深度研究就是例子——LangChain 自己的 deep research 从预定义工作流改成了 agentic 核心循环，GPT Researcher 也做了同样迁移

**结论**：graph 的价值是「该确定的地方确定、该自主的地方自主」，不是「把一切锁死成图」。

### 两层含义别混

社群里「graph」还混了另一个完全不同的东西，写文章和选型要分清：

| 层 | 节点是什么 | 强调 | 对应工具 |
| --- | --- | --- | --- |
| **编排图**（本文讲的就是这层） | agent 或步骤 | 控制流、并行、状态 | LangGraph、Claude Code dynamic workflows、Google ADK workflow agents、OpenAI Agents SDK |
| **知识图谱 / GraphRAG** | 实体 | 关系存储、多跳推理 | Zep Graphiti、GraphRAG |

## 实战总览

四篇实战覆盖两种 shape：**fan-out**（实战一 Claude / 实战二 Codex）和**闭环**（实战三 Claude / 实战四 Codex）。按你的任务选：

| 你的任务 | 「每个」单元 / 形态 | 看哪篇 |
| --- | --- | --- |
| 后端：上线前查接口鉴权 | 每个路由文件 | **实战一**：Claude fan-out 审计 |
| 前端：给 PR 做多维 Code Review | 每个关注点（a11y / 性能 / 状态） | **实战二**：Codex subagents |
| 把 failing tests / lint 改到全绿 | 每轮失败项（带反馈边） | **实战三**（Claude workflow）/ **实战四**（Codex `/goal`）|
| 前端：全站补 loading / error 态 | 每个 page / 组件文件 | 套实战一，换目录与检查项 |
| 后端：批量补接口入参校验 | 每个 controller | 同上 |
| 任意：批量迁移（Options→Composition API、JS→TS、补单测） | 每个文件 | fan-out 每文件改；改完套实战三/四闭环兜底 |

> 判断你能不能套 fan-out：**把任务说成「对每个 X 做 Y」说得通就用**；说不通（任务是一条链、前后依赖）那就用 prompt chaining 或闭环（实战三），别硬并行。

> **触发语 `use a workflow to` 是什么**：下面四篇实战的触发语都以 `use a workflow to …` 开头——这是 Claude Code [官方文档](https://code.claude.com/docs/en/workflows)点名的**自然语言激活说法**（原话：*"Asking in your own words, for example 'use a workflow' or 'run a workflow', also works"*），和 `ultracode` 关键字、`/effort ultracode` 三者等效。它让 Claude 去写并跑一段 fan-out / 闭环的编排脚本，而不是单 agent 顺着做；**不写它（又不换 `ultracode`），就退回普通单 agent 任务**，并行/闭环跑不起来。另外它**只对你本人键入的输入生效**，对 `-p` / 定时任务 / webhook 不触发（v2.1.160 前的触发关键字是 `workflow`，自然语言说法两个版本都行）。

### 日常场景速查：Vue / Element UI 项目怎么套

后文四篇实战涉及 Node/Express、React + TS 和 Python。如果你的项目是 **Vue 2 + Element UI**（或类似的企业中后台系统），下面先给出三个最常见的日常场景和对应触发语，直接复制改两个词就能跑：

**场景 A：全站补 loading / error 态**（套实战一的 fan-out）

```
use a workflow to 扫描 src/views/ 下所有 .vue 文件，检查每个组件里的 API 调用
（axios / this.$http / request）是否都有 loading 态（如 v-loading 或 loading 变量）
和 error 处理（catch / .catch / try-catch）。
输出每个缺失项的文件路径、行号、缺失类型（缺 loading / 缺 error / 都缺）。
这是只读审计，不得修改或创建任何文件。
```

**场景 B：批量 Options API → Composition API 迁移**（fan-out 改 + 闭环兜底）

```
# 第一步：fan-out 每文件改
use a workflow to 把 src/views/opticianManagement/ 下每个 .vue 文件
从 Options API 迁移到 Composition API（setup + ref/reactive/computed），
保持功能不变，不改 template 结构。

# 第二步：闭环兜底（改完后跑）
use a workflow to 反复跑 npm run build，把编译报错改到零为止；
连续 3 轮报错没变化或满 8 轮就停。
```

**场景 C：PR 提交前检查 Element UI 用法规范**（套实战二的多视角审查，把 TOML 里的 React 检查项换成 Vue 的）

```toml
# .codex/agents/vue_reviewer.toml
name                   = "vue_reviewer"
description            = "只读 Vue 2 审查 Agent，检查 Element UI 用法与组件规范。"
sandbox_mode           = "read-only"
developer_instructions = """
你是只读 Vue 2 审查 Agent，只看本 PR 改动的 .vue 文件。
检查：el-form 是否有 :rules 校验、el-table 大数据是否分页或虚拟滚动、
v-for 是否带 :key、组件是否缺 name 属性、$refs 操作是否在 $nextTick 内。
输出按 Critical/High/Medium/Low 排序，每条带文件路径、行号、建议。
"""
```

> 核心逻辑不变——fan-out 就是「对每个 .vue 文件做 Y」，闭环就是「跑 `npm run build` 改到零报错」——**只换触发语里的目录、检查项、命令名**，脚本结构（schema / gate / termination）完全复用。

## 实战一：Claude Code 并行审计工作流（fan-out + 对抗式复核）

Claude Code 把「编排图」做成了官方能力，叫 **Dynamic Workflows（动态工作流）**：让 Claude 写一段 JavaScript 脚本，由后台运行时执行，脚本自己持有循环、分支和中间结果。**它没有 `/graph` 命令**——workflows 就是它的 graph 形态。

> **能力可信度：官方确认。** 命令、版本、限制均来自 `code.claude.com/docs/en/workflows`。

**场景**：Node/Express 或 Python/FastAPI 服务上线前，查 `src/routes/` 下几十个接口有没有鉴权——装饰器、中间件、路由分组写法五花八门，正则容易漏，让 agent 真去读代码再交叉复核。

**形状**（两趟 fan-out，无环；带环的闭环见实战三）：

```
列文件 → ① 每文件 1 agent 审计 → 收集 findings
       → ② 每条发现 1 agent 对抗复核 → 三态裁决
       → 汇总：confirmed 留 / refuted 丢 / unverified 留痕交人工
```

**适合什么任务**：能说成「对每个 X 做独立的只读检查 + 交叉复核」的批量审查（接口鉴权、a11y、硬编码、依赖漏洞…）。

**跑起来**：

- [ ] Claude Code ≥ v2.1.154，`/config` 里 **Dynamic workflows** 已开
- [ ] 切到**干净 worktree**（子 agent 固定 `acceptEdits`、改动自动批准——无论你会话什么模式）
- [ ] 贴触发语：
  ```
  use a workflow to 审计 src/routes/ 下每个 API 端点是否缺少鉴权检查，
  并对每条发现做对抗式复核后再报告。这是只读审计，不得修改或创建任何文件。
  ```
  （含 `ultracode` 关键字也行；v2.1.160 前是 `workflow`，只对你本人键入生效，不对 `-p`/定时/webhook 生效）
- [ ] 看 planned phases → **Yes, run it**（Auto 仅首次弹、`ultracode` 会话跳过、`claude -p`/Bypass/Agent SDK 从不弹）
- [ ] `/workflows` 跟进度：`↑↓` 选 phase、`Enter` 钻入、`p` 暂停、`x` 停
- [ ] 拿报告：每条带 **路径/行号/影响/置信度**，复核分 **confirmed / unverified** 两栏（refuted 静默丢弃；复核本身超时/限流的发现进 unverified 留人工，不被当成「不成立」）
- [ ] 满意 → `/workflows` 选中按 `s`，存到 `.claude/workflows/`（项目级）或 `~/.claude/workflows/`（个人级），变成 `/audit-auth` 下次复用

**你会拿到什么**（报告节选）：

```
confirmed:
  • src/routes/user.ts:14   GET /api/users   无鉴权——任何人可拉全量用户
    severity: Critical   confidence: 0.9
    evidence: 该 handler 未挂 auth 中间件（紧邻的 /api/orders 却挂了）
unverified:
  • src/routes/order.ts:8   对抗复核超时，需人工再看一眼
```

**套到你项目**：把 `src/routes/` 换成你的路由目录，把「鉴权」换成你要查的（参数校验、SQL 注入、日志脱敏、敏感字段返回…）——触发语里改两个词就能跑。

**参考脚本**（两趟 fan-out + 三态裁决，完整版可折叠）：

<details>
<summary>展开看 audit-auth.js</summary>

```javascript
export const meta = {
  name: 'audit-auth',
  description: '审计每个路由处理器是否缺少鉴权检查',
}

// 结构化输出契约：脚本要消费的字段必须用 schema 约束，否则 agent 只返回纯文本
const FINDING_SCHEMA = {
  type: 'object', required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'file', 'line', 'description', 'impact', 'evidence', 'severity', 'confidence'],
        properties: {
          id: { type: 'string' },            // 供第二趟复核回引，别靠数组下标
          file: { type: 'string' },
          line: { type: 'number' },
          description: { type: 'string' },
          impact: { type: 'string' },        // 影响：与产出承诺对齐
          evidence: { type: 'string' },      // 证据：哪一行/哪个调用支撑这条结论
          severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
  },
}
// 三态裁决：技术失败(超时/限流/异常)必须落到 unverified，不能被当成"问题不成立"
const VERDICT_SCHEMA = {
  type: 'object', required: ['finding_id', 'status'],
  properties: {
    finding_id: { type: 'string' },
    status: { type: 'string', enum: ['confirmed', 'refuted', 'unverified'] },
    reason: { type: 'string' },
  },
}
const REPORT_SCHEMA = {
  type: 'object', required: ['summary', 'confirmed', 'unverified'],
  properties: {
    summary: { type: 'string' },
    confirmed: { type: 'array', items: { type: 'object' } },
    unverified: { type: 'array', items: { type: 'object' } },
  },
}

// 第一趟：列出文件；空结果要区分"没文件"还是"列举失败"，别生成"成功的空报告"
const found = await agent('列出 src/routes/ 下所有 .ts 文件。', {
  schema: { type: 'object', required: ['files'],
    properties: { files: { type: 'array', items: { type: 'string' } } } },
})
if (!found) return {
  summary: '路由文件列举失败，审计未执行',
  confirmed: [],
  unverified: [{ description: '文件列举 agent 未返回结果', why: 'agent 被停止或发生不可恢复错误' }],
}
if (!found.files.length) return { summary: '未找到 src/routes/*.ts，请确认目录', confirmed: [], unverified: [] }

const auditResults = await pipeline(found.files, file =>
  agent(`审计 ${file} 是否缺少鉴权检查。每条发现请给 id、file、line、description、impact、evidence、severity、confidence。`, { label: file, schema: FINDING_SCHEMA }))

// pipeline 会保留失败 agent 对应的 null；必须按下标回关联文件，不能 filter 后静默漏报
const audits = [], unverified = []
for (let i = 0; i < auditResults.length; i++) {
  const result = auditResults[i]
  const file = found.files[i]
  if (!result) {
    unverified.push({
      file,
      description: '该文件的审计 agent 未返回结果',
      impact: '该文件尚未完成鉴权审计',
      why: 'agent 被停止或发生不可恢复错误',
    })
    continue
  }
  audits.push(...result.findings)
}

// 第二趟：对每条发现做对抗式复核（独立 agent，默认怀疑）
const verified = await pipeline(audits, f =>
  agent(`对抗式复核：以下疑似缺失鉴权的发现是否成立？请尽力反驳；若你无法判断(缺信息/超时)，标 unverified。返回的 finding_id 要与该发现的 id 一致。${JSON.stringify(f)}`,
    { schema: VERDICT_SCHEMA }))

// 三态分流：confirmed 留，refuted 丢，unverified 单独留痕交人工（技术失败 ≠ 问题不成立）
const confirmed = []
for (let i = 0; i < verified.length; i++) {
  const verdict = verified[i]
  const finding = audits[i]   // pipeline 保持输入顺序，null 也占位
  if (!verdict || verdict.finding_id !== finding.id) {
    unverified.push({
      ...finding,
      why: verdict ? '复核结果无法关联原发现' : '复核 agent 未返回结果',
    })
    continue
  }
  if (verdict.status === 'confirmed') confirmed.push(finding)
  else if (verdict.status === 'unverified') unverified.push({ ...finding, why: verdict.reason })
}
return await agent(
  `汇总去重并按严重程度排序。confirmed=${JSON.stringify(confirmed)}；` +
  `另有 unverified（复核本身失败/未定，需人工看）=${JSON.stringify(unverified)}`,
  { schema: REPORT_SCHEMA })
```

</details>

**注意**：对抗复核是**质量增强不是客观闸门**，能降假阳性但不保证消除（也可能引入假阴性），不能替代测试或人工安全审；上限 16 并发 / 单次 1000 agent / 运行中不支持人工输入（要分阶段签字就拆成多个 workflow）；脚本本身无文件系统/shell 访问、只能通过 agent；超 25 agent 或预计 150 万 token 弹 `Large workflow` 警告（v2.1.203+，仅提醒），想省钱在 `/config` 选 `small`(<5) 的 size guideline。

## 实战二：Codex 官方 Subagents 并行审查

Codex CLI **没有内置 `/graph` 命令**，多 agent 能力是 subagent 路线。和实战一对照看：同样是 fan-out，这边并行的是「不同关注点」，每个关注点一个专职只读 reviewer。

> **能力可信度分级**：subagent + `/goal` = 官方确认；graph-max = 社群演示技巧；Symphony = 外部开源规范。

**场景**：一个 React + TypeScript 的 PR 改了十几个组件，Code Review 怕漏 a11y / 硬编码中文，又怕重渲染性能坑、状态边界没处理好。派三个专职只读 reviewer 并行看。

**形状**（三路并行 fan-out，无环）：

```
PR diff → ① a11y_reviewer  ② perf_reviewer  ③ state_reviewer  并行只读审查
       → 汇总去重 → 一份带路径/行号的清单
```

**适合什么任务**：同一产物（PR / 文档 / 设计）要从多个独立视角各审一遍、每个视角有自己的 checklist。

**跑起来**：

- [ ] 在 `.codex/agents/` 下放 3 个只读 reviewer 角色，都设 `sandbox_mode = "read-only"`（a11y / perf / state，TOML 见下方折叠）
- [ ] 在 `.codex/config.toml` 的 `[agents]` 表下配并发（`max_threads` 是 legacy alias，官方仍兼容）：
  ```toml
  [agents]
  max_concurrent_threads_per_session = 4
  ```
- [ ] **父 Codex 会话选 Read Only、别开 `--yolo`**——subagent 会继承父会话权限模式，父开 Full Auto 会削弱只读意图；提示词里的「只读」只是软约束，真隔离靠 `sandbox_mode` + 父会话权限
- [ ] 贴委派语（编排 spawn / 等待 / 汇总由 Codex 自身负责）：
  ```
  对当前 PR（本分支 vs main）改动的前端文件做只读 Code Review。为以下每个关注点
  各派一个 reviewer（a11y_reviewer / perf_reviewer / state_reviewer），等全部跑完
  再汇总去重，不改代码：1.可访问性与 i18n 2.渲染性能 3.状态与边界。
  ```
- [ ] 拿三路并行审查 + 汇总去重清单（每条带文件/行号）
- [ ] **验证 agent 确实加载了**：贴完委派语后，看 Codex 输出里是否出现类似 `spawning a11y_reviewer` / `perf_reviewer` / `state_reviewer` 的启动日志；如果没出现，检查 TOML 内的 `name` 是否和委派语里的角色名一致、项目是否处于 trusted 状态（文件名保持同名只是推荐约定）

**你会拿到什么**（汇总清单节选）：

```
a11y :  FormLogin.tsx:22   <input> 缺 aria-label                 High
perf :  UserList.tsx:40    1000 项列表未虚拟化，滚动卡顿           Medium
state:  OrderForm.tsx:15   请求中无 loading 态，用户无反馈          High
（去重后共 12 条，每条带文件/行号/建议/置信度）
```

**套到你项目**：把三个 reviewer 换成你关心的关注点——后端 PR 改成 security / logic / test，文档审查改成 准确性 / 完整性 / 语气，`.codex/agents/` 里改 TOML 即可。

<details>
<summary>展开看 a11y / perf / state 三个 reviewer 的 TOML</summary>

```toml
# .codex/agents/a11y_reviewer.toml
name                   = "a11y_reviewer"
description            = "只读前端审查 Agent，检查可访问性、键盘操作、以及硬编码中文（i18n）。"
sandbox_mode           = "read-only"   # 官方支持的 per-agent 覆盖项；只读审查靠它实现
developer_instructions = """
你是只读前端可访问性审查 Agent，只看本 PR 改动的前端文件。
检查：表单控件是否有 label/aria-label、交互能否键盘操作、图片是否有 alt、
是否有硬编码中文（应走 i18n 的 t()）。
输出按 Critical/High/Medium/Low 排序，每条带文件路径、行号、影响、建议、置信度。
没有发现问题时明确说明，不要凑数。
"""
```

```toml
# .codex/agents/perf_reviewer.toml
name                   = "perf_reviewer"
description            = "只读前端审查 Agent，检查重渲染与性能坑。"
sandbox_mode           = "read-only"
developer_instructions = """
你是只读前端性能审查 Agent，只看本 PR 改动的前端文件。
检查：缺少 memo/useMemo/useCallback 导致的重渲染、useEffect 依赖数组错误、
大列表未虚拟化、不必要的全量重算。
输出按 Critical/High/Medium/Low 排序，每条带文件路径、行号、影响、建议、置信度。
没有发现问题时明确说明，不要凑数。
"""
```

```toml
# .codex/agents/state_reviewer.toml
name                   = "state_reviewer"
description            = "只读前端审查 Agent，检查状态管理与边界。"
sandbox_mode           = "read-only"
developer_instructions = """
你是只读前端状态审查 Agent，只看本 PR 改动的前端文件。
检查：loading/error 态是否处理、竞态(过期请求/竞态条件)、未清理的订阅与定时器、
表单防重复提交。
输出按 Critical/High/Medium/Low 排序，每条带文件路径、行号、影响、建议、置信度。
没有发现问题时明确说明，不要凑数。
"""
```

</details>

**注意**：这是 fan-out 单趟、不是带客观 gate 的闭环；多同模型 agent 结论可能高度相关——是「帮你把容易漏的点先过一遍」，不是「替你签字合并」。`.codex/agents/*.toml` 定义的是**角色**（由父 Codex 依提示词 spawn），不是你要另写的脚本函数；换后端 PR 把三个角色改成 security / logic / test 即可。

**延伸（非步骤，了解即可）**：

- **Codex `/goal`**（官方）：给这次审查设个**可评估**的持久目标（达标后进入 `complete` 状态并停止自动续跑）。完整闭环实战见**实战四**——别只给约束，要给「三类审查均完成 + 汇总报告已生成」这种可验证终点。
- **graph-max**（社群演示技巧）：画一张工作流图 → 丢给 Codex → 即兴生成编排脚本并跑。轻量好玩，但**可复现性低**（原帖只说 "draw → send → run, it just works"，未涉及脚本提交/运行入口/失败处理；脚本随模型而变），不建议做稳定运行方式——要可执行编排走 Agents SDK（`asyncio.gather`）或 Codex App Server。
- **Symphony**（外部开源规范，Draft v1）：把 Linear issue tracker 当控制平面、任务组成 DAG 按依赖并行的 always-on 方案；Non-Goals **明确声明不做通用工作流引擎**，是窄域草案。官方数据「部分团队前三周 landed PR 增长约 500%」是 OpenAI 自报、无第三方验证。与 graph-max 同作者（Alex Kotliarskyi），可把 graph-max 理解为 Symphony 思想的轻量类比（本文类比解读，非官方定位）。

## 实战三：真正的闭环——改到检查通过为止（Claude workflow「keep fixing until a check passes」）

实战一、实战二都是 fan-out **单趟**（检查完就结束，没有反馈边）。这里补一个真正的**闭环**：跑客观检查 → 没过就派 agent 修 → 重跑，直到全绿或触发停止。它把 Loop Engineering 那节的 `Goal→Evaluator→Loop→Termination` 落到真实工具里，也验证 **loop ⊂ graph**——这个带「重试边」的 workflow 本身就是一张带环的图。

> **能力可信度：官方 shape。** Claude Code 官方文档列出的标准形态之一（"Keep fixing until a check passes"），和实战一同源（命令、版本、限制见 `code.claude.com/docs/en/workflows`）。

**场景**：Python 服务 CI 挂在十几个 ruff 告警 + 几个 pytest 失败上，逐个人改又烦又容易漏——让 workflow 自己改到绿，改不动再交人。

**形状**（带环，和实战一的无环对照）：

```
预检 gate ──已达标──→ 直接返回「无需修改」
        └─没过──→ 修 ─→ gate ─没过─→ 修 ─→ …（达标 / 连续无进展 / 预算耗尽 即停）
```

**适合什么任务**：有客观通过条件（测试 / lint / 编译）且修了能重验的任务；没有客观 gate 就别上闭环，会变「烧 token 的死循环」。

**四层模型对齐**（闭环的骨架）：

| 层 | 本例是什么 | 关键 |
| --- | --- | --- |
| **Goal** | ruff 无报错 + pytest 全通过 | 可评估 |
| **Evaluator** | 真跑 `ruff check .` + `pytest`（退出码 + stderr） | **客观闸门**，不是问 LLM「你觉得好了吗」 |
| **Loop** | 没过 → 把失败项喂给 agent 修（acceptEdits 直接写回）→ 重跑 | 失败反馈回流下一轮 |
| **Termination** | 达标停 / 连续 3 轮无进展停 / 满 8 轮停 | 三种停止规则都要有 |

**跑起来**：

- [ ] 切到**干净 worktree**（这个 workflow 会**改你的代码**，不是只读——和实战一不同）
- [ ] 贴触发语：
  ```
  use a workflow to 反复跑 ruff + pytest，把失败项改到全绿为止；连续 3 轮失败项没变化、
  或满 8 轮就停，把剩下的失败项列给我。跑完我会 git diff 逐项核对，别顺手重构无关代码。
  ```
- [ ] `/workflows` 跟进度——达标 / 连续无进展 / 预算耗尽时自动停并报告
- [ ] 拿结果后 **`git diff` 逐项核对**再提交

**参考脚本**（一个 `for` 循环 + 客观 gate + 三种停止；和 Loop Engineering 节的 Python 伪代码骨架**主干对应**——`run_tests()`→gate、`agent_step()`→修复 agent、`MAX_ITER=8` / `NO_PROGRESS_LIMIT=3` 连名字都一样，为求极简省掉了骨架的 `try/except` 与「给不出补丁就提前停」两分支）：

<details>
<summary>展开看 fix-until-green.js</summary>

```javascript
export const meta = {
  name: 'fix-until-green',
  description: '闭环：反复跑 ruff+pytest，派 agent 修失败项，直到全绿或预算耗尽',
}

const MAX_ITER = 8
const NO_PROGRESS_LIMIT = 3

// Evaluator 的结构化输出：必须返回客观结果，禁止 LLM 自评"我觉得好了"
const GATE_SCHEMA = {
  type: 'object', required: ['passed', 'failures'],
  properties: {
    passed: { type: 'boolean' },
    failures: {
      type: 'array',
      items: {
        type: 'object', required: ['file', 'line', 'message'],
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
}

const GATE_PROMPT = '执行 ruff check . 与 pytest，原样返回失败项（文件/行/规则码或测试名/报错原文）；不要替我判断"差不多行了"。'

// 去掉耗时、路径分隔符等易变噪音，再按稳定键排序，避免同一批失败因顺序变化被误判为有进展
function normalizeMessage(message) {
  return message
    .replace(/\d+(?:\.\d+)?\s*(?:ms|s)\b/g, '<duration>')
    .replace(/\\/g, '/')
}

function failureSignature(failures) {
  return failures
    .map(({ file, line, code, message }) =>
      `${file.replace(/\\/g, '/')}:${line == null ? '' : line}:${code || normalizeMessage(message)}`)
    .sort()
    .join('\n')
}

// 先评估一次：项目可能已经达标，就别动它（避免无谓修改）
const pre = await agent(GATE_PROMPT, { schema: GATE_SCHEMA })
if (!pre)
  return { summary: '✗ 预检 agent 未返回结果，未修改代码，升级人工', iterations: 0 }
if (pre.passed)                                        // —— Termination：开始前已达标 ——
  return { summary: '✓ 开始前已达标，无需修改', iterations: 0 }

let lastFailures = pre.failures
let lastSignature = failureSignature(pre.failures)
let noProgress = 0

for (let i = 1; i <= MAX_ITER; i++) {
  // —— Loop：把上轮失败项喂给 agent 修（acceptEdits 直接写回，不要顺手重构）——
  const repair = await agent(
    `依据以下失败项修复代码，只改与失败直接相关的地方：\n${JSON.stringify(lastFailures)}`,
    { label: `round-${i}` })
  if (!repair)
    return { summary: `✗ 第 ${i} 轮修复 agent 未返回结果，升级人工`, iterations: i }

  // —— Evaluator：客观闸门（真跑检查，不是问 LLM）——
  const gate = await agent(GATE_PROMPT, { schema: GATE_SCHEMA })
  if (!gate)
    return { summary: `✗ 第 ${i} 轮复检 agent 未返回结果，升级人工`, iterations: i }
  if (gate.passed)                                     // —— Termination：达标 ——
    return { summary: `✓ 第 ${i} 轮修复后 ruff+pytest 全绿`, iterations: i }

  const signature = failureSignature(gate.failures)
  if (signature === lastSignature) {
    if (++noProgress >= NO_PROGRESS_LIMIT)             // —— Termination：连续无进展 ——
      return { summary: `✗ 连续 ${NO_PROGRESS_LIMIT} 轮失败项无变化，升级人工`, iterations: i }
  } else noProgress = 0
  lastSignature = signature
  lastFailures = gate.failures
}
return { summary: `✗ ${MAX_ITER} 轮预算耗尽，升级人工`, iterations: MAX_ITER }   // —— Termination：预算耗尽 ——
```

</details>

**你会拿到什么**（一次闭环的轨迹）：workflow 先跑 `ruff + pytest`，拿到 12 条失败项 → 修复 → 重跑剩 3 条 → 再修 → 第 2 轮全绿并自动停。若规范化后的失败签名连续 3 轮不变，它会提前升级人工，不会硬烧到 8 轮。和实战一的 fan-out 不同，这里靠**客观 Evaluator + 三种 Termination**形成真正的反馈闭环。

**套到你项目**：把 `ruff + pytest` 换成你的检查命令（`npm test`、`go test ./...`、`tsc --noEmit`…），gate agent 的 prompt 里改命令名；失败项的 schema（file/line/message）通用，不用动。

**注意**：和实战一一样，子 agent 固定 `acceptEdits`、**必须在干净 worktree 跑**、跑完 `git diff` 核对；脚本本身无 shell 访问，跑 ruff/pytest 靠子 agent 调 Bash（Claude Code 子代理默认就有；锁了工具白名单就改读 CI 预生成的报告，别让 agent 现跑）；想再快可把每轮修复也 fan-out 并行（做法同实战一的两趟 fan-out），但**落在同一文件的并行改写会互相覆盖**——按文件聚合或用 worktree 隔离。

## 实战四：Codex 的 Loop Engineering 闭环（`/goal` 驱动）

实战三是 Claude 的后台 workflow；Codex 的闭环原语是 **`/goal`**：把目标、生命周期、预算和进度持久化在线程状态里，每轮根据文件、测试、日志、命令输出或制品等证据判断是否完成，未达标就继续，直到达标、预算耗尽、阻塞或人工暂停。和实战三的关键差别在于：那边由脚本显式控制 gate 和循环，这边由持久目标驱动后续行动。

> **能力可信度：官方。** Codex `/goal`（`/goal <objective>` 设、`/goal` 看、`/goal pause` / `resume` / `clear`），持久化到 app-server 状态层，关终端也不丢。

**场景**：在 Codex 会话里把当前分支的测试 + lint 改到全绿——不想自己一轮轮敲「再跑一次」，让 `/goal` 盯着转到绿。

**形状**（带环，和实战三同构）：

```
设 /goal ─→ worker 干活（读/改/跑测试）─→ 检查目标达标？
                                          ├ 未达（带原因）─→ 回 worker 再干（循环）
                                          ├ 达标 ─────────→ 标记 complete，停止续跑
                                          └ 连续无进展 / 预算耗尽 ─→ 停并报告
```

**适合什么任务**：有客观通过条件、且能由线程中的明确证据验证的任务（测试通过、lint 清零、编译过）；没有可验证终点就别用 `/goal`（会转成烧 token 的空转）。

**跑起来**：

- [ ] 使用支持 Goals 的 Codex（0.128.0+；当前版本默认开启），在项目根目录恢复或新建会话
- [ ] 确认目标**可评估**——明确指定文件、测试、日志、命令输出或制品等完成证据
- [ ] 设目标（≤4000 字符），比如：
  ```
  /goal 把当前分支的 npm test + lint 改到全绿：每轮先跑测试和 lint，失败就修、再跑，
  直到对话里出现一次全绿的命令输出；只改与失败直接相关的代码，不重构无关部分。
  以「对话里贴出一次测试+lint 全绿输出」为完成证据；若某失败连续 3 轮改不动，停下报告阻塞。
  ```
- [ ] `/goal`（不带参数）看实时状态：轮次、上次未达标的原因、token 消耗
- [ ] 要暂停/恢复：`/goal pause` / `/goal resume`；中途换目标直接再 `/goal <新>`（覆盖旧的）
- [ ] 达标后进入 `complete` 状态并停止自动续跑；`/goal clear` 用于显式移除目标

**你会拿到什么**（一次闭环的轨迹）：worker 第 1 轮跑 `npm test` → 3 failed → 修 → 第 2 轮剩 1 failed → 再修 → 第 3 轮全绿并记录通过证据 → Goal 标记为 `complete`，自动续跑停止。若连续 3 轮某条失败纹丝不动，它会按目标里的停止条件报告阻塞。

**套到你项目**：把 `npm test + lint` 换成你的检查（`pytest`、`go test ./...`、`cargo test`…），「完成证据」那句跟着改；其余（worker 干活 / 检查判定 / 失败回流）是 `/goal` 内置的，你不用写。

<details>
<summary>展开看「写一个能跑稳的 /goal」六维模板</summary>

Codex 官方 Goal 指南建议稳健目标覆盖以下六类信息，本文将其整理为模板：

```
/goal
  [Outcome]       完成时必须达到的具体状态（如：npm test 全绿）
  [Verification]  用什么证明做对了（如：对话里贴出全绿输出）
  [Constraints]   不能破坏什么（如：不重构无关代码、不降测试覆盖率）
  [Boundaries]    可以改哪些（如：只动 src/ 和测试文件）
  [Iteration]     失败后下一步优先试什么（如：先看报错→查依赖→问人）
  [Blocked-stop]  何时必须停下报告（如：连续 3 轮无进展、或遇到没权限的外部服务）
```

</details>

<details>
<summary>展开看一次完整的 /goal 会话交互示例</summary>

```
# ① 设目标
> /goal 把当前分支的 npm test + eslint 改到全绿。每轮先跑测试和 lint，
  失败就修、再跑。以对话里贴出一次全绿输出为完成证据。
  只改与失败直接相关的代码。若某失败连续 3 轮改不动，停下报告阻塞。

✓ Goal set: "把当前分支的 npm test + eslint 改到全绿..."

# ② 第 1 轮：worker 自动开始干活
> npm test
  FAIL  src/utils/date.test.ts  ✕ formatDate handles null (Expected: "--" Received: TypeError)
  FAIL  src/api/user.test.ts    ✕ fetchUser retries on 500 (timeout)
  Tests: 2 failed, 47 passed
> eslint .
  src/components/Modal.tsx:12  error  'useEffect' missing dependency 'onClose'
  ✖ 1 problem

  [worker] 分析 3 个失败项，开始修复...
  [worker] 修复 date.ts: 加 null 检查返回 "--"
  [worker] 修复 user.test.ts: 增加 mock timer
  [worker] 修复 Modal.tsx: 补 useEffect 依赖

# ③ 第 2 轮：重跑验证
> npm test
  Tests: 1 failed, 48 passed   ← user.test.ts 还挂
> eslint .  ✓ 0 problems

  [worker] user.test.ts 仍失败，换思路：用 vi.useFakeTimers()...

# ④ 第 3 轮：再跑
> npm test
  Tests: 49 passed, 0 failed   ← 全绿！
> eslint .  ✓ 0 problems

✓ Goal achieved — 状态更新为 complete，自动续跑停止。

# ⑤ 确认不再需要该目标后，显式移除
> /goal clear
```

</details>

**注意**：目标必须能用线程里的证据验证（别写「让代码更好」）；`/goal` 是线程级单目标，新目标会覆盖旧目标，完成和清除是两个不同动作；关终端后目标状态仍会持久化。长循环很烧 token，目标里一定写「连续 N 轮改不动就停」做阀门；**别在 `--yolo` 下跑**——worker 改代码 + 无人监督循环，风险叠加。

## 项目里到底怎么选 + 最快落地路径

### 选范式（回到两个维度）

1. **任务简单/路径明确** → 直接做，别上 agent 也别上 graph（Anthropic：最简方案优先）
2. **任务开放/要灵活** → agent loop（Claude Code / Codex 直接干）
3. **任务有可编码的结构 + 多个独立验证步骤** → graph/workflow（fan-out 或闭环）
4. **批量同类任务** → 并行（Claude `pipeline()` / Codex 官方 subagents / 朴素 `asyncio.gather`）

### 什么信号出现时该从 loop 升级到 graph

文章反复说「能用最简方案就别上 graph」，但你得知道**什么时候就该升级了**。对照这个清单，命中 2 条以上就值得考虑 graph/workflow：

- [ ] **上下文爆了**——单个 agent 的对话越来越长、开始忘记前面的指令或结果（你发现它重复做已经做过的事）
- [ ] **任务有可编码的前后依赖**——A 完成后 B 才能开始，C 和 D 可以并行；你发现自己在手动 copy-paste 上一步的输出给下一步
- [ ] **需要交叉验证**——你不信一个 agent 自己审自己的结果（审计 + 对抗式复核，实战一就是这个场景）
- [ ] **同一个编排要重复跑**——每次上线前都要跑一遍接口鉴权审计 / 每个 PR 都要做多维 Code Review → 存成 workflow 复用才划算
- [ ] **角色混乱**——你让一个 agent 同时当 reviewer、fixer、tester，结果它开始自说自话自证正确
- [ ] **需要并行提速**——20 个文件串行审查要 10 分钟，fan-out 2 分钟搞定（但注意：并行不是 graph 的本质，只是它的一种拓扑）

如果以上一条都没中，**请继续用单 loop**——你的复杂度预算不值得花在编排上。

### 选工具

| 需求 | Claude Code | Codex CLI | 其他官方框架 |
| --- | --- | --- | --- |
| 官方 graph 式编排 | Dynamic Workflows（v2.1.154+） | 无内置 graph runtime；用官方 subagents 做产品级多 agent 编排 | LangGraph / Google ADK 2.0 graph workflows / OpenAI Agents SDK |
| 触发方式 | `use a workflow` / `ultracode` / `/effort ultracode` | 提示词派 subagent | 各框架自有 API |
| 目标持久化 | `/goal` | `/goal` | — |
| 编排可保存复用 | `.claude/workflows/` → `/命令` | `.codex/agents/*.toml`（角色级） | 因框架而异 |
| 适合场景 | 需要确定性、可复用、对抗式复核 | 已有 Codex 工作流、想轻量并行 | 跨工具/平台的生产编排 |

> 注意它们**不在同一抽象层**：Claude Dynamic Workflows 和 Codex subagents 是**交互式编码 Agent 产品能力**（CLI / IDE / 桌面端，不是持久化 graph runtime），LangGraph/ADK/Agents SDK 是代码框架，Symphony 是项目级 always-on 规范——选型时别把 Symphony 当成"Codex 的并行替代"来比。

### 最快落地路径（从零到一）

1. **先用单 loop 跑通**：在 Claude Code / Codex 里直接把任务做完，验证目标可评估、终止条件能触发。**别一上来就 graph。**
2. **遇到瓶颈再加结构**：上下文爆了、角色混乱了、同一审查要重复跑——这时升级。
3. **升级到 fan-out 并行**：从 2–4 个节点起步（对应 `small` size guideline 的 <5），量准了再放大。
4. **把反复出现的编排固化**：Claude 存成 `.claude/workflows/`，Codex 沉淀成 `.codex/agents/` + 提示词模板。

> 一句话：**loop 是图的一个简单特例，graph 不是用来取代 loop，而是当你需要"在确定性和自主性之间显式求平衡"时的升级路径。** 能用最简方案就别上 graph；要上，从最小 fan-out 开始。

## 反模式

| 反模式 | 你踩了的信号 | 问题 | 正确做法 |
| --- | --- | --- | --- |
| 把 graph-max / Symphony 当成 Codex 内置命令 | 敲命令后报 "unknown command" | 虚构能力，照抄会失败 | 明确：社群技巧 / 外部规范 |
| 把 fan-out 并行审查称作「闭环/验证闭环」 | 审查报告里零失败项也没触发修复 | 缺客观 gate 与停止规则 | 闭环需 checker→修复→重验→停止；fan-out 是单趟 |
| 把 graph 本质等同于"并行" | 选型时排除了不需要并行但需要确定性路径的场景 | 选型错位（以为不并行就不该用） | 本质是显式控制流；并行只是其一 |
| 把 loop/graph 与 workflow/agent 划等号 | 讨论时说"用了 graph 就不需要 agent 了" | 两个正交维度被揉成一个 | 拓扑（单步/loop/graph）× 决策（代码/LLM），各自独立 |
| 把 agent 当状态机里僵化的节点 | agent 在简单任务上反而比直接提示更慢更差 | 限制模型能力 | 给目标而非严格转移（Symphony 教训） |
| 把知识图谱（GraphRAG）和编排图混为一谈 | 给编排选型时去评估了 Neo4j / Zep | 选型错位 | 分清"存关系"和"调度 agent" |
| 把 Loop/Graph Engineering 当学术共识 | 写进设计文档被同事质疑"查不到出处" | 过几个月就过时 | 标注「社群概念」 |
| 盲信并行提速「快 3 倍」之类的保证 | 实测并行反而更慢（编排开销 > 省下的时间） | 特定硬件 benchmark 被泛化 | 并行耗时 ≈ 最慢分支 + 编排开销，无通用倍数 |

## 成本估算：跑一次大概多少 token

下面是 **token 数量级参考**（实际取决于文件大小、失败轮次和模型选择，仅供制定预算上限）：

| 实战 | 场景规模 | token 估算 |
| --- | --- | --- |
| **实战一**：fan-out 审计 | 20 个路由文件，两趟 fan-out | 约 15–40 万 token |
| **实战二**：3 路 reviewer | 一个中等 PR（10–20 文件变更） | 约 10–25 万 token |
| **实战三**：闭环 fix | 12 条失败项，2–3 轮达标 | 约 20–60 万 token |
| **实战四**：/goal 闭环 | 同上，但含每轮目标检查开销 | 约 20–60 万 token |

> **踩坑提醒**：闭环的成本不确定性比 fan-out 高得多——停止条件没设好时，token 会持续累积。实战三、四的「连续 3 轮无进展就停」是核心护栏。想控制上限，还可以在 Claude `/config` 里选 `small`（<5 agent）的 size guideline，或在 Codex 会话/配置中设定运行预算与上限。美元费用受模型版本、输入/输出比例和缓存策略影响，本文不做固定换算。

## 调试排错：跑挂了怎么办

编排越复杂，出错点越多。这里列实战中最常见的五类故障：

| 现象 | 可能原因 | 排查方法 |
| --- | --- | --- |
| **workflow 启动后卡在 "planned phases"** | 触发语没含 `use a workflow` 或 `ultracode`；工作区不干净有未提交改动 | 确认触发语格式；`git status` 查干净度 |
| **子 agent 返回空结果或纯文本** | schema 定义的必填字段与 prompt 不匹配；或 agent 幻觉了一个不存在的文件 | 在 `/workflows` 里钻入该 phase，看 agent 的原始输出；schema 里加 `description` 字段帮 agent 理解期望格式 |
| **并行 agent 结果互相覆盖** | 多个 agent 同时改同一文件 | 按文件聚合分派（一个文件只派一个 agent）或用 worktree 隔离 |
| **Codex subagent 没被 spawn** | TOML 内的 `name` 与委派语不一致；项目未 trust | 检查 `.codex/agents/xxx.toml` 的 `name` 字段；确认项目已标记为信任（trusted）项目。文件名同名只是推荐约定 |
| **`/goal` 达标后不停 / 不达标就停** | 目标写得太模糊（“让代码更好”）或太严格（“零警告”但包含不相关的 info 级） | 重写目标，确保“完成证据”部分能被 worker 输出客观证明；用 `/goal` 查状态看「上次未达标原因」 |

> **日志在哪看**：Claude Code 用 `/workflows` 钻入每个 phase 看子 agent 的完整输入/输出；Codex 的 subagent 日志会内联显示在会话里（每个 spawn 有独立的输出块）。如果是 CI 场景，加 `--output-format json` 把结果导出到日志文件做事后分析。

## 官方与延伸参考

大公司 / 框架一手资料（权威，均于 2026-08-07 访问核验）：

- [Anthropic：Building Effective AI Agents（workflows vs agents + 五种模式）](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK：Agent orchestration（via code vs via LLM）](https://openai.github.io/openai-agents-python/multi_agent/)
- [OpenAI：Symphony——Codex 编排开源规范](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [Google ADK 2.0：graph-based / dynamic workflows（1.x 的 Sequential/Parallel/Loop 保留为 Template workflows）](https://adk.dev/2.0/)（旧 1.x 文档：google.github.io/adk-docs/）
- [LangChain：3 Years of Graph Engineering with LangGraph](https://www.langchain.com/blog/3-years-of-graph-engineering-with-langgraph)
- [Addy Osmani：Loop Engineering（"外层循环工程化"的原始提法，本文两层 loop 划分的依据）](https://addyosmani.com/blog/loop-engineering/)
- [Addy Osmani：Own the Outer Loop（后续篇，讨论自主循环中人的责任与问责，与本文「闭环必须有人工终止」观点互补）](https://addyosmani.com/blog/own-the-outer-loop/)
- [Claude Code：Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code：/goal 命令](https://code.claude.com/docs/en/goal)
- [Claude Code：定时任务与 /loop](https://code.claude.com/docs/en/scheduled-tasks)
- [Codex：Subagents 官方指南](https://developers.openai.com/codex/subagents)
- [Codex：Configuration Reference（max_concurrent_threads_per_session 等）](https://developers.openai.com/codex/config-reference)
- [Codex：Built-in slash commands（含 /goal）](https://learn.chatgpt.com/docs/developer-commands)
- [Codex：Using Goals in Codex（生命周期、证据标准与六维写法）](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex)

社区讨论（非官方，注意时效与噪音）：

- [Loop Engineering Explained Visually — Techlatest.net](https://medium.com/@techlatest.net/loop-engineering-explained-visually-from-manual-prompts-to-goal-driven-ai-agents-f2c4d634c261)
- [From Loops to Graphs — flowtivity.ai](https://flowtivity.ai/blog/graph-engineering-2026-guide-openclaw-codex/)
- [What Is Graph Engineering? — Turing Post](https://www.turingpost.com/p/is-graph-engineering-real-why-everyone-is-talking-about-it)

## 总结

抓住五点：

- **坐标系**：两个正交维度——拓扑（单步/loop/graph）× 决策归属（代码/LLM），各自独立，别把 graph 绑代码端、loop 绑 LLM 端
- **Loop Engineering**（外层，Osmani 提法）≠ 内层 ReAct 循环：关键是 Goal→Evaluator→Loop→Termination 这套持续验收闭环；Claude 和 Codex 的 `/goal` 是这套闭环的**产品原语**（只是部件，不等于完整 Loop Engineering）；实战三（Claude workflow）/ 实战四（Codex `/goal`）把它落到工具里
- **Graph Engineering** 本质是**显式编码控制流、在确定性与自主间求平衡**，**loop 是它的一个简单特例**；并行只是它的一种拓扑
- **Claude Code** 用官方 **Dynamic Workflows** 落地两种 shape：**fan-out**（实战一：审计 + 对抗式复核）和**闭环**（实战三：keep fixing until check passes）→ 都能存成 `/命令` 复用
- **Codex CLI** 没有内置 graph 命令，靠**官方 Subagents** 做并行（实战二）、`/goal` 做闭环（实战四）；graph-max 只是社群演示技巧，Symphony 是项目级外部规范

最后一句提醒：这两个概念是正在快速演化的社群提法，本文所有「官方确认」的命令以 `code.claude.com`、`learn.chatgpt.com` 和各框架官方文档为准，所有「社群技巧」用之前先在你的环境里验证一遍——**别把别人的 demo 当成你的生产能力**。
