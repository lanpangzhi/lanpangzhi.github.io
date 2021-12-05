---
title: webpack内存溢出
date: 2021-07-03 18:37:50
tags: webpack
keywords:  webpack内存溢出
---
# webpack内存溢出
当项目过大的时候就会碰见内存溢出问题。
<!--more-->

## 更新
从 2017 年 8 月发布的 Node.js v8.0 开始，您现在可以使用NODE_OPTIONS 环境变量来全局设置 max_old_space_size。
```
export NODE_OPTIONS=--max-old-space-size=4096
// windows使用
set NODE_OPTIONS=--max-old-space-size=4096

```
或者使用cross-env来解决平台不同命令不同

```
npm install -g cross-env
cross-env NODE_OPTIONS=--max-old-space-size=4096
```

## vue-cli2.0解决方案
修改package.json文件（兼容windows和macOS本）
```
"scripts": {
    "dev": "node --max_old_space_size=4096 node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --config build/webpack.dev.conf.js",
    "build": "node -max_old_space_size=4096 build/build.js",
  },
```
# 参考
[https://github.com/endel/increase-memory-limit](https://github.com/endel/increase-memory-limit)
[https://github.com/kentcdodds/cross-env](https://github.com/kentcdodds/cross-env)