---
title: css粘性定位实现table表头和列固定
date: 2021-08-22 21:12:07
tags: css
keywords: css粘性定位实现table表头和列固定
---
# css实现table表头和列固定
需求分析：实现table表头和固定列定位，滚动位置不变，这里采用positons: sticky粘性定位来实现。
<!--more-->

# 样式代码具体结构去看demo

```
#table {
  width: 300px;
  height: 300px;
  overflow: auto;
  border: 1px solid;
}
#table div {
  width: 50px;
  height: 50px;
  text-align: center;
}
#table thead div{
  background: red
}

#table tbody td:first-child div {
  background: yellow;
}

#table thead th {
  position: sticky;
  top: 0;
}

#table thead th {
  position: sticky;
  top: 0;
  z-index: 2
}
#table tbody td:first-child,#table thead th:first-child {
  position: sticky;
  left: 0;
}

#table thead th:first-child {
  z-index: 3
}
```
直接设置position: sticky; left和top就可以实现了，注意，一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是最近的真实可滚动祖先。

[demo](https://jsbin.com/cenegoxita/edit?html,css,output)


# 参考
[https://developer.mozilla.org/zh-CN/docs/Web/CSS/position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)