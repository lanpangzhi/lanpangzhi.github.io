---
title: nvm管理node.js版本（Windows系统）
date: 2017-12-26 14:03:59
tags: Node.js
keywords: nvm管理node.js版本（Windows系统）
---
# nvm管理node版本
在开发过程中偶尔会碰见不同项目依赖的node版本不一样，而node没有提供自动切换版本的功能，这个时候就需要nvm出马了，n也可以管理node版本（注：不支持Windows）
<!--more-->

## 先去下载nvm-windows
[下载链接地址](https://github.com/coreybutler/nvm-windows/releases) 注：目前版本1.1.6。
如果你之前安装过node，先卸载掉。

## 安装nvm-windows
刚才下载的是 nvm-setup.zip 这个文件

![](http://hexo-1252491761.file.myqcloud.com/nvm%E7%AE%A1%E7%90%86node%E7%89%88%E6%9C%ACWindows/20171226143805.png)

```
	输入 nvm 
```
![](http://hexo-1252491761.file.myqcloud.com/nvm%E7%AE%A1%E7%90%86node%E7%89%88%E6%9C%ACWindows/20171226150807.png)
这就安装成功了。

## 安装node
安装最新稳定版 node

```
	nvm install latest
```

![](http://hexo-1252491761.file.myqcloud.com/nvm%E7%AE%A1%E7%90%86node%E7%89%88%E6%9C%ACWindows/20171226154557.png)

安装指定版本 node

```
	nvm install 8.9.0
```

![](http://hexo-1252491761.file.myqcloud.com/nvm%E7%AE%A1%E7%90%86node%E7%89%88%E6%9C%ACWindows/20171226155411.png)

## 切换node版本

```
	nvm use 9.3.0
```

nvm list 显示当前安装node版本列表  * 代表当前使用的版本

![](http://hexo-1252491761.file.myqcloud.com/nvm%E7%AE%A1%E7%90%86node%E7%89%88%E6%9C%ACWindows/20171226161037.png)

	 注: 安装的npm全局模块不会在各个版本的node.js之间共享。还有可能有些npm包不支持当前使用的node版本 

## nvm基本命令
nvm arch [32|64]: 设置node是以32还是64位模式运行。 指定32或64来覆盖默认操作系统版本。
nvm install <version> [arch]: version 版本号 例如 8.9.0 或者 latest（最新稳定版）,[arch]可选、指定是否安装32位或64位版本（默认为系统架构），将[arch]设置为 all 安装32和64位版本。
nvm list [available]: 显示当前安装node版本列表  * 代表当前使用的版本，在末尾输入 available 显示可供下载的所有版本列表。
nvm on: 使用Node.js版本管理。
nvm off: 禁用node.js版本管理（不会卸载任何东西）。
nvm proxy [url]: 设置下载的代理，将[url]留空以查看当前代理。 将[url]设置为 none 以删除代理。
nvm uninstall <version>: 卸载指定的node版本。
nvm use <version> [arch]: 切换指定的node版本，可选[arch]32和64位版本。
nvm root <path>: 设置nvm存放不同版本的node.js的目录。 如果没有设置 path ，则显示当前的根目录。
nvm version: 显示Windows的NVM的当前运行版本。
nvm node_mirror <node_mirror_url>: 设置node节点镜像。国内可以使用 https://npm.taobao.org/mirrors/node/
nvm npm_mirror <npm_mirror_url>: 设置npm节点镜像。国内可以使用 https://npm.taobao.org/mirrors/npm/

## 参考
[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)