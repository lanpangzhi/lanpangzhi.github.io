---
title: 在vue使用clipboard.js
date: 2018-12-23 11:30:36
tags: [移动端, vue2.0，clipboard.js]
keywords: 在vue使用clipboard.js
---
# 在vue使用clipboard.js
上一篇写了怎么使用clipboard.js，今天就写下怎么在vue里面使用clipboard.js
<!--more-->

## 安装
有人已经封装好vue插件了我们直接安装使用就好
```
npm install --save vue-clipboard2
```

## 使用
```
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
```

## 例子
指令形式的
```
<div id="app"></div>

<template id="t">
  <div class="container">
  <input type="text" v-model="message">
  <button type="button"
    v-clipboard:copy="message"
    v-clipboard:success="done">Copy!</button>
  </div>
</template>

<script>
new Vue({
  el: '#app',
  template: '#t',
  data: function () {
    return {
      message: 'vbook.langpz.com'
    }
  },
  methods: {
    done: function () {
      alert('Copied成功!')
    }
  }
})
</script>
```
v-clipboard:copy  这里放你要复制的内容
v-clipboard:success  复制成功调用的回调


方法形式的
```
let container = this.$refs.container
this.$copyText("Text to copy", container) // 返回一个Promise
```
你可以通过use的时候设置container为当前元素
```
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // 默认false
Vue.use(VueClipboard)
```


# 参考
[https://github.com/Inndy/vue-clipboard2](https://github.com/Inndy/vue-clipboard2)
