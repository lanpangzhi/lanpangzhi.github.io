---
title: 切换node版本项目Saas报错
date: 2021-09-24 21:18:41
tags: [yarn,npm]
keywords: 'Module build failed: Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime'
---

# 切换node版本项目Saas报错
Module build failed: Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime
<!-- more -->
解决方案
```
yarn add --force node-sass
or
npm rebuild node-sass
```
如果还不能运行，建议先卸载node-sass再重新安装。
```
npm uninstall node-sass && npm install node-sass
or
yarn remove node-sass && yarn add node-sass --dev
```
# 参考
[https://stackoverflow.com/questions/37415134/error-node-sass-does-not-yet-support-your-current-environment-windows-64-bit-w](https://stackoverflow.com/questions/37415134/error-node-sass-does-not-yet-support-your-current-environment-windows-64-bit-w)