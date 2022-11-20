---
title: 解决node-sass安装失败
date: 2020-06-14 20:21:00
tags: [yarn,npm]
keywords: 解决node-sass安装失败
---
# 解决node-sass安装失败
node-sass 安装时需要下载一个node-sass ...binding.node 文件，所以设置了淘宝源还是经常安装失败。还需要配置 sass_binary_site
<!--more-->

# 最新方案
mirror-config-china 为中国内地的Node.js开发者准备的镜像配置，大大提高node模块安装速度。

## 特性

-   支持Windows和其他操作系统
-   自动配置各个node模块的安装源为淘宝镜像
```
npm install -g mirror-config-china --registry=https://registry.npmmirror.com
```
[https://github.com/gucong3000/mirror-config-china](https://github.com/gucong3000/mirror-config-china)
___
# ~~不推荐使用~~
https://registry.npmmirror.com/mirrors/node-sass 无法正常获取到模块了

使用新地址https://registry.npmmirror.com/binary.html?path=node-sass/ 
```
yarn config set registry https://registry.npmmirror.com
yarn config set sass_binary_site https://registry.npmmirror.com/binary.html?path=node-sass/
或者
npm set registry https://registry.npmmirror.com
npm set sass_binary_site https://registry.npmmirror.com/binary.html?path=node-sass/
```