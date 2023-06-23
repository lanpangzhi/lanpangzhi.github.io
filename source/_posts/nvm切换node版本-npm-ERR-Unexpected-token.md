---
title: nvm切换node版本 npm ERR! Unexpected token '.'
date: 2023-06-17 17:22:42
tags: Node.js
keywords: npm ERR! Unexpected token '.'
---
# npm ERR! Unexpected token '.'
nvm 1.1.9 版本切换高版本node后，执行npm命令报错 `npm ERR! Unexpected token '.'`
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/npmERR%21Unexpectedtoken%20%27.%27/12345.png)
# 解决方案
`卸载当前nvm` 重新下载最新版本**1.1.11**，然后删除之前安装node 再重新下载。

找到之前安装nvm的目录 `unins000.exe` 右键打开执行卸载流程。

[下载最新版](https://github.com/coreybutler/nvm-windows/releases)

安装完再执行`nvm list` 把之前安装node卸载重装就解决问题了。
# 参考
[https://github.com/npm/cli/issues/4234](https://github.com/npm/cli/issues/4234)