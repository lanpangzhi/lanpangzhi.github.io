---
title: Codex CLI 子代理工程化工作流指南
date: 2026-07-11 10:05:22
tags: [AI, Codex, Subagent, 开发工具, 工作流]
keywords: Codex CLI, Codex子代理, Subagent, AI编程, AGENTS.md, 多代理协作
---
# Codex CLI 子代理工程化工作流指南

当项目越来越复杂，只让一个 AI 从头分析到尾，容易出现上下文混乱、遗漏调用链、重复搜索和修改范围失控等问题。Codex CLI 的子代理（Subagent）能力，可以把前端分析、后端分析、代码审查等独立任务并行交给不同角色，再由主线程统一判断、修改和验证。<!--more-->

真正有效的多代理协作，不是简单地“多开几个 Agent”，而是同时明确三件事：

- 每个 Agent 负责什么
- 它能使用哪些能力
- 它必须交付什么证据

本文先带你完成一次最小可用配置，再介绍 Vue + Go 项目常用的角色设计、权限边界、端到端案例和日常工作流。

> 本文依据 2026-07-13 的官方文档，并使用 `codex-cli 0.144.1` 核验命令和配置。Codex 更新较快，版本敏感内容应以当前环境和文末官方文档为准。

## 5 分钟快速开始

先用一个面向只读分析的最小 Agent 验证配置链路，再扩展成前端、后端和审查三个角色。

### 第一步：检查 Codex 环境

在项目根目录执行：

```bash
codex --version
codex features list
codex debug models
codex doctor --summary
```

这些命令分别用于确认：

- Codex CLI 版本
- `multi_agent` 功能的当前状态
- 当前账号和登录方式可见的模型
- 配置、认证和本地运行环境

当前 Codex 版本通常已经默认启用多 Agent。如果命令或功能不存在，应先确认 CLI 版本，而不是直接照抄后面的配置。

### 第二步：准备项目目录

```text
项目根目录/
├── AGENTS.md
├── .codex/
│   ├── config.toml
│   └── agents/
│       └── code-mapper.toml
└── services/
    └── payment/
        └── AGENTS.override.md    # 可选：只覆盖支付子目录规则
```

这里有一个容易踩坑的规则：

> 同一目录最多加载一个指导文件，并按 `AGENTS.override.md`、`AGENTS.md` 的顺序查找。不要在项目根目录同时放这两个文件，否则根目录的 `AGENTS.md` 会被忽略。

根目录的 `AGENTS.md` 适合保存仓库结构、构建命令、测试命令和交付标准。某个子目录需要更严格的规则时，再在那个子目录放 `AGENTS.override.md`。

### 第三步：创建最小配置

文件 `.codex/config.toml`：

```toml
[agents]
max_threads = 4
max_depth = 1
```

文件 `.codex/agents/code-mapper.toml`：

```toml
name                   = "code_mapper"
description            = "Read-only agent for locating code paths and returning evidence."
sandbox_mode           = "read-only"
approval_policy        = "never"
web_search             = "disabled"

developer_instructions = """
只读分析当前项目，不要修改文件。
查找与任务相关的入口、调用链和影响范围。
结论必须附带文件路径和行号，并明确列出不确定点。
"""
```

独立 Agent 文件必须包含 `name`、`description` 和 `developer_instructions`。没有显式指定模型时，它会继承父会话的模型配置。

`.codex/agents/*.toml` 会被自动发现，不需要再通过 `[agents.<name>]` 和 `config_file` 重复注册。Agent 类型以 `name` 字段为准，文件名只是便于维护的约定。

### 第四步：信任项目并以只读权限新开会话

项目级 `.codex/` 配置只会在项目被信任时加载。信任前应先检查仓库中的配置、Hook 和外部服务，确认项目来源可靠。

首次从仓库启动 Codex 时，如果出现 trust 提示，应在检查配置后选择信任。新增或修改 Agent TOML 后，不要依赖当前会话热加载，应退出旧会话并重新启动。

本节要验证本地文件系统与命令执行的只读边界，因此从项目根目录使用：

```bash
codex --sandbox read-only --ask-for-approval never
```

