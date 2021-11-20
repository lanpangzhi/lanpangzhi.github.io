---
title: vue3中引入element-plus的Icon
date: 2021-11-20 10:52:58
tags: [vue3.0,element-plus]
---
# vue3中引入element-plus的Icon
最近使用element-plus开发项目，发现element-plus废弃了Font Icon 使用了 SVG Icon。需要在全局注册组件，或者按需引用。
<!--more-->

## 安装
```
$ yarn add @element-plus/icons
# 或者
$ npm install @element-plus/icons
```

## 全局引用
在main.js 全局注册组件。
```
import * as Icons from '@element-plus/icons'
const app = createApp(App)

// 注册Icons 全局组件
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})

// 在vue文件使用
<el-icon color="#409EFC" class="no-inherit">
  <share />
</el-icon>
```
就可以在vue文件里面直接使用图标了。

## 按需引用
对应的vue文件中直接import图标。
```
import { Edit } from '@element-plus/icons'

// 在vue文件使用
<el-icon color="#409EFC" class="no-inherit">
  <edit />
</el-icon>
```

## 参考
[https://element-plus.gitee.io/zh-CN/component/icon.html](https://element-plus.gitee.io/zh-CN/component/icon.html)