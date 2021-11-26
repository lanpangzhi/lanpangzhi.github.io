---
title: vue-cli4配置生产环境删除console.log
date: 2021-11-26 19:49:17
tags: [vue-cli4]
keywords:  vue-cli4配置生产环境删除console.log
---
# vue-cli4配置生产环境删除console.log
使用 babel-plugin-transform-remove-console 插件去配置删除console.log
<!--more-->

## 安装使用
```
npm install babel-plugin-transform-remove-console --save-dev
or
yarn add babel-plugin-transform-remove-console -D
```
然后找到src下面的babel.config.js文件修改

```
const prodPlugins = []
// 生产环境添加plugins，排除console.error 和console.warn
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push(["transform-remove-console", { "exclude": [ "error", "warn"] }])
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...prodPlugins
  ]
}
```
# 参考
[https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-console](https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-console)