当前 CLI 创建子代理时，会在加载角色配置后重新应用父会话的实时权限。也就是说，TOML 中的 `sandbox_mode` 和 `approval_policy` 不能单独保证子代理只读；委派时父会话对本地文件系统和命令执行的实时权限，才是这部分的最终边界。

### 第五步：执行第一次委派

在新会话中输入：

```text
请使用 code_mapper 子代理，只读分析当前项目的构建入口。
返回入口文件、主要调用链、文件路径、行号和不确定点。
等待子代理完成后，由主线程汇总结论。
```

子代理开始运行后，可以使用 `/agent` 查看和切换正在运行的 Agent 线程。

`/agent` 不是可用 Agent 类型列表。还没有派出子代理时看不到 `code_mapper`，并不代表配置失败。

## 子代理是什么

子代理可以理解为主线程临时派出的独立工作单元。一个典型协作结构如下：

```text
主线程（Orchestrator）
├── frontend_mapper：分析页面、组件、路由和 API 调用
├── backend_mapper：分析接口、Service、数据库和数据结构
└── reviewer：检查 Bug、回归、权限风险和缺失测试
```

三类职责需要明确分开：

- **主线程**：识别意图、拆分任务、合并证据、制定方案、修改代码和验证结果
- **分析子代理**：在限定范围内查找代码和证据，默认不修改文件
- **审查子代理**：检查真实风险，按严重程度输出发现，不负责凑数量

子代理的报告只是决策输入。最终仍要由主线程判断结论是否可信、证据是否冲突，以及哪些假设还需要验证。

## 什么时候使用子代理

子代理的价值是降低不确定性，不是增加流程仪式。

| 任务类型 | 是否推荐 | 处理方式 |
| --- | --- | --- |
| 文案修改、样式微调 | 不推荐 | 主线程直接修改并自查 |
| 已定位的单文件 Bug | 一般不需要 | 主线程修复，可选审查 Agent 检查 diff |
| 普通 Bug，根因不明确 | 推荐 | 前端和后端 Agent 并行排查 |
| 新功能或跨模块需求 | 推荐 | mapper 分析现状，reviewer 检查方案风险 |
| 权限、支付、医疗数据、事务 | 强烈推荐 | 增加安全或数据库专用 Agent |
| 上线前检查 | 推荐 | reviewer 检查回归和缺失测试 |

可以用一个简单标准判断：

> 已经知道改哪个文件、为什么改、怎么验证，就直接修改；仍需寻找调用链、确认影响范围或比较方案，再使用子代理。

## 角色设计

### 内置 Agent

Codex 当前提供三种内置 Agent：

| Agent | 定位 | 适用场景 |
| --- | --- | --- |
| `default` | 通用后备角色 | 未指定专业角色的通用任务 |
| `worker` | 偏执行 | 实现功能、修复 Bug |
| `explorer` | 偏只读探索 | 查找代码、分析结构和调用链 |

内置 Agent 的实际能力仍受父会话权限和运行时配置影响。可用类型也可能随版本变化，不能把 `/agent` 当作配置类型列表。

### 项目自定义角色

对于常见前后端项目，可以先从“一主三从”开始：

| Agent | 负责范围 | 不负责 |
| --- | --- | --- |
| `frontend_mapper` | 路由、页面、组件、状态、API 调用和 UI 回归点 | 修改页面或实现功能 |
| `backend_mapper` | Router、Handler、Service、Repository、Model、事务和鉴权 | 连接数据库或执行迁移 |
| `reviewer` | 正确性、回归、权限、并发、事务和缺失测试 | 泛泛点评风格或代替主线程改代码 |

不要把 `reviewer` 简称为“测试”。本文中的 reviewer 只做审查，真正负责运行验证步骤的角色应另命名为 `qa_verifier`。

## 配置并行数量

文件 `.codex/config.toml` 可以这样配置：

```toml
[agents]
max_threads = 4
max_depth = 1
job_max_runtime_seconds = 1800
```

