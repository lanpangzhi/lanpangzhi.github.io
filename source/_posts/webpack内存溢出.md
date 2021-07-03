---
title: webpack内存溢出
date: 2021-07-03 18:37:50
tags: webpack
keywords:  webpack内存溢出
---
# webpack内存溢出
当项目过大的时候就会碰见内存溢出问题。
<!--more-->

## 解决方案
修改package.json文件（兼容windows和macOS本）
```
"scripts": {
    "dev": "node --max_old_space_size=4096 node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --config build/webpack.dev.conf.js",
    "build": "node -max_old_space_size=4096 build/build.js",
  },
```