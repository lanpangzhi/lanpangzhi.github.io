---
title: nativefier 一行命令生成桌面应用
date: 2020-06-27 14:53:57
tags: nativefier
keywords: nativefier 一行命令生成桌面应用
---
# nativefier 一行命令生成桌面应用
nativefier 可以快速生成可执行文件（.app，.exe，等），在Windows，MacOS和Linux的使用。
<!--more-->

## 安装
Node.js 版本要 >= 10
```
npm install nativefier -g

```

## 使用
打包一个百度的桌面应用
```
nativefier "https://www.baidu.com/"
```
然后会在执行命令目录下生成APP-win32-x64 文件夹，进入然后打开APP.exe，一个百度的桌面版就打包好了，可以打包任意网站。
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/nativefier/QQ%E5%9B%BE%E7%89%8720200627203807.png)

## 注意事项
因为这个是基于Electron打包的，执行命名要下载Electron 有的时候会下载失败导致打包失败。
解决方案设置国内源
```
npm set ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
```

# 参考
[https://github.com/jiahaog/nativefier](https://github.com/jiahaog/nativefier)