| 配置项 | 准确含义 |
| --- | --- |
| `max_threads` | 同时打开的代理线程上限；不是简单的“子代理个数” |
| `max_depth` | 嵌套创建深度；根线程深度为 0，设为 1 时只允许创建一层子代理 |
| `job_max_runtime_seconds` | `spawn_agents_on_csv` 批量任务中每个 CSV 工作项的默认超时 |

`max_threads` 默认是 `6`，`max_depth` 默认是 `1`；CSV 工作项未显式设置时，默认超时为 1800 秒。普通子代理的运行时间不能只靠 `job_max_runtime_seconds` 控制。

## 模型选择

当前 GPT-5.6 模型可以按任务性质选择：

| 模型 | 定位 | 适合任务 |
| --- | --- | --- |
| `gpt-5.6-luna` | 高吞吐、适合明确且重复的任务 | 结构化提取、分类、固定格式扫描 |
| `gpt-5.6-terra` | 日常均衡 | 需要一定判断和工具调用的代码探索 |
| `gpt-5.6-sol` | 复杂开放任务 | 深度审查、安全分析、复杂方案决策 |

本文示例使用：

- `frontend_mapper`、`backend_mapper`：`gpt-5.6-luna` + `medium`
- `reviewer`：`gpt-5.6-sol` + `high`

如果 mapper 面对陌生大型仓库、任务边界不清或 Luna 输出不稳定，可以先切换到 Terra。模型可用性取决于套餐、工作区策略、登录方式和当前模型目录，应通过 `/model` 或 `codex debug models` 确认，不要依赖文章中的静态列表。

## 三个可复制的 Agent 配置

下面仍在角色文件中声明 `sandbox_mode` 和 `approval_policy`，用于表达这个角色期望的权限。当前 CLI 会用父会话的实时权限覆盖它们，因此委派前仍要确认父会话处于只读模式。

### 前端分析 Agent

文件 `.codex/agents/frontend-mapper.toml`：

```toml
name                   = "frontend_mapper"
description            = "Read-only Vue frontend mapper for routes, components, stores, and API usage."
model                  = "gpt-5.6-luna"
model_reasoning_effort = "medium"
sandbox_mode           = "read-only"
approval_policy        = "never"
web_search             = "disabled"

developer_instructions = """
你是一个只读的 Vue 前端分析 Agent。

## 任务
- 映射路由、页面和组件依赖
- 追踪 axios/fetch 请求、字段契约和错误处理
- 分析 Vuex/Pinia 数据流、权限判断和 UI 回归点

## 允许动作
- 读取文件和目录
- 运行 rg、git grep、git diff、git show、git status 等只读命令

## 输出
- 结论
- 证据：文件路径、行号和调用链
- 影响范围
- 未确认假设
- 建议下一步

## 约束
- 不编辑文件，不启动服务，不安装依赖
- 不写实现代码，不报告没有证据的猜测
"""
```

### 后端分析 Agent

文件 `.codex/agents/backend-mapper.toml`：

```toml
name                   = "backend_mapper"
description            = "Read-only Go backend mapper for handlers, services, repositories, models, and API contracts."
model                  = "gpt-5.6-luna"
model_reasoning_effort = "medium"
sandbox_mode           = "read-only"
approval_policy        = "never"
web_search             = "disabled"

developer_instructions = """
你是一个只读的 Go 后端分析 Agent。

## 任务
- 映射 Router、Handler、Service、Repository 调用链
- 分析 Request、Response、Model、Struct 和字段映射
- 检查鉴权、中间件、事务、错误处理和敏感字段风险

## 允许动作
- 读取文件和目录
- 运行 rg、git grep、git diff、git show、git status 等只读命令

## 输出
- 结论
- 证据：文件路径、行号和完整调用链
- 影响范围
- 未确认假设
- 建议下一步

## 约束
- 不编辑文件，不连接数据库，不执行迁移
- 不启动服务，不安装依赖，不报告无证据猜测
"""
```

### 代码审查 Agent

文件 `.codex/agents/reviewer.toml`：

