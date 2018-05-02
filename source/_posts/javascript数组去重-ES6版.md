---
title: javascript数组去重(ES6版)
date: 2018-05-02 16:49:44
tags: [数组, ES6, javascript]
keywords: javascript数组去重(ES6版)
---

# javascript数组去重(ES6版)
之前讲了如何利用循环和json对象去重，但是有BUG，如果是一个是字符串一个是数字就没办法区分了。
今天就利用 Set 来去重。
<!--more-->

```
var arr = [1,2,3,4,5,'1','2',3,3,'1'];
arr = Array.from(new Set(arr));
console.log(arr);
```
Array.from() 方法从一个类似数组或可迭代对象中创建一个新的数组实例。

[jsBin 地址](https://jsbin.com/buyowuk/edit?js,console)