---
title: node.js Windows下安装（笔记）
date: 2017-12-12 16:26:01
tags: Node.js
---
# 首先去Node.js中文网下载安装包

- 偶数位为稳定版本，奇数位为非稳定版本（开发版）
- 稳定版本中已发布的API是不会改变的
- 奇数开头的开发版就是会不断变化更新

[点这里去下载](http://nodejs.cn/download/)

## 如下图，选择系统对应的位数下载
{% asset_img 20171212103816.png %}

## 双击打开你下载node-v8.9.0-x64.msi安装包
{% asset_img 20171212113959.png %}
<center>一路下一步</center>
{% asset_img 20171212114548.png %}
<center>Node.js默认安装目录，你也可以点Change修改目录，点击下一步(Next)</center>
{% asset_img 20171212132319.png %}
<center>点击下一步(Next)</center>
{% asset_img 20171212132540.png %}
<center>点击安装(Install)</center>

## 安装完检测PATH环境变量是否配置Node.js

```
  win + r
  输入 cmd 回车
  输入 node -v 和 npm -v
```

{% asset_img 20171212133014.jpg %}
<center>会显示你安装node和npm的版本</center>