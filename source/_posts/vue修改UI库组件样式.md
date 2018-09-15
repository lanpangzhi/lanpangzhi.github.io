---
title: vue（scoped）修改UI库组件样式
date: 2018-09-15 16:40:59
tags: [vue2.0]
keywords: vue（scoped）修改UI库组件样式
---
# vue修改UI库组件样式
在工作中经常会碰见设计稿和UI库的组件样式不一样，在style标签加了scoped，就无法修改UI组件的样式了，因为当前组件样式只应用到这个组件上。
<!--more-->

## 深度作用选择器
如果你想修改组件的样式就可以使用 >>> 操作符：
```
<style scoped>
.langpz >>> .b { /* ... */ }
</style>
```
上述代码将会编译成：
```
.langpz[data-v-f3f3eg9] .b { /* ... */ }
```
如果你用的是SCSS或者LESS需要把 >>> 替换成 /deep/
<style scoped>
.langpz /deep/ .b { /* ... */ }
</style>

如果组件的样式是js动态生成的，深度作用选择器前面就不要跟class了。

# 参考
[https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F)