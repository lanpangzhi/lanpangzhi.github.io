---
title: VSCode 配置Node调试环境
date: 2018-01-05 17:17:59
tags: VSCode
keywords:  VSCode 配置Node调试环境
---
# VSCode 配置Node调试环境
我们在写js的时候需要调试打开浏览器按F12（开发者工具）就可以打断点去看程序写得对不对。但是在node.js里面就没有办法了，因为是在命令行执行的没法打断点一个个console的话效率太低，所以这个时候就需要VSCode来辅助我们开发node.js。
<!--more-->
## 首先下载VSCode
[https://code.visualstudio.com/](https://code.visualstudio.com/)下载对应系统的安装包

![下载VSCode](http://hexo-1252491761.file.myqcloud.com/VSCode-%E9%85%8D%E7%BD%AENode%E8%B0%83%E8%AF%95%E7%8E%AF%E5%A2%83/20180105173242.png)

## 新建文件
打开VSCode新建一个文件夹hello，在里面再新建一个app.js

![新建文件](http://hexo-1252491761.file.myqcloud.com/VSCode-%E9%85%8D%E7%BD%AENode%E8%B0%83%E8%AF%95%E7%8E%AF%E5%A2%83/20180105174736.png)

app.js的代码
```
for (let index = 0; index < 5; index++) {
   console.log(index)   
}

console.log('Hello Word')
```
## 开始调试
再点调试，快捷键（Ctrl+Shift+D）,添加配置选择Node.js。
注： "program": "${workspaceFolder}/app.js"   /app.js 可以是任何名字，但是一定要是你入口文件。
![调试](http://hexo-1252491761.file.myqcloud.com/VSCode-%E9%85%8D%E7%BD%AENode%E8%B0%83%E8%AF%95%E7%8E%AF%E5%A2%83/debug.gif)

## 打断点
开始打断点。
![打断点](http://hexo-1252491761.file.myqcloud.com/VSCode-%E9%85%8D%E7%BD%AENode%E8%B0%83%E8%AF%95%E7%8E%AF%E5%A2%83/20180105180933.png)

## 执行app.js
操作和浏览器调试类似。
![执行app.js](http://hexo-1252491761.file.myqcloud.com/VSCode-%E9%85%8D%E7%BD%AENode%E8%B0%83%E8%AF%95%E7%8E%AF%E5%A2%83/20180105181532.png)