```toml
name                   = "reviewer"
description            = "Read-only reviewer focused on correctness, regressions, security, and missing tests."
model                  = "gpt-5.6-sol"
model_reasoning_effort = "high"
sandbox_mode           = "read-only"
approval_policy        = "never"
web_search             = "disabled"

developer_instructions = """
你是一个只读代码审查 Agent，像代码 Owner 一样检查改动。

## 审查重点
1. 真实 Bug、边界错误和并发安全
2. 行为回归、权限绕过和敏感数据泄露
3. 事务、数据一致性和错误处理
4. 缺失测试和需求外改动

## 输出
- 按 Critical、High、Medium、Low 排序
- 每条包含文件路径、行号、问题、影响、建议和置信度
- 标出是否阻塞发布
- 没有发现问题时明确说明，不要凑数

## 约束
- 不编辑文件，不代替主线程修改代码
- 不运行测试、启动服务或安装依赖
- 优先报告真实问题，不报告纯风格偏好
"""
```

如果项目不是 Vue + Go，应替换名称、技术术语和必查调用链，而不是机械复制这三份配置。

## 权限边界

只读不是在提示词里写一句“不要修改”就绝对安全。需要理解下面几层控制：

| 控制层 | 作用 |
| --- | --- |
| 父会话的 sandbox 和 approval | 当前 CLI 创建子代理时会重新应用，是实际生效的权限边界 |
| Agent TOML 中的 `sandbox_mode`、`approval_policy` | 表达角色期望权限，但不能单独保证子代理只读 |
| `sandbox_mode = "read-only"` | 在生效时禁止命令写入文件系统，并限制命令网络访问 |
| `approval_policy = "never"` | 从不发起批准请求；被沙箱或组织策略拒绝的动作直接失败 |
| `web_search = "disabled"` | 关闭原生 Web Search 工具 |
| MCP 和应用工具 | 拥有独立权限面，需要单独审查、禁用或收窄 |
| `developer_instructions` | 约束 Agent 行为，但不是硬工具白名单 |
| 项目 trust | 未信任项目会忽略项目级 `.codex/` 配置 |

因此，高风险项目应在委派前把父会话切换到 Read Only，检查继承的 MCP 和工具，并避免使用 `--dangerously-bypass-approvals-and-sandbox` 等放宽沙箱的参数。角色文件中的权限配置只能表达意图，不能替代父会话的实际权限。

## 输出合同与主线程汇总

多个 Agent 能否协作，关键不在名称，而在统一输出格式。建议分析 Agent 固定返回五项：

```text
1. 结论：一句话说明当前功能如何工作
2. 证据：文件路径、行号和调用链
3. 影响范围：可能受影响的页面、接口和数据结构
4. 未确认假设：缺少哪些日志、环境或业务信息
5. 建议下一步：最小修改方向或验证方式
```

审查 Agent 再增加严重程度、问题影响、置信度和是否阻塞发布。

主线程汇总时应遵循五条规则：

1. 合并不同 Agent 指向同一字段或接口的证据
2. 保留冲突结论及双方依据，不相信表达最自信的一方
3. 明确区分代码事实、运行结果和未验证假设
4. 列出最小修改文件，并说明哪些文件明确不改
5. 给出自动测试、构建和人工回归清单

## 端到端案例：会员列表返回 500

下面的路径和行号都是虚构内容，只用于演示合格的子代理报告。

### 派发任务

```text
线上问题：会员列表接口 /api/member/list 返回 500。

先不要修改代码，请并行启动：
1. frontend_mapper：检查请求参数、默认值和错误处理
2. backend_mapper：追踪 Router → Handler → Service → Repository → DB

每个结论必须包含文件路径和行号。
主线程汇总事实、假设、根因候选、最小修复和验证步骤。
```

### frontend_mapper 报告

```text
结论：
会员列表首次加载发送 sort_by=createdAt，与后端字段命名不一致。

事实与证据：
- web/src/views/member/MemberList.vue:48 默认排序字段为 createdAt
- web/src/views/member/MemberList.vue:86 页面挂载后调用 loadMembers
- web/src/api/member.ts:22 将该值原样写入 sort_by

影响范围：
首次进入列表和重置筛选都会携带该参数。

未确认假设：
线上部署的前端版本与当前代码一致。

建议验证：
在浏览器 Network 中确认失败请求的 sort_by 参数。
```

### backend_mapper 报告

