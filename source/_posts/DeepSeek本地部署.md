---
title: DeepSeek本地部署
date: 2025-04-19 10:31:29
tags: [DeepSeek, AI]
keywords: DeepSeek本地部署
---
# DeepSeek本地部署
DeepSeek 是由深度求索公司开发的一系列强大的开源大语言模型主打高效推理与成本优势。在本地部署这些模型，可以让你在没有网络连接或出于隐私考虑的情况下，也能利用它们的能力。
<!--more-->

# 硬件要求对比

本地部署 DeepSeek 模型对硬件有一定要求，主要取决于你选择的模型大小和是否使用量化。以下是不同参数规模模型的大致硬件需求对比：

| 模型版本 | 参数量（B = Billion） | 最低显存要求 | 推荐硬件配置 | 适用场景 |
|:---------|:---------------------|:------------|:------------|:---------|
| **1.5B** | 15 亿参数 | 1GB 显存（纯 CPU 推理需 8GB 内存） | CPU 4核+；内存8GB+；显卡可选4GB+（如GTX 1650） | 低资源设备、简单文本生成、物联网设备 |
| **7B** | 70 亿参数 | 8GB 显存（4-bit量化可降至4GB） | CPU 8核+；内存16GB+；RTX 3070/4060（8GB+） | 中小型企业开发测试、文本摘要、轻量级对话 |
| **8B** | 80 亿参数 | 10GB 显存（8-bit量化） | CPU 8核+；内存16GB+；RTX 4060Ti（10GB+） | 复杂逻辑推理、代码生成任务 |
| **14B** | 140 亿参数 | 16GB 显存 | CPU 12核+；内存32GB+；RTX 4090/A5000（16GB+） | 企业级复杂任务、长文本理解与生成 |
| **32B** | 320 亿参数 | 24GB 显存 | CPU 16核+；内存64GB+；A100 40GB或双RTX 3090 | 高精度专业任务、多模态预处理、金融预测 |
| **70B** | 700 亿参数 | 40GB+ 显存 | CPU 32核；内存128GB+；多卡并行（2xA100 80GB或4xRTX 4090） | 科研机构、大型企业的高复杂度生成任务 |

# Ollama 部署
Ollama 是一个流行的工具，可以让你轻松地在本地运行各种开源大语言模型，包括 DeepSeek。用户可以轻松加载并使用这些模型进行文本生成、情感分析、问答等任务。

## 下载Ollama
访问 [Ollama 官网](https://ollama.com/download)或 [GitHub Releases](https://github.com/ollama/ollama/releases)，下载对应系统的安装包并进行安装。

## 下载DeepSeek模型
下载并运行 DeepSeek-r1模型：打开终端或命令提示符，运行以下命令
```
ollama run deepseek-r1:1.5b
```
如果是第一次运行，Ollama 会自动下载模型文件。下载完成后，你就可以在终端直接与模型交互了。
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/DeepSeek%E6%9C%AC%E5%9C%B0%E9%83%A8%E7%BD%B2/20250419112056.png)

## 通过 API 调用：
Ollama 还提供了一个本地 API (默认在 http://localhost:11434 )，你可以通过编程方式调用模型。

获取本地模型列表
```
curl http://localhost:11434/api/tags
```

发送对话请求（推理）
```
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:1.5b",
  "prompt": "你好，介绍一下你自己",
  "stream": false
}'
```

## Web UI 可视化界面

除了命令行和 API，DeepSeek 及其他大模型还可以通过多种 Web UI 工具进行可视化操作，适合不懂代码的用户或需要多轮对话、历史管理等功能的场景。常见的 Web UI 工具有：

- **LM Studio**  
  跨平台桌面应用，支持 DeepSeek、Llama、Qwen 等模型，内置模型下载和聊天界面，支持 OpenAI API 兼容。  
  官网：[https://lmstudio.ai/](https://lmstudio.ai/)

- **Text Generation WebUI (oobabooga)**  
  功能强大，支持多种模型格式（GGUF、GPTQ、Transformers等），插件丰富，适合高级用户。  
  GitHub：[https://github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)

- **Open WebUI**  
  现代化 Web 聊天界面，支持 Ollama、LM Studio、OpenAI API 等后端，支持多会话和插件。  
  GitHub：[https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)

- **Chatbot UI**  
  类似 ChatGPT 的前端界面，支持自定义 API 地址（如 Ollama、LM Studio）。  
  GitHub：[https://github.com/mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)

这些 Web UI 工具大多支持直接加载本地模型，或通过 API 对接 Ollama/LM Studio 等后端，适合快速体验和部署本地大模型。你可以根据自己的需求和系统环境选择合适的 Web UI 工具。

# 本地部署大模型的优点：

1. 数据隐私与安全 ：所有数据都在本地处理，无需上传到云端或第三方服务器，极大保障了用户隐私和企业数据安全。
2. 离线可用 ：无需依赖互联网，断网环境下也能正常使用，适合对网络环境有要求的场景。
3. 低延迟高响应 ：本地推理无需经过网络传输，响应速度更快，体验更流畅。
4. 成本可控 ：一次性硬件投入后，无需持续支付云服务费用，长期使用更经济。
5. 可定制化 ：可以根据自身需求对模型进行微调、裁剪、集成到本地业务系统，实现高度定制。

# 本地模型还能扩展的方向包括：
- 本地知识库检索 ：结合本地文档、数据库，实现企业/个人知识问答、智能客服等场景。
- 插件与工具集成 ：与本地办公软件、自动化脚本、IoT设备等集成，提升自动化和智能化水平。
- 多模态扩展 ：支持图片、语音、视频等多模态输入输出，打造更丰富的AI应用。
- 本地微调与训练 ：根据自身数据进行微调，提升模型在特定领域的表现。
- API服务化 ：本地模型可作为API服务，对接前端、移动端、Web UI等多种应用。
- 安全审计与合规 ：本地可控，便于满足行业合规和安全审计要求。
本地大模型不仅能保护数据，还能成为企业和个人智能化升级的基础平台，具备极强的扩展性和灵活性。