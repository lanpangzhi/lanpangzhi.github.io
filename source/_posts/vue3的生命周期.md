---
title: vue3的生命周期
date: 2021-10-16 15:56:13
tags: [vue3.0,生命周期]
---
# vue3的生命周期
vue3的生命周期对比vue2没有大的改变，只有<font color="red">beforeDestroy</font>和<font color="red">destroyed</font>换了名字，换成<font color="red">beforeUnmount</font>和<font color="red">unmounted</font>。注：如果在组合式API里面使用生命周期的变动就多了。
<!--more-->

## 生命周期图示
![](https://hexo-1252491761.cos.ap-beijing.myqcloud.com/vue3%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/v3.cn.vuejs.org_images_lifecycle.svg.png)

## vue2生命周期
[https://blog.langpz.com/vue%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html](https://blog.langpz.com/vue%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html)


# 参考
[https://v3.cn.vuejs.org/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA](https://v3.cn.vuejs.org/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)