```text
结论：
后端没有保护未知排序字段，createdAt 最终生成无效 SQL。

事实与证据：
- api/internal/member/router/router.go:26 注册 GET /api/member/list
- api/internal/member/handler/member_handler.go:42 解析 sort_by 查询参数
- api/internal/member/handler/member_handler.go:49 调用 MemberService.List
- api/internal/member/service/member_service.go:73 将 SortBy 传给 Repository
- api/internal/member/repository/member_repository.go:31 白名单只有 created_at、name、level
- api/internal/member/repository/member_repository.go:118 使用 sortColumns[query.SortBy] 取列名，但未检查键是否存在
- api/internal/member/repository/member_repository.go:121 将空列名拼入 ORDER BY，生成 ORDER BY  DESC
- api/internal/member/repository/member_repository.go:124 执行查询，数据库返回 DESC 附近的语法错误
- api/internal/member/service/member_service.go:78 将 Repository 错误原样返回
- api/internal/member/handler/member_handler.go:57 将 Service 错误转换为 500

影响范围：
任何未知 sort_by 值都可能触发相同错误。

未确认假设：
生产环境的 500 确实来自该 SQL 分支。

建议验证：
分别请求 sort_by=createdAt 和 sort_by=created_at，并检查服务日志。
```

### 主线程汇总

```text
一致结论：
前端发送 createdAt，后端只识别 created_at，两份证据组成完整调用链。

验证结果：
- 本地请求 sort_by=createdAt，稳定复现 500
- 服务日志记录 ORDER BY DESC 附近存在 SQL 语法错误
- 改用 sort_by=created_at 后返回 200

已确认根因：
前后端排序字段契约不一致，且 Repository 缺少未知值保护。

最小修复：
1. 前端默认排序值改为 created_at
2. Repository 遇到未知字段时回退到 created_at
3. 不修改会员表、分页逻辑和无关筛选条件

验证清单：
- created_at 返回 200 且排序正确
- createdAt 和未知字段不再生成无效 SQL
- 回归首次加载、切换排序和重置筛选
- 补充 Repository 单元测试并运行前端构建
```

这个示例的重点不是猜中答案，而是让每一步都可以被复核。

## 可直接使用的提示词

### 分析现有功能

```text
第一阶段先不要修改代码。

请并行启动 frontend_mapper 和 backend_mapper，
分析“会员等级”功能的前端链路、后端契约和影响范围。

每个 Agent 输出结论、文件路径和行号、影响范围、未确认假设和建议下一步。
主线程汇总一致结论、冲突结论、未验证假设和最小修改方案。
```

### 根据分析执行修改

```text
根据刚才确认的分析报告执行修改。

- 只修改报告确认相关的文件
- 不做顺手重构
- 每个改动对应需求点或代码证据
- 完成后列出文件、位置和修改原因
- 运行最小验证，并说明未验证风险
```

### 提交前代码审查

```text
请启动 reviewer 审查本次改动。

重点检查正确性、权限、并发、事务、边界情况、行为回归和缺失测试。
按 Critical、High、Medium、Low 排序。
每条包含文件路径、行号、影响、建议、置信度和是否阻塞。
没有发现问题时明确说明，不要凑数。
```

写在 `AGENTS.md` 里的“前端”“后端”等短名只是自然语言约定，不是 CLI 正式注册的别名。高风险任务应直接使用准确的 Agent `name`。

## 日常开发的七步工作流

1. **描述目标和约束**：说明要实现什么、不能修改什么、如何验收
2. **判断任务风险**：位置和验证路径明确就直接做，影响面未知再委派
3. **并行收集证据**：让不同 Agent 分析独立调用链，并统一输出格式
4. **主线程汇总方案**：合并一致结论，标记冲突、事实和假设
5. **执行最小修改**：只修改需求直接相关文件，不顺手重构
6. **审查和验证**：reviewer 检查风险，主线程运行测试、构建和人工回归
7. **沉淀项目规则**：把反复出现的约定写入合适的 `AGENTS.md` 或 Agent 指令

## 常见反模式

