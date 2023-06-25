---
title: 使用 Volta 管理Node
date: 2023-06-24 15:11:37
tags: [Volta, 'Node.js']
keywords: 使用 Volta 管理Node
---
# Volta
Volta 是一个JavaScript包管理器，基于rust构建的没有外部依赖项方便安装，支持 **跨平台，支持 macOS、Windows、Linux
**、**按项目自动版本切换**、**多个包管理器**等优势。
<!--more-->
# 安装
如果之前安装过`node` 或者 `nvm n` 请先卸载掉再安装 Volta
## macOS / Unix 安装
```
curl https://get.volta.sh | bash
```
如果没有自动添加到环境变量，需要自己手动配置

如果您的shell是bash，进入终端，编辑环境变量文件~/.bash_profile, 输入如下内容
如果您的shell是zsh，进入终端，编辑环境变量文件~/.zprofile，输入如下内容
```
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```
## Windows安装
[下载地址](https://github.com/volta-cli/volta/releases) 目前最新版是 volta-1.1.1-windows-x86_64.msi
安装过程中需要把360卫士之类的安全管家关闭掉，否则有可能无法自动添加到环境变量。

安装完可以在命令行输入 `volta` 检查是否能正常运行。
# 使用
## 安装 node 和yarn
```
volta install node@11.0.0  // 安装 node 11.0.0版本
volta install yarn@1.19 // 安装 yarn 1.19版本
volta install node@latest  // 安装 node 最新版本
```
固定项目节点引擎（在项目根目录执行）
```
volta pin node@11.0.0
volta pin yarn@1.19
```
将Volta保存到package.json
```
"volta": {
  "node": "11.0.0",
  "yarn": "1.19.2"
}
```
Volta 将 Node 引擎的确切版本保存在您的中package.json，以便您可以将您的选择提交到 git。从那时起，每次您在项目目录中运行 Node 时，Volta 都会**自动切换到您选择的 Node 版本**。同样，您的所有协作者都可以通过在其开发计算机上安装 Volta 来执行相同的操作。

## 使用项目工具
node和包管理工具可执行文件不是工具链中唯一的智能工具。工具链中的包二进制文件也可以识别当前目录并尊重当前项目结构。
例如，安装 Typescript 包会将编译器可执行文件 ( tsc) 添加到工具链中。

```
npm install --global typescript
```
根据您所在的项目，此可执行文件将切换到项目选择的 TypeScript 版本：
```
cd /path/to/project-using-typescript-3.9.4
tsc --version // 3.9.4

cd /path/to/project-using-typescript-4.1.5
tsc --version // 4.1.5
```
不仅 Node 和 npm / Yarn 等包管理器，而且通过它们安装的包二进制文件都受到 Volta 的监控。因此，它会**自动切换每个项目的版本**。注:目前volta支持`pnpm`但是不支持全局安装 `例如pnpm install -g`

# Volta 命令
这是命令行二进制文件的命令参考volta，其语法如下：
```
The JavaScript Launcher ⚡

    To install a tool in your toolchain, use `volta install`.
    To pin your project's runtime or package manager, use `volta pin`.

USAGE:
    volta [FLAGS] [SUBCOMMAND]

FLAGS:
        --verbose    
            Enables verbose diagnostics

        --quiet      
            Prevents unnecessary output

    -v, --version    
            Prints the current version of Volta

    -h, --help       
            Prints help information


SUBCOMMANDS:
    fetch          Fetches a tool to the local machine
    install        Installs a tool in your toolchain
    uninstall      Uninstalls a tool from your toolchain
    pin            Pins your project's runtime or package manager
    list           Displays the current toolchain
    completions    Generates Volta completions
    which          Locates the actual binary that will be called by Volta
    setup          Enables Volta for the current user / shell
    run            Run a command with custom Node, npm, pnpm, and/or Yarn versions
    help           Prints this message or the help of the given subcommand(s)
```
 - `volta fetch` 允许您将工具提取到本地缓存中，而无需将其设置为默认值或使其可用，以供将来离线使用。
 - **volta install** 安装工具的默认版本。如果该工具尚未在本地缓存，它也会下载该工具。
 - **volta uninstall** 允许您删除任何已安装的全局包volta install。
 - **volta pin** 更新项目package.json文件以使用选定版本的工具。
 - **volta list** 查看已安装的 Node 运行时、包管理器和带有二进制文件的包。
 - `volta completions` 为您的 shell 生成命令完成信息。
 - `volta which` 定位并打开 Volta 启动实际的二进制文件。
 - `volta setup` 通过修改当前用户的 来volta setup启用 Volta （以依赖于平台的方式）以包含 Volta shim 目录。PATH
 - `volta run` 使用在命令行中指定的工具版本来运行您提供的命令。
 - `volta help` 打印此消息或给定子命令的帮助。

`常用的命令`用蓝色标注出来了，对比nvm的好处是无感自动切换版本（`在项目目录执行的时候已经切换好版本了`）。速度更快。

# workspaces
如果在单个存储库中有多个项目，都共享 Volta 设置。
"volta"在 中的部分中package.json，您可以使用 key 指定一个条目**"extends"**。该条目的值应该是另一个也有一个部分的 JSON 文件的路径"volta"。相对路径将相对于设置它们的文件进行解析。
```
{
  "volta": {
    "extends": "../../package.json"
  }
}
```
只需要仓库根目录执行`volta pin` 固定版本 子项目通过**extends**引入根项目的`package.json`就可以实现共享 Volta 设置。
# pnpm支持
pnpm目前处于实验阶段。要启用它，请确保将**环境变量VOLTA_FEATURE_PNPM设置为1**。在 Windows 上，可以将其添加到系统设置中的用户或系统环境变量中。在 Linux/Mac 上，您可以在配置文件脚本中设置值（例如.bash_profile、.zshrc或类似的）。
由于此支持是实验性的，因此可能存在一些悬而未决的问题。下面列出了一些已知的限制。


## 全局安装
目前，不支持全局安装（例如`pnpm install -g`），并且会导致错误。

## 迁移
目前没有自动迁移功能，因此如果您之前已pnpm作为 Volta 全局安装，则需要通过调用 手动重新安装它volta install pnpm。在启用支持并重新安装之前，您可以pnpm通过卸载以前安装的软件包volta uninstall pnpm。一旦切换到本机 pnpm 支持，您可能无法pnpm通过调用相同的命令来删除隔离的旧包，因为目前还缺乏卸载实现。

## Volta Could not download node 
如果碰见 **volta install node@11.0.0**报错 `Volta Could not download node` 可以手动下载安装包再执行 **volta install node@11.0.0** 就可以安装成功了。

[node下载地址](https://registry.npmmirror.com/binary.html?path=node/)
然后找到对应版本**Windows** 下载 `win-xnn.zip`后缀 我这边下载的是 `node-v11.0.0-win-x64.zip`
`C:\Users\电脑账号名\AppData\Local\Volta\tools\inventory\node`
放到这个目录下再执行
```
volta install node@11.0.0
```
注:如果你有修改过`VOLTA_HOME` 环境变量请把node 放到配置环境变量的地址。
# 参考
[volta](https://volta.sh/)
[Window下volta安装node失败解决方案](https://zhuanlan.zhihu.com/p/585494072?utm_id=0)