---
title: OpenCode AI 使用教程
date: 2026-01-17 14:30:00
tags: [AI, OpenCode, 开发工具]
keywords: OpenCode, AI编程, Claude, GPT, 开发工具, 终端工具
---
# 什么是 OpenCode？

OpenCode 是一个开源的 AI 编程智能体（AI coding agent），可以在终端、桌面应用或 IDE 中使用。它完全开源，支持 75+ 种 LLM 提供商。
<!--more-->
## 为什么要使用 OpenCode？

作为开发者，我们经常需要：
- **快速理解项目** - 分析复杂的代码结构和逻辑
- **快速解决问题** - 调试错误、修复 bug
- **编写新功能** - 快速生成代码、测试用例
- **代码重构** - 优化现有代码结构和性能

OpenCode 的优势：
- 🆓 **免费模型支持** - 内置 GLM-4.7、MiniMax M2.1 等免费模型，零成本使用
- 🚀 **终端集成** - 直接在命令行中与 AI 对话
- 🔄 **双模式设计** - Build 模式（可写）和 Plan 模式（只读）
- 📚 **上下文理解** - 自动分析项目结构，理解代码逻辑
- 🔌 **多模型支持** - 支持 GPT、Claude、DeepSeek 等 75+ 提供商


# 安装方法

## 使用包管理器

**使用 npm：**
```bash
npm install -g opencode-ai
```

## 验证安装

```bash
opencode --version
```

如果显示版本号（如 1.0.150 或更高），则表示安装成功。

# 国内使用注意事项

## 常见错误：opencode-windows-x64

如果遇到安装后运行时提示找不到 `opencode-windows-x64` 包，解决方案：

**方案 1：使用官方源重新安装**
```bash
npm uninstall -g opencode-ai
npm install -g opencode-ai --registry https://registry.npmjs.org
```

# 支持的模型

## 免费模型（推荐新手使用）

OpenCode Zen 提供经过团队测试验证的免费模型，无需配置 API 密钥：

### GLM-4.7（智谱 AI）
- **特点**：中文理解能力强，适合国内开发
- **上下文**：128K tokens
- **适用场景**：代码分析、Bug 修复、中文文档生成

### MiniMax M2.1
- **特点**：多语言工程能力强，代码质量高
- **上下文**：200K tokens
- **适用场景**：重构、大型项目分析

## 商业模型

- **OpenAI**：GPT 5.2、GPT 5.1 Codex 等
- **Anthropic**：Claude Opus 4.5、Claude Sonnet 4.5 等
- **Google**：Gemini 3 Pro 等
- **DeepSeek**：DeepSeek 系列模型

## 查看和切换模型

启动 OpenCode 后，输入：
```
/models
```

选择你想要的模型，免费模型可以直接使用，商业模型需要配置 API 密钥。

# 核心特性

## 双模式设计

### Build 模式（默认）
- ✅ 读写文件、执行命令
- ✅ 直接修改代码
- ✅ 小改动、快速修复

### Plan 模式（只读）
- ✅ 分析代码库、制定计划
- ✅ 需要确认才能修改
- ✅ 适合复杂功能规划

**切换方法**：按 `Tab` 键

## 其他核心功能

- **LSP 自动加载** - 自动识别项目语言，提供智能代码补全
- **多会话并行** - 同一项目可同时开启多个 Agent
- **分享会话链接** - 快速与团队协作
- **项目初始化** - 自动分析项目，生成 AGENTS.md
- **隐私优先** - 不存储代码，支持完全离线

# 快速上手

## 第一次使用（5 分钟）

### 步骤 1：启动和选择模型

```bash
# 进入项目目录
cd my-project

# 启动 OpenCode
opencode

# 输入 /models 选择免费模型
/models
# 选择 GLM-4.7 或 MiniMax M2.1
```

### 步骤 2：初始化项目

```
/init
```

OpenCode 会分析你的项目结构，生成 `AGENTS.md` 文件。

### 步骤 3：开始提问

```
这个项目用了哪些技术栈？
@package.json 这个文件是做什么的？
```

## 常用场景

### 场景 1：添加新功能

```
# 1. 先切换到 Plan 模式（按 Tab 键）
添加用户登录功能，使用 JWT 认证

# 2. 审查计划
AI 会给出实现方案，你可以提出修改意见

# 3. 确认后切换回 Build 模式（再按 Tab 键）
开始实现吧
```

### 场景 2：修复 Bug

```
用户登录时报错：Invalid token，帮我看看问题在哪

# AI 会自动分析代码、查找问题、提供解决方案
```

### 场景 3：代码重构

```
重构 API 路由，统一错误处理和响应格式

# AI 会分析现有代码，提出重构方案
```

# 高效技巧

## 1. 引用特定文件

使用 `@` 符号让 AI 精准定位文件：

```
@src/components/Button.tsx 这个按钮的样式怎么优化？
```

## 2. 批量操作

```
把所有 console.log 都删掉
给所有 .ts 文件添加 JSDoc 注释
```

## 3. 结合截图

直接把设计图拖到终端：

```
参考这个设计图，实现登录页面
[拖入图片]
```

## 4. 压缩上下文

当对话太长时，压缩节省 token：

```
/compact
```

## 5. 分享会话

遇到问题分享给同事：

```
/share
```

# 常用命令

| 命令 | 功能 |
|------|------|
| `/models` | 查看所有可用模型 |
| `/connect` | 连接 AI 提供商 |
| `/init` | 初始化项目 |
| `/undo` | 撤销上一步操作 |
| `/redo` | 重做已撤销的操作 |
| `/share` | 分享会话链接 |
| `/help` | 显示帮助信息 |
| `/compact` | 压缩会话上下文 |
| `/quit` 或 `Ctrl+C` | 退出 |
| `/new` | 新建会话 |
| `/sessions` | 查看并切换会话 |


**建议**：
1. 新手先从免费模型（GLM-4.7）开始
2. 简单任务用 Build 模式，复杂任务用 Plan 模式
3. 善用 `@` 引用文件，提高精准度
4. 定期使用 `/compact` 压缩上下文，节省 token

# 相关资源

- **官网**：https://opencode.ai
- **GitHub**：https://github.com/anomalyco/opencode
- **文档**：https://opencode.ai/docs
- **Discord**：https://opencode.ai/discord
- **OpenCode Zen**：https://opencode.ai/auth