| 反模式 | 问题 | 正确做法 |
| --- | --- | --- |
| 只说“开几个 Agent 看看” | 多个 Agent 重复搜索 | 指定角色、范围和输出合同 |
| 看完顺便修改 | 分析与执行混在一起 | 先只读收集证据，再由主线程修改 |
| 只输出总结 | 无法复核 | 必须带路径、行号、影响和假设 |
| 所有项目用相同角色 | 技术栈调用链不同 | 按真实架构调整名称和术语 |
| Agent 越多越好 | 增加令牌、延迟和汇总成本 | 先从 2 到 3 个独立角色开始 |

## 可选 Agent

只有任务反复出现或风险足够高时，才增加专用角色：

| Agent | 何时使用 | 输出重点 |
| --- | --- | --- |
| `advisor_reviewer` | 方案争议大，需要第二意见 | 反方观点、隐藏假设、替代方案 |
| `qa_verifier` | 修复后或上线前需要验证 | 最小命令、人工步骤、回归路径 |
| `security_reviewer` | 登录、权限、支付、医疗数据 | 越权、注入、敏感字段和可利用性 |
| `api_contract_mapper` | 前后端字段或兼容性改造 | 请求、响应、错误码和兼容影响 |
| `db_mapper` | 迁移、事务、索引和一致性 | 表结构、事务边界、锁和索引风险 |

## 跨项目迁移

迁移时不要只替换目录名，还要调整：

- `name` 和 `description`
- 技术栈术语和调用链
- 允许的命令、外部工具和权限
- 必查入口、数据结构和风险点
- 输出合同和验证方式

常见映射可以从下面开始：

| 项目类型 | 推荐角色 |
| --- | --- |
| Vue + Go | `frontend_mapper`、`backend_mapper`、`reviewer` |
| React + Node.js | `react_mapper`、`node_mapper`、`reviewer` |
| Spring Boot | `spring_mapper`、`db_mapper`、`security_reviewer` |
| 移动端 App | `ios_mapper` 或 `android_mapper`、`api_contract_mapper` |
| SDK 或纯接口服务 | `api_contract_mapper`、`qa_verifier`、`reviewer` |

子代理应该适配项目，而不是让项目迁就模板。

## 配置验证与排错

| 现象 | 检查方法 |
| --- | --- |
| 自定义 Agent 没生效 | 确认项目已信任、文件位于 `.codex/agents/`，然后新开会话 |
| Codex 不认识 Agent 名称 | 检查三个必填字段，调用时使用 TOML 中的 `name` |
| 修改配置后行为没变化 | 退出旧会话并重新启动，不依赖热加载 |
| `/agent` 中没有自定义 Agent | 先明确要求启动；该命令只显示运行线程 |
| 启动时报告 TOML 错误 | 检查引号、多行字符串和重复字段，再运行 `codex doctor --all` |
| 配置模型不可用 | 使用 `codex debug models` 查看当前模型目录并替换 |
| 没有多 Agent 能力 | 使用 `codex features list` 检查 `multi_agent` 和 CLI 版本 |
| 只读 Agent 仍获得外部能力 | 检查父会话运行时权限、Web Search、MCP 和应用工具 |
| CSV worker 超时 | 调整 `job_max_runtime_seconds`；它不控制普通子代理 |

## 官方参考

- [Subagents](https://developers.openai.com/codex/subagents)
- [AGENTS.md 指南](https://developers.openai.com/codex/guides/agents-md)
- [Codex 配置基础](https://developers.openai.com/codex/config-basic)
- [Codex 配置参考](https://developers.openai.com/codex/config-reference)
- [Codex 模型](https://developers.openai.com/codex/models)
- [GPT-5.6 使用指南](https://developers.openai.com/api/docs/guides/latest-model.md)

## 总结

稳定的 Codex 子代理工作流依靠四件事：

- 清晰的角色边界
- 与风险匹配的工具权限
- 可以复核的证据合同
- 主线程负责的修改和验证闭环

先用最小配置跑通一次，再根据真实项目增加角色。不要为了显得“多 Agent”而拆分任务，也不要把子代理输出直接当成事实。只有证据、权限和验证都形成闭环，多代理协作才真正具有工程价值。
