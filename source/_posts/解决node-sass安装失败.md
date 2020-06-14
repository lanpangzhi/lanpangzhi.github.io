---
title: 解决node-sass安装失败
date: 2020-06-14 20:21:00
tags: [yarn,npm]
keywords: 解决node-sass安装失败
---
# 解决node-sass安装失败
node-sass 安装时需要下载一个node-sass ...binding.node 文件，所以设置了淘宝源还是经常安装失败。还需要配置 sass_binary_site
<!--more-->

```
yarn config set registry http://registry.npm.taobao.org
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass
或者
npm set registry https://registry.npm.taobao.org
npm set sass_binary_site https://npm.taobao.org/mirrors/node-sass
```