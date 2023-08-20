---
title: vite热更新报错
date: 2023-08-20 10:26:53
tags: [vite]
keywords: HMR error Cannot access ‘…’ before initialization
---
# vite热更新报错
在pinia中使用vue-router控制台报错HMR error: Cannot access ‘…’ before initialization。
<!--more-->
发现是因为是循环引用导致的报错。
组件中引用了vue-router的方法，然后组件还引用了pinia的方法，然后pinia又引用vue-router。造成循环引用报错无法热更新。

# 解决方案
使用 import router form '@/router/index.js' 替换 import { useRouter } from "vue-router" 这样去引用vue-router。
在pinia 中可以注册插件把 vue-router 挂到全局属性上使用。
```
import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import { router } from './modules/router/router';

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router)
});
app.use(router)
```

如果还出现这类报错可能是别的js方法也出现循环引用。解决思路同上。